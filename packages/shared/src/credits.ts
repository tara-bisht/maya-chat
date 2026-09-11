import { z } from "zod";
import type { MayaPlan } from "./plans";

export const CREDIT_SCALE_DEFAULT = 10_000;
export const TYPICAL_PROMPT_TOKENS = 8_000;
export const TYPICAL_COMPLETION_TOKENS = 800;
export const MODEL_ID_MAX = 64;

const MODEL_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const modelIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(MODEL_ID_MAX)
  .regex(MODEL_ID_RE);

export function parseModelId(
  value: string | null | undefined,
): string | undefined {
  if (value == null) {
    return undefined;
  }
  const parsed = modelIdSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

const PLAN_RANK: Record<MayaPlan, number> = {
  free: 0,
  plus: 1,
  pro: 2,
};

export function minPlanFor(
  planIds: readonly string[],
): MayaPlan | null {
  let best: MayaPlan | null = null;
  for (const id of planIds) {
    if (id !== "free" && id !== "plus" && id !== "pro") {
      continue;
    }
    if (best === null || PLAN_RANK[id] < PLAN_RANK[best]) {
      best = id;
    }
  }
  return best;
}

export function creditsFromUsd(
  costUsd: number,
  scale = CREDIT_SCALE_DEFAULT,
): number {
  if (!Number.isFinite(costUsd) || costUsd <= 0 || scale <= 0) {
    return 1;
  }
  const scaled = Math.round(costUsd * scale * 1e6) / 1e6;
  return Math.max(1, Math.ceil(scaled));
}

export function usdFromTokens(
  promptTokens: number,
  completionTokens: number,
  inputUsdPerMillion: number,
  outputUsdPerMillion: number,
): number {
  const prompt = Math.max(0, promptTokens);
  const completion = Math.max(0, completionTokens);
  return (
    (prompt * inputUsdPerMillion + completion * outputUsdPerMillion) /
    1_000_000
  );
}

export function creditsFromRates(input: {
  promptTokens: number;
  completionTokens: number;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  scale?: number;
  minTurnCredits?: number;
}): number {
  const usd = usdFromTokens(
    input.promptTokens,
    input.completionTokens,
    input.inputUsdPerMillion,
    input.outputUsdPerMillion,
  );
  const credits = creditsFromUsd(usd, input.scale ?? CREDIT_SCALE_DEFAULT);
  const floor = input.minTurnCredits ?? 1;
  return Math.max(floor, credits);
}

export function estimateReserveCredits(input: {
  estimatedPromptTokens: number;
  maxOutputTokens: number;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  minTurnCredits?: number;
  scale?: number;
}): number {
  return creditsFromRates({
    promptTokens: input.estimatedPromptTokens,
    completionTokens: input.maxOutputTokens,
    inputUsdPerMillion: input.inputUsdPerMillion,
    outputUsdPerMillion: input.outputUsdPerMillion,
    minTurnCredits: input.minTurnCredits,
    scale: input.scale,
  });
}

export function estimateCharsAsTokens(chars: number): number {
  if (!Number.isFinite(chars) || chars <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(chars / 4));
}

export function estimatedCreditsPerTurn(input: {
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  minTurnCredits?: number;
  scale?: number;
}): number {
  return creditsFromRates({
    promptTokens: TYPICAL_PROMPT_TOKENS,
    completionTokens: TYPICAL_COMPLETION_TOKENS,
    inputUsdPerMillion: input.inputUsdPerMillion,
    outputUsdPerMillion: input.outputUsdPerMillion,
    minTurnCredits: input.minTurnCredits,
    scale: input.scale,
  });
}

export type ResolveModelIdInput = {
  requested?: string;
  conversationModelId?: string | null;
  preferredModelId?: string | null;
  defaultModelId: string;
  allowed: ReadonlySet<string>;
};

export type ResolveModelIdResult =
  | { ok: true; modelId: string }
  | { ok: false; reason: "forbidden_model" };

export function resolveModelId(
  input: ResolveModelIdInput,
): ResolveModelIdResult {
  const allowed = input.allowed;
  if (input.requested) {
    if (allowed.has(input.requested)) {
      return { ok: true, modelId: input.requested };
    }
    return { ok: false, reason: "forbidden_model" };
  }

  const fallbacks = [
    input.conversationModelId,
    input.preferredModelId,
    input.defaultModelId,
  ];
  for (const candidate of fallbacks) {
    if (candidate && allowed.has(candidate)) {
      return { ok: true, modelId: candidate };
    }
  }

  const firstAllowed = [...allowed][0];
  if (firstAllowed) {
    return { ok: true, modelId: firstAllowed };
  }
  return { ok: false, reason: "forbidden_model" };
}

export const creditBalanceSchema = z.object({
  ok: z.literal(true),
  dailyLimit: z.number(),
  dailyUsed: z.number(),
  dailyRemaining: z.number(),
  monthlyLimit: z.number(),
  monthlyUsed: z.number(),
  monthlyRemaining: z.number(),
  resetsAt: z.string(),
  turnCount: z.number(),
  maxTurns: z.number(),
});

export type CreditBalance = z.infer<typeof creditBalanceSchema>;

export const reserveOkSchema = z.object({
  ok: z.literal(true),
  eventId: z.string(),
  reserved: z.number(),
  remaining: z.number(),
  dailyLimit: z.number(),
});

export const reserveFailSchema = z.object({
  ok: z.literal(false),
  reason: z.enum([
    "unauthorized",
    "invalid",
    "forbidden_model",
    "quota",
    "quota_month",
    "not_found",
  ]),
  remaining: z.number().optional(),
  resetsAt: z.string().optional(),
  allowed: z.array(z.string()).optional(),
});

export type ReserveChatTurnResult =
  | z.infer<typeof reserveOkSchema>
  | z.infer<typeof reserveFailSchema>;

export function parseCreditBalance(value: unknown): CreditBalance | null {
  const parsed = creditBalanceSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parseReserveChatTurn(
  value: unknown,
): ReserveChatTurnResult | null {
  const ok = reserveOkSchema.safeParse(value);
  if (ok.success) {
    return ok.data;
  }
  const fail = reserveFailSchema.safeParse(value);
  return fail.success ? fail.data : null;
}

export const settleOkSchema = z.object({
  ok: z.literal(true),
  settled: z.number(),
  idempotent: z.boolean().optional(),
});

export function parseSettleChatTurn(
  value: unknown,
): { ok: true; settled: number } | null {
  const parsed = settleOkSchema.safeParse(value);
  return parsed.success
    ? { ok: true, settled: parsed.data.settled }
    : null;
}

