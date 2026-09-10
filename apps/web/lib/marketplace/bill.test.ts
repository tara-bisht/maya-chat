import { describe, expect, it } from "vitest";
import { COMPANY } from "@/lib/company";
import {
  COMING_SOON,
  MARKETPLACE_CATEGORIES,
  buildMarketplaceBill,
  talkHref,
} from "./bill";

describe("buildMarketplaceBill", () => {
  const sections = buildMarketplaceBill();

  it("keeps category order and omits custom", () => {
    expect(sections.map((section) => section.id)).toEqual([
      "learning",
      "philosophy",
      "productivity",
      "wellbeing",
      "lifestyle",
    ]);
    const categoryIds: string[] = MARKETPLACE_CATEGORIES.map(
      (category) => category.id,
    );
    const sectionIds: string[] = sections.map((section) => section.id);
    expect(categoryIds).not.toContain("custom");
    expect(sectionIds).not.toContain("custom");
  });

  it("lists eight on tonight and four on the next bill", () => {
    const players = sections.flatMap((section) => section.players);
    expect(players.filter((player) => player.status === "on_tonight")).toHaveLength(
      8,
    );
    expect(players.filter((player) => player.status === "coming_soon")).toHaveLength(
      4,
    );
    expect(players).toHaveLength(12);
  });

  it("keeps live players on COMPANY ids and coming-soon on next- slugs", () => {
    const live = sections
      .flatMap((section) => section.players)
      .filter((player) => player.status === "on_tonight");
    expect(live.map((player) => player.id).sort()).toEqual(
      COMPANY.map((player) => player.id).sort(),
    );
    expect(COMING_SOON.every((player) => player.id.startsWith("next-"))).toBe(
      true,
    );
  });

  it("groups players with live company order before coming soon", () => {
    const byId = Object.fromEntries(
      sections.map((section) => [
        section.id,
        section.players.map((player) => player.shortName),
      ]),
    );
    expect(byId.learning).toEqual(["Dr. Priya", "Valerian", "Meera", "Sofia"]);
    expect(byId.philosophy).toEqual(["Marcus", "Ren"]);
    expect(byId.productivity).toEqual(["Alex", "Viktor", "Kenji"]);
    expect(byId.wellbeing).toEqual(["Nonna Maria"]);
    expect(byId.lifestyle).toEqual(["Barnaby", "Jules"]);
  });
});

describe("talkHref", () => {
  const marcus = buildMarketplaceBill()
    .flatMap((section) => section.players)
    .find((player) => player.shortName === "Marcus");
  const jules = COMING_SOON.find((player) => player.shortName === "Jules");

  it("sends signed-out Talk to login, signed-in Talk to gallery", () => {
    expect(marcus).toBeDefined();
    expect(talkHref(marcus!, false)).toBe("/login?next=/gallery");
    expect(talkHref(marcus!, true)).toBe("/gallery");
  });

  it("never gives coming-soon players a Talk href", () => {
    expect(jules).toBeDefined();
    expect(talkHref(jules!, false)).toBeNull();
    expect(talkHref(jules!, true)).toBeNull();
  });
});
