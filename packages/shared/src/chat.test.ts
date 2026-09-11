import { describe, expect, it } from "vitest";
import {
  OPEN_NIGHT_TITLE,
  chronologicalWindow,
  isDefaultConversationTitle,
  isUuid,
  parseChatRequest,
  parseConversationCreate,
  systemPromptWithLanguage,
  titleFromFirstMessage,
} from "./chat";

const AGENT_ID = "00000000-0000-0000-0000-000000000001";
const CONVERSATION_ID = "11111111-1111-4111-8111-111111111111";

describe("isUuid", () => {
  it("accepts v4-shaped ids and rejects junk", () => {
    expect(isUuid(AGENT_ID)).toBe(true);
    expect(isUuid("not-a-uuid")).toBe(false);
    expect(isUuid("x-ai/grok-4.20")).toBe(false);
  });
});

describe("parseConversationCreate", () => {
  it("reads agentId", () => {
    expect(parseConversationCreate({ agentId: AGENT_ID })).toEqual({
      ok: true,
      agentId: AGENT_ID,
    });
  });

  it("rejects a gateway string", () => {
    expect(parseConversationCreate({ agentId: "x-ai/grok-4.20" })).toEqual({
      ok: false,
    });
  });
});

describe("parseChatRequest", () => {
  it("extracts user text and ids", () => {
    const parsed = parseChatRequest({
      conversationId: CONVERSATION_ID,
      agentId: AGENT_ID,
      message: {
        id: "msg-1",
        role: "user",
        parts: [{ type: "text", text: "  Roast me.  " }],
      },
    });
    expect(parsed).toEqual({
      ok: true,
      text: "Roast me.",
      data: expect.objectContaining({
        conversationId: CONVERSATION_ID,
        agentId: AGENT_ID,
      }),
    });
    if (parsed.ok) {
      expect(parsed.data.modelId).toBeUndefined();
    }
  });

  it("accepts a catalog model alias and drops gateway slugs", () => {
    const parsed = parseChatRequest({
      conversationId: CONVERSATION_ID,
      agentId: AGENT_ID,
      modelId: "grok-fast",
      message: {
        id: "msg-1",
        role: "user",
        parts: [{ type: "text", text: "Hi" }],
      },
    });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.modelId).toBe("grok-fast");
    }
    expect(
      parseChatRequest({
        conversationId: CONVERSATION_ID,
        agentId: AGENT_ID,
        modelId: "openai/gpt-5.4",
        message: {
          id: "msg-1",
          role: "user",
          parts: [{ type: "text", text: "Hi" }],
        },
      }).ok,
    ).toBe(false);
  });

  it("rejects missing ids and empty text", () => {
    expect(
      parseChatRequest({
        agentId: AGENT_ID,
        message: { id: "m", role: "user", parts: [{ type: "text", text: "Hi" }] },
      }),
    ).toEqual({ ok: false });
    expect(
      parseChatRequest({
        conversationId: CONVERSATION_ID,
        agentId: AGENT_ID,
        message: {
          id: "m",
          role: "user",
          parts: [{ type: "text", text: "   " }],
        },
      }),
    ).toEqual({ ok: false });
  });
});

describe("titleFromFirstMessage", () => {
  it("uses the first line, collapsed", () => {
    expect(titleFromFirstMessage("  My boss\nignored me.  ")).toBe(
      "My boss ignored me.",
    );
  });

  it("truncates on a word boundary", () => {
    const long =
      "Your feelings are valid but your excuses are pathetic and we should talk";
    const title = titleFromFirstMessage(long);
    expect(title.length).toBeLessThanOrEqual(48);
    expect(title.endsWith(" ")).toBe(false);
    expect(title).not.toBe("New Chat");
  });

  it("falls back to the default thread title", () => {
    expect(titleFromFirstMessage("   ")).toBe(OPEN_NIGHT_TITLE);
    expect(titleFromFirstMessage("")).toBe("New chat");
  });
});

describe("chronologicalWindow", () => {
  it("reverses a newest-first window into chronological order", () => {
    const newestFirst = Array.from({ length: 30 }, (_, index) => 30 - index);
    const window = newestFirst.slice(0, 20);
    expect(window[0]).toBe(30);
    expect(chronologicalWindow(window)).toEqual(
      Array.from({ length: 20 }, (_, index) => 11 + index),
    );
  });
});

describe("isDefaultConversationTitle", () => {
  it("treats empty and New chat placeholders as untitled", () => {
    expect(isDefaultConversationTitle("")).toBe(true);
    expect(isDefaultConversationTitle("   ")).toBe(true);
    expect(isDefaultConversationTitle("New chat")).toBe(true);
    expect(isDefaultConversationTitle("New Chat")).toBe(true);
    expect(isDefaultConversationTitle("NEW CHAT")).toBe(true);
    expect(isDefaultConversationTitle("Physics Homework")).toBe(false);
  });
});

describe("systemPromptWithLanguage", () => {
  it("leaves English alone and appends other presets", () => {
    expect(systemPromptWithLanguage("You are Marcus.", "en")).toBe(
      "You are Marcus.",
    );
    expect(systemPromptWithLanguage("You are Nonna.", "hi")).toContain(
      "Warm Hindi",
    );
  });
});
