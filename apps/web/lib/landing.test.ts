import { describe, expect, it } from "vitest";
import {
  COMPANY_KICKER,
  FOOTER,
  HERO,
  HERO_SCENES,
  HOUSE_OPEN,
  HOUSE_STEPS,
  NIGHTS,
  NOTES,
  SEATS,
  SEATS_KICKER,
  STUDIO,
  USUAL,
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
  });
});

describe("lobby marketing copy", () => {
  it("does not count a fixed number of agents as the product", () => {
    const surfaces = [
      HERO.body,
      COMPANY_KICKER.body,
      STUDIO.body,
      SEATS_KICKER.body,
      FOOTER.tagline,
      USUAL.title,
      USUAL.body,
      ...USUAL.prompts.flatMap((entry) => [
        entry.prompt,
        ...entry.leftover.lines,
        ...entry.nights.map((night) => night.quote),
      ]),
      HOUSE_OPEN.title,
      HOUSE_OPEN.body,
      ...HOUSE_STEPS.flatMap((step) => [step.body, ...step.pills]),
      ...NIGHTS.flatMap((scene) => [scene.body, scene.prompt, scene.quote]),
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
  it("opens on Marcus and covers the live company", () => {
    expect(HERO_SCENES.map((scene) => scene.id)).toEqual([
      "marcus",
      "priya",
      "alex",
      "nonna",
      "viktor",
      "valerian",
      "barnaby",
      "ren",
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
      expect(scene.sticker.length).toBeGreaterThan(0);
    }
  });
});

describe("USUAL", () => {
  it("contrasts a generic chatbot with three named voices", () => {
    expect(USUAL.title).toMatch(/same question/i);
    expect(USUAL.leftoverName).toMatch(/assistant/i);
    expect(USUAL.prompts.length).toBeGreaterThan(1);
    for (const entry of USUAL.prompts) {
      expect(entry.leftover.stamp).toMatch(/usual/i);
      expect(entry.leftover.lines.length).toBeGreaterThan(2);
      expect(entry.nights.map((night) => night.player)).toEqual([
        "Marcus",
        "Nonna Maria",
        "Barnaby",
      ]);
    }
  });
});

describe("NIGHTS", () => {
  it("puts a House scrap on each scene", () => {
    expect(NIGHTS.map((scene) => scene.id)).toEqual([
      "maths",
      "advice",
      "code",
    ]);
    for (const scene of NIGHTS) {
      expect(scene.prompt.length).toBeGreaterThan(0);
      expect(scene.quote.length).toBeGreaterThan(0);
    }
  });
});
