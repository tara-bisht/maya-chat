import { z } from "zod";
import { COSTUME_IDS } from "./costumes";
import type { MayaPlan } from "./plans";
import { LANGUAGE_PRESET_IDS, type LanguagePresetId } from "./profile";

export type LanguagePreset = LanguagePresetId;

export const STUDIO_TOOLS = [
  "memory_saver",
  "math_solver",
  "web_search",
] as const;
export type StudioTool = (typeof STUDIO_TOOLS)[number];

export const toneSettingsSchema = z.object({
  warmth: z.number().min(0).max(1),
  directness: z.number().min(0).max(1),
  humor: z.number().min(0).max(1),
});

export type ToneSettings = z.infer<typeof toneSettingsSchema>;

export const DEFAULT_TONE: ToneSettings = {
  warmth: 0.8,
  directness: 0.5,
  humor: 0.5,
};

export const studioUpsertSchema = z.object({
  name: z.string().trim().min(1).max(40),
  tagline: z.string().trim().min(1).max(160),
  languagePreset: z.enum(LANGUAGE_PRESET_IDS),
  costumeId: z.enum(COSTUME_IDS),
  backstory: z.string().trim().min(1).max(8000),
  tone: toneSettingsSchema,
  toolsEnabled: z.array(z.enum(STUDIO_TOOLS)),
  isPublic: z.boolean(),
});

export type StudioUpsert = z.infer<typeof studioUpsertSchema>;

export type StudioWriteAction = "create" | "update" | "archive" | "restore";

export type StudioWriteInput = {
  action: StudioWriteAction;
  planId: MayaPlan;
  maxCustomAgents: number | null;
  liveCustomCount: number;
  desiredPublic: boolean;
  existing?: { isPublic: boolean; archived: boolean };
};

export type StudioWriteCode = "studio_cap" | "studio_private_forbidden";

export type StudioWriteFailure = {
  ok: false;
  code: StudioWriteCode;
  upgradePlan: "plus" | "pro";
};

export type StudioWriteResult = { ok: true } | StudioWriteFailure;

export function upgradePlanFor(planId: MayaPlan): "plus" | "pro" {
  return planId === "free" ? "plus" : "pro";
}

function atCap(maxCustomAgents: number | null, liveCustomCount: number): boolean {
  return maxCustomAgents !== null && liveCustomCount >= maxCustomAgents;
}

export function evaluateStudioWrite(input: StudioWriteInput): StudioWriteResult {
  const {
    action,
    planId,
    maxCustomAgents,
    liveCustomCount,
    desiredPublic,
    existing,
  } = input;

  if (action === "archive") {
    return { ok: true };
  }

  const becomingLive =
    action === "create" || (action === "restore" && existing?.archived === true);

  if (becomingLive && atCap(maxCustomAgents, liveCustomCount)) {
    return {
      ok: false,
      code: "studio_cap",
      upgradePlan: upgradePlanFor(planId),
    };
  }

  const flippingToPrivate =
    desiredPublic === false &&
    (action === "create" ||
      (action === "update" && existing?.isPublic === true) ||
      (action === "restore" && existing?.isPublic === true));

  if (planId === "free" && flippingToPrivate) {
    return {
      ok: false,
      code: "studio_private_forbidden",
      upgradePlan: "plus",
    };
  }

  return { ok: true };
}

export function canUseAgent(input: {
  planId: MayaPlan;
  agent: {
    isCurated: boolean;
    freeTier: boolean;
    isPublic: boolean;
    archivedAt: string | null;
    userId: string | null;
  };
  viewerId: string;
}): boolean {
  if (input.agent.archivedAt) {
    return false;
  }
  if (input.agent.isCurated) {
    return input.planId !== "free" || input.agent.freeTier;
  }
  if (input.agent.userId === input.viewerId) {
    return true;
  }
  return input.agent.isPublic;
}

export function canEditAgent(input: {
  agent: {
    isCurated: boolean;
    archivedAt: string | null;
    userId: string | null;
  };
  viewerId: string;
}): boolean {
  return (
    !input.agent.isCurated &&
    input.agent.userId === input.viewerId &&
    !input.agent.archivedAt
  );
}

export function parseStudioWriteError(
  message: string | null | undefined,
): StudioWriteCode | null {
  if (!message) {
    return null;
  }
  if (message.includes("studio_private_forbidden")) {
    return "studio_private_forbidden";
  }
  if (message.includes("studio_cap")) {
    return "studio_cap";
  }
  return null;
}

export function allowedStudioTools(
  toolsEnabled: readonly string[],
  toolsAllowed: readonly string[],
): StudioTool[] {
  const allowed = new Set(toolsAllowed);
  return toolsEnabled.filter(
    (tool): tool is StudioTool =>
      (STUDIO_TOOLS as readonly string[]).includes(tool) && allowed.has(tool),
  );
}
