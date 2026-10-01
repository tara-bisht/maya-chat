export type TurnFinishKind = "unsaved" | "interrupted";

export function isTurnError(message: string | undefined): message is TurnFinishKind {
  return message === "unsaved" || message === "interrupted";
}

export function showTurnRetry(input: {
  busy: boolean;
  pendingAutoReplay: boolean;
  lastRole: string | null;
  errorMessage: string | undefined;
  finishKind: TurnFinishKind | null;
}): boolean {
  if (input.busy) {
    return false;
  }
  if (input.finishKind || isTurnError(input.errorMessage)) {
    return true;
  }
  if (input.pendingAutoReplay) {
    return false;
  }
  return input.lastRole === "user";
}

export function retryPlan(message: {
  id: string;
  metadata?: unknown;
}): { kind: "resend"; id: string } | { kind: "replay" } {
  const metadata = message.metadata;
  if (metadata && typeof metadata === "object" && "clientMsgId" in metadata) {
    const clientMsgId = (metadata as { clientMsgId?: unknown }).clientMsgId;
    if (typeof clientMsgId === "string" && clientMsgId.length > 0) {
      return { kind: "resend", id: clientMsgId };
    }
    return { kind: "replay" };
  }
  return { kind: "resend", id: message.id };
}
