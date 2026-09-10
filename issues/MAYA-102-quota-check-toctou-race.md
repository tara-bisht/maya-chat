# [MAYA-102] Daily Message Quota Check Has TOCTOU Race Condition

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-102 |
| **Issue Type** | 🐛 Bug / Concurrency & Security |
| **Status** | Done |
| **Priority** | 🔴 P0 (Critical) |
| **Severity** | High (Revenue Leakage & Cost Risk) |
| **Component** | Backend (API Chat Rate Limiting) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Core Backend Pod |

---

## 1. Summary
A Time-of-Check to Time-of-Use (TOCTOU) race condition exists in `POST /api/chat`. The server counts today's turns via `countTurnsToday`, evaluates whether the quota is reached in Node.js, and only after passing the check does it asynchronously insert the usage event via `insertUsageEvent`.

Because there is no database transaction, advisory lock, or atomic decrement, concurrent HTTP requests dispatched in parallel (e.g., automated scripts or fast duplicate client clicks) bypass the daily plan limits (50 on Free, 200 on Plus).

*Note: This failure mode was specifically flagged in [`docs/implementation-plan.md:172-174`](file:///Users/kamalbisht/Documents/maya-chat/docs/implementation-plan.md#L172-L174) as "Trap 3: Concurrent quota", but reintroduced in the implementation.*

---

## 2. Code Reference
- [`apps/web/app/api/chat/route.ts:74-92`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L74-L92):
  ```ts
  const used = await countTurnsToday(supabase, user.id);
  if (isDailyCapReached(planLoad.dailyLimit, used)) {
    return chatError("quota", 429);
  }

  // Conversation history loading happens here (network delay) ...

  await insertUsageEvent(supabase, user.id);
  ```
- [`apps/web/lib/chat/persist.ts:62-95`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/persist.ts#L62-L95):
  ```ts
  export async function countTurnsToday(supabase, userId) { ... }
  export async function insertUsageEvent(supabase, userId) { ... }
  ```

---

## 3. Steps to Reproduce
1. Log in with a Free account (limit = 50 messages/day).
2. Consume 49 turns so that 1 turn remains.
3. Using a script or curl, send 10 concurrent requests to `POST /api/chat` with valid payloads simultaneously:
   ```bash
   for i in {1..10}; do
     curl -X POST http://localhost:3000/api/chat \
       -H "Content-Type: application/json" \
       -H "Cookie: <session-cookie>" \
       -d '{"conversationId":"...","agentId":"...","message":{"id":"m'$i'","role":"user","parts":[{"type":"text","text":"hello"}]}}' &
   done
   ```
4. Observe the response codes and the resulting count in `public.usage_events`.

---

## 4. Expected Behavior
- Exactly 1 request succeeds (returning HTTP 200 with an SSE message stream).
- The other 9 requests fail immediately with HTTP 429 (`{"error": "quota"}`).
- The user cannot consume expensive LLM tokens beyond their allotted daily allowance.

---

## 5. Actual Behavior
- All 10 requests concurrently read `countTurnsToday = 49`.
- All 10 requests pass `isDailyCapReached(50, 49) === false`.
- All 10 requests invoke `streamText` and hit OpenRouter, generating LLM costs.
- The user successfully executes 59 turns on a 50-turn cap.

---

## 6. Root Cause Analysis (RCA)
Checking a count and subsequently inserting an event in separate, non-atomic roundtrips without synchronization primitives is inherently susceptible to race conditions. The window between `countTurnsToday` and `insertUsageEvent` is further widened by `loadConversationHistory` and database I/O.

---

## 7. Proposed Solution & Code Fix

Implement an atomic PostgreSQL function with an advisory transaction lock or an atomic quota-check-and-insert mechanism in a database migration:

```sql
create or replace function public.consume_chat_turn(p_user_id uuid, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_used integer;
  v_today timestamptz := date_trunc('day', now() at time zone 'utc');
begin
  -- Lock transaction for this user
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select count(*)::integer into v_used
  from public.usage_events
  where user_id = p_user_id
    and event_type = 'chat_turn'
    and created_at >= v_today;

  if p_limit is not null and v_used >= p_limit then
    return false; -- Quota exhausted
  end if;

  insert into public.usage_events (user_id, event_type)
  values (p_user_id, 'chat_turn');

  return true; -- Turn granted and stamped
end;
$$;
```

In `apps/web/app/api/chat/route.ts`:
```ts
const { data: allowed, error } = await supabase.rpc("consume_chat_turn", {
  p_user_id: user.id,
  p_limit: planLoad.dailyLimit,
});

if (error || !allowed) {
  return chatError("quota", 429);
}
```

---

## 8. Acceptance Criteria (AC)
- [ ] Concurrency test with 10 parallel requests at limit boundary permits only the remaining allowance through to OpenRouter. (Manual: `supabase/tests/consume_chat_turn.sql`; not in CI.)
- [x] No race conditions exist between counting turns and recording usage.
- [x] Quota check execution is a single atomic database operation.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid bug |
| **Status** | Done |
| **Engineering priority** | P0 (unchanged) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |
| **Shipped** | [#7](https://github.com/tara-bisht/maya-chat/pull/7) on `main` |

**Comment:** Confirmed. `POST /api/chat` calls `countTurnsToday`, then `loadConversationHistory`, then `insertUsageEvent`. Two round-trips with history I/O in between. Concurrent requests at the cap all read `used < limit` and all hit OpenRouter. This is Trap 3 in `docs/implementation-plan.md` (“count + insert `usage_events` in one transaction (or advisory lock) **before** `streamText`”). Studio custom-agent quota already serializes with `pg_catalog.pg_advisory_xact_lock`; chat quota does not.

Stamping usage *before* `streamText` is correct (Trap 8: aborted streams that already hit the gateway still count). The bug is that the check and the insert are not atomic. Pro (`daily_message_limit` null) is unaffected. Free 50 / Plus 200 can be overshot with a parallel burst — P0 for production cost is fair.

**Do not take QA’s RPC as written.** `consume_chat_turn(p_user_id, p_limit)` must not accept an arbitrary uid from `authenticated` (a caller could burn someone else’s day). Bind to `auth.uid()` for user JWTs; only `service_role` may pass an explicit user. Follow the Studio trigger lock pattern. Call the RPC before `streamText`. Include a concurrency test at the boundary.

Ship with MAYA-101.
