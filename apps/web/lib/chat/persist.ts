import "server-only";

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { isDefaultConversationTitle, titleFromFirstMessage } from "@maya/shared";
import { logDropped } from "@/lib/supabase/dropped";

export type PersistFail = { ok: false; error: PostgrestError | null };

export async function insertUserMessage(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; content: string },
): Promise<{ ok: true; id: string } | PersistFail> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: input.conversationId,
      role: "user",
      content: input.content,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error ?? null };
  }

  return { ok: true, id: data.id };
}

export async function insertAssistantMessage(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; content: string; tokensUsed: number },
): Promise<{ ok: true } | PersistFail> {
  const { error } = await supabase.from("messages").insert({
    conversation_id: input.conversationId,
    role: "assistant",
    content: input.content,
    tokens_used: input.tokensUsed,
  });

  if (error) {
    return { ok: false, error };
  }

  return { ok: true };
}

export async function retitleConversation(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; currentTitle: string; firstUserText: string },
): Promise<void> {
  if (!isDefaultConversationTitle(input.currentTitle)) {
    return;
  }

  const nextTitle = titleFromFirstMessage(input.firstUserText);

  const { error } = await supabase
    .from("conversations")
    .update({ title: nextTitle })
    .eq("id", input.conversationId);

  if (error) {
    logDropped("retitleConversation", { update: error });
  }
}

export async function countTurnsToday(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<{ ok: true; count: number } | PersistFail> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", "chat_turn")
    .gte("created_at", start.toISOString());

  if (error) {
    return { ok: false, error };
  }

  return { ok: true, count: count ?? 0 };
}
