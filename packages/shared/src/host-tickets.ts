import { z } from "zod";
import { isUuid } from "./chat";
import { COSTUME_IDS, STUDIO_COSTUME_IDS } from "./costumes";
import { LANGUAGE_PRESET_IDS } from "./profile";

const uuidSchema = z
  .string()
  .trim()
  .refine(isUuid, { message: "Need a real id." });

export const offerSwitchSchema = z.object({
  type: z.literal("offerSwitch"),
  agentId: uuidSchema,
  name: z.string().trim().min(1).max(80),
  reason: z.string().trim().min(1).max(200),
});

export const recommendAddSchema = z.object({
  type: z.literal("recommendAdd"),
  agentId: uuidSchema,
  name: z.string().trim().min(1).max(80),
  reason: z.string().trim().min(1).max(200),
});

export const proposeCustomAgentSchema = z.object({
  type: z.literal("proposeCustomAgent"),
  name: z.string().trim().min(1).max(40),
  tagline: z.string().trim().min(1).max(160),
  backstory: z.string().trim().min(1).max(8000),
  languagePreset: z.enum(LANGUAGE_PRESET_IDS).default("en"),
  costumeId: z
    .enum(COSTUME_IDS)
    .default("custom")
    .refine((id) => (STUDIO_COSTUME_IDS as readonly string[]).includes(id)),
});

export const hostTicketSchema = z.discriminatedUnion("type", [
  offerSwitchSchema,
  recommendAddSchema,
  proposeCustomAgentSchema,
]);

export type OfferSwitchTicket = z.infer<typeof offerSwitchSchema>;
export type RecommendAddTicket = z.infer<typeof recommendAddSchema>;
export type ProposeCustomAgentTicket = z.infer<typeof proposeCustomAgentSchema>;
export type HostTicket = z.infer<typeof hostTicketSchema>;

export const hostToolCallsSchema = z.object({
  tickets: z.array(hostTicketSchema).max(2),
});

export type HostToolCalls = z.infer<typeof hostToolCallsSchema>;

export function parseHostToolCalls(input: unknown): HostToolCalls | null {
  const parsed = hostToolCallsSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

export function firstTicket(input: unknown): HostTicket | null {
  const parsed = parseHostToolCalls(input);
  return parsed?.tickets[0] ?? null;
}

export const rosterWriteSchema = z.object({
  agentId: uuidSchema,
  conversationId: uuidSchema.optional(),
});

export type RosterWrite = z.infer<typeof rosterWriteSchema>;

export function parseRosterWrite(
  input: unknown,
): { ok: true; data: RosterWrite } | { ok: false } {
  const parsed = rosterWriteSchema.safeParse(input);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false };
}

export const handoffRequestSchema = z.object({
  fromConversationId: uuidSchema,
  agentId: uuidSchema,
});

export type HandoffRequest = z.infer<typeof handoffRequestSchema>;

export function parseHandoffRequest(
  input: unknown,
): { ok: true; data: HandoffRequest } | { ok: false } {
  const parsed = handoffRequestSchema.safeParse(input);
  return parsed.success ? { ok: true, data: parsed.data } : { ok: false };
}

export const hostRouteWriteSchema = z.object({
  conversationId: uuidSchema,
  hostRoute: z.enum(["stay"]),
});

export function parseHostRouteWrite(
  input: unknown,
): { ok: true; conversationId: string } | { ok: false } {
  const parsed = hostRouteWriteSchema.safeParse(input);
  return parsed.success
    ? { ok: true, conversationId: parsed.data.conversationId }
    : { ok: false };
}
