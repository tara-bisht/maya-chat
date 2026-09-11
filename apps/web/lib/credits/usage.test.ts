import { describe, expect, it, vi } from "vitest";
import type { PlanModelRow } from "@/lib/chat/load-context";

vi.mock("server-only", () => ({}));

import { costUsdFromUsage, settleCreditsFromUsage } from "./usage";

const qwen: PlanModelRow = {
  id: "qwen-flash",
  gatewayId: "qwen/qwen3.8-flash",
  displayName: "Qwen Flash",
  provider: "qwen",
  inputUsdPerMillion: 0.15,
  outputUsdPerMillion: 0.47,
  minTurnCredits: 1,
  maxOutputTokens: 2048,
};

describe("costUsdFromUsage", () => {
  it("reads usage.raw.cost", () => {
    expect(
      costUsdFromUsage({ raw: { cost: 0.0016 } }, undefined),
    ).toBe(0.0016);
  });

  it("reads providerMetadata.openrouter.usage.cost (OpenRouter AI SDK)", () => {
    expect(
      costUsdFromUsage(undefined, {
        openrouter: { usage: { cost: 0.002 } },
      }),
    ).toBe(0.002);
  });

  it("still reads providerMetadata.openrouter.cost if present", () => {
    expect(
      costUsdFromUsage(undefined, {
        openrouter: { cost: 0.003 },
      }),
    ).toBe(0.003);
  });

  it("prefers usage.raw over metadata", () => {
    expect(
      costUsdFromUsage(
        { raw: { cost: 0.001 } },
        { openrouter: { usage: { cost: 0.009 } } },
      ),
    ).toBe(0.001);
  });

  it("returns 0 when the gateway billed zero", () => {
    expect(costUsdFromUsage({ raw: { cost: 0 } }, undefined)).toBe(0);
  });
});

describe("settleCreditsFromUsage", () => {
  it("prices from USD when cost is present", () => {
    const billed = settleCreditsFromUsage({
      usage: { inputTokens: 100, outputTokens: 50, raw: { cost: 0.0016 } },
      providerMetadata: undefined,
      model: qwen,
      creditScale: 10_000,
      reservedCredits: 16,
    });
    expect(billed.credits).toBe(16);
    expect(billed.costUsd).toBe(0.0016);
  });

  it("does not overcharge an explicit $0 via catalog rates", () => {
    const billed = settleCreditsFromUsage({
      usage: { inputTokens: 8000, outputTokens: 800, raw: { cost: 0 } },
      providerMetadata: undefined,
      model: qwen,
      creditScale: 10_000,
      reservedCredits: 16,
    });
    expect(billed.credits).toBe(1);
    expect(billed.costUsd).toBe(0);
  });

  it("falls back to catalog rates when cost is missing but tokens exist", () => {
    const billed = settleCreditsFromUsage({
      usage: { inputTokens: 8000, outputTokens: 800 },
      providerMetadata: undefined,
      model: qwen,
      creditScale: 10_000,
      reservedCredits: 40,
    });
    expect(billed.credits).toBe(16);
    expect(billed.costUsd).toBeNull();
  });
});
