import "server-only";

import { OpenRouter } from "@openrouter/sdk";
import { openRouterConfigFromEnv } from "./config";

let client: OpenRouter | undefined;

export function getOpenRouter(): OpenRouter {
  if (client) {
    return client;
  }

  const config = openRouterConfigFromEnv();
  client = new OpenRouter({
    apiKey: config.apiKey,
    httpReferer: config.httpReferer,
    appTitle: config.appTitle,
    appCategories: config.appCategories,
    timeoutMs: 30_000,
    retryConfig: {
      strategy: "backoff",
      backoff: {
        initialInterval: 500,
        maxInterval: 8_000,
        exponent: 1.5,
        maxElapsedTime: 20_000,
      },
      retryConnectionErrors: true,
    },
  });

  return client;
}
