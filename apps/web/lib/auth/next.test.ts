import { describe, expect, it } from "vitest";
import { DEFAULT_NEXT, safeNextPath } from "./next";

describe("safeNextPath", () => {
  it("defaults missing or unsafe values to gallery", () => {
    expect(DEFAULT_NEXT).toBe("/gallery");
    expect(safeNextPath(null)).toBe("/gallery");
    expect(safeNextPath(undefined)).toBe("/gallery");
    expect(safeNextPath("")).toBe("/gallery");
    expect(safeNextPath("gallery")).toBe("/gallery");
    expect(safeNextPath("//evil.example")).toBe("/gallery");
    expect(safeNextPath("https://evil.example")).toBe("/gallery");
  });

  it("keeps same-origin absolute paths", () => {
    expect(safeNextPath("/gallery")).toBe("/gallery");
    expect(safeNextPath("/marketplace")).toBe("/marketplace");
    expect(safeNextPath("/login?next=/gallery")).toBe("/login?next=/gallery");
  });
});
