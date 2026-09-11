import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createServiceSupabaseClient } from "@maya/database/service";
import { logDropped } from "@/lib/supabase/dropped";
import {
  FALLBACK_SEATS,
  seatsFromCatalog,
  type CatalogModelRow,
  type CatalogPlanModelRow,
  type CatalogPlanRow,
  type Seat,
} from "./seats-from-catalog";

async function fetchPublicSeats(): Promise<Seat[]> {
  try {
    const supabase = createServiceSupabaseClient();
    const [plansResult, modelsResult, planModelsResult] = await Promise.all([
      supabase
        .from("plans")
        .select(
          "id, display_name, monthly_price_cents, yearly_price_cents, daily_credit_limit, max_custom_agents, curated_agent_limit, vector_memory, tools_allowed",
        )
        .eq("is_active", true),
      supabase
        .from("models")
        .select("id, sort_order, is_enabled")
        .eq("is_enabled", true)
        .order("sort_order", { ascending: true }),
      supabase.from("plan_models").select("plan_id, model_id"),
    ]);

    if (plansResult.error || modelsResult.error || planModelsResult.error) {
      logDropped("loadPublicSeats", {
        plans: plansResult.error,
        models: modelsResult.error,
        planModels: planModelsResult.error,
      });
      return FALLBACK_SEATS;
    }

    const seats = seatsFromCatalog({
      plans: (plansResult.data ?? []) as CatalogPlanRow[],
      models: (modelsResult.data ?? []) as CatalogModelRow[],
      planModels: (planModelsResult.data ?? []) as CatalogPlanModelRow[],
    });

    if (seats.length === 0) {
      return FALLBACK_SEATS;
    }
    return seats;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    console.error(`[maya] loadPublicSeats dropped: ${message}`);
    return FALLBACK_SEATS;
  }
}

const cachedPublicSeats = unstable_cache(fetchPublicSeats, ["public-seats"], {
  revalidate: 300,
});

export const loadPublicSeats = cache(async () => cachedPublicSeats());
