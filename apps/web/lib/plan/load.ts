import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { parseMayaPlan, type MayaPlan } from "@maya/shared";
import { logDropped } from "@/lib/supabase/dropped";
import { highlightedPlan } from "./present";

export type PlanTicket = {
  id: MayaPlan;
  displayName: string;
  monthlyCents: number;
  yearlyCents: number | null;
  dailyCredits: number;
  monthlyCredits: number;
  maxCustomAgents: number | null;
  vectorMemory: boolean;
  models: string[];
  current: boolean;
  highlighted: boolean;
};

export type PlanLoad =
  | { ok: true; current: MayaPlan; plans: PlanTicket[] }
  | { ok: false };

export async function loadPlan(
  supabase: SupabaseClient<Database>,
  input: { userId: string },
): Promise<PlanLoad> {
  const [entitlementResult, plansResult, planModelsResult, modelsResult] =
    await Promise.all([
      supabase
        .from("entitlements")
        .select("plan")
        .eq("user_id", input.userId)
        .maybeSingle(),
      supabase
        .from("plans")
        .select(
          "id, display_name, monthly_price_cents, yearly_price_cents, daily_credit_limit, monthly_credit_limit, max_custom_agents, vector_memory",
        )
        .eq("is_active", true)
        .order("monthly_price_cents", { ascending: true }),
      supabase.from("plan_models").select("plan_id, model_id"),
      supabase
        .from("models")
        .select("id")
        .eq("is_enabled", true)
        .order("sort_order", { ascending: true }),
    ]);

  if (
    entitlementResult.error ||
    plansResult.error ||
    planModelsResult.error ||
    modelsResult.error
  ) {
    logDropped("loadPlan", {
      entitlement: entitlementResult.error,
      plans: plansResult.error,
      planModels: planModelsResult.error,
      models: modelsResult.error,
    });
    return { ok: false };
  }

  const current = parseMayaPlan(entitlementResult.data?.plan);
  const highlight = highlightedPlan(current);
  const enabled = new Set((modelsResult.data ?? []).map((row) => row.id));
  const modelsByPlan = new Map<string, string[]>();
  for (const row of planModelsResult.data ?? []) {
    if (!enabled.has(row.model_id)) {
      continue;
    }
    const list = modelsByPlan.get(row.plan_id) ?? [];
    list.push(row.model_id);
    modelsByPlan.set(row.plan_id, list);
  }

  const plans: PlanTicket[] = [];
  for (const row of plansResult.data ?? []) {
    const id = parseMayaPlan(row.id);
    if (row.id !== id) {
      continue;
    }
    plans.push({
      id,
      displayName: row.display_name,
      monthlyCents: row.monthly_price_cents,
      yearlyCents: row.yearly_price_cents,
      dailyCredits: row.daily_credit_limit,
      monthlyCredits: row.monthly_credit_limit,
      maxCustomAgents: row.max_custom_agents,
      vectorMemory: row.vector_memory,
      models: modelsByPlan.get(row.id) ?? [],
      current: id === current,
      highlighted: id === highlight,
    });
  }

  if (plans.length === 0) {
    logDropped("loadPlan", { plans: plansResult.error });
    return { ok: false };
  }

  return { ok: true, current, plans };
}
