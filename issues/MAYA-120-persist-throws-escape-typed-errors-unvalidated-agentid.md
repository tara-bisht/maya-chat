# [MAYA-120] Persist Throws Escape Typed-Error Contract; `agentId` Query Param Unvalidated; Field Errors Lost

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-120 |
| **Issue Type** | 🐛 Bug / API Contract & Validation |
| **Status** | Todo |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (500 HTML vs typed errors, DB hit on garbage, undebuggable clients) |
| **Component** | Backend (Chat/Conversations API) & `@maya/shared` |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Core Backend Pod |

---

## 1. Summary
Three contract breaks share one theme — validation doesn't reach the client intact: (1) `lib/chat/persist.ts` `throw`s escape the typed `chatError(code,status)` envelope into generic 500 HTML; (2) `GET /api/conversations?agentId=` checks only truthiness then hits the DB (no `isUuid` guard, unlike `loadHouse`), so garbage returns `dropped:500` not `invalid:400`; (3) `chat.ts` schemas return bare `{ok:false}` while `profile.ts` returns `fieldErrors`, and `userMessageSchema` silently drops non-text parts — clients can't distinguish bad-UUID vs empty-text vs oversize vs truncated-multimodal.

---

## 2. Code Reference
- [`apps/web/lib/chat/persist.ts:22,40,60,79`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/persist.ts#L22-L79): `throw new Error("Could not …")`.
- [`apps/web/app/api/chat/route.ts:96-104`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L96-L104): awaits throws with no try/catch → unhandled → 500 HTML, not [`lib/chat/errors.ts:11-13`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/errors.ts#L11-L13).
- [`apps/web/app/api/conversations/route.ts:52`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/conversations/route.ts#L52): `countTurnsToday` throw also uncaught.
- [`apps/web/app/api/conversations/route.ts:80-83`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/conversations/route.ts#L80-L83): `if (!agentId) invalid` only; no UUID check → `loadChatAgent` DB hit (contrast [`lib/house/load.ts:58-63`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/house/load.ts#L58-L63) `isUuid` guard).
- [`packages/shared/src/chat.ts:50-52,77-85`](file:///Users/kamalbisht/Documents/maya-chat/packages/shared/src/chat.ts#L50-L85): bare `{ok:false}`; `parts: z.array(z.unknown())` then `textFromUserParts:54-63` drops non-text silently. Contrast [`packages/shared/src/profile.ts:41-64`](file:///Users/kamalbisht/Documents/maya-chat/packages/shared/src/profile.ts#L41-L64) `fieldErrors`.
- [`apps/web/components/house/house-view.tsx:106-110`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/components/house/house-view.tsx#L106-L110): `errorText.includes("quota") || includes("429")` string-sniff vs typed `payload.error` (`:88` does it right).

---

## 3. Steps to Reproduce
1. Force `insertUserMessage` throw (staging) → observe 500 HTML, not `{"error":"dropped"}`.
2. `GET /api/conversations?agentId=not-a-uuid` → observe `dropped:500` + DB roundtrip instead of `invalid:400`.
3. `POST /api/chat` with `{message:{parts:[{type:"image",...}]}}` → observe 200 with image silently ignored, no field error.

---

## 4. Expected Behavior
- All persist failures → `chatError("dropped",500)`. All bad UUIDs → `invalid:400` pre-DB. All schema failures → `fieldErrors` distinguishing reason. Client branches on `ChatErrorCode` union end-to-end, never substring-sniffs.

---

## 5. Actual Behavior
- Mixed 500 HTML / `dropped` / silent truncation. Client cannot tell user error from infra error.

---

## 6. Root Cause Analysis (RCA)
`load-context.ts:20-23` established the `Result`-union pattern; `persist.ts` predates it and still throws. Query-param validation was added as truthiness-only; shared chat schemas never adopted `profile.ts`'s `fieldErrors` shape.

---

## 7. Proposed Solution & Code Fix
- `persist.ts`: return `Result` unions, map to `dropped` at call sites (pairs with MAYA-114).
- `GET`: `parseConversationCreate`-style UUID check + `invalid:400` before `loadChatAgent`.
- `shared/chat.ts`: return `fieldErrors` like `profile.ts`; reject or explicitly flag non-text parts instead of silent drop; surface `USER_MESSAGE_MAX 8000` / `CONVERSATION_TITLE_MAX 48` violations.
- `house-view.tsx`: branch on typed `payload.error: ChatErrorCode`.

---

## 8. Acceptance Criteria (AC)
- [ ] No `throw` crosses an API route boundary; every failure is typed `chatError`.
- [ ] Garbage `agentId` returns `invalid:400` with zero DB reads.
- [ ] Schema failures return field-level reasons; multimodal truncation is explicit.
- [ ] Route + loader tests cover invalid-UUID / oversize / non-text matrix.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid contract bugs — scoped; do not redesign schemas |
| **Status** | Todo |
| **Engineering priority** | P1 (unchanged) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Three items, not one design.

1. **Persist throws** — confirmed. Same as MAYA-114. Result unions; no `throw` across the route. Ship together.
2. **GET `agentId`** — confirmed. POST uses `parseConversationCreate` (UUID). GET only checks truthiness, then `loadChatAgent` hits PostgREST with a non-uuid → `dropped:500`. `isUuid(agentId)` else `invalid:400` before the DB. One-liner.
3. **`fieldErrors` / non-text parts** — reject for this slice. House is text-only; silent drop of non-text parts is MVP. Keep `parseChatRequest` `{ ok: false }` → `invalid:400`. Do not reshape chat schemas to match `profile.ts`.
4. **`house-view.tsx` string sniff** — P3. Typed `payload.error` is optional if the file is already open.

AC for this ticket: typed `dropped` on persist failure; garbage `agentId` is `invalid:400` with no DB read. Multimodal field errors are out of scope.
