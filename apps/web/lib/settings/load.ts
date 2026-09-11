import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import {
  toSettingsView,
  type CreditBalance,
  type SettingsView,
} from "@maya/shared";
import { loadCreditBalance } from "@/lib/credits/load";

export type SettingsLoad =
  | { ok: true; view: SettingsView; credits: CreditBalance | null }
  | { ok: false };

function embeddedPlan(
  value: unknown,
): { id: string; display_name: string } | null {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") {
    return null;
  }
  const { id, display_name } = row as {
    id?: unknown;
    display_name?: unknown;
  };
  if (typeof id !== "string" || typeof display_name !== "string") {
    return null;
  }
  return { id, display_name };
}

export async function loadSettings(
  supabase: SupabaseClient<Database>,
  input: { userId: string; email: string | null | undefined },
): Promise<SettingsLoad> {
  const [profileResult, entitlementResult, credits] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, preferred_language, global_bio")
      .eq("id", input.userId)
      .maybeSingle(),
    supabase
      .from("entitlements")
      .select("plan, status, plans ( id, display_name )")
      .eq("user_id", input.userId)
      .maybeSingle(),
    loadCreditBalance(supabase),
  ]);

  if (profileResult.error || !profileResult.data) {
    return { ok: false };
  }
  if (entitlementResult.error) {
    return { ok: false };
  }

  const entitlement = entitlementResult.data;

  return {
    ok: true,
    credits,
    view: toSettingsView({
      email: input.email,
      profile: profileResult.data,
      entitlement: entitlement
        ? { plan: entitlement.plan, status: entitlement.status }
        : null,
      plan: embeddedPlan(
        entitlement && "plans" in entitlement ? entitlement.plans : null,
      ),
    }),
  };
}
