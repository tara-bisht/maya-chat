# [MAYA-116] No Model Attribution: `plan_models` Allowlist Unenforced in DB, No Per-Model Cost Audit

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-116 |
| **Issue Type** | 🏗️ Architecture / Billing Integrity |
| **Status** | Backlog |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (paid-model leakage, unauditable LLM cost) |
| **Component** | Database (Catalog) & API (Model Routing) |
| **Affects Versions** | Web MVP, PR4 |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
`public.plan_models` exists as the plan→model allowlist, but no write path joins it. `conversations`, `messages`, and `usage_events` have **no `model_id` column**, and `chat_agent_prompt` checks curated/owner/public + archived — never `free_tier` nor `plan_models`. Any app bug (or future `modelId` param without a check — Trap 5) lets Free call `claude/kimi`, the DB won't stop it, and Finance can't attribute cost per model. MAYA-107 covers the missing picker UI; this is the DB-enforcement + audit gap underneath it.

---

## 2. Code Reference
- [`supabase/migrations/20260910000001_init_schema.sql:52-69`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L52-L69): `conversations` + `messages` — no `model_id`.
- [`supabase/migrations/20260910000001_init_schema.sql:114-119`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L114-L119): `usage_events` — no `model_id`.
- [`supabase/migrations/20260910000001_init_schema.sql:97-101`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L97-L101): `plan_models` composite PK (never referenced on write).
- [`supabase/migrations/20260910061406_chat_agent_prompt.sql:18-22`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910061406_chat_agent_prompt.sql#L18-L22): no plan/model check.
- [`apps/web/lib/openrouter/catalog.ts:16-80`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/openrouter/catalog.ts#L16-L80): TS alias→gateway map ("keep in sync with migration" — drift-prone, no DB FK).

---

## 3. Steps to Reproduce
1. As Free user, hand-craft `POST /api/chat` after a future `modelId` is added (or patch `loadPlanModel` in staging to return `claude` gateway).
2. Observe stream succeeds on a Pro-only model; `usage_events` row has no `model_id`; no `plan_models` join rejects it.
3. Try `SELECT cost_per_model` — impossible, column doesn't exist.

---

## 4. Expected Behavior
- Every consumed turn records `model_id FK → models`. Illegal (plan,model) pairs are rejected at the DB or RPC layer, not just in TS. Cost-per-model is queryable.

---

## 5. Actual Behavior
- Model choice is app-convention only; DB is model-blind; allowlist is advisory.

---

## 6. Root Cause Analysis (RCA)
Catalog seeded `models/plans/plan_models` for reads, but the chat write path (`consume_chat_turn` + message inserts) was built quota-first without a model dimension. Enforcement deferred to PR4 picker without a DB backstop.

---

## 7. Proposed Solution & Code Fix
- Add `usage_events.model_id TEXT FK → models(id)` (and/or `conversations.model_id`), extend `consume_chat_turn(p_model_id)` to `CHECK EXISTS (plan_models where plan=current plan and model=p_model_id)`, return `forbidden_model` + allowlist on miss (pairs with MAYA-107's 403).
- Keep TS `catalog.ts` as display mirror only; DB is the gate.

---

## 8. Acceptance Criteria (AC)
- [ ] Every `chat_turn` row carries `model_id`.
- [ ] Free → `claude` is rejected with allowlist, even if app requests it.
- [ ] `SELECT model_id, count(*) FROM usage_events GROUP BY 1` works for cost review.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Incomplete planned work — same slice as MAYA-107 |
| **Status** | Backlog |
| **Engineering priority** | P1 as Web MVP remaining work, not a hotfix |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Observations are factually right: no `model_id` on `usage_events` / `messages` / `conversations`; `plan_models` is unread on the write path; `loadPlanModel` uses `plans.default_model_id`. Today that is the PR2/PR3 interim. `chatRequestSchema` has no `modelId`, so a hand-rolled payload cannot switch models.

**Do not** add `consume_chat_turn(p_model_id)` or `modelId` on the request without a `plan_models` check — Trap 5 (silent model upgrade). When PR4 ships the picker + `GET /api/models`, add `usage_events.model_id FK → models` and reject illegal pairs in the RPC or route (403 + allowlist). `catalog.ts` stays a display mirror.

Track with MAYA-107. Do not mix into the 111/112 security PR.
