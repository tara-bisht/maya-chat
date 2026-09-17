import { describe, expect, it } from "vitest";
import { MAYA_HOME_HREF } from "@maya/shared";
import {
  APP_NAV,
  COPY,
  creditsLeftLabel,
  creditsRailLabel,
  creditsResetLabel,
  lockedVoiceTitle,
  navIsActive,
  planHref,
  planLabel,
  profileInitial,
} from "./ui-copy";

describe("APP_NAV", () => {
  it("sends Explore to the signed-in catalog", () => {
    expect(APP_NAV.map((item) => item.href)).toEqual([
      MAYA_HOME_HREF,
      "/explore",
      `${MAYA_HOME_HREF}?intent=create`,
      "/settings",
    ]);
  });
});

describe("navIsActive", () => {
  it("marks Explore on /explore, not the public marketplace", () => {
    expect(navIsActive("/explore", "/explore")).toBe(true);
    expect(navIsActive("/explore", "/explore/more")).toBe(true);
    expect(navIsActive("/explore", "/marketplace")).toBe(false);
    expect(navIsActive(MAYA_HOME_HREF, MAYA_HOME_HREF)).toBe(true);
    expect(
      navIsActive(MAYA_HOME_HREF, `${MAYA_HOME_HREF}/thread-id`),
    ).toBe(true);
    expect(navIsActive(MAYA_HOME_HREF, "/chat/other")).toBe(false);
  });
});

describe("rail chrome", () => {
  it("names collapse and expand in plain chrome", () => {
    expect(COPY.collapseRail).toBe("Collapse");
    expect(COPY.expandRail).toBe("Expand");
    expect(COPY.olderChats).toBe("Older chats");
  });
});

describe("plan chrome", () => {
  it("sends every plan to the in-app paywall", () => {
    expect(planLabel("free")).toBe("Free");
    expect(planLabel("plus")).toBe("Plus");
    expect(planLabel("pro")).toBe("Pro");
    expect(planHref()).toBe("/plan");
    expect(COPY.checkoutSuccess).toContain("Stripe confirms");
    expect(COPY.checkoutCanceled).toBe("Checkout was canceled.");
  });

  it("uses the first letter, or Y when the name is empty", () => {
    expect(profileInitial("Kamal Bisht")).toBe("K");
    expect(profileInitial("  maya")).toBe("M");
    expect(profileInitial("")).toBe("Y");
  });

  it("stamps a locked voice with the plan that unlocks it", () => {
    expect(lockedVoiceTitle("Claude", "pro")).toBe("Claude is on Pro");
    expect(creditsLeftLabel(1484)).toBe("1,484 left");
    expect(creditsRailLabel(1484, 1500)).toBe("1,484 left of 1,500");
  });
});

describe("creditsResetLabel", () => {
  it("formats resetsAt in local time", () => {
    expect(
      creditsResetLabel("2026-09-12T00:00:00.000Z", {
        locale: "en-US",
        timeZone: "UTC",
      }),
    ).toBe("Resets 12:00 AM");
  });

  it("falls back to UTC copy when the stamp is missing", () => {
    expect(creditsResetLabel()).toBe("Resets 00:00 UTC");
    expect(creditsResetLabel("nope")).toBe("Resets 00:00 UTC");
  });
});
