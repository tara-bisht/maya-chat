import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { serviceSupabaseConfig } from "./env";

/** Server-only. Never import this module from a Client Component. */
export function createServiceSupabaseClient() {
  const { url, serviceRoleKey } = serviceSupabaseConfig();
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
