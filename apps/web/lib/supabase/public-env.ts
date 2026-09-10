/**
 * Next.js only inlines NEXT_PUBLIC_* when the identifier is a static
 * `process.env.NEXT_PUBLIC_FOO` access. `process.env[name]` is empty in the
 * browser bundle even if apps/web/.env.local is set.
 */
export function getPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Set it in apps/web/.env.local and restart `next dev`.",
    );
  }
  if (!publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Set it in apps/web/.env.local and restart `next dev`.",
    );
  }
  return { url, publishableKey };
}
