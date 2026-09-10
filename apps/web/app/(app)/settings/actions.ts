"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { saveSettings, type SaveSettingsResult } from "@/lib/settings/save";
import { createClient } from "@/lib/supabase/server";

export type UpdateProfileState = SaveSettingsResult | null;

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData,
): Promise<SaveSettingsResult> {
  const user = await requireUser("/settings");
  const supabase = await createClient();
  const result = await saveSettings(supabase, user.id, {
    displayName: formData.get("displayName"),
    preferredLanguage: formData.get("preferredLanguage"),
    globalBio: formData.get("globalBio") ?? "",
  });

  if (result.ok) {
    revalidatePath("/settings");
  }

  return result;
}
