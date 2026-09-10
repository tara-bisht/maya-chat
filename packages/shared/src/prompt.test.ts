import { describe, expect, it } from "vitest";
import { compilePrompt } from "./prompt";

const EXTREME_TONE = { warmth: 0.1, directness: 1, humor: 0 };
const MID_TONE = { warmth: 0.5, directness: 0.5, humor: 0.5 };

describe("compilePrompt", () => {
  it("merges identity, tone, language, profile, then tool policy", () => {
    const compiled = compilePrompt({
      isCurated: false,
      basePrompt: "You are Coach.",
      languagePreset: "hi",
      tone: EXTREME_TONE,
      userProfile: {
        displayName: "Alice",
        bio: "I am an Olympic rowing coach.",
      },
      memories: [],
      toolsEnabled: ["memory_saver"],
      toolsAllowed: [],
    });

    const identity = compiled.indexOf("You are Coach.");
    const tone = compiled.indexOf("Do not soften. Do not apologize.");
    const language = compiled.indexOf("Warm Hindi");
    const profile = compiled.indexOf("<user_profile>");
    const tools = compiled.indexOf("Tool policy:");

    expect(identity).toBe(0);
    expect(tone).toBeGreaterThan(identity);
    expect(language).toBeGreaterThan(tone);
    expect(profile).toBeGreaterThan(language);
    expect(tools).toBeGreaterThan(profile);
    expect(compiled).toContain("Cold. Do not soothe or soften.");
    expect(compiled).toContain("No jokes. Stay serious.");
    expect(compiled).toContain("Name: Alice");
    expect(compiled).toContain("Bio: I am an Olympic rowing coach.");
    expect(compiled).not.toContain("<episodic_memory>");
  });

  it("does not overlay tone on curated agents", () => {
    const compiled = compilePrompt({
      isCurated: true,
      basePrompt: "You are Marcus.",
      tone: EXTREME_TONE,
      toolsEnabled: ["memory_saver"],
      toolsAllowed: ["memory_saver"],
    });

    expect(compiled).toContain("You are Marcus.");
    expect(compiled).not.toContain("Cold. Do not soothe or soften.");
    expect(compiled).not.toContain("Do not soften. Do not apologize.");
  });

  it("omits mid-band tone sentences and empty profile tags", () => {
    const compiled = compilePrompt({
      isCurated: false,
      basePrompt: "You are Coach.",
      languagePreset: "en",
      tone: MID_TONE,
      userProfile: { displayName: "  ", bio: "" },
      toolsEnabled: [],
      toolsAllowed: [],
    });

    expect(compiled).not.toContain("Cold.");
    expect(compiled).not.toContain("Warm and supportive");
    expect(compiled).not.toContain("<user_profile>");
    expect(compiled).not.toContain("Language:");
  });

  it("forbids tools on Free even when the identity mentions memory_saver", () => {
    const compiled = compilePrompt({
      isCurated: true,
      basePrompt:
        "You are Marcus. Invoke the memory_saver tool to remember their excuses.",
      toolsEnabled: ["memory_saver"],
      toolsAllowed: [],
    });

    expect(compiled).toContain("memory_saver");
    expect(compiled).toContain("You have no tools.");
    expect(compiled).toContain("Do not use memory_saver.");
  });

  it("lists only the intersection of enabled and allowed tools", () => {
    const compiled = compilePrompt({
      isCurated: true,
      basePrompt: "You are Priya.",
      toolsEnabled: ["memory_saver", "math_solver", "web_search"],
      toolsAllowed: ["memory_saver", "math_solver"],
    });

    expect(compiled).toContain(
      "You may use only these tools: memory_saver, math_solver.",
    );
    expect(compiled).not.toContain("web_search");
  });
});
