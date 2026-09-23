import { describe, expect, it } from "vitest";
import { MAYA_HOME_HREF } from "@maya/shared";
import { DEFAULT_NEXT, safeHostFromUrl, safeNextPath, safeRedirectHost } from "./next";

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

  it("keeps same-origin absolute paths", () => {
    expect(safeNextPath("/gallery")).toBe("/gallery");
    expect(safeNextPath("/marketplace")).toBe("/marketplace");
    expect(safeNextPath(`/login?next=${MAYA_HOME_HREF}`)).toBe(
      `/login?next=${MAYA_HOME_HREF}`,
    );
  });
});

describe("safeHostFromUrl", () => {
  it("extracts host correctly", () => {
    expect(safeHostFromUrl("https://maya.app/dashboard")).toBe("maya.app");
    expect(safeHostFromUrl("http://localhost:3000")).toBe("localhost:3000");
    expect(safeHostFromUrl(null)).toBeNull();
    expect(safeHostFromUrl("invalid-url")).toBeNull();
  });
});

describe("safeRedirectHost", () => {
  it("returns null when forwardedHost is empty", () => {
    expect(safeRedirectHost(null, ["app.example.com"])).toBeNull();
    expect(safeRedirectHost(undefined, ["app.example.com"])).toBeNull();
  });

  it("returns clean forwarded host when matching any trusted host", () => {
    expect(
      safeRedirectHost("app.example.com", ["app.example.com", "maya.app"]),
    ).toBe("app.example.com");
    expect(
      safeRedirectHost(" MAYA.APP ", ["app.example.com", "maya.app"]),
    ).toBe("maya.app");
  });

  it("rejects untrusted forwarded host in production", () => {
    expect(
      safeRedirectHost("attacker.com", ["app.example.com", "maya.app"]),
    ).toBeNull();
    expect(
      safeRedirectHost("evil.example.org", ["app.example.com"]),
    ).toBeNull();
  });
});
