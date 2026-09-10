import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import {
  DEFAULT_TONE,
  parseCostumeId,
  parseLanguagePreset,
  parseMayaPlan,
  toneSettingsSchema,
  type CostumeId,
  type LanguagePreset,
  type MayaPlan,
  type StudioTool,
  type ToneSettings,
} from "@maya/shared";
import { logDropped } from "@/lib/supabase/dropped";
import { createClient } from "@/lib/supabase/server";
import {
  GALLERY_AGENT_COLUMNS,
  playbillFromAgent,
  type GalleryAgentRow,
  type Playbill,
} from "@/lib/gallery/playbill";

export type StudioContext = {
  planId: MayaPlan;
  planDisplayName: string;
  maxCustomAgents: number | null;
  toolsAllowed: string[];
  liveCustomCount: number;
};

export type OwnSheet = {
  id: string;
  name: string;
  tagline: string;
  languagePreset: LanguagePreset;
  costumeId: CostumeId;
  backstory: string;
  tone: ToneSettings;
  toolsEnabled: StudioTool[];
  isPublic: boolean;
  archived: boolean;
};

export async function loadStudioContext(
  userId: string,
  supabase?: SupabaseClient<Database>,
): Promise<StudioContext | null> {
  const client = supabase ?? (await createClient());
  const [{ data: entitlement }, countResult] = await Promise.all([
    client
      .from("entitlements")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle(),
    client
      .from("agents")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_curated", false)
      .is("archived_at", null),
  ]);

  const planId = parseMayaPlan(entitlement?.plan);
  const { data: plan } = await client
    .from("plans")
    .select("display_name, max_custom_agents, tools_allowed")
    .eq("id", planId)
    .maybeSingle();

  if (!plan) {
    return null;
  }

  return {
    planId,
    planDisplayName: plan.display_name,
    maxCustomAgents: plan.max_custom_agents,
    toolsAllowed: plan.tools_allowed,
    liveCustomCount: countResult.count ?? 0,
  };
}

export async function loadOwnRoles(
  userId: string,
): Promise<{ ok: true; playbills: Playbill[] } | { ok: false }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agents")
    .select(GALLERY_AGENT_COLUMNS)
    .eq("user_id", userId)
    .eq("is_curated", false)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    logDropped("studio", { roles: error });
    return { ok: false };
  }

  return {
    ok: true,
    playbills: ((data ?? []) as GalleryAgentRow[]).map((row) =>
      playbillFromAgent(row, userId),
    ),
  };
}

export async function loadOwnSheet(agentId: string): Promise<OwnSheet | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("own_custom_agent_sheet", {
    p_id: agentId,
  });

  if (error || !data) {
    return null;
  }

  const toneParsed = toneSettingsSchema.safeParse(data.tone_settings);
  const costumeId = parseCostumeId(data.costume_id);
  const languagePreset: LanguagePreset = parseLanguagePreset(
    data.language_preset,
  );

  return {
    id: data.id,
    name: data.name,
    tagline: data.tagline,
    languagePreset,
    costumeId,
    backstory: data.system_prompt,
    tone: toneParsed.success ? toneParsed.data : DEFAULT_TONE,
    toolsEnabled: data.tools_enabled.filter(
      (tool): tool is StudioTool =>
        tool === "memory_saver" ||
        tool === "math_solver" ||
        tool === "web_search",
    ),
    isPublic: data.is_public,
    archived: data.archived_at !== null,
  };
}
