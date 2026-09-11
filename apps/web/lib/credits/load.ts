import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import {
  CREDIT_SCALE_DEFAULT,
  estimatedCreditsPerTurn,
  minPlanFor,
  parseCreditBalance,
  parseMayaPlan,
  type CreditBalance,
  type MayaPlan,
} from "@maya/shared";
import { logDropped } from "@/lib/supabase/dropped";

export type CatalogModel = {
  id: string;
  displayName: string;
  provider: string;
  sortOrder: number;
  allowed: boolean;
  minPlan: MayaPlan;
  estimatedCreditsPerTurn: number;
};

export type ModelsPayload = {
  defaultModelId: string;
  selectedModelId: string;
  credits: CreditBalance;
  models: CatalogModel[];
};

export async function loadCreditBalance(
  supabase: SupabaseClient<Database>,
): Promise<CreditBalance | null> {
  const result = await supabase.rpc("credit_balance");
  if (result.error) {
    logDropped("credit_balance", { rpc: result.error });
    return null;
  }
  return parseCreditBalance(result.data);
}

export async function loadModelsPayload(
  supabase: SupabaseClient<Database>,
  input: {
    planId: MayaPlan;
    conversationModelId?: string | null;
    preferredModelId?: string | null;
  },
): Promise<ModelsPayload | null> {
  const [modelsResult, planModelsResult, planResult, settingsResult, credits] =
    await Promise.all([
      supabase
        .from("models")
        .select(
          "id, display_name, provider, is_enabled, sort_order, input_usd_per_million, output_usd_per_million, min_turn_credits",
        )
        .eq("is_enabled", true)
        .order("sort_order", { ascending: true }),
      supabase.from("plan_models").select("plan_id, model_id"),
      supabase
        .from("plans")
        .select("default_model_id")
        .eq("id", input.planId)
        .maybeSingle(),
      supabase
        .from("catalog_settings")
        .select("credit_scale")
        .eq("id", 1)
        .maybeSingle(),
      loadCreditBalance(supabase),
    ]);

  if (modelsResult.error || planModelsResult.error || planResult.error) {
    logDropped("loadModelsPayload", {
      models: modelsResult.error,
      planModels: planModelsResult.error,
      plan: planResult.error,
    });
    return null;
  }
  if (settingsResult.error) {
    logDropped("loadModelsPayload", { settings: settingsResult.error });
  }

  const defaultModelId = planResult.data?.default_model_id ?? "qwen-flash";
  const scale = settingsResult.data?.credit_scale ?? CREDIT_SCALE_DEFAULT;
  const plansByModel = new Map<string, MayaPlan[]>();
  for (const row of planModelsResult.data ?? []) {
    const plan = parseMayaPlan(row.plan_id);
    const list = plansByModel.get(row.model_id) ?? [];
    list.push(plan);
    plansByModel.set(row.model_id, list);
  }

  const allowed = new Set(
    (planModelsResult.data ?? [])
      .filter((row) => row.plan_id === input.planId)
      .map((row) => row.model_id),
  );

  const models: CatalogModel[] = [];
  for (const row of modelsResult.data ?? []) {
    const minPlan = minPlanFor(plansByModel.get(row.id) ?? []);
    if (!minPlan) {
      continue;
    }
    models.push({
      id: row.id,
      displayName: row.display_name,
      provider: row.provider,
      sortOrder: row.sort_order,
      allowed: allowed.has(row.id),
      minPlan,
      estimatedCreditsPerTurn: estimatedCreditsPerTurn({
        inputUsdPerMillion: Number(row.input_usd_per_million),
        outputUsdPerMillion: Number(row.output_usd_per_million),
        minTurnCredits: row.min_turn_credits,
        scale,
      }),
    });
  }

  const selected =
    (input.conversationModelId && allowed.has(input.conversationModelId)
      ? input.conversationModelId
      : null) ??
    (input.preferredModelId && allowed.has(input.preferredModelId)
      ? input.preferredModelId
      : null) ??
    (allowed.has(defaultModelId) ? defaultModelId : models.find((item) => item.allowed)?.id) ??
    defaultModelId;

  if (!credits) {
    return null;
  }

  return {
    defaultModelId,
    selectedModelId: selected,
    credits,
    models,
  };
}
