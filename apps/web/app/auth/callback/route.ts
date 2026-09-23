import { NextResponse } from "next/server";
import { safeHostFromUrl, safeNextPath, safeRedirectHost } from "@/lib/auth/next";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin, host } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (!isLocalEnv && forwardedHost) {
        const appHost = safeHostFromUrl(process.env.NEXT_PUBLIC_APP_URL);
        const vercelHost = process.env.VERCEL_URL?.trim() || null;
        // Validate x-forwarded-host against trusted hosts to prevent Host Header Injection / Open Redirect
        const trustedHost = safeRedirectHost(forwardedHost, [host, appHost, vercelHost]);
        if (trustedHost) {
          return NextResponse.redirect(`https://${trustedHost}${next}`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
