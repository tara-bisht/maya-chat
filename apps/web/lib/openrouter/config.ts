export const OPENROUTER_APP_TITLE = "Maya Chat";
export const OPENROUTER_APP_CATEGORIES = "roleplay,general-chat";
const DEFAULT_REFERER = "http://localhost:3000";

export type OpenRouterConfig = {
  apiKey: string;
  httpReferer: string;
  appTitle: string;
  appCategories: string;
};

export function openRouterConfigFromEnv(
  env: NodeJS.Dict<string> = process.env,
): OpenRouterConfig {
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing required environment variable OPENROUTER_API_KEY");
  }

  return {
    apiKey,
    httpReferer: env.NEXT_PUBLIC_APP_URL || DEFAULT_REFERER,
    appTitle: OPENROUTER_APP_TITLE,
    appCategories: OPENROUTER_APP_CATEGORIES,
  };
}
