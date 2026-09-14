import { describe, expect, it } from "vitest";
import { getSlugForAgent, resolveCuratedSlug } from "./slugs";
import { MAYA_AGENT_ID } from "@/lib/maya/constants";

describe("slugs helper", () => {
  it("resolves maya and curated slugs to UUIDs", () => {
    expect(resolveCuratedSlug("maya")).toBe(MAYA_AGENT_ID);
    expect(resolveCuratedSlug("marcus-01")).toBe(
      "00000000-0000-0000-0000-000000000001",
    );
    expect(resolveCuratedSlug("priya-02")).toBe(
      "00000000-0000-0000-0000-000000000002",
    );
  });

  it("resolves short aliases (e.g. marcus -> marcus-01 id)", () => {
    expect(resolveCuratedSlug("marcus")).toBe(
      "00000000-0000-0000-0000-000000000001",
    );
  });

  it("leaves valid UUIDs intact", () => {
    const customUuid = "12345678-1234-5678-1234-567812345678";
    expect(resolveCuratedSlug(customUuid)).toBe(customUuid);
  });

  it("returns preferred slugs for display URLs", () => {
    expect(getSlugForAgent(MAYA_AGENT_ID)).toBe("maya");
    expect(getSlugForAgent("00000000-0000-0000-0000-000000000001")).toBe(
      "marcus-01",
    );
    expect(
      getSlugForAgent({
        id: "custom-id",
        slug: "cyber-monk-k8p2",
      }),
    ).toBe("cyber-monk-k8p2");
  });
});
