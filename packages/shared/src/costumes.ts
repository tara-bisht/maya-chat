export const COSTUME_IDS = [
  "marcus",
  "priya",
  "alex",
  "nonna",
  "viktor",
  "valerian",
  "barnaby",
  "ren",
  "custom",
  "maya",
] as const;

export type CostumeId = (typeof COSTUME_IDS)[number];

export const STUDIO_COSTUME_IDS = COSTUME_IDS.filter(
  (id): id is Exclude<CostumeId, "maya"> => id !== "maya",
);

export function parseCostumeId(
  value: string | null | undefined,
): CostumeId {
  if (value && (COSTUME_IDS as readonly string[]).includes(value)) {
    return value as CostumeId;
  }
  return "custom";
}
