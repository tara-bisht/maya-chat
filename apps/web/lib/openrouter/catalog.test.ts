import { describe, expect, it } from "vitest";
import { parseGatewayId, SEED_MODELS } from "./catalog";

describe("SEED_MODELS", () => {
  it("covers the eight seed aliases", () => {
    expect(SEED_MODELS.map((model) => model.alias)).toEqual([
      "gemini-flash",
      "grok-fast",
      "deepseek",
      "qwen",
      "grok",
      "gpt",
      "claude",
      "kimi",
    ]);
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
