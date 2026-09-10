import { z } from "zod";
import {
  LANGUAGE_PRESETS,
  parseLanguagePreset,
  type LanguagePresetId,
} from "./profile";

export const OPEN_NIGHT_TITLE = "New chat";
export const HISTORY_WINDOW = 20;
export const USER_MESSAGE_MAX = 8000;
export const CONVERSATION_TITLE_MAX = 48;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

const uuidSchema = z
  .string()
  .trim()
  .refine(isUuid, { message: "Need a real id." });

export const conversationCreateSchema = z.object({
  agentId: uuidSchema,
});

export type ConversationCreate = z.infer<typeof conversationCreateSchema>;

const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const userMessageSchema = z.object({
  id: z.string().min(1),
  role: z.literal("user"),
  parts: z.array(z.unknown()).min(1),
});

export const chatRequestSchema = z.object({
  conversationId: uuidSchema,
  agentId: uuidSchema,
  message: userMessageSchema,
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export type ParseChatRequestResult =
  | { ok: true; data: ChatRequest; text: string }
  | { ok: false };

export function textFromUserParts(parts: unknown[]): string {
  const chunks: string[] = [];
  for (const part of parts) {
    const parsed = textPartSchema.safeParse(part);
    if (parsed.success) {
      chunks.push(parsed.data.text);
    }
  }
  return chunks.join("\n").trim();
}

export function parseChatRequest(input: unknown): ParseChatRequestResult {
  const parsed = chatRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }
  const text = textFromUserParts(parsed.data.message.parts);
  if (!text || text.length > USER_MESSAGE_MAX) {
    return { ok: false };
  }
  return { ok: true, data: parsed.data, text };
}

export function parseConversationCreate(
  input: unknown,
): { ok: true; agentId: string } | { ok: false } {
  const parsed = conversationCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }
  return { ok: true, agentId: parsed.data.agentId };
}

export function chronologicalWindow<T>(newestFirst: T[]): T[] {
  return [...newestFirst].reverse();
}

export function isDefaultConversationTitle(title: string): boolean {
  const normalized = title.trim().toLowerCase();
  return normalized === "" || normalized === "new chat";
}

export function titleFromFirstMessage(text: string): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (!collapsed) {
    return OPEN_NIGHT_TITLE;
  }
  if (collapsed.length <= CONVERSATION_TITLE_MAX) {
    return collapsed;
  }
  const sliced = collapsed.slice(0, CONVERSATION_TITLE_MAX);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = (lastSpace >= 24 ? sliced.slice(0, lastSpace) : sliced).trim();
  return trimmed || OPEN_NIGHT_TITLE;
}

export function isDailyCapReached(
  limit: number | null,
  usedToday: number,
): boolean {
  if (limit === null) {
    return false;
  }
  return usedToday >= limit;
}

export function systemPromptWithLanguage(
  basePrompt: string,
  languagePreset: string | null | undefined,
): string {
  const preset = parseLanguagePreset(languagePreset);
  if (preset === "en") {
    return basePrompt;
  }
  const label =
    LANGUAGE_PRESETS.find((item) => item.id === preset)?.label ?? preset;
  return `${basePrompt.trim()}\n\nLanguage: reply in ${label}.`;
}

export type { LanguagePresetId };
