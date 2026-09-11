# TECH STACK: Maya Chat

```yaml
---
document_id: "TECH-MAYA-001"
title: "Maya Chat: Locked Tech Stack & Engineering Defaults"
version: "1.0.0"
status: "APPROVED-FOR-BUILD"
stage: "BUILD_MVP"
last_updated: "2026-09-10"
lead_engineer: "team-mates/cto"
supersedes: "Unspecified provider / Edge chat / OpenAI embeddings in architecture.md"
related:
  - "PROJECT_DESCRIPTION.md"
  - "technical-plan.md"
  - "roadmap.md"
  - "architecture.md"
  - "prd.md"
---
```

This document **locks** the stack for Maya Chat. Handover: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md). Product intent: [`prd.md`](prd.md). Schema sketches: [`architecture.md`](architecture.md). System design: [`technical-plan.md`](technical-plan.md). Sequence: [`roadmap.md`](roadmap.md).

**Rule:** do not add a dependency that is not in this file without updating this file first.

---

## 1. Stack at a glance

| Layer | Choice | Why this, not the alternative |
| :--- | :--- | :--- |
| Web app | **Next.js 15** App Router, TypeScript, Tailwind, shadcn/ui | Team Freedom default. SSR auth, Route Handlers, Vercel deploy, one server for web + mobile API. |
| Mobile app | **Expo SDK** (RN) + Expo Router + NativeWind | Same TypeScript, same API, EAS builds. Phase 6, not day 1. |
| Monorepo | **pnpm** + **Turborepo** | Shared types, prompt compiler, Zod schemas. Avoids copy-paste between web and mobile. |
| App server | Next.js Route Handlers, **Node.js runtime** for chat | pgvector, embeddings, tools, and entitlement checks do not belong on Edge. |
| Auth + DB | **Supabase** Postgres + Auth (Google, Apple) + **RLS** | Company default. No custom user table as source of truth. |
| Vectors | Supabase **pgvector** | Agent-private episodic memory without a second database. |
| LLM | **OpenRouter** (`@openrouter/sdk`) — one key, many labs | Sole gateway. Catalog stores OpenRouter slugs. Chat (PR2) still uses Vercel AI SDK `streamText` via `@openrouter/ai-sdk-provider`. No `@ai-sdk/openai` / anthropic / xai. |
| Model catalog | Postgres `models` + `plans` + `plan_models` | Free / Plus / Pro allowlists are **data**. Chat never hardcodes Grok vs Claude. |
| Embeddings | Gateway embedding model **or** xAI `/v1/embeddings` | One embedding vendor, dim **pinned at scaffold**. Independent of chat-model switching. |
| Validation | **Zod** on every route, webhook, and tool input | Company verification gate. |
| Billing (MVP) | **Stripe** Checkout + Portal — **Plus and Pro** | Webhook maps price id → `plans.id`. Source of truth for entitlements. |
| Billing (later) | **RevenueCat** IAP | After web billing works. Mobile never writes `plan` itself. |
| Search tool | One thin vendor (**Tavily**, or xAI live search if enabled) | Timeout + cap. No LangChain agent graph. |
| Hosting | **Vercel** (web + API), **Supabase Cloud**, **EAS** (mobile) | Solo-ops. No k8s, no self-hosted LLM. |
| Observability | Vercel logs + **Sentry** + `messages.tokens_used` | Enough to debug a streaming chat without a full APM suite. |
| Tests | **Vitest** for `@maya/shared` and `apps/web/lib`; Playwright later for web smoke | Prompt compiler, quota logic, and gateway catalog must be unit-tested from day 1. |

Version policy: pin current stable at scaffold (`package.json`). Do not chase majors mid-sprint. Confirm **gateway model ids** against the live OpenRouter catalog on Day 0 and write them into `models.gateway_id` — names change. See [`adr/0001-openrouter-sole-gateway.md`](adr/0001-openrouter-sole-gateway.md).

---

## 2. Clients

### 2.1 Web — `apps/web`

| Piece | Default |
| :--- | :--- |
| Framework | Next.js 15, App Router, `src/` optional — match scaffolder (`app/` at package root) |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS + shadcn/ui + Lucide |
| Chat UI | `@ai-sdk/react` `useChat` against `/api/chat` (UI message stream, not raw text stream) |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| Math | KaTeX (`rehype-katex` / `remark-math`) for Dr. Priya |
| Auth | `@supabase/ssr` cookie session (server components + route handlers) |
| Deploy | Vercel, region close to Supabase |

Routes that matter:

- `(marketing)` — landing + pricing
- `(auth)` — login, OAuth callback
- `(app)/gallery` — curated + user agents
- `(app)/chat/[conversationId]` — streaming thread
- `(app)/studio` — custom agent + tone sliders
- `(app)/settings` — profile, billing portal
- `api/chat` — streaming gateway (Node); `modelId` checked against `plan_models`
- `api/models` — catalog for the picker (`allowed` + `minPlan` + credits)
- `api/credits` — daily/monthly remaining for the meter
- `api/webhooks/stripe` — entitlements (`free` / `plus` / `pro`)

### 2.2 Mobile — `apps/mobile` (Phase 6)

| Piece | Default |
| :--- | :--- |
| Framework | Expo SDK + Expo Router (tabs + chat stack) |
| Styling | NativeWind |
| Chat | Same `useChat` transport to the **web origin** `/api/chat` |
| Auth | Supabase Auth PKCE; Google + Apple |
| Push / Voice | **v1.1**, not MVP |

Mobile does not embed `OPENROUTER_API_KEY` or Stripe secret. It is a client of the Next.js API + Supabase (RLS).

---

## 3. Backend & data

### 3.1 Application server

There is **one** backend: Next.js.

| Concern | Decision |
| :--- | :--- |
| Chat route runtime | `export const runtime = 'nodejs'` |
| Chat duration | `maxDuration = 60` |
| Input validation | Zod schemas in `@maya/shared` |
| LLM calls | OpenRouter via `@openrouter/sdk`. Chat (PR2): `streamText` from `ai` with `@openrouter/ai-sdk-provider` wrapping `models.gateway_id` |
| Tools | `tool({ inputSchema, execute })` + `stopWhen: stepCountIs(n)` |
| Persistence | Supabase server client (user JWT). Service role **only** for webhooks / embedding backfill. |

**Not Edge.** The original architecture diagram labeled `/api/chat` as Edge. Retrieval + embeddings + multi-step tools make Edge a footgun (node APIs, connection pooling, timeouts). Marketing pages may stay static/Edge.

### 3.2 Supabase

| Piece | Decision |
| :--- | :--- |
| Auth | Email optional; **Google + Apple** OAuth for web and mobile |
| DB | Postgres 15+ with `vector` extension |
| Security | RLS on every public table. Browser uses anon key + user JWT only |
| Types | `supabase gen types typescript` → `packages/database` |
| Migrations | `supabase/migrations/` in the turborepo, not ad-hoc SQL in the dashboard |
| Storage | Avatars later; MVP can use static `/public/avatars` for curated agents |

Canonical tables (see [`architecture.md`](architecture.md) §3): `profiles`, `agents`, `agent_memories`, `conversations`, `messages`.

**Additions required before build** (full SQL in [`technical-plan.md`](technical-plan.md) §6):

- `models`, `plans`, `plan_models` — configurable catalog (see [`technical-plan.md`](technical-plan.md) §6)
- `entitlements` — Stripe (later RevenueCat) writes `plan` ∈ `free|plus|pro`; optional `profiles.plan` cache
- `usage_events` — daily AI credit cap from `plans.daily_credit_limit`
- `match_agent_memories(...)` RPC with HNSW
- indexes on `(user_id, agent_id)` and `(conversation_id, created_at)`

---

## 4. AI layer (one gateway)

**Do not add `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/xai`, etc.** One gateway, one secret.

| Role | Policy |
| :--- | :--- |
| Chat | OpenRouter. PR2: `streamText({ model: openrouter(row.gateway_id) })` where `row` comes from `models`. |
| Which models a user may pick | `plan_models` ∩ `models.is_enabled` for `entitlements.plan` |
| Default model | `plans.default_model_id` |
| Key | `OPENROUTER_API_KEY` (server only). |
| Typed client | `@openrouter/sdk` in `apps/web/lib/openrouter` (`getOpenRouter()`). Never imported from a Client Component. |
| Chat UI SDK (PR2) | `ai` + `@ai-sdk/react` (`useChat`) + `@openrouter/ai-sdk-provider` |
| Embeddings | OpenRouter embeddings API, dim pinned at scaffold (`vector(1024)`). Switching chat models must **not** change embedding dim. |

```ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, tool, stepCountIs } from 'ai';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

const result = streamText({
  model: openrouter(modelRow.gateway_id), // e.g. 'anthropic/claude-sonnet-4.5'
  system: compiledPrompt,
  messages,
  tools: { /* intersection of agent tools and plan.tools_allowed */ },
  stopWhen: stepCountIs(5),
});
```

Seed aliases and plan allowlists: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md) §3. Gateway ids are OpenRouter slugs, pinned in `apps/web/lib/openrouter/catalog.ts`.

### Embeddings — do not copy `vector(1536)` blindly

[`architecture.md`](architecture.md) assumed OpenAI `text-embedding-3-small` at 1536 dims. That is **superseded**.

At Day 0 pick **one** embedding model on OpenRouter, pin `dimensions` if the API allows (prefer 1024), bake `vector(N)` into the migration. Never mix dims in one column. Migration currently has `vector(1024)`; confirm the embedding model in the memory PR.

If the embedding vendor documents query/passage prefixes, the writer and retriever must both use them.

---

## 5. Tools

| Tool id | MVP | Implementation |
| :--- | :--- | :--- |
| `memory_saver` | **Ship** | Zod `{ content, metadata? }` → insert `agent_memories` + embed. Strict `(auth.uid(), agent_id)`. |
| `web_search` | **Ship thin** | One HTTP wrapper. Timeout ~8s, max 5 snippets. Env: `TAVILY_API_KEY` or xAI live-search if we enable it instead — pick **one** on Day 8. |
| `math_solver` | **Ship thin** | Model produces step-by-step + LaTeX. Optional arithmetic `evaluate` for numeric checks. No Wolfram. |
| `code_sandbox` | **Stub** | Tool exists so prompts keep calling it; `execute` returns `{ status: "unsupported", hint }`. Model still writes code in markdown. Real isolation (E2B / Vercel Sandbox) is v1.1. |

Agents only receive tools listed in `agents.tools_enabled`. Never register the full hub on every request.

---

## 6. Billing

| Channel | MVP | Later |
| :--- | :--- | :--- |
| Web | Stripe Checkout, Customer Portal, `checkout.session.completed` / `customer.subscription.*` webhooks | — |
| iOS / Android | Not required for Web MVP | RevenueCat → same `entitlements` row |
| Prices | Plus $9 / Pro $19 (seed) | **Stripe price ids live on `plans` rows**, not in client code. Env may hold secrets only. |

Webhook (service role) sets `entitlements.plan` by looking up `plans.stripe_price_id_*`. Optional `profiles.plan` cache. Chat authorization reads `entitlements` + `plans` + `plan_models`, never a client `isPro` flag.

---

## 7. Repo & DX

When code is scaffolded (not this docs pass), it lives **in this repository root**:

```
maya-chat/
├── apps/web/
├── apps/mobile/          # Phase 6
├── packages/shared/      # Zod, types, prompt compiler, tones, entitlements helpers
├── packages/database/    # generated types, supabase helpers
├── supabase/migrations/
├── prd.md
├── architecture.md
├── PROJECT_DESCRIPTION.md
├── tech-stack.md
├── technical-plan.md
├── roadmap.md
└── ...
```

| Tool | Default |
| :--- | :--- |
| Package manager | pnpm |
| Orchestration | Turborepo (`build`, `lint`, `typecheck`, `test`) |
| Lint / format | ESLint + Prettier (or repo standard) |
| Unit tests | Vitest in `packages/shared` |
| Env | `.env.local` gitignored; `.env.example` committed |

---

## 8. Environment variables

**Public (client-safe):**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**Secret (server only — never `NEXT_PUBLIC_`):**

```
OPENROUTER_API_KEY=             # sole LLM gateway; never NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TAVILY_API_KEY=                 # if Tavily is the search vendor
SENTRY_DSN=
# Stripe price ids belong on public.plans, not here.
```

Mobile additionally uses the same `NEXT_PUBLIC_SUPABASE_*` (or Expo `EXPO_PUBLIC_*` aliases) and the web API origin. No LLM key on device.

---

## 9. Explicitly rejected

| Rejected | Reason |
| :--- | :--- |
| Custom FastAPI / Nest “AI gateway” | Second deploy, second auth story, slower MVP. Next.js is the gateway. |
| LangChain / LlamaIndex as the app layer | Heavy graph, poor streaming fit with `useChat`. Retrieval is ~40 lines of SQL + embed. |
| Edge runtime for `/api/chat` | Breaks pgvector/tools/timeouts. |
| One SDK per lab (`@ai-sdk/openai` + anthropic + google + xai + …) | Defeats the gateway. Catalog stores OpenRouter slugs. |
| Vercel AI Gateway **and** OpenRouter | Two secrets, two slug dialects. OpenRouter is the sole gateway ([ADR 0001](adr/0001-openrouter-sole-gateway.md)). |
| Hardcoded `if (isPro) grok-4.5` | Plans and models are rows. |
| Dual-writing `plan` / `is_pro` from the client | Entitlement fraud. Webhooks only. |
| Firebase / Mongo | RLS + pgvector + SQL are the company data primitive. |
| Prisma as source of truth | Supabase migrations + generated types. Prisma optional later, not day 1. |
| Self-hosted open-weight models | Ops cost; kills the &lt;$infra / solo-maintainer constraint. |
| Real code execution in MVP | Support tickets and RCE risk. Stub the tool. |


---

## 10. Cost posture

| Cost | How we keep it boring |
| :--- | :--- |
| Vercel + Supabase | Stay on starter/pro until traffic forces a move |
| LLM | Plan allowlist + `plans.daily_credit_limit` **before** `streamText`. Free stays on cheap models. |
| Embeddings | Pin smaller `dimensions` if quality holds; embed on memory *write*, not every token |
| Search | Cap snippets; only if `web_search` ∈ `plans.tools_allowed` |
| Vectors | HNSW, top-k ≤ 8, filter `user_id` + `agent_id` in the RPC (not after fetch) |

Launch goal: infra in the usual Team Freedom cheap band; **LLM is the only volatile cost**, and quotas exist to bound it.
