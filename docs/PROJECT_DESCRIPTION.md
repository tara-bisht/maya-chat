# Project Description: Maya Chat

```yaml
---
document_id: "DESC-MAYA-001"
title: "Maya Chat: Project Description & Engineering Handover"
version: "2.0.0"
date: "2026-09-10"
status: "APPROVED-FOR-BUILD"
author: "Kamal Bisht (Founder)"
target_audience: "CTO, Engineering Pod, Product"
portfolio_id: "PRJ-MAYA-001"
primary_domain: "Consumer multi-agent chat SaaS (personas, memory, tools)"
target_stack: "Next.js 15, Expo, TypeScript, Supabase (Postgres + pgvector + RLS), Vercel AI SDK + AI Gateway, Stripe"
monetization: "Free / Plus $9/mo / Pro $19/mo — model allowlists configurable in Postgres"
---
```

This is the **handover brief** for Maya Chat. Use it to understand the product, the three paid layers, and the rule that **models are catalog data, not hardcoded providers**. Detail lives in [`prd.md`](prd.md), [`tech-stack.md`](tech-stack.md), [`technical-plan.md`](technical-plan.md), and [`roadmap.md`](roadmap.md).

---

## 1. What it is & Core Market Angle

**Maya Chat** is a web + later iOS/Android product built on a single core truth: **Don't talk to a boring AI chatbot. Give your AI personality and character.**

Every conversation, question, or discussion cannot and should not be a generic AI experience. Every interaction must be with an intentional character tailored to the context:
- **Context-driven personality & tone**: When learning maths, you need a different character, pedagogical tone, and response cadence than when dissecting your favourite movie or seeking advice about your relationship.
- **Pre-built or custom**: Users can converse with our curated repertory company of out-of-the-box characters or craft their own custom characters in the Studio as per their exact needs.

Eight curated agents ship in the gallery: Marcus (Savage Stoic), Dr. Priya (Flirty STEM Prof), Alex (Exhausted 10x Tech Lead), Nonna Maria (Fierce Italian Grandma), Viktor (Tin-Foil Drill Sergeant), Valerian (Cosmic Polymath: Physics & Wealth in Verse), Barnaby (Cynical Apartment Cat), and Ren (Shy Metaphysician). Specs: [`curated-agents.md`](curated-agents.md).

The wedge: **personality-first context matching (anti-boring AI) + utility**, plus **private per-agent memory**, plus **the user picking which model talks** — gated by plan.

---

## 2. What we are building toward

1. Sign in (Google / Apple) on the web.
2. Chat with a persona that stays in character.
3. Pick a **model from the list allowed on your plan**.
4. Hit a paywall (locked agent, quota, or locked model) and upgrade **Free → Plus → Pro** via Stripe.
5. Founder can change **which models sit on which plan**, quotas, and prices **in the database** without a deploy.

Mobile (days 15–21) is the same API. Voice, store IAP, real code execution, group chat, marketplace are **v1.1**.

---

## 3. Plans (Free / Plus / Pro)

Three plans. Seed prices and limits below are **defaults in `public.plans`**. Change the row; the app follows. Do not `if (plan === 'pro')` for quotas or model names in application code.

| | **Free** | **Plus** | **Pro** |
| :--- | :--- | :--- | :--- |
| Price (seed) | $0 | **$9 / mo** or **$90 / yr** | **$19 / mo** or **$190 / yr** |
| Daily messages | 50 | 200 | Unlimited (`null`) |
| Curated agents | 2 (Marcus + Dr. Priya) | All 8 | All 8 |
| Custom agents | 0 | 5 | Unlimited (`null`) |
| Vector memory | No | Yes | Yes |
| Tools | none (short-term chat only) | `memory_saver`, `math_solver` | those + `web_search` |
| Voice | — | — | v1.1 |
| **Models** | Fast/cheap allowlist | Mid-tier allowlist | All enabled models |

Stripe products: **Plus** and **Pro**. Webhook maps `price_id` → `plans.id` using `plans.stripe_price_id_monthly` / `yearly`. `entitlements.plan` is `free | plus | pro`.

### Seed model allowlist

One **LLM gateway** (Vercel AI Gateway). The app stores an alias (`grok-fast`) and a gateway string (`xai/grok-4-1-fast`). Confirm live ids on Day 0; the table is the source of truth after that.

| Alias | Gateway id (pin at scaffold) | Free | Plus | Pro |
| :--- | :--- | :---: | :---: | :---: |
| `gemini-flash` | `google/gemini-2.5-flash` | ✓ | ✓ | ✓ |
| `grok-fast` | `xai/grok-4-1-fast` | ✓ | ✓ | ✓ |
| `deepseek` | `deepseek/deepseek-chat` | | ✓ | ✓ |
| `qwen` | `qwen/qwen3-235b-a22b` | | ✓ | ✓ |
| `grok` | `xai/grok-4.5` | | ✓ | ✓ |
| `gpt` | `openai/gpt-5.4` | | ✓ | ✓ |
| `claude` | `anthropic/claude-sonnet-4.5` | | | ✓ |
| `kimi` | `moonshotai/kimi-k2.5` | | | ✓ |

Default model per plan (seed): Free → `gemini-flash`, Plus → `grok`, Pro → `claude`.

If Vercel AI Gateway does not list Kimi or Qwen, **switch the whole catalog to OpenRouter** (`OPENROUTER_API_KEY` only). Do not add a second SDK per lab.

---

## 4. Configurable — what that means

**Configurable** = Postgres, not env vars and not a TypeScript const that requires a PR.

| Table | Purpose |
| :--- | :--- |
| `models` | Alias, gateway id, provider label, tools support, enabled flag, sort order |
| `plans` | Price cents, Stripe price ids, daily cap, custom-agent cap, memory flag, tools array, default model |
| `plan_models` | Which models each plan may use |
| `entitlements` | This user’s current `plan` (from Stripe / manual) |

MVP config UX: **Supabase table editor or SQL**. No in-app admin until v1.1.

Chat path:

1. Client sends optional `modelId`.
2. Server loads the user’s plan → allowed models (`is_enabled` ∩ `plan_models`).
3. Missing `modelId` → `plans.default_model_id`.
4. `modelId` not allowed → **403** (never silently upgrade to Claude).
5. `streamText({ model: models.gateway_id })`.
6. `GET /api/models` returns only that plan’s list for the picker.

---

## 5. Architecture (one page)

```
Web (Next.js)  ─┐
                ├── POST /api/chat  →  quota + plan_models + prompt compiler
Expo (later)   ─┘         │
                          ├── Vercel AI Gateway  →  OpenAI / Anthropic / Gemini / Grok / …
                          └── Supabase (RLS): agents, memories, plans, models, entitlements
                                      Stripe webhook → entitlements.plan
```

- **One server:** Next.js. Mobile never holds gateway or Stripe keys.
- **Chat runtime:** Node, not Edge (`maxDuration` 60).
- **Personas:** `@maya/shared` prompt compiler (unit-tested). Curated `system_prompt` is server-only.
- **Memory:** `pgvector` per `(user_id, agent_id)`. Plus and Pro only.
- **Billing:** Stripe Checkout + Portal. Two paid prices. Founder can retarget price ids on `plans` rows.

Non-negotiables: Zod on every route, RLS on every table, no provider API keys on the client, no `@ai-sdk/openai` + `@ai-sdk/anthropic` + … stack.

---

## 6. Delivery

See [`roadmap.md`](roadmap.md).

- **Days 1–14:** Web MVP — auth, gallery, streaming chat, compiler, catalog, Stripe Plus + Pro, quotas, model picker.
- **Days 15–21:** Expo against the same API.
- **v1.1:** Voice, RevenueCat, real sandbox, in-app plan/model admin.

Web MVP is done when a production user can chat on Free models, get 403 on Claude, pay Plus, see DeepSeek in the picker, pay Pro, see Claude, and you can add a model to Plus with an `INSERT` into `plan_models` (no deploy).

---

## 7. Doc map

| Doc | Use |
| :--- | :--- |
| [`prd.md`](prd.md) | Product scope, personas, 3-tier packaging |
| [`DESIGN.md`](DESIGN.md) | Visual identity (Maya Street Cast): night wall, costume floods, acid tickets |
| [`tech-stack.md`](tech-stack.md) | Locked libraries, gateway, env |
| [`technical-plan.md`](technical-plan.md) | Schema, chat lifecycle, APIs, security |
| [`roadmap.md`](roadmap.md) | Phases and cuts |
| [`implementation-plan.md`](implementation-plan.md) | PR-level build sequence |
| [`../CONTEXT.md`](../CONTEXT.md) | Domain glossary |
| [`architecture.md`](architecture.md) | Original monorepo + agent/memory SQL |
| [`curated-agents.md`](curated-agents.md) | System prompts |
| [`seed-agents.sql`](seed-agents.sql) | Curated agent rows |
