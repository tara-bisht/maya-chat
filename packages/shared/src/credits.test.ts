import { describe, expect, it } from "vitest";
import {
  CREDIT_SCALE_DEFAULT,
  creditsFromRates,
  creditsFromUsd,
  estimateCharsAsTokens,
  estimateReserveCredits,
  estimatedCreditsPerTurn,
  minPlanFor,
  modelIdSchema,
  parseCreditBalance,
  parseModelId,
  parseReserveChatTurn,
  resolveModelId,
  usdFromTokens,
} from "./credits";

describe("modelIdSchema", () => {
  it("accepts catalog aliases and rejects gateway slugs", () => {
    expect(modelIdSchema.parse("qwen-flash")).toBe("qwen-flash");
    expect(modelIdSchema.parse("gpt")).toBe("gpt");
    expect(modelIdSchema.safeParse("openai/gpt-5.4").success).toBe(false);
    expect(modelIdSchema.safeParse("x-ai/grok-4.20").success).toBe(false);
    expect(parseModelId("claude")).toBe("claude");
    expect(parseModelId("")).toBeUndefined();
  });
});

describe("creditsFromUsd", () => {
  it("ceils to integer credits at 1 credit = $0.0001", () => {
    expect(creditsFromUsd(0.0016, CREDIT_SCALE_DEFAULT)).toBe(16);
    expect(creditsFromUsd(0.0001)).toBe(1);
    expect(creditsFromUsd(0.00001)).toBe(1);
    expect(creditsFromUsd(0)).toBe(1);
    expect(creditsFromUsd(-1)).toBe(1);
  });
});

describe("creditsFromRates", () => {
  it("prices a typical Qwen Flash turn at 16 credits", () => {
    const usd = usdFromTokens(8000, 800, 0.15, 0.47);
    expect(usd).toBeCloseTo(0.001576, 6);
    expect(
      creditsFromRates({
        promptTokens: 8000,
        completionTokens: 800,
        inputUsdPerMillion: 0.15,
        outputUsdPerMillion: 0.47,
      }),
    ).toBe(16);
    expect(
      estimatedCreditsPerTurn({
        inputUsdPerMillion: 0.15,
        outputUsdPerMillion: 0.47,
      }),
    ).toBe(16);
  });

  it("reserves max output, not the typical completion", () => {
    const reserved = estimateReserveCredits({
      estimatedPromptTokens: 8000,
      maxOutputTokens: 2048,
      inputUsdPerMillion: 3,
      outputUsdPerMillion: 15,
    });
    expect(reserved).toBeGreaterThan(
      estimatedCreditsPerTurn({
        inputUsdPerMillion: 3,
        outputUsdPerMillion: 15,
      }),
    );
  });
});

describe("estimateCharsAsTokens", () => {
  it("uses four characters per token", () => {
    expect(estimateCharsAsTokens(0)).toBe(1);
    expect(estimateCharsAsTokens(4)).toBe(1);
    expect(estimateCharsAsTokens(5)).toBe(2);
  });
});

describe("resolveModelId", () => {
  const allowed = new Set(["qwen-flash", "gemini-flash", "grok-fast"]);

  it("403s an explicit model that is not on the plan", () => {
    expect(
      resolveModelId({
        requested: "claude",
        defaultModelId: "qwen-flash",
        allowed,
      }),
    ).toEqual({ ok: false, reason: "forbidden_model" });
  });

  it("uses the requested allowed model", () => {
    expect(
      resolveModelId({
        requested: "grok-fast",
        conversationModelId: "qwen-flash",
        defaultModelId: "qwen-flash",
        allowed,
      }),
    ).toEqual({ ok: true, modelId: "grok-fast" });
  });

  it("walks conversation → preferred → default when omitted", () => {
    expect(
      resolveModelId({
        conversationModelId: "gemini-flash",
        preferredModelId: "grok-fast",
        defaultModelId: "qwen-flash",
        allowed,
      }),
    ).toEqual({ ok: true, modelId: "gemini-flash" });
    expect(
      resolveModelId({
        conversationModelId: "claude",
        preferredModelId: "grok-fast",
        defaultModelId: "qwen-flash",
        allowed,
      }),
    ).toEqual({ ok: true, modelId: "grok-fast" });
  });
});

describe("minPlanFor", () => {
  it("returns the cheapest plan that lists the model", () => {
    expect(minPlanFor(["pro", "plus"])).toBe("plus");
    expect(minPlanFor(["pro"])).toBe("pro");
    expect(minPlanFor([])).toBeNull();
  });
});

describe("rpc parsers", () => {
  it("reads a credit_balance payload", () => {
    expect(
      parseCreditBalance({
        ok: true,
        dailyLimit: 1500,
        dailyUsed: 16,
        dailyRemaining: 1484,
        monthlyLimit: 20000,
        monthlyUsed: 16,
        monthlyRemaining: 19984,
        resetsAt: "2026-09-12T00:00:00.000Z",
        turnCount: 1,
        maxTurns: 80,
      })?.dailyRemaining,
    ).toBe(1484);
  });

  it("reads forbidden_model from reserve", () => {
    const parsed = parseReserveChatTurn({
      ok: false,
      reason: "forbidden_model",
      allowed: ["qwen-flash"],
    });
    expect(parsed).toEqual({
      ok: false,
      reason: "forbidden_model",
      allowed: ["qwen-flash"],
    });
  });
});
