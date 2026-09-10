# [MAYA-115] Dual Plan Truth: `profiles.plan` vs `entitlements.plan` Drift With No Sync

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-115 |
| **Issue Type** | 🏗️ Architecture / Data Integrity |
| **Status** | Backlog |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (entitlement drift, billing disputes) |
| **Component** | Database (Catalog / Entitlements) |
| **Affects Versions** | Web MVP, Stripe PR4 |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Database Pod |

---

## 1. Summary
Two columns both claim to be "the user's plan" with no sync: `profiles.plan TEXT CHECK (free/plus/pro)` (not an FK) and `entitlements.plan FK → plans(id)` (canonical). `handle_new_user` writes `'free'` to both, but later upgrades only touch `entitlements`. Any reader choosing the wrong column (UI, Studio caps, support tooling) shows a stale seat. The future Stripe webhook must update two places atomically — drift guaranteed.

---

## 2. Code Reference
- [`supabase/migrations/20260910000001_init_schema.sql:14`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L14): `profiles.plan TEXT CHECK ...` — not `FK → plans(id)`.
- [`supabase/migrations/20260910000001_init_schema.sql:105`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L105): `entitlements.plan FK → plans(id)` — canonical.
- [`supabase/migrations/20260910054136_profile_settings.sql:32-34`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910054136_profile_settings.sql#L32-L34): correctly blocks auth writes to `plan`, but service_role/webhook still has two targets.
- [`supabase/migrations/20260910000001_init_schema.sql:489-502`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L489-L502): `handle_new_user` dual-write `'free'`.
- [`packages/database/src/types.ts:343-372`](file:///Users/kamalbisht/Documents/maya-chat/packages/database/src/types.ts#L343-L372): `profiles.plan: string|null` (untyped vs FK).

---

## 3. Steps to Reproduce
1. Sign up (both columns `free`).
2. As service_role, simulate webhook: `update entitlements set plan='pro' where user_id=...`.
3. Read `profiles.plan` — still `free`. Any `select plan from profiles` consumer now lies.

---

## 4. Expected Behavior
- One canonical plan source (`entitlements.plan`). All reads join/derive; no second writable copy.

---

## 5. Actual Behavior
- Two writable copies, one FK-backed, one free-text, no trigger/view keeping them in sync.

---

## 6. Root Cause Analysis (RCA)
`profiles.plan` started as a Stripe cache convenience without an FK or mirror trigger. RLS hardening blocked client writes (good) but left the dual-write contract for the webhook (bad).

---

## 7. Proposed Solution & Code Fix
- **Preferred:** drop `profiles.plan` (migration), replace readers with `entitlements JOIN plans` or a `profile_seats` view.
- **Fallback:** add `FK profiles.plan → plans(id)` + definer trigger mirroring `entitlements.plan` on change, backfill existing drift.

---

## 8. Acceptance Criteria (AC)
- [ ] Exactly one writable plan column (`entitlements.plan`).
- [ ] No `SELECT plan FROM profiles` reader in app code.
- [ ] Webhook updates one place; seat reads never drift.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid dual-write — not a current reader bug |
| **Status** | Backlog |
| **Engineering priority** | P1 as PR4 webhook work, not a hotfix |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Two columns exist: `profiles.plan` (CHECK, not FK) and `entitlements.plan` (FK → `plans`). `handle_new_user` dual-writes `'free'`. CONTEXT: chat authorization reads `entitlements`. App loaders already select `entitlements.plan` (House, gallery, Studio, settings, `loadChatAgent`) — no `SELECT plan FROM profiles` in product code. Stripe webhook is not written yet, so there is no live upgrade drift.

**Do not** add a mirror trigger. When PR4 lands, webhook writes **only** `entitlements`; drop `profiles.plan` in that same PR (or immediately after). Fallback FK + trigger is extra surface if the column is going away.
