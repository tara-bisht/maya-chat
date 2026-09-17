import { describe, expect, it } from "vitest";
import {
  EMBEDDING_DIM,
  MEMORY_CONTENT_MAX,
  parseMemorySaverInput,
  vectorLiteral,
} from "./memory";

describe("parseMemorySaverInput", () => {
  it("trims content", () => {
    expect(parseMemorySaverInput({ content: "  skipped legs  " })).toEqual({
      ok: true,
      content: "skipped legs",
    });
  });

  it("caps length at MEMORY_CONTENT_MAX", () => {
    const content = "x".repeat(MEMORY_CONTENT_MAX + 40);
    const parsed = parseMemorySaverInput({ content });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.content).toHaveLength(MEMORY_CONTENT_MAX);
    }
  });

  it("rejects empty or missing content", () => {
    expect(parseMemorySaverInput({ content: "   " }).ok).toBe(false);
    expect(parseMemorySaverInput({}).ok).toBe(false);
    expect(parseMemorySaverInput(null).ok).toBe(false);
  });
});

describe("vectorLiteral", () => {
  it("formats a 1024-d vector", () => {
    const values = Array.from({ length: EMBEDDING_DIM }, (_, i) =>
      i === 0 ? 0.5 : 0,
    );
    expect(vectorLiteral(values)?.startsWith("[0.5,0,")).toBe(true);
    expect(vectorLiteral(values)?.endsWith(",0]")).toBe(true);
  });

  it("rejects the wrong length or non-finite values", () => {
    expect(vectorLiteral([1, 2, 3])).toBeNull();
    const nan = Array.from({ length: EMBEDDING_DIM }, () => Number.NaN);
    expect(vectorLiteral(nan)).toBeNull();
  });
});
