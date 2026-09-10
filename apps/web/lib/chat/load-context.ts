import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { createServiceSupabaseClient } from "@maya/database/service";
import {
  HISTORY_WINDOW,
  canUseAgent,
  chronologicalWindow,
  parseMayaPlan,
  type MayaPlan,
} from "@maya/shared";
import { HOUSE_AGENT_COLUMNS, type HouseAgentRow } from "@/lib/house/columns";
import { toAccessAgent } from "@/lib/house/public-agent";
import { logDropped } from "@/lib/supabase/dropped";

export type ChatAgentRow = HouseAgentRow & { system_prompt: string };

export async function loadChatAgent(
  supabase: SupabaseClient<Database>,
  input: { userId: string; agentId: string },
): Promise<
  | { ok: true; agent: ChatAgentRow; planId: MayaPlan; canChat: boolean }
  | { ok: false; reason: "not_found" | "dropped" }
> {
  const [agentResult, entitlementResult] = await Promise.all([
    supabase
      .from("agents")
      .select(HOUSE_AGENT_COLUMNS)
      .eq("id", input.agentId)
      .maybeSingle(),
    supabase
      .from("entitlements")
      .select("plan")
      .eq("user_id", input.userId)
      .maybeSingle(),
  ]);

  if (agentResult.error) {
    logDropped("loadChatAgent", { agent: agentResult.error });
    return { ok: false, reason: "dropped" };
  }

  const row = agentResult.data as HouseAgentRow | null;
  if (!row || row.archived_at) {
    return { ok: false, reason: "not_found" };
  }

  const planId = parseMayaPlan(entitlementResult.data?.plan);
  const canChat = canUseAgent({
    planId,
    viewerId: input.userId,
    agent: toAccessAgent(row),
  });

  if (!canChat) {
    return {
      ok: true,
      agent: { ...row, system_prompt: "" },
      planId,
      canChat: false,
    };
  }

  const service = createServiceSupabaseClient();
  const promptResult = await service.rpc("chat_agent_prompt", {
    p_agent_id: input.agentId,
  });

  if (promptResult.error) {
    logDropped("loadChatAgent", { prompt: promptResult.error });
    return { ok: false, reason: "dropped" };
  }
  if (!promptResult.data) {
    return { ok: false, reason: "not_found" };
  }

  return {
    ok: true,
    agent: { ...row, system_prompt: promptResult.data },
    planId,
    canChat: true,
  };
}

export type ChatUserProfile = {
  displayName: string;
  bio: string;
};

export async function loadChatProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<ChatUserProfile> {
  const result = await supabase
    .from("profiles")
    .select("display_name, global_bio")
    .eq("id", userId)
    .maybeSingle();

  if (result.error || !result.data) {
    return { displayName: "", bio: "" };
  }

  return {
    displayName: result.data.display_name?.trim() ?? "",
    bio: result.data.global_bio?.trim() ?? "",
  };
}

export async function loadPlanModel(
  supabase: SupabaseClient<Database>,
  planId: MayaPlan,
): Promise<
  | {
      ok: true;
      dailyLimit: number | null;
      defaultModelId: string;
      gatewayId: string;
      toolsAllowed: string[];
    }
  | { ok: false }
> {
  const planResult = await supabase
    .from("plans")
    .select("default_model_id, daily_message_limit, tools_allowed")
    .eq("id", planId)
    .maybeSingle();

  if (planResult.error || !planResult.data) {
    if (planResult.error) logDropped("chat", { plan: planResult.error });
    return { ok: false };
  }

  const modelResult = await supabase
    .from("models")
    .select("id, gateway_id, is_enabled")
    .eq("id", planResult.data.default_model_id)
    .maybeSingle();

  if (modelResult.error || !modelResult.data?.is_enabled) {
    if (modelResult.error) logDropped("chat", { model: modelResult.error });
    return { ok: false };
  }

  return {
    ok: true,
    dailyLimit: planResult.data.daily_message_limit,
    defaultModelId: planResult.data.default_model_id,
    gatewayId: modelResult.data.gateway_id,
    toolsAllowed: planResult.data.tools_allowed ?? [],
  };
}

export async function loadConversationHistory(
  supabase: SupabaseClient<Database>,
  input: { userId: string; agentId: string; conversationId: string },
): Promise<
  | {
      ok: true;
      conversation: { id: string; title: string; agent_id: string };
      history: Array<{ role: "user" | "assistant"; content: string }>;
    }
  | { ok: false; reason: "not_found" | "dropped" }
> {
  const conversationResult = await supabase
    .from("conversations")
    .select("id, title, agent_id, user_id")
    .eq("id", input.conversationId)
    .maybeSingle();

  if (conversationResult.error) {
    logDropped("chat", { conversation: conversationResult.error });
    return { ok: false, reason: "dropped" };
  }

  const conversation = conversationResult.data;
  if (
    !conversation ||
    conversation.user_id !== input.userId ||
    conversation.agent_id !== input.agentId
  ) {
    return { ok: false, reason: "not_found" };
  }

  const messagesResult = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversation.id)
    .in("role", ["user", "assistant"])
    .order("created_at", { ascending: false })
    .limit(HISTORY_WINDOW);

  if (messagesResult.error) {
    logDropped("chat", { messages: messagesResult.error });
    return { ok: false, reason: "dropped" };
  }

  const history: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const row of chronologicalWindow(messagesResult.data ?? [])) {
    if (row.role === "user" || row.role === "assistant") {
      history.push({ role: row.role, content: row.content });
    }
  }

  return {
    ok: true,
    conversation: {
      id: conversation.id,
      title: conversation.title,
      agent_id: conversation.agent_id,
    },
    history,
  };
}
