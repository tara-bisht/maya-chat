import { describe, expect, it } from "vitest";
import { houseHref } from "./href";

describe("houseHref", () => {
  it("opens a new night when there is no thread", () => {
    expect(houseHref("agent-1")).toBe("/chat/agent-1");
    expect(houseHref("agent-1", null)).toBe("/chat/agent-1");
  });

  it("opens the latest thread when one exists", () => {
    expect(houseHref("agent-1", "conv-9")).toBe("/chat/agent-1/conv-9");
  });
});
