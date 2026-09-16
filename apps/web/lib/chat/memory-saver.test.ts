import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const embedText = vi.fn();
vi.mock("@/lib/openrouter/embed", () => ({
  embedText: (...args: unknown[]) => embedText(...args),
}));

vi.mock("@/lib/supabase/dropped", () => ({
  logDropped: vi.fn(),
}));

import { saveAgentMemory } from "./memory-saver";

type InsertResult = {
  data: { id: string } | null;
  error: { message: string } | null;
};

function client(options: {
  insert?: InsertResult;
  updateError?: { message: string } | null;
}) {
  const update = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: options.updateError ?? null }),
    }),
  });
  const insert = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue(
        options.insert ?? { data: { id: "mem-1" }, error: null },
      ),
    }),
  });
  return {
    from: vi.fn().mockImplementation((table: string) => {
      if (table !== "agent_memories") {
        throw new Error(table);
      }
      return { insert, update };
    }),
    insert,
    update,
  };
}

describe("saveAgentMemory", () => {
  beforeEach(() => {
    embedText.mockReset();
  });

  it("inserts then embeds", async () => {
    embedText.mockResolvedValue({ ok: true, vector: "[0.1]" });
    const supabase = client({});
    await expect(
      saveAgentMemory(supabase as never, {
        userId: "user-1",
        agentId: "agent-1",
        raw: { content: "Skipped legs." },
      }),
    ).resolves.toEqual({ ok: true });
    expect(supabase.insert).toHaveBeenCalled();
    expect(embedText).toHaveBeenCalledWith("Skipped legs.");
    expect(supabase.update).toHaveBeenCalledWith({ embedding: "[0.1]" });
  });

  it("does not throw when embed fails after insert", async () => {
    embedText.mockResolvedValue({ ok: false });
    const supabase = client({});
    await expect(
      saveAgentMemory(supabase as never, {
        userId: "user-1",
        agentId: "agent-1",
        raw: { content: "Skipped legs." },
      }),
    ).resolves.toEqual({
      ok: false,
      error: "Saved without a vector. Try again later.",
    });
    expect(supabase.update).not.toHaveBeenCalled();
  });

  it("rejects empty content without inserting", async () => {
    const supabase = client({});
    await expect(
      saveAgentMemory(supabase as never, {
        userId: "user-1",
        agentId: "agent-1",
        raw: { content: "  " },
      }),
    ).resolves.toEqual({
      ok: false,
      error: "Need a short fact to remember.",
    });
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
