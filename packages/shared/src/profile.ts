import { z } from "zod";

export const LANGUAGE_PRESET_IDS = ["en", "hinglish", "hi", "slang"] as const;
export type LanguagePresetId = (typeof LANGUAGE_PRESET_IDS)[number];

export const LANGUAGE_PRESETS: ReadonlyArray<{
  id: LanguagePresetId;
  label: string;
}> = [
  { id: "en", label: "Global English" },
  { id: "hinglish", label: "Casual Hinglish" },
  { id: "hi", label: "Warm Hindi" },
  { id: "slang", label: "Colloquial Slang" },
];

export const DISPLAY_NAME_MAX = 80;
export const GLOBAL_BIO_MAX = 500;

export const ENTITLEMENT_STATUSES = ["active", "past_due", "canceled"] as const;
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];

export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Give a name.")
    .max(DISPLAY_NAME_MAX, "Keep it under 80 characters."),
  preferredLanguage: z.enum(LANGUAGE_PRESET_IDS, {
    error: "Pick a language.",
  }),
  globalBio: z
    .string()
    .trim()
    .max(GLOBAL_BIO_MAX, "Keep it under 500 characters."),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

export type ProfileField = keyof ProfileUpdate;

export type ParseProfileUpdateResult =
  | { ok: true; data: ProfileUpdate }
  | { ok: false; fieldErrors: Partial<Record<ProfileField, string>> };

export function parseProfileUpdate(input: unknown): ParseProfileUpdateResult {
  const parsed = profileUpdateSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }

  const fieldErrors: Partial<Record<ProfileField, string>> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (
      (key === "displayName" ||
        key === "preferredLanguage" ||
        key === "globalBio") &&
      !fieldErrors[key]
    ) {
      fieldErrors[key] = issue.message;
    }
  }
  return { ok: false, fieldErrors };
}

export function parseMayaPlan(
  value: string | null | undefined,
): "free" | "plus" | "pro" {
  if (value === "plus" || value === "pro" || value === "free") {
    return value;
  }
  return "free";
}

export function parseLanguagePreset(
  value: string | null | undefined,
): LanguagePresetId {
  if (
    value === "en" ||
    value === "hinglish" ||
    value === "hi" ||
    value === "slang"
  ) {
    return value;
  }
  return "en";
}

export function parseEntitlementStatus(
  value: string | null | undefined,
): EntitlementStatus {
  if (value === "past_due" || value === "canceled" || value === "active") {
    return value;
  }
  return "active";
}

export type SettingsBill =
  | { kind: "seats"; href: "/#seats" }
  | { kind: "portal-disabled" };

export type SettingsView = {
  email: string | null;
  displayName: string;
  preferredLanguage: LanguagePresetId;
  globalBio: string;
  seat: {
    planId: ReturnType<typeof parseMayaPlan>;
    displayName: string;
    status: EntitlementStatus;
  };
  bill: SettingsBill;
};

export type SettingsViewInput = {
  email: string | null | undefined;
  profile: {
    display_name: string | null;
    preferred_language: string;
    global_bio: string | null;
  };
  entitlement: {
    plan: string | null;
    status: string | null;
  } | null;
  plan: {
    id: string;
    display_name: string;
  } | null;
};

const PLAN_FALLBACK_NAME = {
  free: "Free",
  plus: "Plus",
  pro: "Pro",
} as const;

export function toSettingsView(input: SettingsViewInput): SettingsView {
  const planId = parseMayaPlan(input.entitlement?.plan);
  const catalogName =
    input.plan && input.plan.id === planId ? input.plan.display_name : null;
  const displayName = catalogName ?? PLAN_FALLBACK_NAME[planId];

  return {
    email: input.email ?? null,
    displayName: input.profile.display_name ?? "",
    preferredLanguage: parseLanguagePreset(input.profile.preferred_language),
    globalBio: input.profile.global_bio ?? "",
    seat: {
      planId,
      displayName,
      status: parseEntitlementStatus(input.entitlement?.status),
    },
    bill:
      planId === "free"
        ? { kind: "seats", href: "/#seats" }
        : { kind: "portal-disabled" },
  };
}

