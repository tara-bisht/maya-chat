import { isUuid } from "@maya/shared";
import { COMPANY } from "@/lib/company";
import { MAYA_AGENT_ID, MAYA_SLUG } from "@/lib/maya/constants";

/** Known alias mapping for curated players to their canonical UUIDs */
const CURATED_SLUG_TO_ID = new Map<string, string>([
  [MAYA_SLUG, MAYA_AGENT_ID],
  ["maya-00", MAYA_AGENT_ID],
]);

const CURATED_ID_TO_SLUG = new Map<string, string>([
  [MAYA_AGENT_ID, MAYA_SLUG],
]);

for (const player of COMPANY) {
  CURATED_SLUG_TO_ID.set(player.slug, player.id);
  CURATED_ID_TO_SLUG.set(player.id, player.slug);

  // Also support short name alias (e.g. "marcus" for "marcus-01")
  const shortSlug = player.shortName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (!CURATED_SLUG_TO_ID.has(shortSlug)) {
    CURATED_SLUG_TO_ID.set(shortSlug, player.id);
  }
}

/**
 * Resolves an identifier (which may be a slug or alias or UUID) into a UUID if it matches a known curated agent.
 * Returns null if the identifier is not a known curated slug.
 */
export function resolveCuratedSlug(identifier: string): string | null {
  if (isUuid(identifier)) {
    return identifier;
  }
  const normalized = identifier.toLowerCase().trim();
  return CURATED_SLUG_TO_ID.get(normalized) ?? null;
}

/**
 * Returns the preferred URL slug for an agent.
 * Prefers the explicit slug, then known curated slug, and falls back to id.
 */
export function getSlugForAgent(
  agent: { id: string; slug?: string | null } | string,
): string {
  if (typeof agent === "string") {
    return CURATED_ID_TO_SLUG.get(agent) ?? agent;
  }
  if (agent.slug) {
    return agent.slug;
  }
  return CURATED_ID_TO_SLUG.get(agent.id) ?? agent.id;
}
