import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServiceSupabaseClient } from "@maya/database/service";
import { SEED_MODELS } from "../lib/openrouter/catalog";

function applyEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eq = line.indexOf("=");
    if (eq <= 0) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function loadEnv() {
  applyEnvFile(resolve(process.cwd(), ".env.local"));
  applyEnvFile(resolve(process.cwd(), ".env"));
  applyEnvFile(resolve(process.cwd(), "../../.env.local"));
  applyEnvFile(resolve(process.cwd(), "../../.env"));
}

export async function syncCatalog() {
  loadEnv();
  const supabase = createServiceSupabaseClient();
  const rows = SEED_MODELS.map((m) => ({
    id: m.alias,
    gateway_id: m.gatewayId,
    display_name: m.displayName,
    provider: m.provider,
    supports_tools: true,
    is_enabled: true,
    sort_order: m.sortOrder,
    input_usd_per_million: m.inputUsdPerMillion,
    output_usd_per_million: m.outputUsdPerMillion,
  }));

  const { error } = await supabase.from("models").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("Failed to sync catalog:", error);
    process.exit(1);
  }
  console.log(`Synced ${rows.length} models to public.models successfully.`);
}

if (process.argv[1]?.includes("sync-catalog")) {
  syncCatalog().catch((error: unknown) => {
    console.error("Catalog sync error:", error);
    process.exit(1);
  });
}
