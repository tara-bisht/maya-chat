import { describe, expect, it } from "vitest";
import { turnCloseParts } from "./turn-close";

const ticket = {
  type: "recommendAdd" as const,
  agentId: "00000000-0000-0000-0000-000000000002",
  name: "Priya",
  reason: "Priya does this all day.",
};

describe("turnCloseParts", () => {
  it("emits an error part when the reply did not save", () => {
    expect(turnCloseParts({ outcome: "unsaved", ticket })).toEqual([
      { type: "error", errorText: "unsaved" },
    ]);
  });

  it("emits an error part when the turn was interrupted", () => {
    expect(turnCloseParts({ outcome: "interrupted", ticket: null })).toEqual([
      { type: "error", errorText: "interrupted" },
    ]);
  });

  it("emits the ticket only after a saved reply", () => {
    expect(turnCloseParts({ outcome: "saved", ticket })).toEqual([
      { type: "data-ticket", data: ticket },
    ]);
    expect(turnCloseParts({ outcome: "open", ticket })).toEqual([]);
    expect(turnCloseParts({ outcome: "saved", ticket: null })).toEqual([]);
  });
});
