# [MAYA-112] Direct `usage_events` INSERT Bypasses Atomic Quota API, Allows Forgery and Flooding

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-112 |
| **Issue Type** | 🔴 Security / Quota Integrity |
| **Status** | Todo |
| **Priority** | 🔴 P0 (Critical) |
| **Severity** | Critical (quota bypass, analytics poisoning, storage DoS) |
| **Component** | Database (RLS / Grants on `usage_events`) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Core Backend Pod |

---

## 1. Summary
`POST /api/chat` correctly enforces quota via atomic `rpc("consume_chat_turn")` (MAYA-102 fix). But the legacy direct-write path on `public.usage_events` is still live: any authenticated user holds `GRANT SELECT, INSERT` with a permissive `WITH CHECK (user_id = auth.uid())`. An attacker can insert rows with arbitrary `created_at` (past/future, no CHECK) to pollute the `COUNT(*) WHERE created_at >= today` window the RPC reads, or spam the table at will (no rate limit). Self-DoS at minimum; quota analytics untrusted.

---

## 2. Code Reference
- [`supabase/migrations/20260910000001_init_schema.sql:371-375`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L371-L375): `Users insert own usage WITH CHECK (uid = user_id)` still live after `consume_chat_turn` migration.
- [`supabase/migrations/20260910000001_init_schema.sql:392`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L392): `GRANT SELECT, INSERT ON usage_events TO authenticated`.
- [`supabase/migrations/20260910180000_consume_chat_turn.sql:41-46`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910180000_consume_chat_turn.sql#L41-L46): `COUNT(*) ... WHERE created_at >= date_trunc('day', utc now)` — trusts `created_at`.
- [`apps/web/app/api/chat/route.ts:88-94`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L88-L94): atomic consumer (correct path).

---

## 3. Steps to Reproduce
1. Sign in, open DevTools, get user JWT session.
2. Insert backdated + future rows:
   ```sql
   insert into public.usage_events (user_id, event_type, created_at)
   values (auth.uid(), 'chat_turn', now() - interval '1 hour');
   insert into public.usage_events (user_id, event_type, created_at)
   values (auth.uid(), 'chat_turn', now() + interval '1 day');
   ```
3. Observe both succeed; daily COUNT now includes attacker-chosen timestamps.
4. Loop 10k inserts — no throttle, table grows unbounded for own partition.

---

## 4. Expected Behavior
- Only `consume_chat_turn()` (definer, advisory-locked, server-timestamped) can mint `chat_turn` rows. Direct client INSERT is denied. `created_at` is server-defaulted, never client-supplied.

---

## 5. Actual Behavior
- Client can mint arbitrary quota rows with arbitrary timestamps, poisoning the exact window the atomic check reads.

---

## 6. Root Cause Analysis (RCA)
MAYA-102 added the atomic function but never revoked the pre-atomic grant. Two writers (RPC + direct INSERT) share one table with no `CHECK (created_at <= now() + grace)` and no column-grant restriction, so the legacy path undermines the atomic path.

---

## 7. Proposed Solution & Code Fix
```sql
revoke insert on table public.usage_events from authenticated;
-- keep SELECT own for transparency; writes only via consume_chat_turn()
```
Alternative if direct INSERT must stay: column grants excluding `created_at` + `CHECK (created_at IS NULL OR created_at <= now() + interval '5 minutes')`, plus per-user rate guard. Preferred is revoke.

---

## 8. Acceptance Criteria (AC)
- [ ] Authenticated `INSERT INTO usage_events` returns `42501` / RLS deny.
- [ ] `rpc("consume_chat_turn")` still mints exactly one row per allowed turn with server timestamp.
- [ ] Backdated/future `created_at` can no longer shift daily COUNT.
- [ ] pgTAP test asserts revoke + RPC-only write.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid security bug |
| **Status** | Todo |
| **Engineering priority** | P0 (unchanged) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Confirmed. MAYA-102 added `consume_chat_turn()` but left `GRANT SELECT, INSERT ON usage_events TO authenticated` and `WITH CHECK (user_id = auth.uid())`. The atomic path counts `created_at >= today`; a client INSERT with a chosen timestamp poisons that window, and unthrottled inserts are a self-DoS. Two writers, one table.

**Do this:** `revoke insert on table public.usage_events from authenticated`. Keep `SELECT` own. Writes only via the definer RPC (server-default `created_at`). Do **not** add a `created_at` CHECK as the primary fix. Do not leave a second writer.

Ship with MAYA-111 if the migration PR is shared; they are independent grants.
