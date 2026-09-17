import "server-only";

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@maya/database";
import {
  isDefaultConversationTitle,
  parseHostToolCalls,
  titleFromFirstMessage,
  type HostToolCalls,
} from "@maya/shared";
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
  input: {
    conversationId: string;
    content: string;
    tokensUsed: number;
    modelId?: string | null;
    toolCalls?: HostToolCalls | null;
  },
): Promise<{ ok: true } | PersistFail> {
  const { error } = await supabase.from("messages").insert({
    conversation_id: input.conversationId,
    role: "assistant",
    content: input.content,
    tokens_used: input.tokensUsed,
    model_id: input.modelId ?? null,
    tool_calls: (input.toolCalls ?? null) as Json | null,
  });

  if (error) {
    return { ok: false, error };
  }

  return { ok: true };
}

export async function updateLastAssistantMessage(
  supabase: SupabaseClient<Database>,
  input: {
    conversationId: string;
    content: string;
    tokensUsed: number;
    modelId?: string | null;
    toolCalls?: HostToolCalls | null;
  },
): Promise<{ ok: true } | PersistFail> {
  const existing = await supabase
    .from("messages")
    .select("id, tool_calls")
    .eq("conversation_id", input.conversationId)
    .eq("role", "assistant")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing.error) {
    return { ok: false, error: existing.error };
  }
  if (!existing.data) {
    return insertAssistantMessage(supabase, input);
  }

  const kept = input.toolCalls ?? parseHostToolCalls(existing.data.tool_calls);
  const { error } = await supabase
    .from("messages")
    .update({
      content: input.content,
      tokens_used: input.tokensUsed,
      model_id: input.modelId ?? null,
      tool_calls: (kept ?? null) as Json | null,
    })
    .eq("id", existing.data.id);

  if (error) {
    return { ok: false, error };
  }
  return { ok: true };
}

export async function setHostRoute(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; hostRoute: "open" | "stay" | "handed_off" },
): Promise<{ ok: true } | PersistFail> {
  const { error } = await supabase
    .from("conversations")
    .update({ host_route: input.hostRoute })
    .eq("id", input.conversationId);

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

export async function rememberVoice(
  supabase: SupabaseClient<Database>,
  input: { userId: string; conversationId: string; modelId: string },
): Promise<void> {
  const [conversation, profile] = await Promise.all([
    supabase
      .from("conversations")
      .update({ model_id: input.modelId })
      .eq("id", input.conversationId),
    supabase
      .from("profiles")
      .update({ preferred_model_id: input.modelId })
      .eq("id", input.userId),
  ]);

  if (conversation.error) {
    logDropped("rememberVoice", { conversation: conversation.error });
  }
  if (profile.error) {
    logDropped("rememberVoice", { profile: profile.error });
  }
}
