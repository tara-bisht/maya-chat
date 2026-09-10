# Maya Chat — QA Engineering Defect & Audit Report

**Audit Date**: September 10, 2026  
**QA Lead**: Antigravity Staff QA Engineer  
**Target Release**: Web MVP (Phase 2–4 Verification)  
**Status**: 12 Done on `main` (#7, #9, #14–#18), 1 Todo, 9 Backlog — 2026-09-10  

---

## Executive Summary

A comprehensive quality assurance and architectural audit was performed on the Maya Chat codebase, spanning the PostgreSQL/Supabase schema, Next.js 15 App Router endpoints, Vercel AI SDK integration, and `@maya/shared` domain logic.

While the foundation demonstrates sound multi-tenant security principles (RLS, PostgreSQL advisory locks, prompt IP isolation) and distinct brand identity, **22 issues** have been logged across functional correctness, concurrency, query performance, and specification drift.

---

## Ticket Index

| Ticket | Type | Priority | Status | Component | Summary |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **[MAYA-101](./MAYA-101-inverted-history-limit.md)** | Bug | **P0** | **Done** (#7) | API / Chat History | Inverted conversation history limit loads oldest turns instead of newest |
| **[MAYA-102](./MAYA-102-quota-check-toctou-race.md)** | Bug / Race | **P0** | **Done** (#7) | API / Rate Limiting | TOCTOU race condition in daily quota enforcement allows cap bypass |
| **[MAYA-103](./MAYA-103-unbounded-public-agents-scan.md)** | Performance | **P1** | **Done** (#7) | House / SSR Loader | Unbounded public agents query in `loadHouse` causes full table scan |
| **[MAYA-104](./MAYA-104-conversation-retitling-ineffective.md)** | Bug | **P2** | **Done** (#7) | API / Persistence | Auto-retitling logic fails when conversation title defaults to `'New Chat'` |
| **[MAYA-105](./MAYA-105-abandoned-empty-conversations.md)** | Bug / UX | **P2** | **Done** (#7) | Client / House View | Premature conversation creation leaves orphaned empty threads in DB & UI |
| **[MAYA-106](./MAYA-106-prompt-compiler-bio-tone-ignored.md)** | Architecture | **P1** | **Done** (#9) | AI / Prompt Engine | Custom tone sliders & user bio ignored during prompt construction |
| **[MAYA-107](./MAYA-107-model-selection-inoperative.md)** | Architecture | **P1** | **Backlog** | API / Model Routing | Model selection per plan is inoperative; chat hardcoded to default model |
| **[MAYA-108](./MAYA-108-landing-pricing-catalog-drift.md)** | Spec Drift | **P2** | **Backlog** | Marketing / Landing | Pricing & model lists on landing page are hardcoded, bypassing SQL catalog |
| **[MAYA-109](./MAYA-109-memory-rpc-service-role-failure.md)** | Bug / Database | **P2** | **Backlog** | Database / pgvector | `match_agent_memories` RPC fails for service role & lacks tenant index isolation |
| **[MAYA-110](./MAYA-110-unbounded-user-conversations-query.md)** | Performance | **P3** | **Backlog** | House / Threads | Unbounded, unpaginated conversation query degrades with user tenure |
| **[MAYA-111](./MAYA-111-chat-prompt-rpc-leaks-public-custom-prompts.md)** | Security | **P0** | **Done** (#15) | Database / RPC | `chat_agent_prompt` leaks any public custom system prompt to any authenticated user |
| **[MAYA-112](./MAYA-112-usage-events-direct-insert-bypasses-quota.md)** | Security | **P0** | **Done** (#15) | Database / Quota | Direct `usage_events` INSERT bypasses atomic quota API, allows forgery and flooding |
| **[MAYA-113](./MAYA-113-conversation-create-quota-peek-and-spam.md)** | Bug / Race | **P0** | **Done** (#15) | API / Conversations | Create-route quota peek TOCTOU plus unbounded empty-row spam |
| **[MAYA-114](./MAYA-114-quota-burned-before-persist-no-compensation.md)** | Bug | **P0** | **Done** (#18) | API / Persistence | Quota burned before user-message persist, no compensation on DB failure |
| **[MAYA-115](./MAYA-115-dual-plan-truth-profiles-vs-entitlements.md)** | Architecture | **P1** | **Backlog** | Database / Catalog | Dual plan truth `profiles.plan` vs `entitlements.plan` drifts with no sync |
| **[MAYA-116](./MAYA-116-no-model-attribution-plan-models-unenforced.md)** | Architecture | **P1** | **Backlog** | Database / Billing | No `model_id` attribution, `plan_models` allowlist unenforced in DB |
| **[MAYA-117](./MAYA-117-assistant-persist-best-effort-history-divergence.md)** | Bug | **P1** | **Backlog** | API / Streaming | Assistant persist best-effort swallow diverges stream from DB, abort orphans |
| **[MAYA-118](./MAYA-118-ci-never-builds.md)** | CI/CD | **P0** | **Done** (#17) | CI / Build | CI never builds, broken production ships green |
| **[MAYA-119](./MAYA-119-committed-stage-credential-in-env-example.md)** | Hygiene | **P0** | **Todo** | Repo / Secrets | Live stage credential material committed in `.env.example` |
| **[MAYA-120](./MAYA-120-persist-throws-escape-typed-errors-unvalidated-agentid.md)** | Bug | **P1** | **Done** (#18) | API / Validation | Persist throws escape typed errors, `agentId` unvalidated, field errors lost |
| **[MAYA-121](./MAYA-121-agents-delete-dead-signup-not-idempotent-missing-guards.md)** | Database | **P1** | **Backlog** | Database / Migrations | Dead delete, non-idempotent signup, missing CHECK/UNIQUE guards |
| **[MAYA-122](./MAYA-122-env-validation-sentry-ratelimit-service-role-hygiene.md)** | Ops | **P2** | **Backlog** | Platform / Observability | Env unvalidated, cache poisonable, no Sentry, no burst limit, key reachable |

---

## Severity Definitions

- **P0 (Blocker / Critical)**: Severe functional breakdown, data corruption, financial leakage, or security bypass. Must be resolved prior to any production deployment.
- **P1 (High)**: Major architectural flaw, high-impact performance bottleneck under scale, or core product specification deviation.
- **P2 (Medium)**: Noticeable user-facing defect, UI inconsistency, or edge-case failure with available workaround.
- **P3 (Low)**: Minor optimization, hygiene improvement, or non-blocking cosmetic cleanup.

---

## Recommended Triage Priority (QA)

1. **Immediate P0 Patch**: Resolve **MAYA-101** (Chat Amnesia) and **MAYA-102** (Daily Quota Bypass). Both directly impact core conversational continuity and token billing costs.
2. **High-Priority Performance Patch**: Resolve **MAYA-103** before community users create public custom agents in Studio.
3. **Core Specification Alignment**: Address **MAYA-106** and **MAYA-107** to unlock character customization and tier-differentiated LLMs as promised in product documentation.

---

## Engineering Tech Lead Review (2026-09-10)

Reviewed against the current tree (`POST /api/chat`, House/gallery loaders, persist helpers, Studio writes, `plans` / `plan_models`, `match_agent_memories`) and the PR plan (PR2–PR4 cuts, Trap 3).

**None of the ten tickets are invalid. None need more information.** Six are **Done** on `main`. Four are **Backlog**.

Product code for 101–105 landed in [#7](https://github.com/tara-bisht/maya-chat/pull/7). `compilePrompt` (106) landed in [#9](https://github.com/tara-bisht/maya-chat/pull/9) after stacked #8 merged into the wrong base.

### Status counts (101–110)

| Status | Count | Meaning |
| :--- | :---: | :--- |
| **Done** | 6 | On `main` (#7, #9). |
| **Backlog** | 4 | Scheduled with PR4 / memory / pagination. |

### Disposition (101–110)

| Ticket | QA pri | Eng pri | Status | Verdict |
| :--- | :---: | :---: | :--- | :--- |
| **[MAYA-101](./MAYA-101-inverted-history-limit.md)** | P0 | P0 | Done (#7) | Valid bug. Oldest 20 messages, not newest. Both API and House SSR. |
| **[MAYA-102](./MAYA-102-quota-check-toctou-race.md)** | P0 | P0 | Done (#7) | Valid bug. Count-then-insert races. Studio already advisory-locks; chat does not. |
| **[MAYA-103](./MAYA-103-unbounded-public-agents-scan.md)** | P1 | P2 | Done (#7) | Valid, cheap. Unbounded public-agent select on every House SSR. Not a current incident. |
| **[MAYA-104](./MAYA-104-conversation-retitling-ineffective.md)** | P2 | P2 | Done (#7) | Latent. Web inserts `title: ""` so first-send retitles. DB default `'New Chat'` is a footgun. |
| **[MAYA-105](./MAYA-105-abandoned-empty-conversations.md)** | P2 | P2 | Done (#7) | Valid UX. Failed first send leaves empty “New chat” rows. Do not lazy-create in `/api/chat` as the hotfix. |
| **[MAYA-106](./MAYA-106-prompt-compiler-bio-tone-ignored.md)** | P1 | P1 | Done (#9) | Valid product gap. `compilePrompt()` never shipped; Studio sliders and bio are inert. Next *feature* slice, not the P0 hotfix. |
| **[MAYA-107](./MAYA-107-model-selection-inoperative.md)** | P1 | P1 | Backlog | Incomplete PR4. Catalog *default* model is the intentional interim. Do not add `modelId` without `plan_models`. |
| **[MAYA-108](./MAYA-108-landing-pricing-catalog-drift.md)** | P2 | P2 | Backlog | Spec drift, deferred in code comments to PR4. Footnote currently overclaims. |
| **[MAYA-109](./MAYA-109-memory-rpc-service-role-failure.md)** | P2 | P3 | Backlog | RPC unused. `auth.uid()` is the chat-path design. Reject unbound `p_user_id` on a security-definer function. HNSW is approved schema, not an MVP defect. |
| **[MAYA-110](./MAYA-110-unbounded-user-conversations-query.md)** | P3 | P3 | Backlog | Valid at tenure scale. Reject `.limit(50)` on `loadHouse` — it would drop other agents’ latest titles on the rail. |

### Engineering order (101–110)

1. **Shipped** — **101–105** in #7; **106** in #9.
2. **Stay on the implementation plan** — **107** + **108** with PR4 (picker, `GET /api/models`, catalog-driven seats). **109** with memory retrieve. **110** when rail pagination is real.

### Notes for implementers (101–110)

- **101:** `ORDER BY created_at DESC LIMIT 20`, reverse in JS. Same in `load-context.ts` and `house/load.ts`. Window of 20 is intentional; the bug is which 20.
- **102:** Atomic consume-and-insert (advisory lock, same pattern as Studio quota). Bind uid to `auth.uid()` for authenticated callers. Do not take QA’s RPC as written.
- **105:** Hide or delete empty threads. Do not change the chat contract to optional `conversationId` in the hotfix.
- **107 / 109:** Extra surface without the surrounding PR4/memory work would reintroduce Trap 5 (silent model upgrade) or a tenant-isolation hole.

---

## Engineering Tech Lead Review (MAYA-111–122)

Reviewed against the current tree (`chat_agent_prompt`, `usage_events` grants, `POST /api/chat` + `/api/conversations`, persist throws, `profiles.plan` vs `entitlements`, CI, `.env.example`, Studio archive, CONTEXT, implementation-plan traps).

**None of the twelve tickets are invalid. None need more information.** Six Wave 0 tickets are **Done** on `main`. **119** stays **Todo** until the stage publishable key is rotated. Five are **Backlog** (plus 107–110 already Backlog).

### Status counts (all 22)

| Status | Count | Meaning |
| :--- | :---: | :--- |
| **Done** | 12 | On `main` (#7, #9, #14–#18). |
| **Todo** | 1 | 119 — rotate the exposed stage publishable key. |
| **Backlog** | 9 | 107–110, 115–117, 121–122. |
| **More info** | 0 | — |

### Disposition (111–122)

| Ticket | QA pri | Eng pri | Status | Verdict |
| :--- | :---: | :---: | :--- | :--- |
| **[MAYA-111](./MAYA-111-chat-prompt-rpc-leaks-public-custom-prompts.md)** | P0 | P0 | Done (#15) | Valid prompt-IP leak. RPC is executable by any authed JWT. Do **not** take Option B (still leaks curated prompts). |
| **[MAYA-112](./MAYA-112-usage-events-direct-insert-bypasses-quota.md)** | P0 | P0 | Done (#15) | Valid. MAYA-102 added atomic consume but never revoked `GRANT INSERT` on `usage_events`. |
| **[MAYA-113](./MAYA-113-conversation-create-quota-peek-and-spam.md)** | P0 | P1 | Done (#15) | Valid empty-row spam + peek TOCTOU. Does **not** bypass chat quota. Do not consume on create. Do not lazy-create in `/api/chat`. |
| **[MAYA-114](./MAYA-114-quota-burned-before-persist-no-compensation.md)** | P0 | P1 | Done (#18) | Valid pre-gateway burn on persist throw. Insert-then-consume; no `refund_chat_turn`. |
| **[MAYA-115](./MAYA-115-dual-plan-truth-profiles-vs-entitlements.md)** | P1 | P1 | Backlog | Dual column is real. App already reads `entitlements.plan`. Drop `profiles.plan` with the Stripe webhook (PR4). |
| **[MAYA-116](./MAYA-116-no-model-attribution-plan-models-unenforced.md)** | P1 | P1 | Backlog | Same slice as **107**. Do not add `modelId` / `consume_chat_turn(p_model_id)` without the picker (Trap 5). |
| **[MAYA-117](./MAYA-117-assistant-persist-best-effort-history-divergence.md)** | P1 | P1 | Backlog | Valid stream/DB divergence. Full ACs are PR5. Optional `logDropped` can hitch on 114. |
| **[MAYA-118](./MAYA-118-ci-never-builds.md)** | P0 | P0 | Done (#17) | Valid. `check` is `lint typecheck test` only. `docs/git.md` enshrines it. |
| **[MAYA-119](./MAYA-119-committed-stage-credential-in-env-example.md)** | P0 | P0 | Todo | Valid policy break. Placeholders shipped in #14; rotate the exposed stage publishable key in the dashboard. |
| **[MAYA-120](./MAYA-120-persist-throws-escape-typed-errors-unvalidated-agentid.md)** | P1 | P1 | Done (#18) | Persist throws land with **114**. GET `isUuid` is a one-liner. Reject `fieldErrors` / multimodal redesign. |
| **[MAYA-121](./MAYA-121-agents-delete-dead-signup-not-idempotent-missing-guards.md)** | P1 | P2 | Backlog | Dead DELETE is **working as designed** (CONTEXT Archive). Do not restore DELETE. Do not squash applied migrations. |
| **[MAYA-122](./MAYA-122-env-validation-sentry-ratelimit-service-role-hygiene.md)** | P2 | P2 | Backlog | Six PR5/v1.1 ops items. `server-only` + `turbo.json globalEnv` hitched on #15/#17. |

### Engineering order (111–122)

1. **Shipped** — **111**, **112**, **113** in #15; **118** in #17; **114**, **120** in #18. Placeholders for **119** in #14 (rotate the stage key).
2. **Stay on the implementation plan** — **115** + **116** with PR4; **117** + **122** with PR5; **121** as later schema hardening.

### Notes for implementers (111–122)

- **111:** Revoke `EXECUTE` from `authenticated`; grant `service_role` only. Rewrite the function — drop `auth.uid() is not null` or service-role chat returns no prompt. Fetch prompt after `canChat` via the service client. Do not grant `system_prompt` on authenticated `SELECT`. Do not take Option B.
- **112:** `revoke insert on usage_events from authenticated`. Keep `SELECT` own. Writes only via `consume_chat_turn()`.
- **113:** Cap empty conversations (5) with an advisory-locked `BEFORE INSERT` trigger. Do not consume a chat turn on create. Do not lazy-create in `/api/chat`. Drop the JS peek.
- **114:** Insert user message, then consume, then `streamText`. Retitle is non-fatal. Result unions, no `refund_chat_turn`. Trap 8 still counts gateway aborts.
- **119:** Placeholders only. Rotate the stage publishable key in the dashboard. Do not rewrite git history.
- **120:** `isUuid` on GET `agentId`. Persist Result with 114. Keep `{ ok: false }` chat parse — no `fieldErrors` reshape.
- **121:** Archive-only is the product. Do not restore DELETE.
- **116 / 107:** No `modelId` without a `plan_models` check.
