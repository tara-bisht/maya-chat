import { parseCostumeId, type CostumeId } from "@maya/shared";
import { COMPANY, type PosterCostumeId } from "@/lib/company";

/** Columns the gallery is allowed to read. Never include `system_prompt`. */
export const GALLERY_AGENT_COLUMNS =
  "id, user_id, name, tagline, avatar_url, category, costume_id, is_curated, is_public, free_tier, archived_at, created_at" as const;

export type GalleryAgentRow = {
  id: string;
  user_id: string | null;
  name: string;
  tagline: string;
  avatar_url: string | null;
  category: string;
  costume_id: string;
  is_curated: boolean;
  is_public: boolean;
  free_tier: boolean;
  archived_at: string | null;
  created_at: string;
};

export type PlaybillStamp = "free" | "plus" | "house" | "private" | "next-bill";

export type Playbill = {
  id: string;
  shortName: string;
  tagline: string;
  category: string;
  costume: PosterCostumeId;
  avatar: string;
  freeTier: boolean;
  stamp?: PlaybillStamp;
  href?: string | null;
};

const COMPANY_BY_ID = new Map(COMPANY.map((player) => [player.id, player]));

export const COMPANY_ORDER = new Map(
  COMPANY.map((player, index) => [player.id, index]),
);

function costumeFromRow(row: GalleryAgentRow): CostumeId {
  const known = COMPANY_BY_ID.get(row.id);
  if (known) {
    return known.costume;
  }
  return parseCostumeId(row.costume_id);
}

function stampFromRow(row: GalleryAgentRow): PlaybillStamp {
  if (!row.is_curated) {
    return row.is_public ? "house" : "private";
  }
  return row.free_tier ? "free" : "plus";
}

export function playbillFromAgent(
  row: GalleryAgentRow,
  viewerId?: string,
): Playbill {
  void viewerId;
  const known = COMPANY_BY_ID.get(row.id);

  return {
    id: row.id,
    shortName: known?.shortName ?? row.name,
    tagline: row.tagline,
    category: row.category,
    costume: costumeFromRow(row),
    avatar: row.avatar_url ?? known?.avatar ?? "",
    freeTier: row.free_tier,
    stamp: stampFromRow(row),
    href: null,
  };
}

export function sortCuratedPlaybills(playbills: Playbill[]): Playbill[] {
  return [...playbills].sort(
    (a, b) =>
      (COMPANY_ORDER.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (COMPANY_ORDER.get(b.id) ?? Number.MAX_SAFE_INTEGER),
  );
}
