import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mockExchangeCodeForSession = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}));

import { GET } from "@/app/auth/callback/route";

describe("GET /auth/callback", () => {
  it("redirects to origin and ignores untrusted x-forwarded-host header on auth success", async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: null });

    const request = new Request("https://myapp.com/auth/callback?code=valid-code&next=/explore", {
      headers: {
        "x-forwarded-host": "evil.example.com",
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://myapp.com/explore");
  });

  it("redirects to auth-code-error on failure", async () => {
    mockExchangeCodeForSession.mockResolvedValueOnce({ error: new Error("invalid code") });

    const request = new Request("https://myapp.com/auth/callback?code=bad-code", {
      headers: {
        "x-forwarded-host": "evil.example.com",
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://myapp.com/auth/auth-code-error");
  });
});
