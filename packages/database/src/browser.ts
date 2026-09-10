import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { publicSupabaseConfig } from "./env";

export function createBrowserSupabaseClient() {
  const { url, publishableKey } = publicSupabaseConfig();
  return createBrowserClient<Database>(url, publishableKey);
}
