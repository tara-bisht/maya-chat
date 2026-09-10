import type { PostgrestError } from "@supabase/supabase-js";

/** Server-only. Codes and messages only — no row payloads. */
export function logDropped(
  surface: string,
  parts: Record<string, PostgrestError | null | undefined>,
) {
  const failed = Object.entries(parts).flatMap(([name, err]) =>
    err ? [`${name} ${err.code ?? "?"} ${err.message}`] : [],
  );
  if (failed.length === 0) {
    return;
  }
  console.error(`[maya] ${surface} dropped: ${failed.join("; ")}`);
}
