export type SeedModel = {
  alias: string;
  gatewayId: string;
  displayName: string;
  provider: string;
  sortOrder: number;
};

/**
 * Public aliases (`models.id`) and OpenRouter slugs (`models.gateway_id`).
 * Keep in sync with `supabase/migrations/20260910000001_init_schema.sql`.
 *
 * Pinned against the live OpenRouter catalog on 2026-09-10.
 * `xai/grok-4-1-fast` is not listed; `x-ai/grok-4.20` is the current cheap/fast Grok.
 */
export const SEED_MODELS: readonly SeedModel[] = [
  {
    alias: "qwen-flash",
    gatewayId: "qwen/qwen3.8-flash",
    displayName: "Qwen Flash",
    provider: "qwen",
    sortOrder: 10,
  },
  {
    alias: "gemini-flash",
    gatewayId: "google/gemini-2.5-flash",
    displayName: "Gemini Flash",
    provider: "google",
    sortOrder: 15,
  },
  {
    alias: "grok-fast",
    gatewayId: "x-ai/grok-4.20",
    displayName: "Grok Fast",
    provider: "xai",
    sortOrder: 20,
  },
  {
    alias: "deepseek",
    gatewayId: "deepseek/deepseek-chat",
    displayName: "DeepSeek",
    provider: "deepseek",
    sortOrder: 30,
  },
  {
    alias: "qwen",
    gatewayId: "qwen/qwen3-235b-a22b",
    displayName: "Qwen",
    provider: "qwen",
    sortOrder: 40,
  },
  {
    alias: "grok",
    gatewayId: "x-ai/grok-4.5",
    displayName: "Grok",
    provider: "xai",
    sortOrder: 50,
  },
  {
    alias: "gpt",
    gatewayId: "openai/gpt-5.4",
    displayName: "GPT",
    provider: "openai",
    sortOrder: 60,
  },
  {
    alias: "claude",
    gatewayId: "anthropic/claude-sonnet-4.5",
    displayName: "Claude",
    provider: "anthropic",
    sortOrder: 70,
  },
  {
    alias: "kimi",
    gatewayId: "moonshotai/kimi-k2.5",
    displayName: "Kimi",
    provider: "moonshot",
    sortOrder: 80,
  },
];

export function parseGatewayId(gatewayId: string): {
  author: string;
  slug: string;
} {
  const slash = gatewayId.indexOf("/");
  if (slash <= 0 || slash === gatewayId.length - 1) {
    throw new Error(`Invalid OpenRouter gateway id: ${gatewayId}`);
  }
  return {
    author: gatewayId.slice(0, slash),
    slug: gatewayId.slice(slash + 1),
  };
}
