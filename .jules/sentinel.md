## 2025-05-18 - Unvalidated X-Forwarded-Host in Auth Callback
**Vulnerability:** The OAuth callback route (`/auth/callback`) blindly trusted the `X-Forwarded-Host` header to redirect authenticated users, enabling Host Header Injection and Open Redirects to attacker-controlled domains.
**Learning:** Checking `forwardedHost` without validating it against configured application hosts (`NEXT_PUBLIC_APP_URL`, `VERCEL_URL`, or `request.url` host) allows external HTTP headers to override redirect origins.
**Prevention:** Always validate `X-Forwarded-Host` against an explicit list of trusted hosts using `safeRedirectHost` before issuing redirects.
