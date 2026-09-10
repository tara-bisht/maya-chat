import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@maya/database";
import { getPublicSupabaseEnv } from "./public-env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getPublicSupabaseEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component. Middleware refreshes the session.
        }
      },
    },
  });
}
