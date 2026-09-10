import {
  DEFAULT_TONE,
  canEditAgent,
  canUseAgent,
  parseCostumeId,
  parseLanguagePreset,
  parseMayaPlan,
  toneSettingsSchema,
  type MayaPlan,
} from "@maya/shared";
import { COMPANY } from "@/lib/company";
import type { HouseAgent } from "./types";
import type { HouseAgentRow } from "./columns";

const COMPANY_BY_ID = new Map(COMPANY.map((player) => [player.id, player]));

export function shortNameFor(row: { id: string; name: string }): string {
  return COMPANY_BY_ID.get(row.id)?.shortName ?? row.name;
}

export function avatarFor(row: { id: string; avatar_url: string | null }): string {
  return row.avatar_url ?? COMPANY_BY_ID.get(row.id)?.avatar ?? "";
}

export function toAccessAgent(row: HouseAgentRow) {
  return {
    isCurated: row.is_curated,
    freeTier: row.free_tier,
    isPublic: row.is_public,
    archivedAt: row.archived_at,
    userId: row.user_id,
  };
}

export function toHouseAgent(input: {
  row: HouseAgentRow;
  viewerId: string;
  planId: MayaPlan;
  backstory: string | null;
}): HouseAgent {
  const { row, viewerId, planId, backstory } = input;
  const known = COMPANY_BY_ID.get(row.id);
  const canEdit = canEditAgent({ agent: toAccessAgent(row), viewerId });
  const tone = toneSettingsSchema.safeParse(row.tone_settings);

  return {
    id: row.id,
    name: row.name,
    shortName: known?.shortName ?? row.name,
    tagline: row.tagline,
    category: row.category,
    costume: parseCostumeId(row.costume_id || known?.costume),
    avatar: avatarFor(row),
    languagePreset: parseLanguagePreset(row.language_preset),
    tone: tone.success ? tone.data : DEFAULT_TONE,
    toolsEnabled: row.tools_enabled ?? [],
    isCurated: row.is_curated,
    isPublic: row.is_public,
    freeTier: row.free_tier,
    canEdit,
    canChat: canUseAgent({
      planId,
      viewerId,
      agent: toAccessAgent(row),
    }),
    backstory: canEdit ? backstory : null,
  };
}

export { parseMayaPlan };
