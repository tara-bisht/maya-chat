import { describe, expect, it } from "vitest";
import {
  AGENT_CATEGORIES,
  MAYA_AGENT_ID,
  MAYA_HOME_HREF,
  MAYA_PLANS,
} from "./index";

describe("@maya/shared", () => {
  it("locks the three plans", () => {
    expect(MAYA_PLANS).toEqual(["free", "plus", "pro"]);
  });

  it("locks agent categories including wellbeing and lifestyle", () => {
    expect(AGENT_CATEGORIES).toContain("wellbeing");
    expect(AGENT_CATEGORIES).toContain("lifestyle");
    expect(AGENT_CATEGORIES).toContain("host");
    expect(AGENT_CATEGORIES).not.toContain("friendship");
  });

  it("pins Maya's stable id as signed-in home", () => {
    expect(MAYA_AGENT_ID).toBe("00000000-0000-0000-0000-00000000000a");
    expect(MAYA_HOME_HREF).toBe(`/chat/${MAYA_AGENT_ID}`);
  });
});
