import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostgrestError } from "@supabase/supabase-js";

vi.mock("server-only", () => ({}));

const dropped = {
  code: "PGRST",
  message: "could not insert",
  details: null,
  hint: null,
} as unknown as PostgrestError;

function userInsertClient(result: {
  data: { id: string } | null;
  error: PostgrestError | null;
}) {
  return {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: async () => result,
        }),
      }),
    }),
  };
}

function assistantInsertClient(error: PostgrestError | null) {
  return {
    from: () => ({
      insert: async () => ({ error }),
    }),
  };
}

function retitleClient(error: PostgrestError | null) {
  return {
    from: () => ({
      update: () => ({
        eq: async () => ({ error }),
      }),
    }),
  };
}

describe("persist helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("insertUserMessage returns ok with id", async () => {
    const { insertUserMessage } = await import("./persist");
    const result = await insertUserMessage(
      userInsertClient({ data: { id: "msg-1" }, error: null }) as never,
      { conversationId: "c1", content: "hello" },
    );
    expect(result).toEqual({ ok: true, id: "msg-1" });
  });

  it("insertUserMessage returns ok:false instead of throwing", async () => {
    const { insertUserMessage } = await import("./persist");
    const result = await insertUserMessage(
      userInsertClient({ data: null, error: dropped }) as never,
      { conversationId: "c1", content: "hello" },
    );
    expect(result).toEqual({ ok: false, error: dropped });
  });

  it("insertAssistantMessage stores tool_calls on the assistant row", async () => {
    const insert = vi.fn(async (row: { tool_calls?: unknown }) => {
      expect(row.tool_calls).toEqual({
        tickets: [
          {
            type: "offerSwitch",
            agentId: "00000000-0000-0000-0000-000000000002",
            name: "Dr. Priya",
            reason: "Priya is on your agents — they're stronger on this.",
          },
        ],
      });
      return { error: null };
    });
    const { insertAssistantMessage } = await import("./persist");
    const result = await insertAssistantMessage(
      { from: () => ({ insert }) } as never,
      {
        conversationId: "c1",
        content: "Priya is on your agents — they're stronger on this.",
        tokensUsed: 0,
        toolCalls: {
          tickets: [
            {
              type: "offerSwitch",
              agentId: "00000000-0000-0000-0000-000000000002",
              name: "Dr. Priya",
              reason: "Priya is on your agents — they're stronger on this.",
            },
          ],
        },
      },
    );
    expect(result).toEqual({ ok: true });
    expect(insert).toHaveBeenCalled();
  });

  it("insertAssistantMessage returns ok:false instead of throwing", async () => {
    const { insertAssistantMessage } = await import("./persist");
    const result = await insertAssistantMessage(
      assistantInsertClient(dropped) as never,
      { conversationId: "c1", content: "reply", tokensUsed: 12 },
    );
    expect(result).toEqual({ ok: false, error: dropped });
  });

  it("retitleConversation logs and does not throw on update failure", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { retitleConversation } = await import("./persist");
    await expect(
      retitleConversation(retitleClient(dropped) as never, {
        conversationId: "c1",
        currentTitle: "",
        firstUserText: "How do I solve quadratic equations?",
      }),
    ).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
