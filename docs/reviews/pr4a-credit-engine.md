# PR4a review brief: AI credits + `plan_models` gate

**PR:** [#21](https://github.com/tara-bisht/maya-chat/pull/21) · `feat/pr4-credit-engine` → `main`
**Plan id:** PR4a ([`docs/implementation-plan.md`](../implementation-plan.md))
**Tickets:** [MAYA-107](../../issues/MAYA-107-model-selection-inoperative.md) (picker/routing), [MAYA-116](../../issues/MAYA-116-no-model-attribution-plan-models-unenforced.md) (DB gate + cost audit)
**ADR:** [`docs/adr/0003-ai-credits-from-gateway-cost.md`](../adr/0003-ai-credits-from-gateway-cost.md)

Read this before the diff. The interesting code is the migration + chat route, not the chrome copy.

---

## 1. Why this exists

Two product promises were catalog-true on paper and inoperative in the app:

1. **Voice is a user choice, gated by plan.** Tables `models` / `plan_models` / `plans.default_model_id` exist. The chat path ignored them. `loadPlanModel` always loaded the plan default. `chatRequestSchema` had no `modelId`. Extra JSON was dropped by Zod. House chrome rendered the alias as static text. A Pro user paying for Claude could not switch to Grok; a Free user who later sent `modelId: "claude"` would have been a silent upgrade (Trap 5) if we had added the field without the allowlist.

2. **Quota must track cost, not turns.** `consume_chat_turn()` counted `usage_events` rows against `plans.daily_message_limit` (Free 50 / Plus 200 / Pro unlimited). One Claude turn and one Qwen Flash turn cost ~20× apart. Pro “unlimited” on Sonnet is a cost hole. `usage_events` had no `model_id`, so finance could not attribute spend.

This PR is the metering and authorization layer. The interactive Voice picker (locked rows, upgrade ticket) and catalog-true landing seats are **PR4b**. Stripe is **PR4c**. Do not block 4a on those.

---

## 2. Goals and non-goals

**In**

- Optional `modelId` on `POST /api/chat` (catalog alias only, never a gateway slug).
- Enforce `plan_models ∩ models.is_enabled` in both TypeScript and the RPC. Illegal pair → HTTP 403 `{ error: "forbidden_model", allowedModelIds }`. Never fall through to Claude.
- Replace the user-visible message cap with **AI credits** deducted from actual OpenRouter cost.
- Record `model_id` + `openrouter_cost_usd` on every consumed turn.
- Show remaining credits in lobby header, sidebar, and House chrome.
- Keep founder config in Postgres (limits, rates, allowlists). No `if (plan === "pro")` for quotas or model names.

**Out (do not ask this PR to add them)**

- House picker dropdown and locked-model upsell UI (4b).
- Landing `SEATS` still says “50 messages” (MAYA-108 / 4b).
- Stripe Checkout / entitlements webhook (4c).
- In-app catalog admin (v1.1; SQL / table editor is the knob).
- Credit packs, rollover, dollar amounts in chrome, Tavily/tool surcharge, prompt cache.

---

## 3. Solution in one page

Industry analog is **Poe compute points**, not ChatGPT message caps and not a consumer dollar bar.

| Decision | Choice | Why |
| :--- | :--- | :--- |
| Unit | Integer **credits**. `1 credit = $0.0001` of OpenRouter `usage.cost` (`scale = 10_000`). | One currency across models. Users never see $. |
| Metering | **Reserve-then-settle** under the existing per-uid advisory lock. | Stream cost is unknown until the last chunk. |
| Profit | Unused daily allowance. No extra 2.5× markup on top of a tight cap. | Markup + tight cap double-dips and makes Pro feel cheap. ChatGPT/Claude/Poe all make money on unused included usage. |
| Whale fuse | Silent `monthly_credit_limit` + hidden `max_turns_per_day`. | A user who maxes daily every day cannot print a $200 OpenRouter bill on a $19 seat. |
| Allowlist | `plan_models` rows, not app `if`. | `INSERT/DELETE plan_models` changes 403 allowlists with no deploy. |
| Hot path | `credit_days` / `credit_months` aggregates. Do not `SUM(usage_events)` per send. | `usage_events` is the audit log. |

**Seed allowances** (catalog-true; edit `plans` to retune):

| Plan | Daily credits | Daily $ | Typical day (~8k in + 800 out) | Monthly cap |
| :--- | ---: | ---: | :--- | ---: |
| Free | 1,500 | $0.15 | ~90 Qwen Flash / ~12 Grok Fast | 20,000 ($2) |
| Plus | 4,000 | $0.40 | ~19 Grok / ~12 GPT | 80,000 ($8 of $9) |
| Pro | 9,000 | $0.90 | ~25 Claude / ~176 Kimi | 180,000 ($18 of $19) |

Hidden `max_turns_per_day`: 80 / 250 / 400. Not shown in chrome. Stops empty Flash floods from racing the formula.

`$1 / $3 / $5` per day wholesale was rejected: at Plus $9 / Pro $19 that is 3–8× revenue if anyone maxes.

---

## 4. Request lifecycle

```
POST /api/chat { conversationId, agentId, modelId?, message }
  1. Session. Zod parse. modelId must match ^[a-z0-9]+(?:-[a-z0-9]+)*$
     (rejects openai/gpt-5.4). Empty/omit → undefined.
  2. loadChatAgent (canChat / locked_agent 403).
  3. load conversation + profile (preferred_model_id).
  4. loadPlanModel:
       requested → conversation.model_id → profile.preferred_model_id
       → plans.default_model_id
       Explicit illegal modelId → 403. Never silent default (Trap 5).
  5. compilePrompt. Estimate prompt tokens as ceil(chars/4) over
     system + history + user text.
  6. reserve = catalog_cost(est_input, models.max_output_tokens).
  7. insert user message (MAYA-114: persist before burning quota).
  8. rpc reserve_chat_turn(model_id, reserve, conversation_id)
       lock uid
       plan_models ∩ is_enabled else forbidden_model
       clamp reserve to remaining
       insert usage_events status=reserved
       bump credit_days / credit_months.reserved
  9. rememberVoice (conversation.model_id + profiles.preferred_model_id).
 10. streamText(gateway_id, maxOutputTokens from catalog).
 11. onEnd: settle from usage.cost → credits; insert assistant + model_id.
     onError / abort: settle reserved (Trap 8). No refund_chat_turn.
```

**Forbidden model is checked before insert** (client bug / attack; no reason to persist). **Quota is reserved after insert** (same 114 shape as today: a 429 can leave a user row with no assistant).

RPC also re-checks `plan_models`. App-layer 403 is UX; DB is the backstop if the route is wrong.

---

## 5. Credit formula

```
credits = max(1, ceil(openrouter_cost_usd * credit_scale))
credit_scale default 10_000  (catalog_settings.credit_scale)
```

Settle fallbacks in `apps/web/lib/credits/usage.ts`:

1. `usage.raw.cost` or `providerMetadata.openrouter.cost` (OpenRouter usage accounting, USD).
2. Else catalog `input_usd_per_million` / `output_usd_per_million` × actual tokens.
3. Else settle the **reserved** amount (never undercharge a gateway hit).

Reserve estimate uses **max output tokens** (seed 2048), not a typical 800-token completion, so we do not start a turn we cannot afford in the worst case. The RPC then `least(estimate, daily_remaining, monthly_remaining)` so a user with 100 credits left can still send a short Flash reply instead of 429ing on a 500-credit Claude-sized estimate.

If actual cost **exceeds** reserve (tools, long think), we still settle the actual (we already paid OpenRouter). The next turn 429s. Remaining is not allowed to go negative in the aggregate tables (`greatest(0, reserved - event.reserved)`); settled can push `used` above `limit` for that day. That is intentional.

---

## 6. Schema (read the migration)

File: `supabase/migrations/20260911090000_ai_credits.sql`

| Object | Role |
| :--- | :--- |
| `plans.daily_credit_limit` / `monthly_credit_limit` / `max_turns_per_day` | Caps. `daily_message_limit` **dropped**. |
| `models.input_usd_per_million` / `output_usd_per_million` / `min_turn_credits` / `max_output_tokens` | Reserve rates. Unique `gateway_id`. |
| `catalog_settings` (singleton `id = 1`) | `credit_scale`. Authenticated SELECT only. |
| `conversations.model_id`, `profiles.preferred_model_id`, `messages.model_id` | Voice preference + assistant attribution. ON DELETE SET NULL. |
| `usage_events` | Audit: `model_id`, `status` (`reserved`\|`settled`), reserved/settled credits, tokens, `openrouter_cost_usd`, generation id. |
| `credit_days` / `credit_months` | Hot-path balances. RLS on, **no authenticated grants** (RPC only). |

**Dollar leak:** table-level `SELECT` on `usage_events` was revoked from `authenticated`. Column grant omits `openrouter_cost_usd` and `openrouter_generation_id`. Chrome cannot read our COGS through PostgREST.

**Writes:** still RPC-only (MAYA-112). `consume_chat_turn()` is dropped.

**RPCs** (`security definer`, `search_path = ''`, `auth.uid()` only, `EXECUTE` to `authenticated`, revoked from `public`/`anon`):

- `credit_balance()` → remaining / limits / `resetsAt`
- `reserve_chat_turn(p_model_id, p_reserve_credits, p_conversation_id)`
- `settle_chat_turn(...)` — idempotent if already `settled`

Existing `usage_events` rows (if any) are backfilled to `qwen-flash` / `settled` / 0 credits so `model_id` can be NOT NULL. Dev/stage counters reset in spirit; there is no production contract on those rows.

---

## 7. API contract

`POST /api/chat`

| Case | Status | Body |
| :--- | ---: | :--- |
| Illegal / gateway-shaped `modelId` | 400 | `{ error: "invalid" }` |
| Model not on plan or disabled | 403 | `{ error: "forbidden_model", allowedModelIds: string[] }` |
| Daily credits or turn fuse | 429 | `{ error: "quota", remaining, resetsAt }` |
| Monthly whale cap | 429 | `{ error: "quota_month", remaining }` |
| Happy | 200 | UI message stream (unchanged) |

Omitted `modelId` uses conversation → profile → plan default among **allowed** models.

`GET /api/models` (session required)

```json
{
  "defaultModelId": "qwen-flash",
  "selectedModelId": "qwen-flash",
  "credits": { "ok": true, "dailyLimit": 1500, "dailyRemaining": 1484, "...": "..." },
  "models": [
    { "id": "qwen-flash", "displayName": "Qwen Flash", "allowed": true, "minPlan": "free", "estimatedCreditsPerTurn": 16 }
  ]
}
```

No `gateway_id` on the wire. `GET /api/models` already returns **locked** models (`allowed: false`, `minPlan`) so 4b can render them without another backend change.

`GET /api/credits` — same balance object for post-turn refetch.

---

## 8. UI in this PR

House header: `Voice through {selectedModelId} · {n} left`. Client now sends `modelId: house.selectedModelId` on each turn (whatever was last remembered / plan default). There is **no dropdown yet**.

Lobby: remaining in the AppShell header and a 3px bar at the bottom of the 268px rail. Acid at ≤15%.

Quota ticket copy no longer mentions “50 messages.” Monthly cap has its own ticket.

Landing pricing still claims message caps. That is a known 4b/MAYA-108 leftover, not a 4a defect.

---

## 9. Impact analysis

### Product

- Free/Plus users who previously had a **turn** budget now have a **cost** budget. A Free user living on Qwen Flash gets more turns (~90 vs 50). A Free user who picks Grok Fast gets fewer (~12). That is the point of the meter; 4b should show estimated credits per Voice so it does not feel like a trap.
- Pro is no longer unlimited. ~25 Claude-quality turns/day, more if they mix Kimi/Flash. Monthly cap ≈ $18 COGS vs $19 revenue if they max every day.
- Light users (~20% of daily) → Plus ~$2.40/mo COGS (27% of $9), Pro ~$5.40/mo (28% of $19). That is the margin.

### Breaking (callers / data)

- `consume_chat_turn()` is gone. Anything still calling it will 404 the RPC.
- `plans.daily_message_limit` column is dropped. Generated `Database` types updated.
- `usage_events` INSERT remains denied; SELECT is column-restricted. Clients that `select *` on usage will not see cost columns (PostgREST omits ungranted columns).
- Chat 403/429 payloads gained fields (`allowedModelIds`, `remaining`, `resetsAt`). `error` string is still the discriminator. New codes: `forbidden_model`, `quota_month`.
- House `dailyLimit` is gone; `credits` + `selectedModelId` are required on `HouseView`. `GalleryViewer.credits` is now required (`null` if the RPC fails).

### Security

- Trap 5: explicit `modelId` not on the plan is 403 at the route **and** RPC. Fallback walk only runs when `modelId` is omitted.
- Gateway slugs cannot be smuggled in `modelId` (Zod regex, no `/`).
- `auth.uid()` only; no `p_user_id` argument (same as MAYA-102).
- `openrouter_cost_usd` is not granted to `authenticated`.
- `credit_days` / `credit_months` are not on the Data API for users.
- `catalog_settings` is readable (scale is not a secret). Writes are service_role.

### Concurrency / reliability

- Same `pg_advisory_xact_lock(hashtext(uid))` as Studio quota and the old consume RPC. Parallel sends at the cap cannot both pass.
- Process crash after reserve and before settle: reserved credits stay held until UTC day roll (new `credit_days` row; old reserved does not count). Worst case: one max-output reservation leaked per crash. No sweeper in this PR. Acceptable for MVP; call it out, do not invent a cron here.
- `settle` is idempotent. `onEnd` + `onError` share a `settled` flag in the route so we do not double-settle in-process.
- `onError` settle is fire-and-forget (`void settleTurn`). If that promise loses a race with process teardown, same crash-leak as above.

### Performance

- Chat send: extra reads (`plan_models`, `models`, `catalog_settings`) plus one reserve RPC. No full-table `count(*)` of today’s events.
- Lobby/House: extra `credit_balance()` RPC on every chrome load (including gallery). Cheap PK lookup. Watch if it shows up in traces; do not cache across users.

### Ops / deploy

- **Must apply the migration** before this build talks to a database. Chat will fail closed if `reserve_chat_turn` is missing.
- Seed rates are pinned OpenRouter list prices as of review time. Founder updates `models.input_usd_per_million` when the catalog moves. `catalog.ts` is a display/seed **mirror**; DB is the gate.
- Do not point `gpt` at `openai/gpt-5.4-pro` ($30/$180). Current slug is `openai/gpt-5.4` ($2.50/$15).

---

## 10. What to review (file map)

Start here, in order:

| File | Why |
| :--- | :--- |
| `supabase/migrations/20260911090000_ai_credits.sql` | Whole design. Grants, RLS, lock, allowlist, clamp, settle math. |
| `apps/web/app/api/chat/route.ts` | Order of persist / reserve / stream / settle. Trap 5 and Trap 8. |
| `packages/shared/src/credits.ts` | Formula, `resolveModelId`, RPC parsers, modelId regex. |
| `apps/web/lib/credits/usage.ts` | Cost extraction fallbacks. |
| `apps/web/lib/chat/load-context.ts` | `loadPlanModel` allowlist. |
| `apps/web/app/api/models/route.ts` | No `gateway_id` on the wire. |
| `packages/database/src/types.ts` | Hand-updated to match the migration (no `supabase gen` in CI). |

Chrome (`app-shell-chrome`, `house-view`, `ui-copy`) is presentation. Docs/CONTEXT/ADR are expected with this slice.

---

## 11. Tests that exist vs tests you should still run

**In CI (already green locally on this branch):**

- `@maya/shared` credits: formula, alias vs gateway slug, Trap 5 resolve, RPC parsers.
- Chat parse: `modelId: "grok-fast"` ok; `openai/gpt-5.4` rejected.
- Catalog seed rates pinned.

**Not automated (SQL file is a checklist, same pattern as `consume_chat_turn.sql`):**

See `supabase/tests/ai_credits.sql`. After `supabase db reset` (or migrate) with a user JWT:

1. Free `credit_balance()` → `dailyLimit` 1500, remaining 1500.
2. `reserve_chat_turn('qwen-flash', 16)` → ok, row `reserved`.
3. Free `reserve_chat_turn('claude', 16)` → `forbidden_model`, allowed includes `qwen-flash`.
4. Cap: next reserve after remaining `< min_turn_credits` → `quota`, no insert.
5. `settle_chat_turn` moves reserved → settled; second call `idempotent`.
6. Authenticated `INSERT usage_events` denied; `SELECT openrouter_cost_usd` denied.
7. `consume_chat_turn()` does not exist.

**Manual product:**

1. Apply migration. Sign in as Free.
2. `POST /api/chat` without `modelId` streams on `qwen-flash` (or the plan default).
3. `POST` with `"modelId": "claude"` → 403 + allowlist. **No OpenRouter call.**
4. `GET /api/models` lists Claude with `allowed: false`, `minPlan: "pro"`.
5. Meter in sidebar/header matches `GET /api/credits` after a turn (within settle timing).
6. Chrome never shows `$`.

---

## 12. Known risks (do not rubber-stamp these away)

1. **`usage.raw.cost` may be missing** from the Vercel AI SDK OpenRouter path. Fallback to catalog rates is correct; last-resort settle-reserved is correct. Worth one staging turn logged to confirm which branch runs. Optional later: `GET /api/v1/generation?id=` if stream usage is empty.
2. **Reserved leak on crash** (see §9). No sweeper.
3. **429 after user-message insert** — same as current main (MAYA-114). Empty-looking turns can appear if the client does not refetch; House already hides empty threads on the rail.
4. **Grok Fast on Free is expensive** (~120 credits/turn). Default stays Qwen Flash. 4b should show estimates.
5. **Character prompts + 20-message window** can double “typical turn” cost. Monthly cap still holds. Prompt caching is a later COGS win, not this PR.
6. **Landing copy drift** (MAYA-108) remains until 4b.

---

## 13. Approval checklist

- [ ] Trap 5: no path from a Free JWT to a Pro `gateway_id`.
- [ ] Trap 8: abort/error after the gateway starts still settles (reserved or actual).
- [ ] Trap 3: reserve + increment are one locked transaction; no count-then-insert in Node.
- [ ] MAYA-112: authenticated cannot INSERT `usage_events` or UPDATE balances.
- [ ] Dollars are not selectable by `authenticated`.
- [ ] `gateway_id` is not on `GET /api/models`.
- [ ] Migration is additive except the intentional `daily_message_limit` / `consume_chat_turn` drop, and that is acceptable for current environments.
- [ ] 4b/4c scope was not sneakily required for this merge.

Approve PR4a if the metering and allowlist are sound. Do not hold it for the picker.
