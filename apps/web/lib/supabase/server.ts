import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@maya/database";
import { publicSupabaseConfig } from "@maya/database";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = publicSupabaseConfig();

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
