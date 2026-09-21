import { describe, expect, it } from "vitest";
import { MAYA_HOME_HREF } from "@maya/shared";
import { DEFAULT_NEXT, safeNextPath } from "./next";

describe("safeNextPath", () => {
  it("defaults missing or unsafe values to Maya", () => {
    expect(DEFAULT_NEXT).toBe(MAYA_HOME_HREF);
    expect(safeNextPath(null)).toBe(MAYA_HOME_HREF);
    expect(safeNextPath(undefined)).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("")).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("gallery")).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("//evil.example")).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("https://evil.example")).toBe(MAYA_HOME_HREF);
  });

  it("rejects malicious open redirect vectors using backslashes, tabs, or whitespace", () => {
    expect(safeNextPath("/\\evil.com")).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("/\\/evil.com")).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("/\tevil.com")).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("/\nevil.com")).toBe(MAYA_HOME_HREF);
    expect(safeNextPath("/\revil.com")).toBe(MAYA_HOME_HREF);
  });

  it("keeps same-origin absolute paths", () => {
    expect(safeNextPath("/gallery")).toBe("/gallery");
    expect(safeNextPath("/marketplace")).toBe("/marketplace");
    expect(safeNextPath("/gallery?tab=all#top")).toBe("/gallery?tab=all#top");
    expect(safeNextPath(`/login?next=${MAYA_HOME_HREF}`)).toBe(
      `/login?next=${MAYA_HOME_HREF}`,
    );
  });
});
