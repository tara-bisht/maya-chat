# [MAYA-122] Env Unvalidated, Turbo Cache Poisonable, No Sentry, No Burst Limit, Service Key Reachable, Gateway Singletons Diverge

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-122 |
| **Issue Type** | 🛠️ Ops Bundle (Config / Observability / Resilience) |
| **Status** | Backlog |
| **Priority** | 🟢 P2 (Medium) |
| **Severity** | Moderate (misconfig runtime-throws, stale builds, blind prod, burst abuse) |
| **Component** | Platform (Env / CI Cache / Logging / Rate Limit / SDK) |
| **Affects Versions** | Web MVP → PR5 |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Platform Pod |

---

## 1. Summary
Six ops gaps bundle as one platform slice (none blocks chat today, all bite in prod): (1) env parsed via raw `process.env` throws, not Zod — typos surface as runtime/build errors not CI failures; (2) `turbo.json globalEnv` omits server secrets → key rotation doesn't bust `build` cache; (3) Sentry/docs-contract missing — `logDropped` is `console.error`-only, chat `onError`/persist `catch` swallow; (4) daily-quota-only rate limiting — no burst/minute/IP guard, 429 lacks `Retry-After`, captcha commented out; (5) `createServiceSupabaseClient` exported from the same `@maya/database` entry as the browser client with no `server-only` guard — one bad import ships the key; (6) dual OpenRouter singletons diverge (raw client has 30s timeout + backoff, chat-path provider has none; module `let` caches key for process life) + `NEXT_PUBLIC_APP_URL` abused as server `httpReferer` (missing prod → silently sends `localhost:3000`); `supabase/tests/*.sql` are comments, not runnable pgTAP.

---

## 2. Code Reference
- [`apps/web/lib/openrouter/config.ts:12-26`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/openrouter/config.ts#L12-L26): manual `if (!apiKey) throw`, `httpReferer: env.NEXT_PUBLIC_APP_URL || DEFAULT_REFERER` (`:3` = `http://localhost:3000`), no URL validation. Docs require [`docs/tech-stack.md:41`](file:///Users/kamalbisht/Documents/maya-chat/docs/tech-stack.md#L41) Zod everywhere.
- [`apps/web/lib/supabase/public-env.ts:7-8`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/supabase/public-env.ts#L7-L8), [`packages/database/src/env.ts:2-24`](file:///Users/kamalbisht/Documents/maya-chat/packages/database/src/env.ts#L2-L24): manual throws, no format/`sb_` check.
- [`turbo.json:3-7`](file:///Users/kamalbisht/Documents/maya-chat/turbo.json#L3-L7): `globalEnv` lists only `NEXT_PUBLIC_*`.
- [`apps/web/lib/supabase/dropped.ts:14`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/supabase/dropped.ts#L14): `console.error` only; grep `Sentry` hits docs only (`tech-stack.md:46`, `technical-plan.md:469`, `roadmap.md:137`, `implementation-plan.md:139` PR5).
- [`apps/web/app/api/chat/route.ts:92-94,134-147`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L92-L147): daily-only 429 no `Retry-After`; `onError console.error`, `catch {}` swallow.
- [`supabase/config.toml:201-221`](file:///Users/kamalbisht/Documents/maya-chat/supabase/config.toml#L201-L221): auth rate limits only; captcha commented out; `roadmap.md:183` defers Upstash to v1.1.
- [`packages/database/src/index.ts:9-11`](file:///Users/kamalbisht/Documents/maya-chat/packages/database/src/index.ts#L9-L11): same entry exports browser + `createServiceSupabaseClient`; chat/conversations correctly use RLS client today, but no guard stops a client-component import.
- [`apps/web/lib/openrouter/client.ts:8-32`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/openrouter/client.ts#L8-L32) vs [`apps/web/lib/openrouter/ai.ts:6-17`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/openrouter/ai.ts#L6-L17): timeout/retry only on raw path; both `let provider/client` cache key.
- [`supabase/tests/consume_chat_turn.sql:1-15`](file:///Users/kamalbisht/Documents/maya-chat/supabase/tests/consume_chat_turn.sql#L1-L15), [`supabase/tests/studio_quota.sql:1-14`](file:///Users/kamalbisht/Documents/maya-chat/supabase/tests/studio_quota.sql#L1-L14): manual JWT checklists, no `pgTAP` assertions.
- [`apps/web/scripts/openrouter-ping.ts:8-38`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/scripts/openrouter-ping.ts#L8-L38): hand-rolled dotenv, `../../.env.local` resolves above repo root from `apps/web` cwd.

---

## 3. Steps to Reproduce
1. Typo `NEXT_PUBLIC_SUPABASE_URL` → dev boots, first Supabase call throws (not CI-red).
2. Rotate `OPENROUTER_API_KEY` → `turbo build` hits cache, stale key ships.
3. Force `onEnd` persist fail → only `console.error`, no Sentry/typed part; Vercel logs only.
4. Burst 100 turns in 60s under daily cap → all pass (no minute/IP throttle), 429 body has no `Retry-After`/reset (cf `roadmap.md:121`).
5. `import { createServiceSupabaseClient } from "@maya/database"` in a client component → bundles without error.
6. Stop OpenRouter 5s mid-stream on chat path → hangs to default (no 30s/backoff the raw client has).

---

## 4. Expected Behavior
- Zod env schema fails CI on typo; secret rotation busts build cache; Sentry + `tokens_used` dashboard show stream/persist health; burst abuse throttled with `Retry-After`; service key unimportable from client graph; both gateway paths share timeout/retry/headers; pgTAP guards quota/studio in CI.

---

## 5. Actual Behavior
- Runtime-throw config, poisonable cache, console-only observability, daily-only throttle, footgun export, divergent resilience, comment-only SQL tests.

---

## 6. Root Cause Analysis (RCA)
Each is a PR0/PR5 deferral that never got a tracking ticket: env validation scoped to routes not config; Turbo cache scoped to public vars; Sentry scoped to PR5 Harden; rate limit scoped to daily DB count (Upstash v1.1); database package scoped to single entry; OpenRouter raw-vs-AI-SDK paths grew independently.

---

## 7. Proposed Solution & Code Fix
- Zod env schema (`@maya/shared/env` or `apps/web/lib/env.ts`): URL + `sb_` checks; wire `openRouterConfigFromEnv`, `public-env.ts`, `database/env.ts` to it; fix `openrouter-ping.ts` dotenv + `../.env.local` path.
- `turbo.json`: add `OPENROUTER_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` to `globalEnv` (or `globalPassThrough` if intentionally uncached).
- Sentry (`instrumentation.*`, `sentry.*`) per PR5 + `logDropped` → Sentry in `house/load.ts`, `chat/route.ts onError/onEnd`; keep `tokens_used` persist.
- Burst guard (Upstash or in-DB minute bucket now, `Retry-After` + reset in 429 body per `roadmap.md:121`); enable captcha for prod.
- Split `@maya/database/server` entry (or `server-only` guard) for service export; unify OpenRouter factory (shared timeout 30s + backoff + headers, test-injectable, no module-`let` key pin); server `APP_URL` with prod assertion for `httpReferer`.
- pgTAP (`set_config('request.jwt.claim.sub',...) + SET ROLE authenticated`) for `consume_chat_turn` race + `studio_cap`/`private_forbidden`; wire to CI.

---

## 8. Acceptance Criteria (AC)
- [ ] Bad env fails `lint/typecheck/test` (or new `envcheck`), not runtime.
- [ ] Key rotation invalidates `turbo build` cache.
- [ ] Persist/stream failures appear in Sentry with `tokens_used` intact.
- [ ] 429 includes `Retry-After`/reset; burst loop throttled.
- [ ] Client-component service import fails at build.
- [ ] Chat path has 30s timeout + retry parity; referer never `localhost` in prod.
- [ ] `supabase/tests` run green in CI.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid ops deferrals — none block chat today |
| **Status** | Backlog |
| **Engineering priority** | P2 as PR5 / v1.1, not a hotfix |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Six items, all true on the tree: manual `process.env` throws (not Zod), `turbo.json globalEnv` is `NEXT_PUBLIC_*` only, `logDropped` is `console.error`, daily quota only (Upstash is v1.1), `createServiceSupabaseClient` shares `@maya/database` with the browser client and has no `import "server-only"`, chat-path OpenRouter provider has no 30s timeout, `supabase/tests/*.sql` are JWT checklists.

**Do not** pull Zod env, Sentry, Upstash burst, captcha, or pgTAP-in-CI into the 111–114 slice. Those are PR5 (Sentry, error parts) and roadmap v1.1 (Upstash). Comment-only SQL tests were an explicit MAYA-102 choice.

Cheap hitch on MAYA-118: `import "server-only"` in `packages/database/src/service.ts`; add `OPENROUTER_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to `turbo.json` `globalEnv`. That does not close this ticket.
