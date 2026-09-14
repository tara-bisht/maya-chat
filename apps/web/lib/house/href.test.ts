import { describe, expect, it } from "vitest";
import { houseHref } from "./href";
import { MAYA_AGENT_ID } from "@/lib/maya/constants";

describe("houseHref", () => {
  it("opens a new night with a clean slug when there is no thread", () => {
    expect(houseHref(MAYA_AGENT_ID)).toBe("/chat/maya");
    expect(houseHref("00000000-0000-0000-0000-000000000001", null)).toBe(
      "/chat/marcus-01",
    );
    expect(houseHref("marcus-01")).toBe("/chat/marcus-01");
  });

  it("converts raw thread UUIDs to compact short IDs", () => {
    const threadUuid = "00000000-0000-0000-0000-000000000001";
    expect(houseHref("marcus-01", threadUuid)).toBe("/chat/marcus-01/t_1");
  });

  it("preserves non-UUID thread tokens", () => {
    expect(houseHref("agent-1", "conv-9")).toBe("/chat/agent-1/conv-9");
  });
});
