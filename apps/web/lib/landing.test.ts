import { describe, expect, it } from "vitest";
import { HERO, HERO_SCENES } from "./landing";

describe("HERO", () => {
  it("names AI instead of a person", () => {
    expect(HERO.title).toMatch(/AI/i);
    expect(HERO.title).not.toMatch(/someone/i);
    expect(HERO.body).toMatch(/chatbot/i);
  });
});

describe("HERO_SCENES", () => {
  it("opens on Marcus and covers the three lobby voices", () => {
    expect(HERO_SCENES.map((scene) => scene.id)).toEqual([
      "marcus",
      "priya",
      "alex",
    ]);
    expect(HERO_SCENES[0]?.shortName).toBe("Marcus");
    expect(HERO_SCENES[0]?.freeTier).toBe(true);
    expect(HERO_SCENES[2]?.freeTier).toBe(false);
  });

  it("gives each scene a quote and the line that prompted it", () => {
    for (const scene of HERO_SCENES) {
      expect(scene.quote.length).toBeGreaterThan(0);
      expect(scene.prompt.length).toBeGreaterThan(0);
      expect(scene.kicker.length).toBeGreaterThan(0);
    }
  });
});
