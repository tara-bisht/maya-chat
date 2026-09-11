import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { createServiceSupabaseClient } from "@maya/database/service";
import {
  CREDIT_SCALE_DEFAULT,
  HISTORY_WINDOW,
  canUseAgent,
  chronologicalWindow,
  parseMayaPlan,
  resolveModelId,
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
  preferredModelId: string | null;
};

export async function loadChatProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<ChatUserProfile> {
  const result = await supabase
    .from("profiles")
    .select("display_name, global_bio, preferred_model_id")
    .eq("id", userId)
    .maybeSingle();

  if (result.error || !result.data) {
    return { displayName: "", bio: "", preferredModelId: null };
  }

  return {
    displayName: result.data.display_name?.trim() ?? "",
    bio: result.data.global_bio?.trim() ?? "",
    preferredModelId: result.data.preferred_model_id,
  };
}

export type PlanModelRow = {
  id: string;
  gatewayId: string;
  displayName: string;
  provider: string;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  minTurnCredits: number;
  maxOutputTokens: number;
};

export type LoadPlanModelResult =
  | {
      ok: true;
      defaultModelId: string;
      modelId: string;
      model: PlanModelRow;
      toolsAllowed: string[];
      allowedModelIds: string[];
      creditScale: number;
    }
  | { ok: false; reason: "dropped" }
  | { ok: false; reason: "forbidden_model"; allowedModelIds: string[] };

export async function loadPlanModel(
  supabase: SupabaseClient<Database>,
  planId: MayaPlan,
  input: {
    requestedModelId?: string;
    conversationModelId?: string | null;
    preferredModelId?: string | null;
  } = {},
): Promise<LoadPlanModelResult> {
  const [planResult, allowResult, modelsResult, settingsResult] = await Promise.all([
    supabase
      .from("plans")
      .select("default_model_id, tools_allowed")
      .eq("id", planId)
      .maybeSingle(),
    supabase.from("plan_models").select("model_id").eq("plan_id", planId),
    supabase
      .from("models")
      .select(
        "id, gateway_id, display_name, provider, is_enabled, input_usd_per_million, output_usd_per_million, min_turn_credits, max_output_tokens",
      )
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true }),
    supabase.from("catalog_settings").select("credit_scale").eq("id", 1).maybeSingle(),
  ]);

  if (planResult.error || !planResult.data) {
    logDropped("loadPlanModel", { plan: planResult.error });
    return { ok: false, reason: "dropped" };
  }
  if (allowResult.error || modelsResult.error) {
    logDropped("loadPlanModel", {
      allow: allowResult.error,
      models: modelsResult.error,
    });
    return { ok: false, reason: "dropped" };
  }
  if (settingsResult.error) {
    logDropped("loadPlanModel", { settings: settingsResult.error });
  }

  const allowedIdsOnPlan = new Set(
    (allowResult.data ?? []).map((row) => row.model_id),
  );
  const allowedRows: PlanModelRow[] = [];
  for (const model of modelsResult.data ?? []) {
    if (!allowedIdsOnPlan.has(model.id)) {
      continue;
    }
    allowedRows.push({
      id: model.id,
      gatewayId: model.gateway_id,
      displayName: model.display_name,
      provider: model.provider,
      inputUsdPerMillion: Number(model.input_usd_per_million),
      outputUsdPerMillion: Number(model.output_usd_per_million),
      minTurnCredits: model.min_turn_credits,
      maxOutputTokens: model.max_output_tokens,
    });
  }

  const allowedIds = allowedRows.map((row) => row.id);
  const resolved = resolveModelId({
    requested: input.requestedModelId,
    conversationModelId: input.conversationModelId,
    preferredModelId: input.preferredModelId,
    defaultModelId: planResult.data.default_model_id,
    allowed: new Set(allowedIds),
  });

  if (!resolved.ok) {
    return { ok: false, reason: "forbidden_model", allowedModelIds: allowedIds };
  }

  const model = allowedRows.find((row) => row.id === resolved.modelId);
  if (!model) {
    return { ok: false, reason: "forbidden_model", allowedModelIds: allowedIds };
  }

  const creditScale = settingsResult.data?.credit_scale ?? CREDIT_SCALE_DEFAULT;

  return {
    ok: true,
    defaultModelId: planResult.data.default_model_id,
    modelId: model.id,
    model,
    toolsAllowed: planResult.data.tools_allowed ?? [],
    allowedModelIds: allowedIds,
    creditScale: creditScale > 0 ? creditScale : CREDIT_SCALE_DEFAULT,
  };
}

export async function loadConversationHistory(
  supabase: SupabaseClient<Database>,
  input: { userId: string; agentId: string; conversationId: string },
): Promise<
  | {
      ok: true;
      conversation: {
        id: string;
        title: string;
        agent_id: string;
        modelId: string | null;
      };
      history: Array<{ role: "user" | "assistant"; content: string }>;
    }
  | { ok: false; reason: "not_found" | "dropped" }
> {
  const conversationResult = await supabase
    .from("conversations")
    .select("id, title, agent_id, user_id, model_id")
    .eq("id", input.conversationId)
    .maybeSingle();

  if (conversationResult.error) {
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
      modelId: conversation.model_id,
    },
    history,
  };
}
