# Implementation Plan: Maya Chat

```yaml
---
document_id: "IMPL-MAYA-001"
title: "Maya Chat: PR-level implementation plan"
version: "1.0.0"
date: "2026-09-10"
status: "ACTIVE"
depends_on:
  - "PROJECT_DESCRIPTION.md"
  - "technical-plan.md"
  - "tech-stack.md"
  - "roadmap.md"
  - "DESIGN.md"
---
```

This is the **build sequence**. System design stays in [`technical-plan.md`](technical-plan.md). This file turns that design into ordered, mergeable slices.

Repo root is this folder (`maya-chat/`), not `projects/implementation/maya-chat/`.

---

## Locked decisions

| Decision | Lock |
| :--- | :--- |
| Curated company | **8** agents. Seed: [`seed-agents.sql`](seed-agents.sql). |
| Free gate | `agents.free_tier` on Marcus + Dr. Priya only. Plus/Pro see all eight. Not “first N rows.” |
| Categories | `learning`, `philosophy`, `productivity`, `wellbeing`, `lifestyle`, `custom`. Nonna = `wellbeing`. Barnaby = `lifestyle`. |
| Tone sliders | Locked on curated agents. Compiler overlays sliders for **custom** agents only. |
| Tools vs plan | Register `agents.tools_enabled ∩ plans.tools_allowed`. Strip tool-policy text when a tool is not allowed. |
| Catalog | `plans` / `models` / `plan_models` are the source of truth. No `if (plan === 'pro')` for quotas or model names. |
| Chat runtime | Next.js Route Handler, **Node**, `maxDuration = 60`. Not Edge. |
| Gateway | One: Vercel AI Gateway. OpenRouter only if it becomes the **sole** gateway. |
| Embeddings | One vendor, dim pinned in the first memory migration (prefer 1024). Independent of chat-model switching. |
| Billing | Stripe Checkout + Portal for Plus and Pro. RevenueCat is v1.1. |
| Mobile | Phase 6 client of the same API. Do not start Expo until Web MVP is live. |
| UI | [`DESIGN.md`](DESIGN.md) is law. Map shadcn tokens on day 0. No Inter/Geist, no bubbles, no zinc defaults. |
| `architecture.md` | Schema sketch + monorepo layout only. Ignore Edge, `is_pro`, `vector(1536)`, and §4’s dual-track checklist. |

---

## Source of truth

| Question | Read |
| :--- | :--- |
| What / why / packaging | [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md), [`prd.md`](prd.md) |
| How a message flows | [`technical-plan.md`](technical-plan.md) |
| Libraries and env | [`tech-stack.md`](tech-stack.md) |
| Calendar / cuts | [`roadmap.md`](roadmap.md) |
| Screens and tokens | [`DESIGN.md`](DESIGN.md) |
| Prompts | [`curated-agents.md`](curated-agents.md) + seed SQL |
| Words | [`../CONTEXT.md`](../CONTEXT.md) |

---

## PR sequence

Each PR should be independently reviewable. Do not merge a slice that lacks Zod (if it adds a route), RLS (if it adds a table), or `tsc --noEmit`.

### PR0 — Scaffold (Phase 0)

**Title:** Monorepo, Next.js 15 house, Maya tokens, env inventory

**Touches:** `apps/web`, `packages/shared`, `packages/database`, `supabase/`, `pnpm-workspace.yaml`, `turbo.json`, `.env.example`, CI, `DESIGN.md` → CSS variables

**Does:** Night-wall lobby (`#14110F`), Fraunces italic wordmark, costume-flood posters, shadcn remapped to Maya Street Cast, empty Vitest pipeline.

**Does not:** Auth, chat, Stripe, Expo.

**Exit:** `pnpm turbo typecheck` and `lint` clean. Preview deploy possible.

### PR1 — Data + Auth (Phase 1)

**Title:** Migrations, RLS, Google/Apple sign-in, catalog seed

**Touches:** `supabase/migrations/*`, `packages/database`, `apps/web/app/(auth)`, profile trigger

**Does:** Tables from [`architecture.md`](architecture.md) §3 plus catalog/entitlements/usage from [`technical-plan.md`](technical-plan.md) §6. Seed eight agents + `free_tier`. `auth.users` → `profiles` + `entitlements(free)`. Login page: “The house is members only.”

**Does not:** Chat route.

**Exit:** Sign in locally. User B cannot read user A’s rows. Curated agents selectable under RLS.

### PR2 — Gallery + streaming chat (Phase 2)

**Title:** Playbill gallery and Marcus streaming thread

**Touches:** `(app)/gallery`, `(app)/chat/[conversationId]`, `POST /api/conversations`, `POST /api/chat`, `GET /api/agents` (no `system_prompt`)

**Does:** Cast-first rail, attributed dialogue, `useChat`, persist user message before `streamText`, `onFinish` assistant + tokens. Hardcoded Marcus prompt + one fast model is OK **if** entitlement helpers are extracted so PR4 does not rewrite the route.

**Does not:** Compiler, tools, Stripe, model picker (unless cheap).

**Exit:** Signed-in user opens Marcus, streams, refreshes, history remains.

**Cut:** KaTeX, auto-title.

### PR3 — Prompt compiler + tools + Studio (Phase 3)

**Title:** `compilePrompt()`, tool hub, Casting notes

**Touches:** `packages/shared` (compiler + Vitest), chat route, `(app)/studio`, tool factory

**Does:** Merge order from technical-plan §5. `memory_saver` (write; embed can no-op until PR4), thin `math_solver`, thin `web_search` behind plan tools, `code_sandbox` stub. Studio gated in PR4.

**Exit:** Dr. Priya returns LaTeX. Compiler tests cover merge order, slider extremes (custom), and “no tool policy on Free.”

**Cut:** Studio preview pane; language presets beyond `en` + Hinglish.

### PR4 — Memory, catalog routing, Stripe (Phase 4)

**Title:** pgvector retrieve, plan-gated models, Plus/Pro Checkout

**Touches:** embeddings + `match_agent_memories`, `GET /api/models`, quota before `streamText`, Stripe webhook + `stripe_events`, pricing page

**Does:** 403 on locked agent / locked model (body includes allowlist). 429 on daily cap. 402 on Studio over cap. Webhook maps `price_id` → `plans.id`. Pricing copy reads catalog.

**Exit:** Free blocked on Alex, on message 51, and on Claude. Plus unlocks Alex + DeepSeek. Pro unlocks Claude. `INSERT INTO plan_models` changes the picker with no deploy.

**Cut:** Yearly prices; Stripe-hosted portal is enough.

### PR5 — Harden + Web MVP (Phase 5)

**Title:** Sentry, smoke, production env

**Touches:** error stream parts, landing playbill strip, RLS regression script, Vercel + prod Supabase + Stripe endpoint

**Exit:** Production URL. Definition of done in [`roadmap.md`](roadmap.md).

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
4. Hit a paywall (agent, quota, or model) that is catalog-true
5. Pay, and the catalog changes what the picker shows

If the calendar slips, cut Studio preview, yearly billing, KaTeX polish, and conversation auto-title — not the compiler, not RLS, not the 403-on-Claude path.

---

## Known traps (do not re-introduce)

1. **Copy-pasting `architecture.md` §4** — superseded. Use this file + `roadmap.md`.
2. **`select *` on agents** — leaks curated `system_prompt`. Explicit column lists / a view.
3. **Concurrent quota** — count + insert `usage_events` in one transaction (or advisory lock) **before** `streamText`. A naive `count(*)` then insert races.
4. **Free + `memory_saver` in the prompt** — Marcus’s base prompt mentions the tool. Compiler must drop that policy when the plan’s `tools_allowed` is empty.
5. **Silent model upgrade** — missing or illegal `modelId` → plan default or 403, never Claude.
6. **Zinc shadcn** — remap tokens in PR0 or the house look never lands.
7. **Missing avatars** — ship square monograms first; linocut SVGs can follow. Paths in seed stay stable.
8. **Usage insert after success only** — aborted streams that already hit the gateway still count.

---

## Scaffold-time pins (not blockers)

Record in `.env.example` and a one-line comment on the embedding column when known:

1. Live `models.gateway_id` strings (Vercel AI Gateway catalog, Day 0).
2. Embedding model id + dimension N.
3. Search vendor (Tavily vs gateway live search) — pick on the tools PR, one wrapper.
4. Free-tier memory: **none** (last ~20 messages in the window only).

---

## Out of this plan

Voice, RevenueCat, real `code_sandbox`, in-app catalog admin, group chat, marketplace, push, Upstash. See `roadmap.md` v1.1.
