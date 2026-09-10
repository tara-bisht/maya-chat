import { describe, expect, it } from "vitest";
import { HOUSE_AGENT_COLUMNS } from "./columns";

describe("HOUSE_AGENT_COLUMNS", () => {
  it("does not select system_prompt", () => {
    expect(HOUSE_AGENT_COLUMNS).not.toMatch(/system_prompt/);
  });
});
