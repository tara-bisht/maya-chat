# PR #21 Review — muse (senior dev) — Action Required

**PR:** #21 `feat/pr4-credit-engine` → `main`
**Brief:** `docs/reviews/pr4a-credit-engine.md`
**Original verdict:** Request changes — 3 blockers. Core metering + allowlist are sound; fix below then ready to approve.
**Follow-up:** dispositions below. Full table in the brief §14.

| Item | Disposition |
| :--- | :--- |
| Required 1 — abort never settles | **Done** — `abortSignal` + `onAbort` + await `settleTurn` |
| Required 2 — revoke `models` SELECT | **Rejected** — would break user-JWT catalog reads; not Trap 5. Documented. |
| Required 3 — House voice not allowlisted | **Done** — `loadHouse` uses `resolveModelId` against `plan_models` |
| Suggested 4 — `sort_order` | **Done** |
| Suggested 5 — scale-read log | **Done** (log; still default scale) |
| Suggested 6 — `Promise.all` | **Done** |
| Suggested 7 — dead `isDailyCapReached` | **Done** |
| Suggested 8 — zero-cost edge | **Done** — `$0` → `min_turn_credits` |
| Suggested 9 — unparseable reserve | **Done** (log raw payload; no Sentry yet) |

---

## How to use this file

Each item is written as a GitHub-ready comment. File + line anchors match `feat/pr4-credit-engine` at `e7f740a`. Apply the **Required** section before merge. **Suggested** can land in this PR or as fast-follow with a ticket.

---

## Required 1 — Critical: client abort never settles (Trap 8 open)

**Status: Done.** `streamText` now gets `abortSignal: request.signal` and `onAbort` / `onError` await `settleTurn({ aborted: true })`. Staging still needs one cancelled turn to confirm `reserved → settled`.

**File:** `apps/web/app/api/chat/route.ts:257-278`

Current code handles `onError` + `onEnd` only, with no `abortSignal` passed to `streamText`:

```ts
const result = streamText({
  model: getOpenRouterModel(voice.gatewayId),
  maxOutputTokens: voice.maxOutputTokens,
  system,
  messages: await convertToModelMessages(nextMessages),
  onError: ({ error }) => {
    console.error("[streamText error]", error);
    void settleTurn({ text: "", aborted: true });
  },
  onEnd: async (event) => { /* ... settle ... */ },
});
```

Stop-button / navigate-away / network drop cancels the stream without firing `onEnd`/`onError` in AI SDK v7 (`ai@^7.0.97`). The full max-output reservation (e.g. ~550 credits for a Claude-sized estimate) stays in `reserved_credits` until UTC roll. Repeated aborts drain daily allowance with zero gateway cost — the exact leak Trap 8 was meant to close.

**Please change to:**

```ts
const result = streamText({
  model: getOpenRouterModel(voice.gatewayId),
  maxOutputTokens: voice.maxOutputTokens,
  system,
  messages: await convertToModelMessages(nextMessages),
  abortSignal: request.signal,
  onAbort: () => {
    void settleTurn({ text: "", aborted: true });
  },
  onError: ({ error }) => {
    console.error("[streamText error]", error);
    void settleTurn({ text: "", aborted: true });
  },
  onEnd: async (event) => { /* unchanged */ },
});
```

In-process `settled` flag already makes `onAbort`/`onError`/`onEnd` mutually exclusive, so this is safe to add. Please also confirm in staging with one client-cancelled turn that `usage_events` flips `reserved → settled` at the reserved amount.

---

## Required 2 — Important: `gateway_id` still readable via PostgREST

**Status: Rejected (documented).** Observation is true. Option A as written is unsafe: `default_model_id` is not a column on `models`, and `loadPlanModel` / `loadModelsPayload` read `gateway_id` and list rates with the user JWT — a revoke without moving those reads to service_role breaks chat. This is not Trap 5 (enforcement is the RPC). List prices are public on OpenRouter. `GET /api/models` still omits `gateway_id`. COGS (`openrouter_cost_usd`) stays column-hidden. See migration header + brief §9 Security / §14.

**Files:**
- `supabase/migrations/20260910000001_init_schema.sql:388`
- `supabase/migrations/20260911090000_ai_credits.sql` (no narrowing)

`GET /api/models` correctly omits `gateway_id`, but the base migration grants:

```sql
grant select on table public.models to authenticated;
```

This PR never narrows it. Any authenticated JWT can run `select gateway_id from models` through the Data API, which violates the "catalog alias only, never a gateway slug on the wire" contract (brief §7, Trap 5 context).

Same observation for `input_usd_per_million / output_usd_per_million` — these are founder list prices, not COGS (`openrouter_cost_usd` is correctly hidden), but the "dollars never in chrome/API" posture should explicitly bless or hide them.

**Please do one of:**

A. Narrow the grant (preferred, mirrors the `usage_events` pattern already in this migration):

```sql
revoke select on table public.models from authenticated;
grant select (
  id, display_name, provider, is_enabled, sort_order,
  min_turn_credits, max_output_tokens, default_model_id
) on table public.models to authenticated;
```

with a note on how server code that needs rates/gateway reads them (service-role client or a `security definer` RPC), since `loadPlanModel` (`apps/web/lib/chat/load-context.ts:155-160`) and `loadModelsPayload` (`apps/web/lib/credits/load.ts:54-60`) currently read those columns with the user JWT and will break under a narrowed grant. Or:

B. Document in the brief + migration header why direct Data API exposure of `gateway_id`/rates is accepted (e.g. "obscurity only, enforcement is in RPC"), so the next reviewer doesn't re-raise it.

A without the server-read fix will break chat; please don't land the revoke alone.

---

## Required 3 — Important: House `selectedModelId` not allowlisted, downgraded users brick

**Status: Done.** `loadHouse` fetches `plan_models` and runs `resolveModelId` with no `requested`, so a stale `claude` conversation/preference degrades to an allowed voice. Chrome no longer sends an illegal `modelId`. `POST /api/chat` still 403s an explicit illegal id (Trap 5).

**File:** `apps/web/lib/house/load.ts:181-190`

```ts
const selectedModelId =
  conversationModelId ??
  profileResult.data?.preferred_model_id ??
  defaultModelId;
```

No `allowed.has()` check, unlike `loadModelsPayload` (`apps/web/lib/credits/load.ts:122-130`) which walks conversation → preferred → default among allowed, and unlike `loadPlanModel` which 403s correctly per Trap 5.

Repro: Pro user with `preferred_model_id = 'claude'` (or a conversation pinned to `claude`) downgrades to Free. House renders "Voice through claude", `house-view.tsx` sends `modelId: 'claude'` every turn → permanent 403 with no picker in 4a to escape.

**Please change `loadHouse` to the same allowlisted walk:**

```ts
// fetch allowed set for planId (plan_models where plan_id = planId)
// then:
const selectedModelId =
  (conversationModelId && allowed.has(conversationModelId) ? conversationModelId : null) ??
  (profileResult.data?.preferred_model_id && allowed.has(profileResult.data.preferred_model_id)
    ? profileResult.data.preferred_model_id : null) ??
  (allowed.has(defaultModelId) ? defaultModelId : [...allowed][0] ?? defaultModelId);
```

Or, if you prefer a client-side guard, have `house-view` omit `modelId` when it isn't in the `/api/models` allowlist so the server fallback walk runs. Either way, a stale voice must degrade to an allowed model, not hard-403 every send.

---

## Suggested 4 — `loadPlanModel` fallback is nondeterministic

**Status: Done.** `.order("sort_order", { ascending: true })` on the `models` query in `loadPlanModel`.

**File:** `apps/web/lib/chat/load-context.ts:155-160,196-203`

The `models` query has no `.order("sort_order")`, so the `[...allowed][0]` fallback (when the plan default itself isn't allowed/misconfigured) picks an arbitrary voice. The RPC orders `allowed` by `sort_order` (`20260911090000_ai_credits.sql:397-405`).

One-line fix:

```ts
.eq("is_enabled", true)
.order("sort_order", { ascending: true }),
```

---

## Suggested 5 — Scale-read failure silently mints at wrong scale

**Status: Done (log only).** `logDropped` on `catalog_settings` error in `loadPlanModel` and `loadModelsPayload`. Still falls back to `CREDIT_SCALE_DEFAULT`. Fail-closed 500 over a seeded constant is worse.

**Files:** `apps/web/lib/chat/load-context.ts:214`, `apps/web/lib/credits/load.ts:85`

```ts
const creditScale = settingsResult.data?.credit_scale ?? CREDIT_SCALE_DEFAULT;
```

If the `catalog_settings` read errors, reserve and settle mint credits at 10_000 with no alert. Please `logDropped("loadPlanModel", { settings: settingsResult.error })` (same for `loadModelsPayload`) or fail closed. Silent wrong-scale minting is worse than a 500 here.

---

## Suggested 6 — Sequential hot-path writes before stream

**Status: Done.** `rememberVoice` and `retitleConversation` run in `Promise.all`.

**File:** `apps/web/app/api/chat/route.ts:175-185`

```ts
await rememberVoice(...);
await retitleConversation(...);
```

Both are failure-tolerant (log-only). `Promise.all` them to shave latency off every send:

```ts
await Promise.all([
  rememberVoice(supabase, { ... }),
  retitleConversation(supabase, { ... }),
]);
```

---

## Suggested 7 — Dead code after cap removal

**Status: Done.** `isDailyCapReached` removed from `@maya/shared`. `supabase/tests/consume_chat_turn.sql` marked historical. `docs/roadmap.md` Phase 4 bullet is credits.

* `packages/shared/src/chat.ts:115-123` still exports `isDailyCapReached` — nothing calls it after `daily_message_limit` is dropped. Delete.
* `supabase/tests/consume_chat_turn.sql` still documents the retired RPC. Archive or annotate as historical so nobody re-adds a message cap.
* Any roadmap/doc ref to `plans.daily_message_limit` (e.g. `docs/roadmap.md` if present) — update to credits.

---

## Suggested 8 — Zero-cost edge in `costUsdFromUsage`

**Status: Done.** Explicit gateway `$0` settles `min_turn_credits` and does not fall through to catalog rates.

**File:** `apps/web/lib/credits/usage.ts:29,63`

`rawCost: 0` passes the `>= 0` presence check but `> 0` is required to use it, so a zero-cost model falls through to catalog rates and gets overcharged. No free model exists today, so harmless — just decide explicitly: `0 → min_turn_credits` with a comment, or keep current behavior with a comment.

---

## Suggested 9 — Unparseable reserve payload leaks reservation

**Status: Done (log).** `console.error` now includes raw `quota.data`. No alert hook — Sentry is PR5.

**File:** `apps/web/app/api/chat/route.ts:150-154`

If `reserve_chat_turn` succeeds but `parseReserveChatTurn` fails (schema drift), `eventId` is lost and the reservation is never settled. Probability is low and parser tests cover the shape, but please log the raw payload (already done) plus an alert hook so drift pages someone instead of silently leaking.

---

## What looks good (so the approval isn't just nits)

* Reserve-then-settle under `pg_advisory_xact_lock` + `FOR UPDATE` in one xact — no count-then-insert in Node.
* 403 before `insertUserMessage`, reserve after insert — matches MAYA-114 shape intentionally.
* `openrouter_cost_usd` hidden from `authenticated`, `credit_days/months` RPC-only, RPCs `security definer + search_path=''` with `auth.uid()` only.
* Settle-idempotent in DB and in-process; settle-can-exceed-reserve with next-turn-429 is the right call.
* Reserve uses max-output estimate with `least(estimate, daily_remaining, monthly_remaining)` clamp so low-balance users can still send short Flash replies.

Fix Required 1–3 + Suggested 4 and I'm an approve. Thanks for the reviewer brief — it made this review fast.

**Follow-up:** Required 1 and 3 + Suggested 4 landed. Required 2 was rejected with documentation (see Status on that item). Remaining suggested items also landed except no Sentry hook.
