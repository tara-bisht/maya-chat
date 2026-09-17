import { EXPENSIVE_MODEL_OUTPUT_USD_THRESHOLD } from "@maya/shared";

export type SeedModel = {
  alias: string;
  gatewayId: string;
  displayName: string;
  provider: string;
  sortOrder: number;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
};

export function isExpensiveModel(model: { outputUsdPerMillion: number }): boolean {
  return model.outputUsdPerMillion > EXPENSIVE_MODEL_OUTPUT_USD_THRESHOLD;
}

/**
 * Public aliases (`models.id`) and OpenRouter slugs (`models.gateway_id`).
 * Keep in sync with `supabase/migrations/20260910000001_init_schema.sql`.
 *
 * Pinned against the live OpenRouter catalog on 2026-09-10.
 * `xai/grok-4-1-fast` is not listed; `x-ai/grok-4.20` is the current cheap/fast Grok.
 */
export const SEED_MODELS: readonly SeedModel[] = [
  {
    "alias": "qwen-flash",
    "gatewayId": "qwen/qwen3.8-flash",
    "displayName": "Qwen Flash",
    "provider": "qwen",
    "sortOrder": 10,
    "inputUsdPerMillion": 0.15,
    "outputUsdPerMillion": 0.47
  },
  {
    "alias": "gemini-flash",
    "gatewayId": "google/gemini-2.5-flash",
    "displayName": "Gemini Flash",
    "provider": "google",
    "sortOrder": 15,
    "inputUsdPerMillion": 0.3,
    "outputUsdPerMillion": 2.5
  },
  {
    "alias": "grok-fast",
    "gatewayId": "x-ai/grok-4.20",
    "displayName": "Grok Fast",
    "provider": "xai",
    "sortOrder": 20,
    "inputUsdPerMillion": 1.25,
    "outputUsdPerMillion": 2.5
  },
  {
    "alias": "deepseek",
    "gatewayId": "deepseek/deepseek-chat",
    "displayName": "DeepSeek",
    "provider": "deepseek",
    "sortOrder": 30,
    "inputUsdPerMillion": 0.2574,
    "outputUsdPerMillion": 1.0287
  },
  {
    "alias": "qwen",
    "gatewayId": "qwen/qwen3-235b-a22b",
    "displayName": "Qwen",
    "provider": "qwen",
    "sortOrder": 40,
    "inputUsdPerMillion": 0.455,
    "outputUsdPerMillion": 1.82
  },
  {
    "alias": "grok",
    "gatewayId": "x-ai/grok-4.5",
    "displayName": "Grok",
    "provider": "xai",
    "sortOrder": 50,
    "inputUsdPerMillion": 2,
    "outputUsdPerMillion": 6
  },
  {
    "alias": "gpt",
    "gatewayId": "openai/gpt-5.4",
    "displayName": "GPT",
    "provider": "openai",
    "sortOrder": 60,
    "inputUsdPerMillion": 2.5,
    "outputUsdPerMillion": 15
  },
  {
    "alias": "claude",
    "gatewayId": "anthropic/claude-sonnet-4.5",
    "displayName": "Claude",
    "provider": "anthropic",
    "sortOrder": 70,
    "inputUsdPerMillion": 3,
    "outputUsdPerMillion": 15
  },
  {
    "alias": "kimi",
    "gatewayId": "moonshotai/kimi-k2.5",
    "displayName": "Kimi",
    "provider": "moonshot",
    "sortOrder": 80,
    "inputUsdPerMillion": 0.45,
    "outputUsdPerMillion": 2.25
  },
  {
    "alias": "gpt-6-astra",
    "gatewayId": "openai/gpt-6-astra",
    "displayName": "GPT-6 Astra",
    "provider": "openai",
    "sortOrder": 100,
    "inputUsdPerMillion": 10,
    "outputUsdPerMillion": 50
  },
  {
    "alias": "gpt-6-astra-pro",
    "gatewayId": "openai/gpt-6-astra-pro",
    "displayName": "GPT-6 Astra Pro",
    "provider": "openai",
    "sortOrder": 101,
    "inputUsdPerMillion": 10,
    "outputUsdPerMillion": 50
  },
  {
    "alias": "gpt-5-6-luna-pro",
    "gatewayId": "openai/gpt-5.6-luna-pro",
    "displayName": "GPT-5.6 Luna Pro",
    "provider": "openai",
    "sortOrder": 102,
    "inputUsdPerMillion": 0.2,
    "outputUsdPerMillion": 1.2
  },
  {
    "alias": "gpt-5-6-luna",
    "gatewayId": "openai/gpt-5.6-luna",
    "displayName": "GPT-5.6 Luna",
    "provider": "openai",
    "sortOrder": 103,
    "inputUsdPerMillion": 0.2,
    "outputUsdPerMillion": 1.2
  },
  {
    "alias": "gpt-5-6-terra-pro",
    "gatewayId": "openai/gpt-5.6-terra-pro",
    "displayName": "GPT-5.6 Terra Pro",
    "provider": "openai",
    "sortOrder": 104,
    "inputUsdPerMillion": 2,
    "outputUsdPerMillion": 12
  },
  {
    "alias": "claude-fable-5-1",
    "gatewayId": "anthropic/claude-fable-5.1",
    "displayName": "Claude Fable 5.1",
    "provider": "anthropic",
    "sortOrder": 105,
    "inputUsdPerMillion": 10,
    "outputUsdPerMillion": 50
  },
  {
    "alias": "claude-opus-5",
    "gatewayId": "anthropic/claude-opus-5",
    "displayName": "Claude Opus 5",
    "provider": "anthropic",
    "sortOrder": 106,
    "inputUsdPerMillion": 5,
    "outputUsdPerMillion": 25
  },
  {
    "alias": "claude-sonnet-5",
    "gatewayId": "anthropic/claude-sonnet-5",
    "displayName": "Claude Sonnet 5",
    "provider": "anthropic",
    "sortOrder": 107,
    "inputUsdPerMillion": 2,
    "outputUsdPerMillion": 10
  },
  {
    "alias": "claude-fable-5",
    "gatewayId": "anthropic/claude-fable-5",
    "displayName": "Claude Fable 5",
    "provider": "anthropic",
    "sortOrder": 108,
    "inputUsdPerMillion": 10,
    "outputUsdPerMillion": 50
  },
  {
    "alias": "claude-opus-4-8",
    "gatewayId": "anthropic/claude-opus-4.8",
    "displayName": "Claude Opus 4.8",
    "provider": "anthropic",
    "sortOrder": 109,
    "inputUsdPerMillion": 5,
    "outputUsdPerMillion": 25
  },
  {
    "alias": "gemini-3-8-flash",
    "gatewayId": "google/gemini-3.8-flash",
    "displayName": "Gemini 3.8 Flash",
    "provider": "google",
    "sortOrder": 110,
    "inputUsdPerMillion": 0.75,
    "outputUsdPerMillion": 3.75
  },
  {
    "alias": "gemini-3-7-flash",
    "gatewayId": "google/gemini-3.7-flash",
    "displayName": "Gemini 3.7 Flash",
    "provider": "google",
    "sortOrder": 111,
    "inputUsdPerMillion": 0.75,
    "outputUsdPerMillion": 3.75
  },
  {
    "alias": "gemini-3-6-flash",
    "gatewayId": "google/gemini-3.6-flash",
    "displayName": "Gemini 3.6 Flash",
    "provider": "google",
    "sortOrder": 112,
    "inputUsdPerMillion": 0.75,
    "outputUsdPerMillion": 3.75
  },
  {
    "alias": "gemini-3-5-flash-lite",
    "gatewayId": "google/gemini-3.5-flash-lite",
    "displayName": "Gemini 3.5 Flash Lite",
    "provider": "google",
    "sortOrder": 113,
    "inputUsdPerMillion": 0.3,
    "outputUsdPerMillion": 2.5
  },
  {
    "alias": "gemini-3-1-flash-lite-image",
    "gatewayId": "google/gemini-3.1-flash-lite-image",
    "displayName": "Nano Banana 2 Lite",
    "provider": "google",
    "sortOrder": 114,
    "inputUsdPerMillion": 0.25,
    "outputUsdPerMillion": 1.5
  },
  {
    "alias": "deepseek-v4-1-flash",
    "gatewayId": "deepseek/deepseek-v4.1-flash",
    "displayName": "DeepSeek V4.1 Flash",
    "provider": "deepseek",
    "sortOrder": 115,
    "inputUsdPerMillion": 0.15,
    "outputUsdPerMillion": 0.6
  },
  {
    "alias": "deepseek-v4-flash-vision-exp",
    "gatewayId": "deepseek/deepseek-v4-flash-vision-exp",
    "displayName": "DeepSeek V4 Flash Vision Exp",
    "provider": "deepseek",
    "sortOrder": 116,
    "inputUsdPerMillion": 0.22,
    "outputUsdPerMillion": 0.66
  },
  {
    "alias": "deepseek-v4-pro-0813",
    "gatewayId": "deepseek/deepseek-v4-pro-0813",
    "displayName": "DeepSeek V4 Pro 0813",
    "provider": "deepseek",
    "sortOrder": 117,
    "inputUsdPerMillion": 0.66,
    "outputUsdPerMillion": 1.98
  },
  {
    "alias": "deepseek-v4-flash-0731",
    "gatewayId": "deepseek/deepseek-v4-flash-0731",
    "displayName": "DeepSeek V4 Flash 0731",
    "provider": "deepseek",
    "sortOrder": 118,
    "inputUsdPerMillion": 0.06,
    "outputUsdPerMillion": 0.12
  },
  {
    "alias": "deepseek-v4-pro",
    "gatewayId": "deepseek/deepseek-v4-pro",
    "displayName": "DeepSeek V4 Pro 0423",
    "provider": "deepseek",
    "sortOrder": 119,
    "inputUsdPerMillion": 1.6,
    "outputUsdPerMillion": 3.2
  },
  {
    "alias": "grok-4-6",
    "gatewayId": "x-ai/grok-4.6",
    "displayName": "Grok 4.6",
    "provider": "xai",
    "sortOrder": 120,
    "inputUsdPerMillion": 2,
    "outputUsdPerMillion": 6
  },
  {
    "alias": "grok-build-0-1",
    "gatewayId": "x-ai/grok-build-0.1",
    "displayName": "Grok Build 0.1",
    "provider": "xai",
    "sortOrder": 121,
    "inputUsdPerMillion": 1,
    "outputUsdPerMillion": 2
  },
  {
    "alias": "grok-4-3",
    "gatewayId": "x-ai/grok-4.3",
    "displayName": "Grok 4.3",
    "provider": "xai",
    "sortOrder": 122,
    "inputUsdPerMillion": 1.25,
    "outputUsdPerMillion": 2.5
  },
  {
    "alias": "grok-4-20-multi-agent",
    "gatewayId": "x-ai/grok-4.20-multi-agent",
    "displayName": "Grok 4.20 Multi-Agent",
    "provider": "xai",
    "sortOrder": 123,
    "inputUsdPerMillion": 1.25,
    "outputUsdPerMillion": 2.5
  },
  {
    "alias": "llama-4-maverick",
    "gatewayId": "meta-llama/llama-4-maverick",
    "displayName": "Llama 4 Maverick",
    "provider": "meta",
    "sortOrder": 124,
    "inputUsdPerMillion": 0.1875,
    "outputUsdPerMillion": 0.6525
  },
  {
    "alias": "llama-4-scout",
    "gatewayId": "meta-llama/llama-4-scout",
    "displayName": "Llama 4 Scout",
    "provider": "meta",
    "sortOrder": 125,
    "inputUsdPerMillion": 0.1,
    "outputUsdPerMillion": 0.3
  },
  {
    "alias": "llama-3-3-70b-instruct",
    "gatewayId": "meta-llama/llama-3.3-70b-instruct",
    "displayName": "Llama 3.3 70B Instruct",
    "provider": "meta",
    "sortOrder": 126,
    "inputUsdPerMillion": 0.1,
    "outputUsdPerMillion": 0.32
  },
  {
    "alias": "llama-3-2-1b-instruct",
    "gatewayId": "meta-llama/llama-3.2-1b-instruct",
    "displayName": "Llama 3.2 1B Instruct",
    "provider": "meta",
    "sortOrder": 127,
    "inputUsdPerMillion": 0.027,
    "outputUsdPerMillion": 0.201
  },
  {
    "alias": "llama-3-2-3b-instruct",
    "gatewayId": "meta-llama/llama-3.2-3b-instruct",
    "displayName": "Llama 3.2 3B Instruct",
    "provider": "meta",
    "sortOrder": 128,
    "inputUsdPerMillion": 0.05,
    "outputUsdPerMillion": 0.33
  },
  {
    "alias": "mistral-medium-3-5",
    "gatewayId": "mistralai/mistral-medium-3-5",
    "displayName": "Mistral Medium 3.5",
    "provider": "mistral",
    "sortOrder": 129,
    "inputUsdPerMillion": 1.5,
    "outputUsdPerMillion": 7.5
  },
  {
    "alias": "mistral-small-2603",
    "gatewayId": "mistralai/mistral-small-2603",
    "displayName": "Mistral Small 4",
    "provider": "mistral",
    "sortOrder": 130,
    "inputUsdPerMillion": 0.15,
    "outputUsdPerMillion": 0.6
  },
  {
    "alias": "devstral-2512",
    "gatewayId": "mistralai/devstral-2512",
    "displayName": "Devstral 2 2512",
    "provider": "mistral",
    "sortOrder": 131,
    "inputUsdPerMillion": 0.4,
    "outputUsdPerMillion": 2
  },
  {
    "alias": "ministral-14b-2512",
    "gatewayId": "mistralai/ministral-14b-2512",
    "displayName": "Ministral 3 14B 2512",
    "provider": "mistral",
    "sortOrder": 132,
    "inputUsdPerMillion": 0.2,
    "outputUsdPerMillion": 0.2
  },
  {
    "alias": "ministral-8b-2512",
    "gatewayId": "mistralai/ministral-8b-2512",
    "displayName": "Ministral 3 8B 2512",
    "provider": "mistral",
    "sortOrder": 133,
    "inputUsdPerMillion": 0.15,
    "outputUsdPerMillion": 0.15
  },
  {
    "alias": "qwen3-8-max-0902",
    "gatewayId": "qwen/qwen3.8-max-0902",
    "displayName": "Qwen3.8 Max",
    "provider": "qwen",
    "sortOrder": 134,
    "inputUsdPerMillion": 2,
    "outputUsdPerMillion": 6
  },
  {
    "alias": "qwen3-8-27b",
    "gatewayId": "qwen/qwen3.8-27b",
    "displayName": "Qwen3.8 27B",
    "provider": "qwen",
    "sortOrder": 135,
    "inputUsdPerMillion": 0.214,
    "outputUsdPerMillion": 2.55
  },
  {
    "alias": "qwen3-8-2-4t-a95b",
    "gatewayId": "qwen/qwen3.8-2.4t-a95b",
    "displayName": "Qwen3.8 2.4T A95B",
    "provider": "qwen",
    "sortOrder": 136,
    "inputUsdPerMillion": 2,
    "outputUsdPerMillion": 6
  },
  {
    "alias": "qwen3-7-flash",
    "gatewayId": "qwen/qwen3.7-flash",
    "displayName": "Qwen3.7 Flash",
    "provider": "qwen",
    "sortOrder": 137,
    "inputUsdPerMillion": 0.03,
    "outputUsdPerMillion": 0.13
  },
  {
    "alias": "qwen3-7-plus",
    "gatewayId": "qwen/qwen3.7-plus",
    "displayName": "Qwen3.7 Plus",
    "provider": "qwen",
    "sortOrder": 138,
    "inputUsdPerMillion": 0.32,
    "outputUsdPerMillion": 1.28
  },
  {
    "alias": "kimi-k3",
    "gatewayId": "moonshotai/kimi-k3",
    "displayName": "Kimi K3",
    "provider": "moonshot",
    "sortOrder": 139,
    "inputUsdPerMillion": 3,
    "outputUsdPerMillion": 15
  },
  {
    "alias": "kimi-k2-7-code",
    "gatewayId": "moonshotai/kimi-k2.7-code",
    "displayName": "Kimi K2.7 Code",
    "provider": "moonshot",
    "sortOrder": 140,
    "inputUsdPerMillion": 0.7062,
    "outputUsdPerMillion": 3.21
  },
  {
    "alias": "kimi-k2-6",
    "gatewayId": "moonshotai/kimi-k2.6",
    "displayName": "Kimi K2.6",
    "provider": "moonshot",
    "sortOrder": 141,
    "inputUsdPerMillion": 0.95,
    "outputUsdPerMillion": 4
  },
  {
    "alias": "kimi-k2-thinking",
    "gatewayId": "moonshotai/kimi-k2-thinking",
    "displayName": "Kimi K2 Thinking",
    "provider": "moonshot",
    "sortOrder": 142,
    "inputUsdPerMillion": 0.6,
    "outputUsdPerMillion": 2.5
  },
  {
    "alias": "kimi-k2-0905",
    "gatewayId": "moonshotai/kimi-k2-0905",
    "displayName": "Kimi K2 0905",
    "provider": "moonshot",
    "sortOrder": 143,
    "inputUsdPerMillion": 0.6,
    "outputUsdPerMillion": 2.5
  },
  {
    "alias": "command-a",
    "gatewayId": "cohere/command-a",
    "displayName": "Command A",
    "provider": "cohere",
    "sortOrder": 144,
    "inputUsdPerMillion": 2.5,
    "outputUsdPerMillion": 10
  },
  {
    "alias": "command-r7b-12-2024",
    "gatewayId": "cohere/command-r7b-12-2024",
    "displayName": "Command R7B",
    "provider": "cohere",
    "sortOrder": 145,
    "inputUsdPerMillion": 0.0375,
    "outputUsdPerMillion": 0.15
  },
  {
    "alias": "command-r-08-2024",
    "gatewayId": "cohere/command-r-08-2024",
    "displayName": "Command R",
    "provider": "cohere",
    "sortOrder": 146,
    "inputUsdPerMillion": 0.15,
    "outputUsdPerMillion": 0.6
  },
  {
    "alias": "command-r-plus-08-2024",
    "gatewayId": "cohere/command-r-plus-08-2024",
    "displayName": "Command R+",
    "provider": "cohere",
    "sortOrder": 147,
    "inputUsdPerMillion": 2.5,
    "outputUsdPerMillion": 10
  }
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
