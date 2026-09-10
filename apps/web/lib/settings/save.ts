import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { parseProfileUpdate, type ProfileField } from "@maya/shared";

export type SaveSettingsResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors?: Partial<Record<ProfileField, string>>;
      formError?: string;
    };

export async function saveSettings(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: unknown,
): Promise<SaveSettingsResult> {
  const parsed = parseProfileUpdate(input);
  if (!parsed.ok) {
    return parsed;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      preferred_language: parsed.data.preferredLanguage,
      global_bio: parsed.data.globalBio === "" ? null : parsed.data.globalBio,
    })
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { ok: false, formError: "The line dropped." };
  }

  return { ok: true };
}
