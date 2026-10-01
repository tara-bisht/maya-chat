## 2025-05-18 - OAuth Callback Host Header Injection
**Vulnerability:** Untrusted `x-forwarded-host` header in OAuth callback route was used to construct 302 redirect URLs without validation, enabling open redirects to attacker domains.
**Learning:** Request headers like `x-forwarded-host` can be spoofed in incoming HTTP requests unless stripped or validated by upstream reverse proxies.
**Prevention:** Always redirect using validated `origin` (from `new URL(request.url)`) or strictly validate `x-forwarded-host` against known allowed application domains.
