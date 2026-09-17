import { describe, expect, it } from "vitest";
import { isExpensiveModel, parseGatewayId, SEED_MODELS } from "./catalog";

describe("SEED_MODELS", () => {
  it("contains exactly 57 models", () => {
    expect(SEED_MODELS).toHaveLength(57);
  });

  it("includes all 9 legacy aliases", () => {
    const legacyAliases = [
      "qwen-flash",
      "gemini-flash",
      "grok-fast",
      "deepseek",
      "qwen",
      "grok",
      "gpt",
      "claude",
      "kimi",
    ];
    const aliases = new Set(SEED_MODELS.map((model) => model.alias));
    for (const alias of legacyAliases) {
      expect(aliases.has(alias)).toBe(true);
    }
  });

  it("has unique aliases and gateway IDs", () => {
    const aliases = SEED_MODELS.map((m) => m.alias);
    const gatewayIds = SEED_MODELS.map((m) => m.gatewayId);
    expect(new Set(aliases).size).toBe(57);
    expect(new Set(gatewayIds).size).toBe(57);
  });

  it("represents all 10 labs in SEED_MODELS", () => {
    const expectedLabs = [
      "openai",
      "anthropic",
      "google",
      "deepseek",
      "xai",
      "meta",
      "mistral",
      "qwen",
      "moonshot",
      "cohere",
    ];
    const providers = new Set(SEED_MODELS.map((m) => m.provider));
    for (const lab of expectedLabs) {
      expect(providers.has(lab)).toBe(true);
    }
  });

  it("pins reserve rates used by the credit formula", () => {
    expect(
      SEED_MODELS.find((model) => model.alias === "qwen-flash"),
    ).toMatchObject({
      inputUsdPerMillion: 0.15,
      outputUsdPerMillion: 0.47,
    });
    expect(SEED_MODELS.find((model) => model.alias === "claude")).toMatchObject({
      inputUsdPerMillion: 3,
      outputUsdPerMillion: 15,
    });
  });

  it("stores OpenRouter slugs, not Vercel xai/ prefixes", () => {
    for (const model of SEED_MODELS) {
      expect(model.gatewayId).toContain("/");
      expect(model.gatewayId.startsWith("xai/")).toBe(false);
    }
    expect(SEED_MODELS.find((model) => model.alias === "grok-fast")?.gatewayId).toBe(
      "x-ai/grok-4.20",
    );
    expect(SEED_MODELS.find((model) => model.alias === "grok")?.gatewayId).toBe(
      "x-ai/grok-4.5",
    );
  });
});

describe("isExpensiveModel", () => {
  it("recognizes frontier expensive models", () => {
    const astra = SEED_MODELS.find((m) => m.alias === "gpt-6-astra")!;
    const fable = SEED_MODELS.find((m) => m.alias === "claude-fable-5-1")!;
    expect(isExpensiveModel(astra)).toBe(true);
    expect(isExpensiveModel(fable)).toBe(true);
    expect(isExpensiveModel({ outputUsdPerMillion: 20.01 })).toBe(true);
  });

  it("does not flag standard or cheap models as expensive", () => {
    const gpt = SEED_MODELS.find((m) => m.alias === "gpt")!;
    const flash = SEED_MODELS.find((m) => m.alias === "qwen-flash")!;
    expect(isExpensiveModel(gpt)).toBe(false);
    expect(isExpensiveModel(flash)).toBe(false);
    expect(isExpensiveModel({ outputUsdPerMillion: 20 })).toBe(false);
  });
});

describe("parseGatewayId", () => {
  it("splits author and slug on the first slash", () => {
    expect(parseGatewayId("x-ai/grok-4.20")).toEqual({
      author: "x-ai",
      slug: "grok-4.20",
    });
    expect(parseGatewayId("moonshotai/kimi-k2.5")).toEqual({
      author: "moonshotai",
      slug: "kimi-k2.5",
    });
  });

  it("rejects malformed ids", () => {
    expect(() => parseGatewayId("grok-4.20")).toThrow(/Invalid OpenRouter gateway id/);
    expect(() => parseGatewayId("/slug")).toThrow(/Invalid OpenRouter gateway id/);
    expect(() => parseGatewayId("author/")).toThrow(/Invalid OpenRouter gateway id/);
  });
});
