import { systemPromptWithLanguage } from "./chat";
import type { ToneSettings } from "./studio";

export type CompilePromptMemory = {
  content: string;
  createdAt?: string;
};

export type CompilePromptInput = {
  isCurated: boolean;
  basePrompt: string;
  languagePreset?: string | null;
  tone?: ToneSettings | null;
  userProfile?: {
    displayName?: string | null;
    bio?: string | null;
  } | null;
  memories?: CompilePromptMemory[] | null;
  toolsAllowed?: readonly string[];
  toolsEnabled?: readonly string[];
};

function bandLine(
  value: number,
  low: string,
  high: string,
): string | null {
  if (value <= 0.25) {
    return low;
  }
  if (value >= 0.75) {
    return high;
  }
  return null;
}

export function compileToneDirectives(tone: ToneSettings): string | null {
  const lines = [
    bandLine(
      tone.warmth,
      "Cold. Do not soothe or soften.",
      "Warm and supportive without losing the brief.",
    ),
    bandLine(
      tone.directness,
      "Soften. Do not lead with a roast.",
      "Do not soften. Do not apologize. Lead with the point, then the prescription.",
    ),
    bandLine(
      tone.humor,
      "No jokes. Stay serious.",
      "Dry wit is allowed; never undercut the answer.",
    ),
  ].filter((line): line is string => Boolean(line));

  if (lines.length === 0) {
    return null;
  }
  return lines.join(" ");
}

function allowedTools(
  enabled: readonly string[] | undefined,
  allowed: readonly string[] | undefined,
): string[] {
  const allow = new Set(allowed ?? []);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tool of enabled ?? []) {
    if (!allow.has(tool) || seen.has(tool)) {
      continue;
    }
    seen.add(tool);
    out.push(tool);
  }
  return out;
}

export function compilePrompt(input: CompilePromptInput): string {
  const sections: string[] = [];
  const identity = input.basePrompt.trim();
  if (identity) {
    sections.push(identity);
  }

  if (!input.isCurated && input.tone) {
    const tone = compileToneDirectives(input.tone);
    if (tone) {
      sections.push(tone);
    }
  }

  const withLanguage = systemPromptWithLanguage(
    sections.join("\n\n"),
    input.languagePreset,
  );
  const merged: string[] = withLanguage ? [withLanguage] : [];

  const name = input.userProfile?.displayName?.trim() ?? "";
  const bio = input.userProfile?.bio?.trim() ?? "";
  if (name || bio) {
    const parts: string[] = [];
    if (name) {
      parts.push(`Name: ${name}`);
    }
    if (bio) {
      parts.push(`Bio: ${bio}`);
    }
    merged.push(`<user_profile>\n${parts.join("\n")}\n</user_profile>`);
  }

  const memories = (input.memories ?? [])
    .map((item) => {
      const content = item.content.trim();
      if (!content) {
        return "";
      }
      return item.createdAt ? `${item.createdAt}: ${content}` : content;
    })
    .filter(Boolean);
  if (memories.length > 0) {
    merged.push(`<episodic_memory>\n${memories.join("\n")}\n</episodic_memory>`);
  }

  const tools = allowedTools(input.toolsEnabled, input.toolsAllowed);
  if (tools.length === 0) {
    merged.push(
      "Tool policy: You have no tools. Do not call tools. Do not use memory_saver. Ignore any tool-call instructions above.",
    );
  } else {
    merged.push(
      `Tool policy: You may use only these tools: ${tools.join(", ")}. Do not call any other tool.`,
    );
  }

  return merged.join("\n\n");
}
