import { describe, expect, it } from "vitest";
import { openRouterConfigFromEnv } from "./config";

describe("openRouterConfigFromEnv", () => {
  it("throws without OPENROUTER_API_KEY", () => {
    expect(() => openRouterConfigFromEnv({})).toThrow(
      "Missing required environment variable OPENROUTER_API_KEY",
    );
  });

  it("uses NEXT_PUBLIC_APP_URL as the referer", () => {
    expect(
      openRouterConfigFromEnv({
        OPENROUTER_API_KEY: "sk-or-test",
        NEXT_PUBLIC_APP_URL: "https://maya.example",
      }),
    ).toEqual({
      apiKey: "sk-or-test",
      httpReferer: "https://maya.example",
      appTitle: "Maya Chat",
      appCategories: "roleplay,general-chat",
    });
  });

  it("defaults the referer to localhost", () => {
    expect(
      openRouterConfigFromEnv({ OPENROUTER_API_KEY: "sk-or-test" }).httpReferer,
    ).toBe("http://localhost:3000");
  });
});
