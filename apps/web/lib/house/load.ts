import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { HISTORY_WINDOW, isUuid, parseMayaPlan } from "@maya/shared";
import { logDropped } from "@/lib/supabase/dropped";
import { HOUSE_AGENT_COLUMNS, type HouseAgentRow } from "./columns";
import { toHouseAgent } from "./public-agent";
import { buildCast, displayThreadTitle, threadsForAgent } from "./threads";
import type { ConversationRow } from "./threads";
import type { HouseView, HydratedTurn } from "./types";

export type HouseLoad =
  | { ok: true; house: HouseView }
  | { ok: false; reason: "not_found" | "dropped" };

function hydrateTurns(
  rows: Array<{
    id: string;
    role: string;
    content: string;
    created_at: string;
  }>,
): HydratedTurn[] {
  const turns: HydratedTurn[] = [];
  for (const row of rows) {
    if (row.role !== "user" && row.role !== "assistant") {
      continue;
    }
    turns.push({
      id: row.id,
      role: row.role,
      content: row.content,
      createdAt: row.created_at,
    });
  }
  return turns;
}

export async function loadHouse(
  supabase: SupabaseClient<Database>,
  input: {
    userId: string;
    agentId: string;
    conversationId?: string | null;
  },
): Promise<HouseLoad> {
  if (!isUuid(input.agentId)) {
    return { ok: false, reason: "not_found" };
  }
  if (input.conversationId && !isUuid(input.conversationId)) {
    return { ok: false, reason: "not_found" };
  }

  const [agentResult, entitlementResult, conversationResult, agentsResult] =
    await Promise.all([
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
      supabase
        .from("conversations")
        .select("id, agent_id, title, updated_at")
        .eq("user_id", input.userId)
        .order("updated_at", { ascending: false }),
      supabase.from("agents").select(HOUSE_AGENT_COLUMNS),
    ]);

  if (agentResult.error || conversationResult.error || agentsResult.error) {
    logDropped("house", {
      agent: agentResult.error,
      conversations: conversationResult.error,
      company: agentsResult.error,
    });
    return { ok: false, reason: "dropped" };
  }

  const row = agentResult.data as HouseAgentRow | null;
  if (!row || row.archived_at) {
    return { ok: false, reason: "not_found" };
  }

  const planId = parseMayaPlan(entitlementResult.data?.plan);
  const planResult = await supabase
    .from("plans")
    .select("default_model_id, daily_message_limit")
    .eq("id", planId)
    .maybeSingle();

  if (planResult.error) {
    logDropped("house", { plan: planResult.error });
    return { ok: false, reason: "dropped" };
  }

  let backstory: string | null = null;
  if (row.user_id === input.userId && !row.is_curated) {
    const promptResult = await supabase.rpc("chat_agent_prompt", {
      p_agent_id: row.id,
    });
    if (promptResult.error) {
      logDropped("house", { prompt: promptResult.error });
      return { ok: false, reason: "dropped" };
    }
    backstory = promptResult.data ?? null;
  }

  const agent = toHouseAgent({
    row,
    viewerId: input.userId,
    planId,
    backstory,
  });

  const conversationRows = (conversationResult.data ?? []) as ConversationRow[];
  const agentRows = (agentsResult.data ?? []) as HouseAgentRow[];
  const threads = threadsForAgent(conversationRows, agent.id);

  let conversation: HouseView["conversation"] = null;
  if (input.conversationId) {
    const summary = conversationRows.find(
      (item) => item.id === input.conversationId && item.agent_id === agent.id,
    );
    if (!summary) {
      return { ok: false, reason: "not_found" };
    }
    const messagesResult = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", summary.id)
      .in("role", ["user", "assistant"])
      .order("created_at", { ascending: true })
      .limit(HISTORY_WINDOW);

    if (messagesResult.error) {
      return { ok: false, reason: "dropped" };
    }

    conversation = {
      id: summary.id,
      title: displayThreadTitle(summary.title),
      messages: hydrateTurns(messagesResult.data ?? []),
    };
  }

  return {
    ok: true,
    house: {
      agent,
      plan: planId,
      defaultModelId: planResult.data?.default_model_id ?? "qwen-flash",
      dailyLimit: planResult.data?.daily_message_limit ?? null,
      threads,
      cast: buildCast({
        agents: agentRows,
        viewerId: input.userId,
        conversations: conversationRows,
        activeAgentId: agent.id,
      }),
      conversation,
    },
  };
}
