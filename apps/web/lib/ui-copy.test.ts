import { describe, expect, it } from "vitest";
import {
  APP_NAV,
  MOBILE_NAV,
  navIsActive,
  planHref,
  planLabel,
  profileInitial,
} from "./ui-copy";

describe("APP_NAV", () => {
  it("sends Explore to the signed-in catalog", () => {
    expect(APP_NAV.map((item) => item.href)).toEqual([
      "/gallery",
      "/explore",
      "/studio/new",
      "/settings",
    ]);
  });
});

describe("MOBILE_NAV", () => {
  it("includes Explore beside Home, Create, and Profile", () => {
    expect(MOBILE_NAV.map((item) => item.href)).toEqual([
      "/gallery",
      "/explore",
      "/studio/new",
      "/settings",
    ]);
  });
});

describe("navIsActive", () => {
  it("marks Explore on /explore, not the public marketplace", () => {
    expect(navIsActive("/explore", "/explore")).toBe(true);
    expect(navIsActive("/explore", "/explore/more")).toBe(true);
    expect(navIsActive("/explore", "/marketplace")).toBe(false);
    expect(navIsActive("/gallery", "/gallery")).toBe(true);
  });
});

describe("plan chrome", () => {
  it("sends every plan to the in-app paywall", () => {
    expect(planLabel("free")).toBe("Free");
    expect(planLabel("plus")).toBe("Plus");
    expect(planLabel("pro")).toBe("Pro");
    expect(planHref()).toBe("/plan");
  });

  it("uses the first letter, or Y when the name is empty", () => {
    expect(profileInitial("Kamal Bisht")).toBe("K");
    expect(profileInitial("  maya")).toBe("M");
    expect(profileInitial("")).toBe("Y");
  });
});
