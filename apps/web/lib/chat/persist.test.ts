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

type MessageRow = Record<string, unknown> & { id: string };

function messageTable(rows: MessageRow[]) {
  return {
    from() {
      return {
        insert(row: Record<string, unknown>) {
          const write = () => {
            const duplicate =
              (typeof row.client_msg_id === "string" &&
                rows.some(
                  (item) =>
                    item.conversation_id === row.conversation_id &&
                    item.client_msg_id === row.client_msg_id,
                )) ||
              (typeof row.reply_to === "string" &&
                rows.some((item) => item.reply_to === row.reply_to));
            if (duplicate) {
              return {
                data: null,
                error: {
                  code: "23505",
                  message: "duplicate",
                  details: null,
                  hint: null,
                },
              };
            }
            const id = `id-${rows.length + 1}`;
            rows.push({ id, ...row });
            return { data: { id }, error: null };
          };
          const pending = write();
          return {
            select() {
              return { single: async () => pending };
            },
            then(
              resolve: (value: { error: unknown }) => void,
              reject: (reason: unknown) => void,
            ) {
              return Promise.resolve({ error: pending.error }).then(resolve, reject);
            },
          };
        },
        select() {
          const filters: Array<[string, unknown]> = [];
          const api = {
            eq(column: string, value: unknown) {
              filters.push([column, value]);
              return api;
            },
            maybeSingle: async () => {
              const found = rows.find((row) =>
                filters.every(([column, value]) => row[column] === value),
              );
              return { data: found ?? null, error: null };
            },
          };
          return api;
        },
        update(patch: Record<string, unknown>) {
          const filters: Array<[string, unknown]> = [];
          const api = {
            eq(column: string, value: unknown) {
              filters.push([column, value]);
              return api;
            },
            in(column: string, values: unknown[]) {
              filters.push([column, values]);
              return api;
            },
            then(
              resolve: (value: { error: null }) => void,
              reject: (reason: unknown) => void,
            ) {
              for (const row of rows) {
                const matches = filters.every(([column, value]) => {
                  const current = row[column];
                  return Array.isArray(value)
                    ? value.includes(current)
                    : current === value;
                });
                if (matches) {
                  Object.assign(row, patch);
                }
              }
              return Promise.resolve({ error: null }).then(resolve, reject);
            },
          };
          return api;
        },
      };
    },
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
    expect(result).toEqual({ ok: true, id: "msg-1", duplicate: false });
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

  it("insertUserMessage returns the existing row when the client id was already stored", async () => {
    const rows: MessageRow[] = [
      {
        id: "user-1",
        conversation_id: "c1",
        role: "user",
        client_msg_id: "client-1",
        content: "hello",
        turn_status: "unsaved",
      },
    ];
    const { insertUserMessage, acceptUserTurn, insertAssistantMessage } =
      await import("./persist");
    const client = messageTable(rows);

    const again = await insertUserMessage(client as never, {
      conversationId: "c1",
      content: "hello",
      clientMsgId: "client-1",
    });
    expect(again).toEqual({ ok: true, id: "user-1", duplicate: true });
    expect(rows.filter((row) => row.role === "user")).toHaveLength(1);

    const retry = await acceptUserTurn(client as never, {
      conversationId: "c1",
      content: "hello",
      clientMsgId: "client-1",
    });
    expect(retry).toEqual({
      ok: true,
      messageId: "user-1",
      duplicate: true,
      stored: null,
    });
    expect(rows[0]?.turn_status).toBe("pending");

    const saved = await insertAssistantMessage(client as never, {
      conversationId: "c1",
      content: "reply",
      tokensUsed: 3,
      replyTo: "user-1",
    });
    expect(saved).toEqual({ ok: true });
    expect(rows[0]?.turn_status).toBe("complete");

    const repeat = await acceptUserTurn(client as never, {
      conversationId: "c1",
      content: "hello",
      clientMsgId: "client-1",
    });
    expect(repeat).toEqual({
      ok: true,
      messageId: "user-1",
      duplicate: true,
      stored: { content: "reply", toolCalls: null },
    });
    expect(rows.filter((row) => row.role === "user")).toHaveLength(1);
    expect(rows.filter((row) => row.role === "assistant")).toHaveLength(1);
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
