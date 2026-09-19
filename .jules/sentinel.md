## 2026-03-31 - Open Redirect via Backslash URL Bypass in `safeNextPath`
**Vulnerability:** `safeNextPath` validated redirect paths by checking `startsWith("/")` and rejecting `startsWith("//")`. Backslash paths like `/\evil.com` or `/\\evil.com` bypassed this check and were resolved by standard WHATWG URL parsers / browser URL engines as protocol-relative off-site redirects.
**Learning:** Checking `startsWith("/")` and `!startsWith("//")` is insufficient for open redirect prevention because `\` (backslash) in URL paths is normalized to `/` by browsers when resolving relative URLs.
**Prevention:** Always validate relative paths using `new URL(path, "https://dummy.domain")` and verify `url.origin` matches the dummy domain before accepting the path.
