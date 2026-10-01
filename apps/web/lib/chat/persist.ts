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

export type TurnStatus = "pending" | "complete" | "interrupted" | "unsaved";

const OPEN_TURN: TurnStatus[] = ["pending", "unsaved", "interrupted"];

function isUniqueViolation(error: PostgrestError | null): boolean {
  return error?.code === "23505";
}

export async function insertUserMessage(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; content: string; clientMsgId?: string | null },
): Promise<{ ok: true; id: string; duplicate: boolean } | PersistFail> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: input.conversationId,
      role: "user",
      content: input.content,
      ...(input.clientMsgId
        ? { client_msg_id: input.clientMsgId, turn_status: "pending" }
        : {}),
    })
    .select("id")
    .single();

  if (!error && data) {
    return { ok: true, id: data.id, duplicate: false };
  }

  if (isUniqueViolation(error) && input.clientMsgId) {
    const existing = await supabase
      .from("messages")
      .select("id")
      .eq("conversation_id", input.conversationId)
      .eq("client_msg_id", input.clientMsgId)
      .maybeSingle();
    if (existing.error || !existing.data) {
      return { ok: false, error: existing.error ?? error };
    }
    return { ok: true, id: existing.data.id, duplicate: true };
  }

  return { ok: false, error: error ?? null };
}

export async function insertAssistantMessage(
  supabase: SupabaseClient<Database>,
  input: {
    conversationId: string;
    content: string;
    tokensUsed: number;
    modelId?: string | null;
    toolCalls?: HostToolCalls | null;
    replyTo?: string | null;
  },
): Promise<{ ok: true } | PersistFail> {
  const { error } = await supabase.from("messages").insert({
    conversation_id: input.conversationId,
    role: "assistant",
    content: input.content,
    tokens_used: input.tokensUsed,
    model_id: input.modelId ?? null,
    tool_calls: (input.toolCalls ?? null) as Json | null,
    reply_to: input.replyTo ?? null,
    turn_status: "complete",
  });

  if (error) {
    if (isUniqueViolation(error) && input.replyTo) {
      await completeUserTurn(supabase, input.replyTo);
      return { ok: true };
    }
    return { ok: false, error };
  }

  if (input.replyTo) {
    await completeUserTurn(supabase, input.replyTo);
  }

  return { ok: true };
}

export async function loadAssistantReply(
  supabase: SupabaseClient<Database>,
  userMessageId: string,
): Promise<
  | { ok: true; reply: { content: string; tool_calls: Json | null } | null }
  | PersistFail
> {
  const { data, error } = await supabase
    .from("messages")
    .select("content, tool_calls")
    .eq("reply_to", userMessageId)
    .eq("role", "assistant")
    .maybeSingle();

  if (error) {
    return { ok: false, error };
  }

  return { ok: true, reply: data };
}

export async function markUserTurn(
  supabase: SupabaseClient<Database>,
  input: { messageId: string; status: TurnStatus },
): Promise<{ ok: true } | PersistFail> {
  const { error } = await supabase
    .from("messages")
    .update({ turn_status: input.status })
    .eq("id", input.messageId)
    .in("turn_status", OPEN_TURN);

  if (error) {
    return { ok: false, error };
  }
  return { ok: true };
}

async function completeUserTurn(
  supabase: SupabaseClient<Database>,
  messageId: string,
): Promise<void> {
  const marked = await markUserTurn(supabase, {
    messageId,
    status: "complete",
  });
  if (!marked.ok) {
    logDropped("markUserTurn", { update: marked.error });
  }
}

export async function acceptUserTurn(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; content: string; clientMsgId: string },
): Promise<
  | {
      ok: true;
      messageId: string;
      duplicate: boolean;
      stored: { content: string; toolCalls: Json | null } | null;
    }
  | PersistFail
> {
  const inserted = await insertUserMessage(supabase, input);
  if (!inserted.ok) {
    return inserted;
  }
  if (!inserted.duplicate) {
    return {
      ok: true,
      messageId: inserted.id,
      duplicate: false,
      stored: null,
    };
  }

  const reply = await loadAssistantReply(supabase, inserted.id);
  if (!reply.ok) {
    return reply;
  }
  if (reply.reply) {
    return {
      ok: true,
      messageId: inserted.id,
      duplicate: true,
      stored: {
        content: reply.reply.content,
        toolCalls: reply.reply.tool_calls,
      },
    };
  }

  const marked = await markUserTurn(supabase, {
    messageId: inserted.id,
    status: "pending",
  });
  if (!marked.ok) {
    logDropped("markUserTurn", { update: marked.error });
  }
  return { ok: true, messageId: inserted.id, duplicate: true, stored: null };
}

export async function updateLastAssistantMessage(
  supabase: SupabaseClient<Database>,
  input: {
    conversationId: string;
    content: string;
    tokensUsed: number;
    modelId?: string | null;
    toolCalls?: HostToolCalls | null;
    replyTo?: string | null;
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
