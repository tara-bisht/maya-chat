import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { openRouterConfigFromEnv } from "./config";

let provider: ReturnType<typeof createOpenRouter> | undefined;

export function getOpenRouterModel(gatewayId: string) {
  if (!provider) {
    const config = openRouterConfigFromEnv();
    provider = createOpenRouter({
      apiKey: config.apiKey,
      appName: config.appTitle,
      appUrl: config.httpReferer,
      compatibility: "strict",
    });
  }

  return provider(gatewayId);
}
