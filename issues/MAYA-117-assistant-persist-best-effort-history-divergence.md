# [MAYA-117] Assistant Persist Is Best-Effort Swallow: Stream/DB Divergence, No Error Part, Abort Orphans

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-117 |
| **Issue Type** | 🐛 Bug / Reliability |
| **Status** | Backlog |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (lost replies, ghost user msgs) |
| **Component** | Backend (Chat Streaming) & Client (House View) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
`onEnd` wraps `insertAssistantMessage` in an empty `catch` ("Stream already reached client") and `onError` is only `console.error`. Client sees the reply, DB doesn't — refresh loses it. Client disconnect mid-stream still consumed quota (by design, Trap 8) but leaves a user message with no assistant row. `parsed.data.message.id` is received but never used as a DB idempotency key, so retries double-insert. PR5 explicitly requires error stream parts — not present.

---

## 2. Code Reference
- [`apps/web/app/api/chat/route.ts:134-148`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L134-L148):
  ```ts
  onError: ({ error }) => { console.error("[streamText error]", error); },
  onEnd: async ({ text, usage }) => {
    try { await insertAssistantMessage(...); }
    catch { // Stream already reached the client. }
  },
  ```
- [`apps/web/app/api/chat/route.ts:96-99`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L96-L99): `insertUserMessage` before `streamText` — abort orphans it.
- [`apps/web/app/api/chat/route.ts:114`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L114): `parsed.data.message.id` unused as idempotency key.
- [`docs/implementation-plan.md:141`](file:///Users/kamalbisht/Documents/maya-chat/docs/implementation-plan.md#L141): PR5 "error stream parts" (missing).

---

## 3. Steps to Reproduce
1. Start a turn, kill `messages` INSERT on `onEnd` (staging revoke) — stream completes in UI.
2. Refresh — user message present, assistant reply gone.
3. Start a turn, close tab mid-stream — reopen thread: user message with no reply, quota -1, no retry affordance.

---

## 4. Expected Behavior
- Persist failure surfaces as a typed error part in-stream; client can retry/reconcile. Aborted turns show "line dropped / Try again" (existing `dropped-notice`) with no ghost state. Retried sends are idempotent on `message.id`.

---

## 5. Actual Behavior
- Silent divergence: what you see ≠ what's stored. Support ticket generator ("refresh shows my message with no reply").

---

## 6. Root Cause Analysis (RCA)
Fire-and-forget `onEnd`/`onError` with `console`-only observability and no dead-letter/reconcile. No `abortSignal` handling, no idempotency constraint.

---

## 7. Proposed Solution & Code Fix
- Emit error stream parts on persist failure (PR5 item); log via `logDropped` + Sentry (see MAYA-122).
- Client reconcile: on mount, threads ending in orphan user message show retry.
- Use client `message.id` as idempotency key (`UNIQUE` on `messages(client_msg_id)` or dedupe table); handle `abortSignal` to mark interrupted turns.

---

## 8. Acceptance Criteria (AC)
- [ ] `onEnd` persist failure is visible to client + logged, not swallowed.
- [ ] Abort mid-stream leaves a retryable state, not a silent orphan.
- [ ] Double-send with same `message.id` does not double-insert.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid reliability gap — full ACs are PR5 |
| **Status** | Backlog |
| **Engineering priority** | P1 as PR5 harden, not a hotfix |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Confirmed. `onEnd` swallows `insertAssistantMessage` failures; `onError` is `console.error` only; client `message.id` is unused as an idempotency key; disconnect after user-row insert leaves an orphan (quota already consumed — Trap 8). Refresh then shows a user line with no reply. PR5 explicitly lists error stream parts.

**Do not** add `UNIQUE (client_msg_id)`, abort-retry UI, or `abortSignal` handling in the 111–114 slice. Those ACs ship with PR5 (error parts + Sentry).

Cheap hitch on MAYA-114: replace the empty `catch` with `logDropped` so persist failure is at least in Vercel logs. That does not close this ticket.
