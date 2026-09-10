# Maya Chat — QA Engineering Defect & Audit Report

**Audit Date**: September 10, 2026  
**QA Lead**: Antigravity Staff QA Engineer  
**Target Release**: Web MVP (Phase 2–4 Verification)  
**Status**: Engineering review complete (2026-09-10) — 5 Todo, 5 Backlog  

---

## Executive Summary

A comprehensive quality assurance and architectural audit was performed on the Maya Chat codebase, spanning the PostgreSQL/Supabase schema, Next.js 15 App Router endpoints, Vercel AI SDK integration, and `@maya/shared` domain logic.

While the foundation demonstrates sound multi-tenant security principles (RLS, PostgreSQL advisory locks, prompt IP isolation) and distinct brand identity, **10 issues** have been logged across functional correctness, concurrency, query performance, and specification drift.

---

## Ticket Index

| Ticket | Type | Priority | Component | Summary |
| :--- | :--- | :---: | :--- | :--- |
| **[MAYA-101](./MAYA-101-inverted-history-limit.md)** | Bug | **P0 (Blocker)** | API / Chat History | Inverted conversation history limit loads oldest turns instead of newest |
| **[MAYA-102](./MAYA-102-quota-check-toctou-race.md)** | Bug / Race Condition | **P0 (Critical)** | API / Rate Limiting | TOCTOU race condition in daily quota enforcement allows cap bypass |
| **[MAYA-103](./MAYA-103-unbounded-public-agents-scan.md)** | Performance | **P1 (High)** | House / SSR Loader | Unbounded public agents query in `loadHouse` causes full table scan |
| **[MAYA-104](./MAYA-104-conversation-retitling-ineffective.md)** | Bug | **P2 (Medium)** | API / Persistence | Auto-retitling logic fails when conversation title defaults to `'New Chat'` |
| **[MAYA-105](./MAYA-105-abandoned-empty-conversations.md)** | Bug / UX | **P2 (Medium)** | Client / House View | Premature conversation creation leaves orphaned empty threads in DB & UI |
| **[MAYA-106](./MAYA-106-prompt-compiler-bio-tone-ignored.md)** | Architecture / Feature | **P1 (High)** | AI / Prompt Engine | Custom tone sliders & user bio ignored during prompt construction |
| **[MAYA-107](./MAYA-107-model-selection-inoperative.md)** | Architecture / Feature | **P1 (High)** | API / Model Routing | Model selection per plan is inoperative; chat hardcoded to default model |
| **[MAYA-108](./MAYA-108-landing-pricing-catalog-drift.md)** | Spec Drift / Integrity | **P2 (Medium)** | Marketing / Landing | Pricing & model lists on landing page are hardcoded, bypassing SQL catalog |
| **[MAYA-109](./MAYA-109-memory-rpc-service-role-failure.md)** | Bug / Database | **P2 (Medium)** | Database / pgvector | `match_agent_memories` RPC fails for service role & lacks tenant index isolation |
| **[MAYA-110](./MAYA-110-unbounded-user-conversations-query.md)** | Performance | **P3 (Low)** | House / Threads | Unbounded, unpaginated conversation query degrades with user tenure |

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

**None of the ten tickets are invalid. None need more information.** Five are **Todo** (fix next). Five are **Backlog** (real, but they belong to a later slice).

Shipped today is roughly PR2 chat + Studio/settings UI + catalog-backed *default* model and quota — not full Web MVP. Several QA P1s are unfinished PR3/PR4 work, not regressions of a finished compiler or picker.

### Status counts

| Status | Count | Meaning |
| :--- | :---: | :--- |
| **Todo** | 5 | Real defect or incomplete shipped surface. Next engineering PRs. |
| **Backlog** | 5 | Real, scheduled with PR3 remainder / PR4 / memory. Not a hotfix. |
| **More info** | 0 | — |
| **Won't Fix** | 0 | No ticket is dismissed at the ticket level. |

### Disposition

| Ticket | QA pri | Eng pri | Status | Verdict |
| :--- | :---: | :---: | :--- | :--- |
| **[MAYA-101](./MAYA-101-inverted-history-limit.md)** | P0 | P0 | Todo | Valid bug. Oldest 20 messages, not newest. Both API and House SSR. |
| **[MAYA-102](./MAYA-102-quota-check-toctou-race.md)** | P0 | P0 | Todo | Valid bug. Count-then-insert races. Studio already advisory-locks; chat does not. |
| **[MAYA-103](./MAYA-103-unbounded-public-agents-scan.md)** | P1 | P2 | Todo | Valid, cheap. Unbounded public-agent select on every House SSR. Not a current incident. |
| **[MAYA-104](./MAYA-104-conversation-retitling-ineffective.md)** | P2 | P2 | Todo | Latent. Web inserts `title: ""` so first-send retitles. DB default `'New Chat'` is a footgun. |
| **[MAYA-105](./MAYA-105-abandoned-empty-conversations.md)** | P2 | P2 | Todo | Valid UX. Failed first send leaves empty “New chat” rows. Do not lazy-create in `/api/chat` as the hotfix. |
| **[MAYA-106](./MAYA-106-prompt-compiler-bio-tone-ignored.md)** | P1 | P1 | Todo | Valid product gap. `compilePrompt()` never shipped; Studio sliders and bio are inert. Next *feature* slice, not the P0 hotfix. |
| **[MAYA-107](./MAYA-107-model-selection-inoperative.md)** | P1 | P1 | Backlog | Incomplete PR4. Catalog *default* model is the intentional interim. Do not add `modelId` without `plan_models`. |
| **[MAYA-108](./MAYA-108-landing-pricing-catalog-drift.md)** | P2 | P2 | Backlog | Spec drift, deferred in code comments to PR4. Footnote currently overclaims. |
| **[MAYA-109](./MAYA-109-memory-rpc-service-role-failure.md)** | P2 | P3 | Backlog | RPC unused. `auth.uid()` is the chat-path design. Reject unbound `p_user_id` on a security-definer function. HNSW is approved schema, not an MVP defect. |
| **[MAYA-110](./MAYA-110-unbounded-user-conversations-query.md)** | P3 | P3 | Backlog | Valid at tenure scale. Reject `.limit(50)` on `loadHouse` — it would drop other agents’ latest titles on the rail. |

### Engineering order (replaces QA order above for scheduling)

1. **Hotfix PR** — **101** and **102** (P0). Same PR: cheap **103**, **104**, **105**.
2. **Next feature slice** — **106** (`compilePrompt()` in `@maya/shared`, merge order from technical-plan §5). Studio UI already writes the columns; the model never sees them.
3. **Stay on the implementation plan** — **107** + **108** with PR4 (picker, `GET /api/models`, catalog-driven seats). **109** with memory retrieve. **110** when rail pagination is real.

### Notes for implementers

- **101:** `ORDER BY created_at DESC LIMIT 20`, reverse in JS. Same in `load-context.ts` and `house/load.ts`. Window of 20 is intentional; the bug is which 20.
- **102:** Atomic consume-and-insert (advisory lock, same pattern as Studio quota). Bind uid to `auth.uid()` for authenticated callers. Do not take QA’s RPC as written.
- **105:** Hide or delete empty threads. Do not change the chat contract to optional `conversationId` in the hotfix.
- **107 / 109:** Extra surface without the surrounding PR4/memory work would reintroduce Trap 5 (silent model upgrade) or a tenant-isolation hole.
