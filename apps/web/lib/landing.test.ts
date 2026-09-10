import { describe, expect, it } from "vitest";
import {
  COMPANY_KICKER,
  FOOTER,
  HERO,
  HERO_SCENES,
  HOUSE_STEPS,
  NOTES,
  SEATS,
  SEATS_KICKER,
  STUDIO,
} from "./landing";

describe("HERO", () => {
  it("names AI instead of a person", () => {
    expect(HERO.title).toMatch(/AI/i);
    expect(HERO.title).not.toMatch(/someone/i);
    expect(HERO.body).toMatch(/chatbot/i);
  });

  it("marks personality as the highlight word", () => {
    expect(HERO.titleMark).toBe("personality.");
    expect(HERO.title).toBe(`${HERO.titleLead}${HERO.titleMark}`);
  });

  it("sells writing a character, not a closed roster", () => {
    expect(HERO.body).not.toMatch(/eight/i);
    expect(HERO.body).toMatch(/write/i);
    expect(HERO.lineup).toMatch(/write yours/i);
  });
});

describe("lobby marketing copy", () => {
  it("does not count a fixed number of agents as the product", () => {
    const surfaces = [
      HERO.body,
      HERO.lineup,
      HERO.sticker,
      COMPANY_KICKER.body,
      STUDIO.body,
      SEATS_KICKER.body,
      FOOTER.tagline,
      ...HOUSE_STEPS.map((step) => step.body),
      ...SEATS.flatMap((seat) => seat.bullets),
      ...NOTES.map((note) => `${note.q} ${note.a}`),
    ].join(" ");
    expect(surfaces).not.toMatch(/eight/i);
    expect(COMPANY_KICKER.title).toMatch(/start/i);
    expect(STUDIO.title).toMatch(/personality/i);
    expect(NOTES[0]?.q).toMatch(/own agent/i);
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
