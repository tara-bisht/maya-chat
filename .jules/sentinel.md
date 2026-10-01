## 2025-05-10 - Open Redirect Prevention in OAuth Callbacks
**Vulnerability:** `safeNextPath` only guarded against double slash `//` redirects, allowing backslash or control character redirect bypass vectors like `/\\evil.com` or `/\tevil.com` which browser URL parsers interpret as scheme-relative off-site redirects.
**Learning:** Checking `raw.startsWith("/")` and `!raw.startsWith("//")` is insufficient for path safety in JavaScript due to browser and URL parser backslash normalization rules.
**Prevention:** Combine initial string checks (`/\\`, `//`, control characters) with strict `new URL(raw, dummyBase)` origin validation.
