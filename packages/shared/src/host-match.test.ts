import { describe, expect, it } from "vitest";
import {
  isCreateIntent,
  isMetaTurn,
  matchCatalog,
  matchRoster,
} from "./host-match";

const PRIYA = {
  id: "00000000-0000-0000-0000-000000000002",
  name: "Dr. Priya",
  tagline: "Now let's integrate this function.",
  category: "learning",
  freeTier: true,
};

const ALEX = {
  id: "00000000-0000-0000-0000-000000000003",
  name: "Alex",
  tagline: "Let's fix this before prod dies.",
  category: "productivity",
  freeTier: false,
};

describe("isMetaTurn", () => {
  it("treats greetings and plan questions as meta", () => {
    expect(isMetaTurn("hi")).toBe(true);
    expect(isMetaTurn("Hey!")).toBe(true);
    expect(isMetaTurn("what's my plan")).toBe(true);
    expect(isMetaTurn("What can you do?")).toBe(true);
    expect(isMetaTurn("explain this integral")).toBe(false);
  });
});

describe("isCreateIntent", () => {
  it("catches make-me-an-agent jobs", () => {
    expect(isCreateIntent("I want to create an agent.")).toBe(true);
    expect(
      isCreateIntent("make me a sarcastic Hinglish lifting coach"),
    ).toBe(true);
    expect(isCreateIntent("explain this integral")).toBe(false);
  });
});

describe("matchRoster", () => {
  it("picks Priya for a proof and misses on hi", () => {
    expect(matchRoster("prove this integral", [PRIYA])?.id).toBe(PRIYA.id);
    expect(matchRoster("hi", [PRIYA])).toBeNull();
  });

  it("does not pause on create-intent", () => {
    expect(
      matchRoster("make me a sarcastic Hinglish lifting coach", [PRIYA]),
    ).toBeNull();
  });
});

describe("matchCatalog", () => {
  it("prefers a free specialist when scores are close", () => {
    const hit = matchCatalog("explain this integral", [PRIYA, ALEX], {
      preferFree: true,
    });
    expect(hit?.id).toBe(PRIYA.id);
  });

  it("picks Alex for a python dump when Priya is already on the roster", () => {
    const hit = matchCatalog("dump a Python fix for this bug", [ALEX], {
      preferFree: false,
    });
    expect(hit?.id).toBe(ALEX.id);
  });

  it("excludes nobody when the text is chitchat", () => {
    expect(matchCatalog("thanks", [PRIYA, ALEX])).toBeNull();
  });
});
