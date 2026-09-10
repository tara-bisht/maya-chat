import { describe, expect, it } from "vitest";
import { COMPANY } from "@/lib/company";
import {
  GALLERY_AGENT_COLUMNS,
  PLAYBILL_STAMP_LABEL,
  playbillFromAgent,
  type GalleryAgentRow,
} from "./playbill";

const MARCUS = COMPANY[0];

function row(overrides: Partial<GalleryAgentRow> = {}): GalleryAgentRow {
  return {
    id: MARCUS.id,
    user_id: null,
    name: MARCUS.name,
    tagline: MARCUS.tagline,
    avatar_url: MARCUS.avatar,
    category: MARCUS.category,
    costume_id: "marcus",
    is_curated: true,
    is_public: true,
    free_tier: true,
    archived_at: null,
    created_at: "2026-09-10T00:00:00.000Z",
    ...overrides,
  };
}

describe("PLAYBILL_STAMP_LABEL", () => {
  it("uses plain product words for house and next-bill stamps", () => {
    expect(PLAYBILL_STAMP_LABEL.house).toBe("Public");
    expect(PLAYBILL_STAMP_LABEL.private).toBe("Private");
    expect(PLAYBILL_STAMP_LABEL["next-bill"]).toBe("Coming soon");
  });
});

describe("GALLERY_AGENT_COLUMNS", () => {
  it("does not select system_prompt, tone, or tools", () => {
    expect(GALLERY_AGENT_COLUMNS).not.toMatch(/system_prompt/);
    expect(GALLERY_AGENT_COLUMNS).not.toMatch(/tone_settings/);
    expect(GALLERY_AGENT_COLUMNS).not.toMatch(/tools_enabled/);
  });
});

describe("playbillFromAgent", () => {
  it("maps a curated Marcus row to costume, short name, and Free sticker", () => {
    const playbill = playbillFromAgent(row());
    expect(playbill).toEqual({
      id: MARCUS.id,
      shortName: "Marcus",
      tagline: MARCUS.tagline,
      category: "philosophy",
      costume: "marcus",
      avatar: MARCUS.avatar,
      freeTier: true,
      stamp: "free",
      href: null,
    });
    expect(playbill).not.toHaveProperty("system_prompt");
  });

  it("maps a custom row to its costume and a House stamp", () => {
    const playbill = playbillFromAgent(
      row({
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        user_id: "user-1",
        name: "Auntie Ji",
        tagline: "Eat first. Then we talk.",
        avatar_url: "/avatars/custom.jpg",
        category: "custom",
        costume_id: "nonna",
        is_curated: false,
        is_public: true,
        free_tier: false,
      }),
      "user-1",
    );
    expect(playbill.costume).toBe("nonna");
    expect(playbill.shortName).toBe("Auntie Ji");
    expect(playbill.stamp).toBe("house");
    expect(playbill.href).toBeNull();
  });

  it("stamps a private custom role and skips a Studio link for strangers", () => {
    const playbill = playbillFromAgent(
      row({
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        user_id: "user-1",
        name: "Night clerk",
        tagline: "The till is closed.",
        category: "custom",
        costume_id: "custom",
        is_curated: false,
        is_public: false,
        free_tier: false,
      }),
      "stranger",
    );
    expect(playbill.stamp).toBe("private");
    expect(playbill.href).toBeNull();
  });

  it("renders an unknown curated id instead of throwing", () => {
    const playbill = playbillFromAgent(
      row({
        id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
        name: "A new player",
        is_curated: true,
        costume_id: "unknown",
        avatar_url: null,
      }),
    );
    expect(playbill.shortName).toBe("A new player");
    expect(playbill.costume).toBe("custom");
    expect(playbill.avatar).toBe("");
  });
});
