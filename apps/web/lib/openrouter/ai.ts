import "server-only";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { openRouterConfigFromEnv } from "./config";

let provider: ReturnType<typeof createOpenRouter> | undefined;

export function getOpenRouterModel(gatewayId: string) {
  if (!provider) {
    const config = openRouterConfigFromEnv();
    provider = createOpenRouter({
      apiKey: config.apiKey,
      extraBody: {
        // Attribution; OpenRouter also reads HTTP-Referer / X-Title via headers.
      },
      headers: {
        "HTTP-Referer": config.httpReferer,
        "X-Title": config.appTitle,
      },
    });
  }

  return provider(gatewayId);
}
