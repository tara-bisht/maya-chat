import { describe, expect, it } from "vitest";
import {
  allowedStudioTools,
  canEditAgent,
  canUseAgent,
  evaluateStudioWrite,
  parseStudioWriteError,
  studioUpsertSchema,
  type StudioWriteInput,
} from "./studio";

const freeCreate: StudioWriteInput = {
  action: "create",
  planId: "free",
  maxCustomAgents: 3,
  liveCustomCount: 0,
  desiredPublic: true,
};

describe("evaluateStudioWrite", () => {
  it("allows a public create under the Free cap", () => {
    expect(evaluateStudioWrite(freeCreate)).toEqual({ ok: true });
  });

  it("rejects the 4th live custom agent on Free", () => {
    expect(
      evaluateStudioWrite({ ...freeCreate, liveCustomCount: 3 }),
    ).toEqual({
      ok: false,
      code: "studio_cap",
      upgradePlan: "plus",
    });
  });

  it("rejects the 11th live custom agent on Plus", () => {
    expect(
      evaluateStudioWrite({
        action: "create",
        planId: "plus",
        maxCustomAgents: 10,
        liveCustomCount: 10,
        desiredPublic: false,
      }),
    ).toEqual({
      ok: false,
      code: "studio_cap",
      upgradePlan: "pro",
    });
  });

  it("allows unlimited creates on Pro", () => {
    expect(
      evaluateStudioWrite({
        action: "create",
        planId: "pro",
        maxCustomAgents: null,
        liveCustomCount: 400,
        desiredPublic: false,
      }),
    ).toEqual({ ok: true });
  });

  it("rejects a private create on Free", () => {
    expect(
      evaluateStudioWrite({ ...freeCreate, desiredPublic: false }),
    ).toEqual({
      ok: false,
      code: "studio_private_forbidden",
      upgradePlan: "plus",
    });
  });

  it("allows Plus to create a private role", () => {
    expect(
      evaluateStudioWrite({
        action: "create",
        planId: "plus",
        maxCustomAgents: 10,
        liveCustomCount: 1,
        desiredPublic: false,
      }),
    ).toEqual({ ok: true });
  });

  it("grandfathers a private row on Free updates", () => {
    expect(
      evaluateStudioWrite({
        action: "update",
        planId: "free",
        maxCustomAgents: 3,
        liveCustomCount: 3,
        desiredPublic: false,
        existing: { isPublic: false, archived: false },
      }),
    ).toEqual({ ok: true });
  });

  it("rejects flipping public to private on Free", () => {
    expect(
      evaluateStudioWrite({
        action: "update",
        planId: "free",
        maxCustomAgents: 3,
        liveCustomCount: 1,
        desiredPublic: false,
        existing: { isPublic: true, archived: false },
      }),
    ).toEqual({
      ok: false,
      code: "studio_private_forbidden",
      upgradePlan: "plus",
    });
  });

  it("does not apply the cap to edits of live rows", () => {
    expect(
      evaluateStudioWrite({
        action: "update",
        planId: "free",
        maxCustomAgents: 3,
        liveCustomCount: 3,
        desiredPublic: true,
        existing: { isPublic: true, archived: false },
      }),
    ).toEqual({ ok: true });
  });

  it("always allows archive", () => {
    expect(
      evaluateStudioWrite({
        action: "archive",
        planId: "free",
        maxCustomAgents: 3,
        liveCustomCount: 3,
        desiredPublic: true,
        existing: { isPublic: true, archived: false },
      }),
    ).toEqual({ ok: true });
  });

  it("treats restore like create for the cap", () => {
    expect(
      evaluateStudioWrite({
        action: "restore",
        planId: "free",
        maxCustomAgents: 3,
        liveCustomCount: 3,
        desiredPublic: true,
        existing: { isPublic: true, archived: true },
      }),
    ).toEqual({
      ok: false,
      code: "studio_cap",
      upgradePlan: "plus",
    });
  });

  it("lets Free restore a grandfathered private row under the cap", () => {
    expect(
      evaluateStudioWrite({
        action: "restore",
        planId: "free",
        maxCustomAgents: 3,
        liveCustomCount: 2,
        desiredPublic: false,
        existing: { isPublic: false, archived: true },
      }),
    ).toEqual({ ok: true });
  });
});

describe("canUseAgent", () => {
  const viewer = "viewer-1";

  it("allows Free to talk to a free-tier curated player", () => {
    expect(
      canUseAgent({
        planId: "free",
        viewerId: viewer,
        agent: {
          isCurated: true,
          freeTier: true,
          isPublic: true,
          archivedAt: null,
          userId: null,
        },
      }),
    ).toBe(true);
  });

  it("blocks Free on a Plus curated player", () => {
    expect(
      canUseAgent({
        planId: "free",
        viewerId: viewer,
        agent: {
          isCurated: true,
          freeTier: false,
          isPublic: true,
          archivedAt: null,
          userId: null,
        },
      }),
    ).toBe(false);
  });

  it("lets the owner talk to a private custom role", () => {
    expect(
      canUseAgent({
        planId: "plus",
        viewerId: viewer,
        agent: {
          isCurated: false,
          freeTier: false,
          isPublic: false,
          archivedAt: null,
          userId: viewer,
        },
      }),
    ).toBe(true);
  });

  it("hides a private custom role from a stranger", () => {
    expect(
      canUseAgent({
        planId: "pro",
        viewerId: viewer,
        agent: {
          isCurated: false,
          freeTier: false,
          isPublic: false,
          archivedAt: null,
          userId: "owner-2",
        },
      }),
    ).toBe(false);
  });

  it("lets a stranger talk to a public custom role", () => {
    expect(
      canUseAgent({
        planId: "free",
        viewerId: viewer,
        agent: {
          isCurated: false,
          freeTier: false,
          isPublic: true,
          archivedAt: null,
          userId: "owner-2",
        },
      }),
    ).toBe(true);
  });

  it("blocks new threads with an archived public role", () => {
    expect(
      canUseAgent({
        planId: "plus",
        viewerId: "owner-2",
        agent: {
          isCurated: false,
          freeTier: false,
          isPublic: true,
          archivedAt: "2026-09-10T00:00:00.000Z",
          userId: "owner-2",
        },
      }),
    ).toBe(false);
  });
});

describe("canEditAgent", () => {
  it("lets the owner edit a live custom role", () => {
    expect(
      canEditAgent({
        viewerId: "owner",
        agent: { isCurated: false, archivedAt: null, userId: "owner" },
      }),
    ).toBe(true);
  });

  it("blocks strangers, curated rows, and archived rows", () => {
    expect(
      canEditAgent({
        viewerId: "stranger",
        agent: { isCurated: false, archivedAt: null, userId: "owner" },
      }),
    ).toBe(false);
    expect(
      canEditAgent({
        viewerId: "owner",
        agent: { isCurated: true, archivedAt: null, userId: null },
      }),
    ).toBe(false);
    expect(
      canEditAgent({
        viewerId: "owner",
        agent: {
          isCurated: false,
          archivedAt: "2026-09-10T00:00:00.000Z",
          userId: "owner",
        },
      }),
    ).toBe(false);
  });
});

describe("parseStudioWriteError", () => {
  it("reads trigger messages", () => {
    expect(parseStudioWriteError("studio_cap")).toBe("studio_cap");
    expect(parseStudioWriteError("studio_private_forbidden")).toBe(
      "studio_private_forbidden",
    );
    expect(parseStudioWriteError("something else")).toBeNull();
  });
});

describe("allowedStudioTools", () => {
  it("intersects requested tools with the plan allowlist", () => {
    expect(
      allowedStudioTools(
        ["memory_saver", "web_search", "nope"],
        ["memory_saver", "math_solver"],
      ),
    ).toEqual(["memory_saver"]);
  });
});

describe("studioUpsertSchema", () => {
  it("rejects an overlong name", () => {
    const parsed = studioUpsertSchema.safeParse({
      name: "x".repeat(41),
      tagline: "A line they would actually say",
      languagePreset: "en",
      costumeId: "custom",
      backstory: "You are a player with a point of view.",
      tone: { warmth: 0.5, directness: 0.5, humor: 0.5 },
      toolsEnabled: [],
      isPublic: true,
    });
    expect(parsed.success).toBe(false);
  });
});
