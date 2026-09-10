import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { parseMayaPlan, type MayaPlan } from "@maya/shared";
import { houseHref } from "@/lib/house/href";
import {
  GALLERY_AGENT_COLUMNS,
  playbillFromAgent,
  sortCuratedPlaybills,
  type GalleryAgentRow,
  type Playbill,
} from "./playbill";

export type GalleryLoad =
  | {
      ok: true;
      curated: Playbill[];
      custom: Playbill[];
      house: Playbill[];
      plan: MayaPlan;
    }
  | { ok: false };

const HOUSE_LISTING_LIMIT = 24;

export async function loadGallery(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<GalleryLoad> {
  const [
    curatedResult,
    customResult,
    houseResult,
    entitlementResult,
    conversationsResult,
  ] = await Promise.all([
    supabase
      .from("agents")
      .select(GALLERY_AGENT_COLUMNS)
      .eq("is_curated", true),
    supabase
      .from("agents")
      .select(GALLERY_AGENT_COLUMNS)
      .eq("user_id", userId)
      .eq("is_curated", false)
      .is("archived_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("agents")
      .select(GALLERY_AGENT_COLUMNS)
      .eq("is_public", true)
      .eq("is_curated", false)
      .is("archived_at", null)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(HOUSE_LISTING_LIMIT),
    supabase
      .from("entitlements")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("conversations")
      .select("id, agent_id, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
  ]);

  if (
    curatedResult.error ||
    customResult.error ||
    houseResult.error ||
    conversationsResult.error
  ) {
    return { ok: false };
  }

  const latestByAgent = new Map<string, string>();
  for (const conversation of conversationsResult.data ?? []) {
    if (!latestByAgent.has(conversation.agent_id)) {
      latestByAgent.set(conversation.agent_id, conversation.id);
    }
  }

  const withDoor = (playbill: Playbill): Playbill => ({
    ...playbill,
    href: houseHref(playbill.id, latestByAgent.get(playbill.id)),
  });

  const curatedRows = (curatedResult.data ?? []) as GalleryAgentRow[];
  const customRows = (customResult.data ?? []) as GalleryAgentRow[];
  const houseRows = (houseResult.data ?? []) as GalleryAgentRow[];

  return {
    ok: true,
    curated: sortCuratedPlaybills(
      curatedRows.map((row) => playbillFromAgent(row, userId)),
    ).map(withDoor),
    custom: customRows.map((row) => playbillFromAgent(row, userId)).map(withDoor),
    house: houseRows.map((row) => playbillFromAgent(row, userId)).map(withDoor),
    plan: parseMayaPlan(entitlementResult.data?.plan),
  };
}
