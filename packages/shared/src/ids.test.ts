import { describe, expect, it } from "vitest";
import {
  generateCustomAgentSlug,
  isAgentSlug,
  isShortThreadId,
  shortIdToUuid,
  uuidToShortId,
} from "./ids";

describe("ids utilities", () => {
  it("losslessly encodes and decodes arbitrary UUIDs", () => {
    const testUuids = [
      "00000000-0000-0000-0000-000000000000",
      "00000000-0000-0000-0000-000000000001",
      "e6297db4-6a1e-5e3f-e01e-67ce90f1c46b",
      "ffffffff-ffff-ffff-ffff-ffffffffffff",
      "12345678-1234-5678-1234-567812345678",
    ];

    for (const id of testUuids) {
      const short = uuidToShortId(id);
      expect(short.startsWith("t_")).toBe(true);
      expect(isShortThreadId(short)).toBe(true);
      const restored = shortIdToUuid(short);
      expect(restored).toBe(id);
    }
  });

  it("handles non-shortId strings gracefully in shortIdToUuid", () => {
    expect(shortIdToUuid("regular-slug")).toBe("regular-slug");
    expect(shortIdToUuid("00000000-0000-0000-0000-000000000001")).toBe(
      "00000000-0000-0000-0000-000000000001",
    );
  });

  it("generates clean custom agent slugs with suffixes", () => {
    const slug1 = generateCustomAgentSlug("Dr. Sherlock Holmes", "a7b2");
    expect(slug1).toBe("dr-sherlock-holmes-a7b2");
    expect(isAgentSlug(slug1)).toBe(true);

    const slug2 = generateCustomAgentSlug("  Socrates !!!  ");
    expect(slug2.startsWith("socrates-")).toBe(true);
    expect(isAgentSlug(slug2)).toBe(true);
  });

  it("validates agent slugs accurately", () => {
    expect(isAgentSlug("maya")).toBe(true);
    expect(isAgentSlug("marcus-01")).toBe(true);
    expect(isAgentSlug("priya-02")).toBe(true);
    expect(isAgentSlug("Dr. Priya")).toBe(false);
    expect(isAgentSlug("maya/01")).toBe(false);
  });
});
