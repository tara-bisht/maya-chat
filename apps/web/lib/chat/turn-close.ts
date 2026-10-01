import type { HostTicket } from "@maya/shared";

export type TurnOutcome = "open" | "saved" | "unsaved" | "interrupted";

export type TurnClosePart =
  | { type: "error"; errorText: "unsaved" | "interrupted" }
  | { type: "data-ticket"; data: HostTicket };

/** What the chat stream writes after the model finishes. */
export function turnCloseParts(input: {
  outcome: TurnOutcome;
  ticket: HostTicket | null;
}): TurnClosePart[] {
  if (input.outcome === "unsaved" || input.outcome === "interrupted") {
    return [{ type: "error", errorText: input.outcome }];
  }
  if (input.outcome === "saved" && input.ticket) {
    return [{ type: "data-ticket", data: input.ticket }];
  }
  return [];
}
