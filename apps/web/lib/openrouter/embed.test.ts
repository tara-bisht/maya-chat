import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("./client", () => ({ getOpenRouter: vi.fn() }));

import { EMBEDDING_DIM } from "@maya/shared";
import { embeddingFromResponse } from "./embed";

describe("embeddingFromResponse", () => {
  it("accepts a 1024-d float vector", () => {
    const values = Array.from({ length: EMBEDDING_DIM }, () => 0.1);
    expect(
      embeddingFromResponse({
        data: [{ embedding: values, object: "embedding" }],
        model: "openai/text-embedding-3-small",
        object: "list",
      }),
    ).toEqual(values);
  });

  it("rejects the wrong shape", () => {
    expect(embeddingFromResponse(null)).toBeNull();
    expect(embeddingFromResponse({ data: [] })).toBeNull();
    expect(
      embeddingFromResponse({ data: [{ embedding: [1, 2, 3] }] }),
    ).toBeNull();
    expect(
      embeddingFromResponse({ data: [{ embedding: "base64" }] }),
    ).toBeNull();
  });
});
