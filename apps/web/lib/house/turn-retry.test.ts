import { describe, expect, it } from "vitest";
import { retryPlan, showTurnRetry } from "./turn-retry";

describe("showTurnRetry", () => {
  it("hides while a turn is in flight", () => {
    expect(
      showTurnRetry({
        busy: true,
        pendingAutoReplay: false,
        lastRole: "user",
        errorMessage: "unsaved",
        finishKind: null,
      }),
    ).toBe(false);
  });

  it("shows when the thread ends on a user line", () => {
    expect(
      showTurnRetry({
        busy: false,
        pendingAutoReplay: false,
        lastRole: "user",
        errorMessage: undefined,
        finishKind: null,
      }),
    ).toBe(true);
  });

  it("stays quiet for a handoff that is about to replay", () => {
    expect(
      showTurnRetry({
        busy: false,
        pendingAutoReplay: true,
        lastRole: "user",
        errorMessage: undefined,
        finishKind: null,
      }),
    ).toBe(false);
  });

  it("shows after an abort even when a partial reply is on screen", () => {
    expect(
      showTurnRetry({
        busy: false,
        pendingAutoReplay: false,
        lastRole: "assistant",
        errorMessage: undefined,
        finishKind: "interrupted",
      }),
    ).toBe(true);
  });

  it("hides when the last line is a saved reply", () => {
    expect(
      showTurnRetry({
        busy: false,
        pendingAutoReplay: false,
        lastRole: "assistant",
        errorMessage: undefined,
        finishKind: null,
      }),
    ).toBe(false);
  });
});

describe("retryPlan", () => {
  it("resends the live client id", () => {
    expect(retryPlan({ id: "client-1" })).toEqual({
      kind: "resend",
      id: "client-1",
    });
  });

  it("resends the stored client id after refresh", () => {
    expect(
      retryPlan({ id: "db-uuid", metadata: { clientMsgId: "client-1" } }),
    ).toEqual({ kind: "resend", id: "client-1" });
  });

  it("replays a stored line that has no client id", () => {
    expect(retryPlan({ id: "db-uuid", metadata: { clientMsgId: null } })).toEqual({
      kind: "replay",
    });
  });
});
