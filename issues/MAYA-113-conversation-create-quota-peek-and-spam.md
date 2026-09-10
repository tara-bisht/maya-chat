# [MAYA-113] `POST /api/conversations` Quota Peek TOCTOU Plus Unbounded Empty-Row Spam

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-113 |
| **Issue Type** | 🐛 Bug / Concurrency & Abuse |
| **Status** | Todo |
| **Priority** | 🔴 P0 (Critical) |
| **Severity** | High (quota bypass vector, storage exhaustion) |
| **Component** | Backend (Conversations API) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Core Backend Pod |

---

## 1. Summary
`POST /api/chat` is atomic since MAYA-102 (`rpc consume_chat_turn` before `streamText`). `POST /api/conversations` is not: it does a non-atomic `countTurnsToday()` + `isDailyCapReached()` peek in Node, then unconditionally inserts a `title=""` row without consuming quota. Parallel creates both pass the peek (classic TOCTOU). Worse, creation never consumes, and `GET` filters empties only after fetch — so an attacker (or buggy retry loop) can spam unlimited empty rows without ever hitting 429. MAYA-105 fixed empty-thread *display*; this is the *creation-path* quota + abuse hole underneath it.

---

## 2. Code Reference
- [`apps/web/app/api/conversations/route.ts:52-65`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/conversations/route.ts#L52-L65):
  ```ts
  const used = await countTurnsToday(supabase, user.id);
  if (isDailyCapReached(planLoad.dailyLimit, used)) {
    return chatError("quota", 429);
  }
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, agent_id: loaded.agent.id, title: "" })
  ```
- [`apps/web/app/api/conversations/route.ts:109-111`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/conversations/route.ts#L109-L111): filters `messageCount == 0` in JS after unbounded fetch.
- [`apps/web/app/api/chat/route.ts:88-94`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L88-L94): atomic path (contrast).
- [`docs/implementation-plan.md:173`](file:///Users/kamalbisht/Documents/maya-chat/docs/implementation-plan.md#L173): Trap 3 mandates transaction/advisory lock before `streamText` — creation path ignored it.

---

## 3. Steps to Reproduce
1. At 49/50 turns, fire 10 parallel `POST /api/conversations {agentId}`:
   ```bash
   for i in {1..10}; do curl -X POST http://localhost:3000/api/conversations -H "Cookie: <sess>" -H "Content-Type: application/json" -d '{"agentId":"..."}' & done
   ```
2. Observe all 10 return `{id}` despite 1 turn remaining.
3. With 0 turns remaining, loop 1k creates with no chat send — all succeed, `conversations` fills with `title=""` zero-message rows.

---

## 4. Expected Behavior
- Creation at/over cap returns 429 without inserting. No number of parallel creates can mint rows beyond allowance. Empty-row spam without a subsequent chat turn is bounded (rate-limited or lazy-created).

---

## 5. Actual Behavior
- Peek-then-insert races; quota never consumed on create; storage grows unbounded; `GET` pays O(threads) to filter ghosts in JS.

---

## 6. Root Cause Analysis (RCA)
Two writers, two quota models: chat uses server-atomic consume; create uses client-side count peek with I/O gap and no consume. `lib/chat/persist.ts` midnight (`setUTCHours`) vs RPC `date_trunc('day', utc)` adds a second source of truth that will drift.

---

## 7. Proposed Solution & Code Fix
Pick one (do not do all three):
- **A:** Gate create with the same `rpc("consume_chat_turn")` — but that burns a chat turn per create; only if create==turn.
- **B (preferred short-term):** Per-user creation rate limit (e.g. max N creates/hour, advisory lock) + keep chat-turn consume as the real gate; delete `countTurnsToday` peek or mark observability-only.
- **C (later API cleanup):** Lazy-create inside `POST /api/chat` (optional `conversationId`), return new id in stream metadata — do NOT do as hotfix (contract change, per MAYA-105 note).

Also: exclude empties server-side (`WHERE EXISTS messages`) once spam is capped; unify midnight to DB `date_trunc`.

---

## 8. Acceptance Criteria (AC)
- [ ] 10 parallel creates at boundary do not all succeed.
- [ ] Over-cap create returns 429 with no row inserted.
- [ ] 1k-create spam loop is throttled / bounded.
- [ ] Single source of day-window truth (DB).

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid abuse / spam hole — not a chat-quota bypass |
| **Status** | Todo |
| **Engineering priority** | P1 (QA P0 overstates OpenRouter leak) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Confirmed: `POST /api/conversations` peeks `countTurnsToday` in Node then inserts `title=""`. Parallel creates at the boundary all pass. Creation never consumes. Direct Data API `INSERT` on `conversations` is the same hole. Chat turns are still gated by `consume_chat_turn` — this does **not** extra-hit OpenRouter.

QA’s Option A (consume on create) burns a chat turn for opening a thread. Option C (lazy-create in `/api/chat`) was rejected on MAYA-105.

**Do this:**

- Do **not** call `consume_chat_turn` on create.
- Do **not** lazy-create inside `POST /api/chat`.
- `BEFORE INSERT` trigger on `conversations` with `pg_advisory_xact_lock(hashtext(uid))`; if the user already has **5** rows with `NOT EXISTS` messages, `raise exception`. Trigger covers the route and the Data API.
- Drop the `countTurnsToday` peek once the cap exists (it does not stop under-cap spam; JS UTC midnight vs RPC `date_trunc` will drift).
- Map the exception to existing `chatError("dropped" | "invalid")`. Do not add a new `ChatErrorCode` for this.
- GET JS filter of zeros stays (MAYA-105). Unbounded fetch is MAYA-110.

Can share a grants/trigger migration with 112.
