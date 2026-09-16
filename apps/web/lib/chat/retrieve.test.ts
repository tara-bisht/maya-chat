import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const embedText = vi.fn();
vi.mock("@/lib/openrouter/embed", () => ({
  embedText: (...args: unknown[]) => embedText(...args),
}));

vi.mock("@/lib/supabase/dropped", () => ({
  logDropped: vi.fn(),
}));

import { retrieveMemories } from "./retrieve";

function supabaseRpc(result: { data?: unknown; error?: { message: string } | null }) {
  return {
    rpc: vi.fn().mockResolvedValue({
      data: result.data ?? null,
      error: result.error ?? null,
    }),
  };
}

describe("retrieveMemories", () => {
  beforeEach(() => {
    embedText.mockReset();
  });

  it("skips embeddings when vector memory is off", async () => {
    const client = supabaseRpc({});
    const memories = await retrieveMemories(client as never, {
      agentId: "agent-1",
      text: "I skipped legs",
      vectorMemory: false,
    });
    expect(memories).toEqual([]);
    expect(embedText).not.toHaveBeenCalled();
    expect(client.rpc).not.toHaveBeenCalled();
  });

  it("returns neighbors from the RPC", async () => {
    embedText.mockResolvedValue({ ok: true, vector: "[0.1,0.2]" });
    const client = supabaseRpc({
      data: [
        { id: "m1", content: "Skipped legs.", metadata: {}, similarity: 0.9 },
        { id: "m2", content: "  ", metadata: {}, similarity: 0.2 },
      ],
    });
    const memories = await retrieveMemories(client as never, {
      agentId: "agent-1",
      text: "legs",
      vectorMemory: true,
    });
    expect(memories).toEqual([{ content: "Skipped legs." }]);
    expect(client.rpc).toHaveBeenCalledWith("match_agent_memories", {
      p_agent_id: "agent-1",
      p_query: "[0.1,0.2]",
      p_match_count: 8,
    });
  });

  it("fails open when embed or RPC drops", async () => {
    embedText.mockResolvedValue({ ok: false });
    const idle = supabaseRpc({});
    expect(
      await retrieveMemories(idle as never, {
        agentId: "agent-1",
        text: "legs",
        vectorMemory: true,
      }),
    ).toEqual([]);
    expect(idle.rpc).not.toHaveBeenCalled();

    embedText.mockResolvedValue({ ok: true, vector: "[0.1]" });
    const failed = supabaseRpc({ error: { message: "boom" } });
    expect(
      await retrieveMemories(failed as never, {
        agentId: "agent-1",
        text: "legs",
        vectorMemory: true,
      }),
    ).toEqual([]);
  });
});
