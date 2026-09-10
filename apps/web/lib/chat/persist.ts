import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { isDefaultConversationTitle, titleFromFirstMessage } from "@maya/shared";

export async function insertUserMessage(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; content: string },
) {
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
    throw new Error("Could not save the line.");
  }

  return data.id;
}

export async function insertAssistantMessage(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; content: string; tokensUsed: number },
) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: input.conversationId,
    role: "assistant",
    content: input.content,
    tokens_used: input.tokensUsed,
  });

  if (error) {
    throw new Error("Could not save the reply.");
  }
}

export async function retitleConversation(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; currentTitle: string; firstUserText: string },
) {
  if (!isDefaultConversationTitle(input.currentTitle)) {
    return;
  }

  const nextTitle = titleFromFirstMessage(input.firstUserText);

  const { error } = await supabase
    .from("conversations")
    .update({ title: nextTitle })
    .eq("id", input.conversationId);

  if (error) {
    throw new Error("Could not name the night.");
  }
}

export async function countTurnsToday(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<number> {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", "chat_turn")
    .gte("created_at", start.toISOString());

  if (error) {
    throw new Error("Could not read the daily curtain.");
  }

  return count ?? 0;
}

