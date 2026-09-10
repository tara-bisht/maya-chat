# [MAYA-114] Quota Burned Before User-Message Persist, No Compensation on DB Failure

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-114 |
| **Issue Type** | 🐛 Bug / Billing Correctness |
| **Status** | Todo |
| **Priority** | 🔴 P0 (Critical) |
| **Severity** | High (user charged, no stream, maybe no message) |
| **Component** | Backend (Chat Route / Persistence) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Core Backend Pod |

---

## 1. Summary
`POST /api/chat` consumes quota at `:88` *before* `insertUserMessage :96` and `retitleConversation :100`, both of which `throw` on error with no try/catch. If either throws after consume, the user is charged a turn, gets a generic 500 (not the typed `chatError` envelope), and may have no user message saved. Trap 8 says aborted *gateway* streams count — failed *writes* should not burn.

---

## 2. Code Reference
- [`apps/web/app/api/chat/route.ts:88-104`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L88-L104):
  ```ts
  const quota = await supabase.rpc("consume_chat_turn");
  if (quota.error) return chatError("dropped", 500);
  if (quota.data !== true) return chatError("quota", 429);
  await insertUserMessage(supabase, {...});   // throws "Could not ..."
  await retitleConversation(supabase, {...}); // throws "Could not name the night."
  ```
- [`apps/web/lib/chat/persist.ts:22,40,60`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/persist.ts#L22-L60): `throw new Error(...)` on insert/retitle failure.
- [`apps/web/lib/chat/errors.ts:11-13`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/errors.ts#L11-L13): typed `chatError(code,status)` contract (violated by uncaught throw → 500 HTML).

---

## 3. Steps to Reproduce
1. Stub `messages` INSERT to fail (RLS revoke in staging, or kill DB between consume and insert).
2. Send one chat turn as a Free user at 49/50.
3. Observe: 500 (non-typed), `usage_events` +1, `messages` +0. Retry costs a second turn.

---

## 4. Expected Behavior
- Failed writes before gateway hit do not burn quota, or burn is refunded. Client always gets typed `{error: code}`. `retitle` failure never fails the turn.

---

## 5. Actual Behavior
- Quota consumed, throw escapes to generic 500, message maybe missing. User pays for a DB error.

---

## 6. Root Cause Analysis (RCA)
Ordering (consume → insert → stream) is right for gateway-abort accounting, but wrong for pre-gateway write failures, and there is no compensation path (`refund` RPC) nor `Result`-union error mapping.

---

## 7. Proposed Solution & Code Fix
- Make `retitleConversation` non-fatal (log + continue via `logDropped`).
- Return `Result` unions from `persist.ts` instead of throws; map to `dropped:500`.
- Long-term: insert-first-then-consume in one txn, or `refund_chat_turn()` compensation on pre-stream failure. Keep post-gateway aborts counted per Trap 8.

---

## 8. Acceptance Criteria (AC)
- [ ] Insert failure before stream does not permanently burn a turn (or refunds).
- [ ] Retitle failure never 500s the turn.
- [ ] All persist failures return typed `chatError("dropped",500)`, never HTML 500.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid bug |
| **Status** | Todo |
| **Engineering priority** | P1 (rare persist failure, not a race) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Confirmed. Route consumes at `:88`, then `insertUserMessage` / `retitleConversation` throw with no catch → generic 500, turn burned, maybe no user row. Trap 8 is about **gateway** aborts counting; pre-gateway write failures should not.

**Do this:**

- `retitleConversation`: log + return, never throw / never fail the turn.
- `insertUserMessage` / `insertAssistantMessage` / `countTurnsToday`: Result unions (`{ ok: true } | { ok: false }`), no `throw` across the route boundary (also MAYA-120).
- Order: **insert user message → `consume_chat_turn` → `streamText`**. Insert fail → no burn, `chatError("dropped", 500)`. Consume fail → 429 (orphan user row is acceptable vs burning quota). After the gateway starts, Trap 8 — no refund.
- Do **not** add `refund_chat_turn()`.

Ship persist Result + retitle with MAYA-120. Empty `catch` on assistant `onEnd` can gain `logDropped` here; the rest of MAYA-117 stays PR5.
