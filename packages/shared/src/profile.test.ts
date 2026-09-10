import { describe, expect, it } from "vitest";
import {
  LANGUAGE_PRESET_IDS,
  LANGUAGE_PRESETS,
  parseProfileUpdate,
  toSettingsView,
  type SettingsViewInput,
} from "./profile";

const valid = {
  displayName: "Kamal",
  preferredLanguage: "en",
  globalBio: "Learns maths at night.",
};

function viewInput(
  overrides: Partial<{
    email: SettingsViewInput["email"];
    profile: Partial<SettingsViewInput["profile"]>;
    entitlement: SettingsViewInput["entitlement"];
    plan: SettingsViewInput["plan"];
  }> = {},
): SettingsViewInput {
  return {
    email: overrides.email === undefined ? "kamal@example.com" : overrides.email,
    profile: {
      display_name: "Kamal",
      preferred_language: "en",
      global_bio: "Learns maths at night.",
      ...overrides.profile,
    },
    entitlement:
      overrides.entitlement === undefined
        ? { plan: "free", status: "active" }
        : overrides.entitlement,
    plan:
      overrides.plan === undefined
        ? { id: "free", display_name: "Free" }
        : overrides.plan,
  };
}

describe("LANGUAGE_PRESETS", () => {
  it("locks the four dialect ids the check constraint will allow", () => {
    expect(LANGUAGE_PRESET_IDS).toEqual(["en", "hinglish", "hi", "slang"]);
    expect(LANGUAGE_PRESETS.map((preset) => preset.id)).toEqual([
      ...LANGUAGE_PRESET_IDS,
    ]);
  });
});

describe("parseProfileUpdate", () => {
  it("accepts a valid payload and strips a sneaked plan", () => {
    const result = parseProfileUpdate({ ...valid, plan: "pro" });
    expect(result).toEqual({ ok: true, data: valid });
    if (result.ok) {
      expect(result.data).not.toHaveProperty("plan");
    }
  });

  it("trims name and bio", () => {
    const result = parseProfileUpdate({
      displayName: "  Kamal  ",
      preferredLanguage: "hi",
      globalBio: "  नमस्ते  ",
    });
    expect(result).toEqual({
      ok: true,
      data: {
        displayName: "Kamal",
        preferredLanguage: "hi",
        globalBio: "नमस्ते",
      },
    });
  });

  it("rejects an empty name", () => {
    const result = parseProfileUpdate({ ...valid, displayName: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.displayName).toBe("Give a name.");
    }
  });

  it("rejects a name over 80 characters", () => {
    const result = parseProfileUpdate({
      ...valid,
      displayName: "K".repeat(81),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.displayName).toBe("Keep it under 80 characters.");
    }
  });

  it("rejects a bio over 500 characters", () => {
    const result = parseProfileUpdate({
      ...valid,
      globalBio: "x".repeat(501),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.globalBio).toBe("Keep it under 500 characters.");
    }
  });

  it("rejects an unknown language", () => {
    const result = parseProfileUpdate({ ...valid, preferredLanguage: "fr" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.preferredLanguage).toBe("Pick a language.");
    }
  });

  it("allows an empty bio", () => {
    const result = parseProfileUpdate({ ...valid, globalBio: "   " });
    expect(result).toEqual({
      ok: true,
      data: { ...valid, globalBio: "" },
    });
  });
});

describe("toSettingsView", () => {
  it("maps seat from entitlement, never from a profile plan cache", () => {
    const view = toSettingsView(
      viewInput({
        entitlement: { plan: "plus", status: "active" },
        plan: { id: "plus", display_name: "Plus" },
      }),
    );
    expect(view.seat).toEqual({
      planId: "plus",
      displayName: "Plus",
      status: "active",
    });
    expect(view.bill).toEqual({ kind: "portal-disabled" });
  });

  it("falls back a missing entitlement to Free and the seats link", () => {
    const view = toSettingsView(viewInput({ entitlement: null, plan: null }));
    expect(view.seat.planId).toBe("free");
    expect(view.seat.displayName).toBe("Free");
    expect(view.bill).toEqual({ kind: "seats", href: "/#seats" });
  });

  it("clamps unknown language to en and empty bio to an empty string", () => {
    const view = toSettingsView(
      viewInput({
        profile: {
          display_name: null,
          preferred_language: "fr",
          global_bio: null,
        },
      }),
    );
    expect(view.displayName).toBe("");
    expect(view.preferredLanguage).toBe("en");
    expect(view.globalBio).toBe("");
  });

  it("uses the catalog display name only when the plan id matches", () => {
    const view = toSettingsView(
      viewInput({
        entitlement: { plan: "pro", status: "past_due" },
        plan: { id: "plus", display_name: "Plus" },
      }),
    );
    expect(view.seat).toEqual({
      planId: "pro",
      displayName: "Pro",
      status: "past_due",
    });
  });

  it("keeps a null email as null", () => {
    const view = toSettingsView(viewInput({ email: null }));
    expect(view.email).toBeNull();
  });
});
