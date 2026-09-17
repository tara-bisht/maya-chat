import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { MAYA_AGENT_ID, type MatchCandidate } from "@maya/shared";
import { HOUSE_AGENT_COLUMNS, type HouseAgentRow } from "@/lib/house/columns";
import { shortNameFor } from "@/lib/house/public-agent";
import { logDropped } from "@/lib/supabase/dropped";

function toCandidate(row: HouseAgentRow): MatchCandidate {
  return {
    id: row.id,
    name: shortNameFor(row),
    tagline: row.tagline,
    category: row.category,
    freeTier: row.free_tier,
  };
}

export async function loadPinnedIds(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<string[]> {
  const result = await supabase
    .from("agent_roster")
    .select("agent_id")
    .eq("user_id", userId);
  if (result.error) {
    logDropped("loadPinnedIds", { roster: result.error });
    return [];
  }
  return (result.data ?? []).map((row) => row.agent_id);
}

export async function loadRosterForMatch(
  supabase: SupabaseClient<Database>,
  input: { userId: string },
): Promise<MatchCandidate[]> {
  const pinnedIds = await loadPinnedIds(supabase, input.userId);
  const [pinnedResult, customResult] = await Promise.all([
    pinnedIds.length > 0
      ? supabase
          .from("agents")
          .select(HOUSE_AGENT_COLUMNS)
          .in("id", pinnedIds)
          .is("archived_at", null)
      : Promise.resolve({ data: [] as HouseAgentRow[], error: null }),
    supabase
      .from("agents")
      .select(HOUSE_AGENT_COLUMNS)
      .eq("user_id", input.userId)
      .eq("is_curated", false)
      .is("archived_at", null),
  ]);
  if (pinnedResult.error || customResult.error) {
    logDropped("loadRosterForMatch", {
      pinned: pinnedResult.error,
      custom: customResult.error,
    });
    return [];
  }
  const seen = new Set<string>();
  const rows: HouseAgentRow[] = [];
  for (const row of [
    ...((pinnedResult.data ?? []) as HouseAgentRow[]),
    ...((customResult.data ?? []) as HouseAgentRow[]),
  ]) {
    if (row.is_host || row.id === MAYA_AGENT_ID || seen.has(row.id)) {
      continue;
    }
    seen.add(row.id);
    rows.push(row);
  }
  return rows.map(toCandidate);
}

export async function loadCatalogForMatch(
  supabase: SupabaseClient<Database>,
  input: { userId: string; excludeIds: readonly string[] },
): Promise<MatchCandidate[]> {
  const result = await supabase
    .from("agents")
    .select(HOUSE_AGENT_COLUMNS)
    .eq("is_curated", true)
    .eq("is_public", true)
    .eq("is_host", false)
    .is("archived_at", null);
  if (result.error) {
    logDropped("loadCatalogForMatch", { agents: result.error });
    return [];
  }
  const excluded = new Set(input.excludeIds);
  return ((result.data ?? []) as HouseAgentRow[])
    .filter((row) => !excluded.has(row.id))
    .map(toCandidate);
}


