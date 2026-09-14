# Implementation Plan: Maya Chat

```yaml
---
document_id: "IMPL-MAYA-001"
title: "Maya Chat: PR-level implementation plan"
version: "1.1.0"
date: "2026-09-14"
status: "ACTIVE"
depends_on:
  - "NOW.md"
  - "PROJECT_DESCRIPTION.md"
  - "technical-plan.md"
  - "tech-stack.md"
  - "DESIGN.md"
---
```

Build sequence for **remaining** slices. What is true on `main`: [`NOW.md`](NOW.md). System design: [`technical-plan.md`](technical-plan.md). Open work that is not a numbered PR: [`backlog/README.md`](backlog/README.md).

---

## Locked decisions

| Decision | Lock |
| :--- | :--- |
| Curated catalog | Unbounded. Starter seed: [`seed-agents.sql`](seed-agents.sql) + [`curated-agents.md`](curated-agents.md). Not a cap of eight. |
| Free gate | `agents.free_tier`. Seed: Marcus + Dr. Priya. Plus/Pro see every curated row. Not “first N rows.” Free may also cast 3 public custom agents. |
| Categories | `learning`, `philosophy`, `productivity`, `wellbeing`, `lifestyle`, `custom`. Nonna = `wellbeing`. Barnaby = `lifestyle`. |
| Tone sliders | Locked on curated agents. Compiler overlays sliders for **custom** agents only. |
| Tools vs plan | Register `agents.tools_enabled ∩ plans.tools_allowed`. Strip tool-policy text when a tool is not allowed. |
| Catalog | `plans` / `models` / `plan_models` are the source of truth. No `if (plan === 'pro')` for quotas or model names. |
| Chat runtime | Next.js Route Handler, **Node**, `maxDuration = 60`. Not Edge. |
| Gateway | One: **OpenRouter** (`OPENROUTER_API_KEY`). Chat UI still uses Vercel AI SDK + `@openrouter/ai-sdk-provider`. |
| Embeddings | One vendor, dim pinned in the first memory migration (prefer 1024). Independent of chat-model switching. |
| Billing | Stripe Checkout + Portal for Plus and Pro. RevenueCat is later. |
| Mobile | PR6 client of the same API. Do not start Expo until Web MVP is live. |
| UI | [`DESIGN.md`](DESIGN.md) is law. Map shadcn tokens on day 0. No Inter/Geist, no bubbles, no zinc defaults. |
| Schema sketch | [`archive/architecture.md`](archive/architecture.md) — layout + SQL sketch only. Ignore Edge, `is_pro`, `vector(1536)`, and §4’s dual-track checklist. |

---

## Source of truth

| Question | Read |
| :--- | :--- |
| Shipped / next | [`NOW.md`](NOW.md) |
| What / why / packaging | [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md), [`prd.md`](prd.md) |
| How a message flows | [`technical-plan.md`](technical-plan.md) |
| Libraries and env | [`tech-stack.md`](tech-stack.md) |
| Screens and tokens | [`DESIGN.md`](DESIGN.md) |
| Starter prompts | [`curated-agents.md`](curated-agents.md) + seed SQL |
| Words | [`../CONTEXT.md`](../CONTEXT.md) |
| Open ideas / defects | [`backlog/README.md`](backlog/README.md) |

---

## Shipped (PR0–PR4b)

| ID | What | Notes |
| :--- | :--- | :--- |
| PR0 | Monorepo, Next.js 15 house, Maya tokens, env inventory | |
| PR1 | Migrations, RLS, Google sign-in, catalog seed | |
| PR2 | Playbill gallery + streaming House | |
| PR2b | Profile fields, `/settings` | |
| PR3 | `compilePrompt()`, tools, Studio | |
| PR4a | Credit engine, `plan_models` gate, `modelId` on chat | MAYA-107 / 116 |
| PR4b | Voice picker, locked models, catalog seats | MAYA-108 |

Each merged PR was independently reviewable (Zod, RLS, `tsc --noEmit` as applicable).

---

## Remaining

Each PR should be independently reviewable. Do not merge a slice that lacks Zod (if it adds a route), RLS (if it adds a table), or `tsc --noEmit`.

### PR4c — Memory + Stripe (rest of Phase 4)

**Title:** pgvector retrieve, Plus/Pro Checkout

**Touches:** embeddings + `match_agent_memories`, Stripe webhook + `stripe_events`, pricing checkout

**Does:** 402 on Studio over cap. Webhook maps `price_id` → `plans.id`. Picker CTAs can stay `/#seats` until portal exists. Hitch [MAYA-109](backlog/defects/MAYA-109-memory-rpc-service-role-failure.md) and [MAYA-115](backlog/defects/MAYA-115-dual-plan-truth-profiles-vs-entitlements.md) here if cheap.

**Cut:** Yearly prices; Stripe-hosted portal is enough.

### PR5 — Harden + Web MVP (Phase 5)

**Title:** Sentry, smoke, production env

**Touches:** error stream parts, landing playbill strip, RLS regression script, Vercel + prod Supabase + Stripe endpoint

**Does:** Hitch [MAYA-117](backlog/defects/MAYA-117-assistant-persist-best-effort-history-divergence.md) and [MAYA-122](backlog/defects/MAYA-122-env-validation-sentry-ratelimit-service-role-hygiene.md) where they fit.

**Exit:** Production URL. A stranger can sign in, talk to a free-tier character on a Free model, hit a Plus/Pro paywall (agent, credits, or model), and pay Stripe.

### PR6 — Mobile v1 (Phase 6)

**Title:** Expo gallery + chat against production API

**Depends on:** PR5. Do not start earlier.

**Cut:** Studio on mobile, NativeWind polish, store listing.

---

## Vertical slice to protect

The product is not a gallery. It is:

1. Sign in
2. Pick a character
3. Stream a reply that stays in character
4. Hit a paywall (agent, credits, or model) that is catalog-true
5. Pay, and the catalog changes what the picker shows

If the calendar slips, cut Studio preview, yearly billing, KaTeX polish, and conversation auto-title — not the compiler, not RLS, not the 403-on-Claude path.

---

## Known traps (do not re-introduce)

1. **Copy-pasting archived `architecture.md` §4** — superseded. Use [`NOW.md`](NOW.md) + this file.
2. **`select *` on agents** — leaks curated `system_prompt`. Explicit column lists / a view.
3. **Concurrent quota** — reserve credits + insert `usage_events` in one transaction (advisory lock) **before** `streamText`. A naive `count(*)` then insert races.
4. **Free + `memory_saver` in the prompt** — a curated base prompt may mention the tool. Compiler must drop that policy when the plan’s `tools_allowed` is empty.
5. **Silent model upgrade** — missing or illegal `modelId` → plan default or 403, never Claude.
6. **Zinc shadcn** — remap tokens in PR0 or the house look never lands.
7. **Missing avatars** — ship square monograms first; linocut SVGs can follow. Paths in seed stay stable.
8. **Usage insert after success only** — aborted streams that already hit the gateway still count.
9. **Hardcoding the company as eight** — curated count is catalog data. Landing `COMPANY` is a snapshot ([TODO-006](backlog/ideas/006-catalog-driven-first-party-bill.md)).

---

## Scaffold-time pins (not blockers)

Record in `.env.example` and a one-line comment on the embedding column when known:

1. Live `models.gateway_id` strings (OpenRouter catalog, pinned in `apps/web/lib/openrouter/catalog.ts`).
2. Embedding model id + dimension N.
3. Search vendor (Tavily vs gateway live search) — pick on the tools PR, one wrapper.
4. Free-tier memory: **none** (last ~20 messages in the window only).

---

## Out of this plan

Voice, RevenueCat, real `code_sandbox`, in-app catalog admin, group chat, community marketplace, push, Upstash, rating, remix. See [`backlog/README.md`](backlog/README.md).
