import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createBrowserSupabaseClient(
  url: string,
  publishableKey: string,
) {
  return createBrowserClient<Database>(url, publishableKey);
}
