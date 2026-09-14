import { describe, expect, it } from "vitest";
import { DEFAULT_NEXT, safeNextPath } from "./next";

describe("safeNextPath", () => {
  it("defaults missing or unsafe values to chat", () => {
    expect(DEFAULT_NEXT).toBe("/chat");
    expect(safeNextPath(null)).toBe("/chat");
    expect(safeNextPath(undefined)).toBe("/chat");
    expect(safeNextPath("")).toBe("/chat");
    expect(safeNextPath("gallery")).toBe("/chat");
    expect(safeNextPath("//evil.example")).toBe("/chat");
    expect(safeNextPath("https://evil.example")).toBe("/chat");
  });

  it("keeps same-origin absolute paths", () => {
    expect(safeNextPath("/gallery")).toBe("/gallery");
    expect(safeNextPath("/marketplace")).toBe("/marketplace");
    expect(safeNextPath("/login?next=/gallery")).toBe("/login?next=/gallery");
  });
});
