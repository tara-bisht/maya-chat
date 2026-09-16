import "server-only";

import { jsonSchema, tool } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { parseMemorySaverInput } from "@maya/shared";
import { embedText } from "@/lib/openrouter/embed";
import { logDropped } from "@/lib/supabase/dropped";

const inputSchema = jsonSchema<{ content: string }>({
  type: "object",
  properties: {
    content: { type: "string" },
  },
  required: ["content"],
});

export async function saveAgentMemory(
  supabase: SupabaseClient<Database>,
  input: { userId: string; agentId: string; raw: unknown },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = parseMemorySaverInput(input.raw);
  if (!parsed.ok) {
    return { ok: false, error: "Need a short fact to remember." };
  }

  const inserted = await supabase
    .from("agent_memories")
    .insert({
      user_id: input.userId,
      agent_id: input.agentId,
      content: parsed.content,
    })
    .select("id")
    .single();

  if (inserted.error || !inserted.data) {
    logDropped("saveAgentMemory", { insert: inserted.error });
    return { ok: false, error: "Could not save that memory." };
  }

  const embedded = await embedText(parsed.content);
  if (!embedded.ok) {
    return { ok: false, error: "Saved without a vector. Try again later." };
  }

  const updated = await supabase
    .from("agent_memories")
    .update({ embedding: embedded.vector })
    .eq("id", inserted.data.id)
    .eq("user_id", input.userId);

  if (updated.error) {
    logDropped("saveAgentMemory", { embed: updated.error });
    return { ok: false, error: "Saved without a vector. Try again later." };
  }

  return { ok: true };
}

export function memorySaverTool(
  supabase: SupabaseClient<Database>,
  input: { userId: string; agentId: string },
) {
  return tool({
    description:
      "Save a durable fact about this user for later chats with you. Use for habits, goals, names, and commitments. Do not save the whole transcript.",
    inputSchema,
    execute: async ({ content }) =>
      saveAgentMemory(supabase, {
        userId: input.userId,
        agentId: input.agentId,
        raw: { content },
      }),
  });
}
