# [MAYA-121] Agents DELETE Dead, Signup Not Idempotent, Missing CHECK/UNIQUE Guards, Category Escalation Surface

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-121 |
| **Issue Type** | 🗄️ Database Hardening Bundle |
| **Status** | Backlog |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (dead delete, signup fragility, negative-price/quota inversion, dup slugs) |
| **Component** | Database (Migrations / Constraints / Triggers) |
| **Affects Versions** | Web MVP, Studio, Signup |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Database Pod |

---

## 1. Summary
Five hardening gaps share one migration bundle: (1) `agents` DELETE policy + grant were dropped and never restored — authenticated DELETE always fails; (2) `handle_new_user` plain-INSERTs `profiles` + `entitlements`, so any retry/replay or missing `plans/free` row aborts signup; (3) no `CHECK >= 0` on `tokens_used`/prices/limits (negative limit = total lockout) and no `UNIQUE` on `gateway_id`/Stripe ids (double-mapped prices); (4) `agents` UPDATE policy + grants are the only bar stopping `custom → philosophy` category escalation; (5) orphan custom (`is_curated=false AND user_id NULL`) permitted by CHECK, plus migration duplication (`00002` dup, studio re-apply 90%, seed-order dependency).

---

## 2. Code Reference
- [`supabase/migrations/20260910054442_studio_custom_agents.sql:88-91`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910054442_studio_custom_agents.sql#L88-L91) + [`20260910061706_studio_quota_and_free_caps.sql:16-19`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910061706_studio_quota_and_free_caps.sql#L16-L19): `DROP POLICY ... delete` with no replacement (orig `init:225-229,384` proves intent).
- [`supabase/migrations/20260910054442_studio_custom_agents.sql:125-172`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910054442_studio_custom_agents.sql#L125-L172): `REVOKE` then `GRANT SELECT/INSERT/UPDATE` only — no DELETE.
- [`supabase/migrations/20260910000001_init_schema.sql:482-512`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L482-L512) + [`20260910054136_profile_settings.sql:36-76`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910054136_profile_settings.sql#L36-L76): `handle_new_user` plain INSERTs.
- [`supabase/migrations/20260910000001_init_schema.sql:67,83-90`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L67-L90): `tokens_used`, `monthly_price_cents`, `daily_message_limit`, `max_custom_agents` — no non-negative CHECK.
- [`supabase/migrations/20260910000001_init_schema.sql:72,86-87,108-109`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L72-L109): `gateway_id`, `stripe_price_id_*`, `stripe_customer/subscription_id` — no UNIQUE.
- [`supabase/migrations/20260910054442_studio_custom_agents.sql:107-119`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910054442_studio_custom_agents.sql#L107-L119): INSERT forces `category='custom'`, UPDATE only checks owner+not-curated (grant-exclusion is the only guard).
- [`supabase/migrations/20260910000001_init_schema.sql:36-39`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L36-L39): `agents_curated_owner_chk` allows orphan custom.
- [`supabase/migrations/20260910000002_catalog_fk_indexes.sql:1-2`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000002_catalog_fk_indexes.sql#L1-L2) dups `init:136-138`; `studio_quota` re-applies 90% of `studio_custom`; [`supabase/seed.sql:14`](file:///Users/kamalbisht/Documents/maya-chat/supabase/seed.sql#L14) requires `costume_id` from `studio_custom:8` (order-dependent).

---

## 3. Steps to Reproduce
1. As owner: `DELETE FROM agents WHERE id=<own-custom>` → `42501` / RLS deny (dead delete).
2. Insert `profiles` row then replay signup trigger (or delete `plans/free` then sign up) → PK/FK conflict aborts signup txn.
3. As service_role: `UPDATE plans SET daily_message_limit=-1` / insert dup `gateway_id 'x-ai/grok-4.20'` → both succeed; Free now hard-locked / model routing ambiguous.
4. As owner: if a future migration blanket-grants UPDATE, `UPDATE agents SET category='philosophy'` succeeds (policy allows).

---

## 4. Expected Behavior
- Delete works for own customs OR archive-only is documented + dead test removed. Signup retries are idempotent; catalog-missing fails loudly with alert, not silent user lockout. Prices/limits/tokens non-negative, slugs/prices unique, category immutable post-insert, no orphans, one canonical grant migration.

---

## 5. Actual Behavior
- Dead delete, fragile signup, invertible quotas, duplicable gateway/Stripe ids, grant-only category guard, migrational drift surface.

---

## 6. Root Cause Analysis (RCA)
Studio quota migration was copy-pasted (drop-all + re-grant) and the DELETE leg was cut for soft-delete (`archived_at`) without updating the original intent or tests. Signup trigger predates idempotency review. Constraint pass (`CHECK`/`UNIQUE`) was scoped to `profiles` (80/500 caps) and never extended to catalog/counters.

---

## 7. Proposed Solution & Code Fix
- Decide delete vs archive: re-add `DELETE own + GRANT DELETE` OR document archive-only + drop dead expectation.
- `handle_new_user`: `ON CONFLICT DO NOTHING` + FK-guard alert on missing `plans/free`.
- Add `CHECK (col >= 0)` on tokens/prices/limits; `UNIQUE` on `gateway_id`, `stripe_price_id_*` (partial where NULL), `stripe_customer/subscription_id`.
- Harden UPDATE policy `WITH CHECK (category='custom' AND user_id=auth.uid() AND NOT is_curated)`; tighten CHECK to `((curated AND user NULL) OR (NOT curated AND user NOT NULL))`.
- Squash `00002` dup + studio re-apply into one canonical `agents` grant migration; pin seed order / make seed column-tolerant; guard costume backfill `WHERE ... IS DISTINCT FROM`.

---

## 8. Acceptance Criteria (AC)
- [ ] Own-custom DELETE either works or is explicitly archive-only (tested).
- [ ] Signup replay never aborts on PK; missing catalog alerts.
- [ ] Negative/duplicate catalog writes rejected at DB.
- [ ] Category flip rejected at policy even with broad grants; no orphan customs insertable.
- [ ] `pgTAP` covers delete/signup/negative/unique/category matrix.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Mixed bundle — dead DELETE is working as designed |
| **Status** | Backlog |
| **Engineering priority** | P2 (schema hardening, not a user-facing defect) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Five items in one ticket. Split:

1. **Dead DELETE** — **not a bug.** CONTEXT Archive: “Soft-removal (`archived_at`). Avoid: Hard delete.” Studio `archiveCustomAgent` updates `archived_at`; there is no product DELETE. Init policy was dropped when Studio switched to archive. Do **not** restore `DELETE` + `GRANT DELETE`.
2. **`handle_new_user` not idempotent** — valid hardening. Auth trigger fires once per user insert; replay/half-row is rare. `ON CONFLICT DO NOTHING` + loud fail if `plans/free` is missing is fine later.
3. **`CHECK >= 0` / `UNIQUE gateway_id` / Stripe ids** — valid catalog guards. Service-role only today. Later hardening migration.
4. **Category escalation** — INSERT already forces `category='custom'`; UPDATE column grants omit `category`. Policy `WITH CHECK (category = 'custom' AND …)` is cheap insurance against a future blanket grant. Later.
5. **Orphan CHECK / migration dup** — INSERT policy already requires `user_id is not null` and not curated. Do **not** squash already-applied `00002` or studio re-apply.

Do not mix this bundle into the 111/112 security PR. Later hardening migration: signup `ON CONFLICT`, non-negative CHECKs, `UNIQUE (gateway_id)`, UPDATE `WITH CHECK (category = 'custom')`. Archive-only stays documented.
