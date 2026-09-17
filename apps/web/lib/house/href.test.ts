import { describe, expect, it } from "vitest";
import { MAYA_AGENT_ID, MAYA_HOME_HREF } from "@maya/shared";
import { houseHref, newChatHref, parseChatPath } from "./href";

describe("houseHref", () => {
  it("opens a new night when there is no thread", () => {
    expect(houseHref("agent-1")).toBe("/chat/agent-1");
    expect(houseHref("agent-1", null)).toBe("/chat/agent-1");
  });

  it("opens the latest thread when one exists", () => {
    expect(houseHref("agent-1", "conv-9")).toBe("/chat/agent-1/conv-9");
  });
});

describe("parseChatPath", () => {
  it("reads agent and thread ids from a chat URL", () => {
    expect(parseChatPath(MAYA_HOME_HREF)).toEqual({
      agentId: MAYA_AGENT_ID,
      conversationId: null,
    });
    expect(parseChatPath(`${MAYA_HOME_HREF}/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`)).toEqual({
      agentId: MAYA_AGENT_ID,
      conversationId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    });
    expect(parseChatPath("/explore")).toEqual({
      agentId: null,
      conversationId: null,
    });
  });
});

describe("newChatHref", () => {
  it("starts a new thread with the current agent, or Maya on lobby routes", () => {
    expect(newChatHref(`${MAYA_HOME_HREF}/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`)).toBe(
      MAYA_HOME_HREF,
    );
    expect(newChatHref("/explore")).toBe(MAYA_HOME_HREF);
  });
});
