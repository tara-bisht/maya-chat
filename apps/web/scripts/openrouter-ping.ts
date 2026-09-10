import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { OpenRouter } from "@openrouter/sdk";
import { NotFoundResponseError } from "@openrouter/sdk/models/errors";
import { parseGatewayId, SEED_MODELS } from "../lib/openrouter/catalog";
import { openRouterConfigFromEnv } from "../lib/openrouter/config";

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

applyEnvFile(resolve(process.cwd(), ".env.local"));
applyEnvFile(resolve(process.cwd(), ".env"));
applyEnvFile(resolve(process.cwd(), "../../.env.local"));

function createClient(): OpenRouter {
  const config = openRouterConfigFromEnv();
  return new OpenRouter({
    apiKey: config.apiKey,
    httpReferer: config.httpReferer,
    appTitle: config.appTitle,
    appCategories: config.appCategories,
    timeoutMs: 30_000,
  });
}

async function pingCatalog(openRouter: OpenRouter) {
  let failed = 0;

  for (const model of SEED_MODELS) {
    const { author, slug } = parseGatewayId(model.gatewayId);
    try {
      const result = await openRouter.models.get({ author, slug });
      const id = result.data.id;
      console.log(`ok    ${model.alias.padEnd(14)} ${model.gatewayId}  (${id})`);
    } catch (error) {
      failed += 1;
      const reason =
        error instanceof NotFoundResponseError
          ? "not found"
          : error instanceof Error
            ? error.message
            : String(error);
      console.error(`fail  ${model.alias.padEnd(14)} ${model.gatewayId}  ${reason}`);
    }
  }

  if (failed > 0) {
    throw new Error(`${failed} seed gateway_id(s) did not resolve on OpenRouter`);
  }
}

function isChatResult(
  value: unknown,
): value is { choices: Array<{ message?: { content?: unknown } }> } {
  return (
    typeof value === "object" &&
    value !== null &&
    "choices" in value &&
    Array.isArray((value as { choices: unknown }).choices)
  );
}

async function pingChat(openRouter: OpenRouter) {
  const seed =
    SEED_MODELS.find((model) => model.alias === "gemini-flash") ?? SEED_MODELS[0];
  const result = await openRouter.chat.send({
    chatRequest: {
      model: seed.gatewayId,
      maxTokens: 16,
      stream: false,
      messages: [
        {
          role: "user",
          content: "Reply with the single word pong.",
        },
      ],
    },
  });

  if (!isChatResult(result)) {
    throw new Error("Expected a non-streaming chat result");
  }

  const content = result.choices[0]?.message?.content;
  console.log(`chat  ${seed.alias} → ${String(content ?? "").trim()}`);
}

async function main() {
  const wantChat = process.argv.includes("--chat");
  let config;
  try {
    config = openRouterConfigFromEnv();
  } catch {
    console.error(
      "Missing OPENROUTER_API_KEY. Add it to apps/web/.env.local (see .env.example).",
    );
    process.exit(1);
  }

  const openRouter = createClient();
  console.log(`referer ${config.httpReferer}`);
  await pingCatalog(openRouter);
  if (wantChat) {
    await pingChat(openRouter);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
