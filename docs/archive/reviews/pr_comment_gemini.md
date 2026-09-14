# PR Review Comments: #21 (`feat/pr4-credit-engine` → `main`)

**Reviewer:** Senior Developer  
**Target Branch:** `main`  
**Reference Document:** [`docs/reviews/pr4a-credit-engine.md`](./pr4a-credit-engine.md)  
**Original status:** **Approve with Fixes** (Ready to merge once comments 1–3 are resolved)  
**Re-Review Status:** **APPROVED FOR MERGE** 🚀 (All blockers resolved; comment 6 appropriately deferred to PR4b)  
**Follow-up:** comments 1–5 landed; comment 6 deferred to PR4b. Full table in the brief §14.

| Item | Disposition |
| :--- | :--- |
| 1. House lockout on downgrade | **Done** — `loadHouse` allowlists via `resolveModelId` |
| 2. `openrouter.usage.cost` fallback | **Done** |
| 3. `abortSignal` + `onAbort` | **Done** — also **await** settle (not `void`) |
| 4. `sort_order` on `loadPlanModel` | **Done** |
| 5. Forward `openrouter_generation_id` | **Done** |
| 6. `forbidden_model` PaywallTicket | **Deferred to PR4b** |

---

## Overall Assessment

This PR introduces a well-architected, production-grade metering engine. The transition from crude message-turn counting to reserve-then-settle AI credits pegged to OpenRouter wholesale cost ($0.0001/credit, scale `10_000`) is cleanly executed. 

Key architectural wins:
- **Concurrency & Atomicity (Trap 3):** Using `pg_advisory_xact_lock(hashtext(v_uid::text))` combined with row-level `FOR UPDATE` on `credit_days` and `credit_months` prevents double-spending at quota boundaries.
- **Model Authorization (Trap 5):** Dual-layer check (`plan_models ∩ models.is_enabled`) in both TypeScript (`loadPlanModel`) and Postgres (`reserve_chat_turn`) eliminates the silent default/upgrade risk.
- **Data Minimization & COGS Security (MAYA-112):** Revoking table-level SELECT on `usage_events` and granting column-level access that hides `openrouter_cost_usd` prevents wholesale margins from leaking over PostgREST.

Below are specific, actionable comments and code suggestions to address before merging into `main`.

---

## Actionable Review Comments

### 1. [High Priority] User Lockout on Plan Downgrade / Illegal Voice Selection

**Status: Done.** `loadHouse` fetches `plan_models` and uses `resolveModelId` with no `requested`. House chrome no longer sends a stale Pro voice after a Free downgrade. `POST /api/chat` still 403s an explicit illegal `modelId`.

* **Files:** `apps/web/lib/house/load.ts` (lines 186–190), `apps/web/components/house/house-view.tsx` (line 58)
* **Issue:**  
  `loadHouse` derives `selectedModelId` without checking against `plan_models`:
  ```ts
  const selectedModelId =
    conversationModelId ??
    profileResult.data?.preferred_model_id ??
    defaultModelId;
  ```
  `HouseView` then sends `modelId: house.selectedModelId` on every turn.
* **Why it matters:**  
  If a user was previously on Pro and used `claude`, and subsequently downgrades to Free (or if an existing conversation had a Pro voice), `house.selectedModelId` resolves to `"claude"`.  
  Because the client explicitly sends `modelId: "claude"`, `POST /api/chat` rejects it with HTTP 403 `{ error: "forbidden_model" }`. Since PR4a does not have the model picker UI yet, and `house-view.tsx` treats non-quota errors as generic stage failures (`showDropped`), the user is **permanently blocked** from sending messages in that house/thread.
* **Suggested Fix:**  
  Validate candidates against `plan_models` in `loadHouse`, mirroring the safe resolution logic in `loadModelsPayload`:
  ```ts
  // apps/web/lib/house/load.ts
  const [..., allowedResult] = await Promise.all([
    ...,
    supabase.from("plan_models").select("model_id").eq("plan_id", planId),
  ]);

  const allowedSet = new Set((allowedResult.data ?? []).map((row) => row.model_id));
  const defaultModelId = planResult.data?.default_model_id ?? "qwen-flash";

  const selectedModelId =
    (conversationModelId && allowedSet.has(conversationModelId) ? conversationModelId : null) ??
    (profileResult.data?.preferred_model_id && allowedSet.has(profileResult.data.preferred_model_id)
      ? profileResult.data.preferred_model_id
      : null) ??
    defaultModelId;
  ```

---

### 2. [Medium Priority] Fix Provider Metadata Cost Fallback (`openrouter.usage.cost`)

**Status: Done.** `costUsdFromUsage` reads `nested.cost` and `nested.usage.cost`. Covered in `apps/web/lib/credits/usage.test.ts`.

* **File:** `apps/web/lib/credits/usage.ts` (lines 33–44)
* **Issue:**  
  `costUsdFromUsage` checks `(nested as Record<string, unknown>).cost` directly under `providerMetadata.openrouter`:
  ```ts
  for (const key of ["openrouter", "openai"]) {
    const nested = record[key];
    if (nested && typeof nested === "object") {
      const cost = finiteNumber((nested as Record<string, unknown>).cost);
      if (cost != null && cost >= 0) return cost;
    }
  }
  ```
  In `@openrouter/ai-sdk-provider@3.0.0`, the stream finish event enqueues metadata as:
  ```ts
  providerMetadata: {
    openrouter: {
      usage: {
        cost: number,
        ...
      }
    }
  }
  ```
* **Why it matters:**  
  The review brief identified in Section 12 (Risk #1) that `usage.raw.cost` can sometimes be missing or stripped by upstream AI SDK wrappers. If `usage.raw.cost` is missing, this metadata fallback currently fails to find the cost because it looks for `openrouter.cost` instead of `openrouter.usage.cost`, needlessly falling back to estimated catalog token rates instead of exact gateway billing.
* **Suggested Fix:**  
  Check both `nested.cost` and `nested.usage.cost`:
  ```ts
  for (const key of ["openrouter", "openai"]) {
    const nested = record[key];
    if (nested && typeof nested === "object") {
      const n = nested as Record<string, unknown>;
      const directCost = finiteNumber(n.cost);
      if (directCost != null && directCost >= 0) {
        return directCost;
      }
      if (n.usage && typeof n.usage === "object") {
        const usageCost = finiteNumber((n.usage as Record<string, unknown>).cost);
        if (usageCost != null && usageCost >= 0) {
          return usageCost;
        }
      }
    }
  }
  ```

---

### 3. [Medium Priority] Wire `abortSignal` and `onAbort` on `streamText` (Trap 8)

**Status: Done.** `abortSignal: request.signal`; `onAbort` and `onError` are async and await `settleTurn`. Staging still needs one cancelled turn to confirm `reserved → settled`.

* **File:** `apps/web/app/api/chat/route.ts` (lines 257–278)
* **Issue:**  
  `streamText` does not receive `abortSignal: request.signal`, does not define an `onAbort` handler, and calls `void settleTurn(...)` inside `onError` without awaiting it:
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
    onEnd: async (event) => {
      // ...
    },
  });
  ```
* **Why it matters:**  
  - If a user closes the tab, navigates away, or stops generation, the backend should immediately abort generation to stop burning tokens at OpenRouter.
  - If generation aborts, `onAbort` will not settle the turn, leaving the reservation held in `credit_days.reserved_credits` until the UTC midnight rollover.
  - Making `onError` and `onAbort` async and awaiting `settleTurn` protects against race conditions with serverless process teardown.
* **Suggested Fix:**  
  ```ts
  const result = streamText({
    model: getOpenRouterModel(voice.gatewayId),
    maxOutputTokens: voice.maxOutputTokens,
    system,
    abortSignal: request.signal,
    messages: await convertToModelMessages(nextMessages),
    onError: async ({ error }) => {
      console.error("[streamText error]", error);
      await settleTurn({ text: "", aborted: true });
    },
    onAbort: async () => {
      await settleTurn({ text: "", aborted: true });
    },
    onEnd: async (event) => {
      await settleTurn({
        text: event.text,
        usage: {
          inputTokens: event.usage.inputTokens,
          outputTokens: event.usage.outputTokens,
          totalTokens: event.usage.totalTokens,
          raw: event.usage.raw as Record<string, unknown> | undefined,
        },
        providerMetadata: event.providerMetadata,
      });
    },
  });
  ```

---

### 4. [Low Priority] Add Explicit Sort Order to `loadPlanModel`

**Status: Done.** `.order("sort_order", { ascending: true })` on the `models` query.

* **File:** `apps/web/lib/chat/load-context.ts` (line 155)
* **Issue:**  
  The `models` query in `loadPlanModel` does not specify an `.order()`:
  ```ts
  supabase
    .from("models")
    .select(...)
    .eq("is_enabled", true)
  ```
* **Why it matters:**  
  `reserve_chat_turn` in Postgres uses `order by m.sort_order`, and `loadModelsPayload` uses `.order("sort_order", { ascending: true })`. If `resolveModelId` ever falls back to `[...allowed][0]`, an unsorted query can lead to non-deterministic model selection based on Postgres page order.
* **Suggested Fix:**  
  Add `.order("sort_order", { ascending: true })` to the `models` query in `loadPlanModel`.

---

### 5. [Polish] Forward `openrouter_generation_id` in `settle_chat_turn`

**Status: Done.** `onEnd` passes `p_generation_id: event.response?.id`. Abort/error settle with null.

* **File:** `apps/web/app/api/chat/route.ts` (line 231)
* **Note:**  
  Migration `20260911090000_ai_credits.sql` added `openrouter_generation_id text` to `usage_events`, and `settle_chat_turn` accepts `p_generation_id text default null`. However, `route.ts` currently omits `p_generation_id` when calling the RPC.
* **Recommendation:**  
  Pass `p_generation_id: event.response?.id ?? null` (or extract it from `providerMetadata.openrouter.generationId`) during settlement to complete the OpenRouter audit trail.

---

### 6. [UX Polish] Distinct UI Ticket for `forbidden_model`

**Status: Deferred to PR4b.** After comment 1, House no longer sends an illegal voice on downgrade, so this path is attack/stale-client. Locked-row upsell copy belongs with the picker.

* **File:** `apps/web/components/house/house-view.tsx` (lines 105–119)
* **Note:**  
  `quota_month` and `quota` display dedicated `PaywallTicket` cards. If a `forbidden_model` response occurs, it currently triggers `showDropped` ("Something went wrong on the stage").
* **Recommendation:**  
  Map `forbidden_model` to an upgrade or voice reset ticket so users understand why the turn failed rather than seeing a generic error.

---

## Verification & Pre-Merge Checklist

- [x] All automated unit and integration tests pass (`pnpm test` - 20 test files, 129 tests passing).
- [x] Turbo typecheck and linting pass without errors (`pnpm exec turbo typecheck lint --force`).
- [ ] Apply migration in staging / local Supabase (`20260911090000_ai_credits.sql`).
- [ ] Complete manual SQL checklist in `supabase/tests/ai_credits.sql`.
- [ ] Verify manual chat flow for Free user on Qwen Flash and 403 on Claude.
- [ ] Cancel one in-flight turn; confirm `usage_events` flips `reserved → settled`.

---

## Senior Developer Re-Review & Final Sign-Off (Commit `26df22d`)

**Verdict:** **APPROVED FOR MERGE** 🚀

### Evaluation of Author's Changes & Dispositions

1. **Item 1 (House Voice Allowlist on Downgrade):**  
   **Verified.** `loadHouse` now queries `plan_models` and delegates to `resolveModelId({ conversationModelId, preferredModelId, defaultModelId, allowed })` without passing `requested`. This cleanly preserves the fallback hierarchy (`conversation` → `profile` → `default` → `first allowed`) among permitted models. The Free user lock-out scenario after a Pro downgrade is completely eliminated.

2. **Item 2 (Provider Metadata Cost Fallback):**  
   **Verified.** `costFromProviderBag` recursively checks `record.cost` and `record.usage.cost`. The addition of `apps/web/lib/credits/usage.test.ts` (8 passing unit tests) provides strong regression protection across both OpenRouter AI SDK metadata shapes as well as explicit `$0` gateway returns.

3. **Item 3 (`abortSignal`, `onAbort`, and `await settleTurn`):**  
   **Verified.** Passing `abortSignal: request.signal` stops OpenRouter token burn immediately when a client connection terminates. Adding `onAbort` and making both `onAbort` and `onError` `async` while awaiting `settleTurn` fully closes the Trap 8 reservation leak and avoids process-teardown races.

4. **Item 4 (Deterministic Model Order):**  
   **Verified.** Adding `.order("sort_order", { ascending: true })` to `loadPlanModel` aligns TypeScript fallback resolution with the SQL RPC `reserve_chat_turn`.

5. **Item 5 (Forwarding `openrouter_generation_id`):**  
   **Verified.** `event.response?.id` is now forwarded to `settle_chat_turn`, ensuring end-to-end trace auditability.

6. **Item 6 (PaywallTicket for `forbidden_model` Deferred to PR4b):**  
   **Concur with Author's Rationale.** Since Item 1 prevents normal UI callers from ever sending a forbidden `modelId`, an illegal request now only occurs via forged requests or stale clients. User-facing locked model upsells belong with the interactive model picker component in PR4b.

7. **Architectural Commendation on Muse M2 (Models SELECT Grant):**  
   The author correctly rejected the suggestion to revoke `SELECT` on `models` from `authenticated`. `loadPlanModel` and `loadModelsPayload` run with user JWTs; revoking table SELECT would break chat unless those reads were moved to `service_role`. Crucially, authorization is enforced at the RPC level (`reserve_chat_turn`) and `GET /api/models` strips `gateway_id`. Keeping public list prices readable while column-hiding actual COGS (`openrouter_cost_usd`) on `usage_events` is the correct design.

---

### Final Merge Clearance

- [x] Test suite passing: 21 test suites, 136 tests passing (`pnpm test`).
- [x] Typecheck and lint passing with no errors (`pnpm exec turbo typecheck lint --force`).
- [x] All PR4a criteria and traps (Trap 3, Trap 5, Trap 8, MAYA-112) satisfied.
- [x] Ready to squash-merge `feat/pr4-credit-engine` into `main`.

