# Project Description: Maya Chat

```yaml
---
document_id: "DESC-MAYA-001"
title: "Maya Chat: Project Description & Engineering Handover"
version: "2.1.0"
date: "2026-09-14"
status: "APPROVED-FOR-BUILD"
author: "Kamal Bisht (Founder)"
target_audience: "CTO, Engineering Pod, Product"
portfolio_id: "PRJ-MAYA-001"
primary_domain: "Consumer multi-agent chat SaaS (personas, memory, tools)"
target_stack: "Next.js 15, Expo, TypeScript, Supabase (Postgres + pgvector + RLS), OpenRouter + Vercel AI SDK, Stripe"
monetization: "Free / Plus / Pro — model allowlists configurable in Postgres"
---
```

Handover brief. Product intent: [`prd.md`](prd.md). How a turn flows: [`technical-plan.md`](technical-plan.md). What is shipped: [`NOW.md`](NOW.md). Words: [`../CONTEXT.md`](../CONTEXT.md).

---

## 1. What it is

**Maya Chat** is a web + later iOS/Android product: **Don't talk to a boring AI chatbot. Give your AI personality and character.**

Every interaction is with an intentional character:

- **Context-driven personality**: learning maths is a different character than dissecting a film or taking advice.
- **Pre-built or custom**: talk to first-party inbuilt characters, or write your own in Studio.

The first-party **curated** catalog is unbounded (thousands of inbuilt agents over time). [`curated-agents.md`](curated-agents.md) is the **starter seed**, not a closed roster of eight. Free sees rows with `free_tier`; Plus/Pro see every live curated agent.

The wedge: personality-first matching + utility + private per-agent memory + the user picking which model talks, gated by plan.

---

## 2. What we are building toward

1. Sign in (Google / Apple) on the web.
2. Chat with a persona that stays in character.
3. Pick a **model from the list allowed on your plan**.
4. Hit a paywall (locked agent, quota, or locked model) and upgrade **Free → Plus → Pro** via Stripe.
5. Founder can change **which models sit on which plan**, quotas, and prices **in the database** without a deploy.

Mobile is the same API (PR6). Voice, store IAP, real code execution, group chat, community marketplace, ratings, and remix are **later** ([`backlog/README.md`](backlog/README.md)).

---

## 3. Plans (Free / Plus / Pro)

Three plans. Seed prices and limits below are **defaults in `public.plans`**. Change the row; the app follows. Do not `if (plan === 'pro')` for quotas or model names in application code.

| | **Free** | **Plus** | **Pro** |
| :--- | :--- | :--- | :--- |
| Price (seed) | $0 | **$9 / mo** or **$90 / yr** | **$19 / mo** or **$190 / yr** |
| Daily credits | 1,500 | 4,000 | 9,000 |
| Curated agents | `free_tier` rows (seed: Marcus, Dr. Priya) | All curated | All curated |
| Custom agents | 3, public only | 10, public or private | Unlimited (`null`) |
| Vector memory | No | Yes | Yes |
| Tools | none (short-term chat only) | `memory_saver`, `math_solver` | those + `web_search` |
| Voice | — | — | v1.1 |
| **Models** | Fast/cheap allowlist | Mid-tier allowlist | All enabled models |

Stripe products: **Plus** and **Pro**. Webhook maps `price_id` → `plans.id` using `plans.stripe_price_id_monthly` / `yearly`. `entitlements.plan` is `free | plus | pro`.

### Seed model allowlist

One **LLM gateway** (OpenRouter). The app stores an alias (`grok-fast`) and an OpenRouter slug (`x-ai/grok-4.20`). Live ids pinned 2026-09-10; the table is the source of truth after that.

| Alias | Gateway id (OpenRouter slug) | Free | Plus | Pro |
| :--- | :--- | :---: | :---: | :---: |
| `gemini-flash` | `google/gemini-2.5-flash` | ✓ | ✓ | ✓ |
| `grok-fast` | `x-ai/grok-4.20` | ✓ | ✓ | ✓ |
| `deepseek` | `deepseek/deepseek-chat` | | ✓ | ✓ |
| `qwen` | `qwen/qwen3-235b-a22b` | | ✓ | ✓ |
| `grok` | `x-ai/grok-4.5` | | ✓ | ✓ |
| `gpt` | `openai/gpt-5.4` | | ✓ | ✓ |
| `claude` | `anthropic/claude-sonnet-4.5` | | | ✓ |
| `kimi` | `moonshotai/kimi-k2.5` | | | ✓ |

Default model per plan (seed): Free → `gemini-flash`, Plus → `grok`, Pro → `claude`.

Do not add a second SDK per lab. Chat UI still uses the Vercel AI SDK through `@openrouter/ai-sdk-provider`. See [`adr/0001-openrouter-sole-gateway.md`](adr/0001-openrouter-sole-gateway.md).

---

## 4. Configurable — what that means

**Configurable** = Postgres, not env vars and not a TypeScript const that requires a PR.

| Table | Purpose |
| :--- | :--- |
| `models` | Alias, gateway id, provider label, tools support, enabled flag, sort order |
| `plans` | Price cents, Stripe price ids, daily cap, custom-agent cap, memory flag, tools array, default model |
| `plan_models` | Which models each plan may use |
| `entitlements` | This user’s current `plan` (from Stripe / manual) |

MVP config UX: **Supabase table editor or SQL**. No in-app admin until later.

Chat path:

1. Client sends optional `modelId`.
2. Server loads the user’s plan → allowed models (`is_enabled` ∩ `plan_models`).
3. Missing `modelId` → `plans.default_model_id`.
4. `modelId` not allowed → **403** (never silently upgrade to Claude).
5. `streamText({ model: openrouter(models.gateway_id) })`.
6. `GET /api/models` returns every enabled model with `allowed` + `minPlan` (locked rows are the upsell).

---

## 5. Architecture (one page)

```
Web (Next.js)  ─┐
                ├── POST /api/chat  →  quota + plan_models + prompt compiler
Expo (later)   ─┘         │
                          ├── OpenRouter  →  OpenAI / Anthropic / Gemini / Grok / …
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

See [`NOW.md`](NOW.md). Remaining slices: [`implementation-plan.md`](implementation-plan.md).

Web MVP is done when a production user can chat on Free models, get 403 on Claude, pay Plus, see DeepSeek in the picker, pay Pro, see Claude, and you can add a model to Plus with an `INSERT` into `plan_models` (no deploy). Adding a curated agent is a catalog/seed change, not a product-identity change.

---

## 7. Doc map

| Doc | Use |
| :--- | :--- |
| [`prd.md`](prd.md) | Product scope |
| [`NOW.md`](NOW.md) | Shipped vs next |
| [`DESIGN.md`](DESIGN.md) | Visual identity |
| [`tech-stack.md`](tech-stack.md) | Locked libraries, gateway, env |
| [`technical-plan.md`](technical-plan.md) | Schema, chat lifecycle, APIs |
| [`implementation-plan.md`](implementation-plan.md) | Remaining PR write-ups |
| [`backlog/README.md`](backlog/README.md) | Open work |
| [`../CONTEXT.md`](../CONTEXT.md) | Domain glossary |
| [`curated-agents.md`](curated-agents.md) | Starter seed prompts |
| [`seed-agents.sql`](seed-agents.sql) | Starter curated rows |
