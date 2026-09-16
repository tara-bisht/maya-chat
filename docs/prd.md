# PRODUCT REQUIREMENT DOCUMENT (PRD): Maya Chat

```yaml
---
document_id: "PRD-MAYA-001"
title: "Maya Chat: Multi-Agent Persona, Memory & Tools Platform"
version: "1.1.0"
status: "APPROVED"
stage: "BUILD_MVP"
last_updated: "2026-09-14"
lead_author: "team-mates/product-manager"
lead_engineer: "team-mates/cto"
target_market: "Lifelong Learners, Students, Knowledge Workers, Casual AI Users"
monetization: "Free / Plus / Pro — plan-gated, configurable model catalog via one LLM gateway"
---
```

Product identity (Maya is host, launch company is a handful, Voice from any listed lab): [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md). Words: [`../CONTEXT.md`](../CONTEXT.md). Starter prompts: [`curated-agents.md`](curated-agents.md). Status: [`NOW.md`](NOW.md). Follow the project description if this file and that one disagree on identity.

## 1. Executive Summary & Product Vision

### 1.1 The Core Proposition: Stop Talking to Boring AI Chatbots

The primary problem with current conversational AI is uniform blandness: every user interaction receives the same sterile, overly-polite, and neutral response from a generic chatbot. Whether asking for calculus proofs, relationship guidance, or movie debates, the voice is identical.

**Maya Chat rejects the generic AI experience.**

> **"Don't talk to a boring AI chatbot. Give your AI personality and character."**
> Every conversation, question, and discussion cannot be a generic AI experience; every conversation must be with an intentional character tailored to the context.

### 1.2 Contextual Character & Tone Dynamics

Different conversations require completely different dynamics, tones, and responses from the AI:

- **When Learning Maths**: Pedagogical rigor, interactive breakdown, engaging banter — not cold formula dumps.
- **When Discussing Your Favourite Movie**: An opinionated cinephile with passion and debate-ready critique — not a bland encyclopedia summary.
- **When Seeking Relationship or Life Advice**: Emotional grounding, fierce empathy, or tough love — not canned corporate disclaimers.

### 1.3 Pre-Built Company vs. Custom Character Creation

1. **Curated (inbuilt) agents**: First-party characters. The catalog can grow to **thousands**. The named set in [`curated-agents.md`](curated-agents.md) is the **starter seed**, not a closed repertory of eight.
2. **Custom Character Studio**: A builder for the user’s own agents — tone sliders, backstories, boundaries, tools — counted against `plans.max_custom_agents`.

Starter examples (not the cap): Marcus, Dr. Priya, Alex, Nonna Maria, Viktor, Valerian, Barnaby, Ren. Specs and prompts stay in the seed doc.

## 2. Core Product Pillars

### 2.1 Persona & Tone Customization Engine

- Tone sliders for custom agents (warmth, directness, humor). Curated voices are locked in the prompt.
- Language presets (including Hinglish / Hindi) and custom phrasing guidelines.
- Configurable backstory and behavioral boundaries.

### 2.2 Hybrid Memory Architecture

- Global user profile (name, language, bio) shared across agents.
- Private episodic memory per `(user_id, agent_id)` via `pgvector`. Plus and Pro only.

### 2.3 Plan-gated, configurable models

- One LLM gateway (OpenRouter). Clients send catalog aliases, never raw vendor ids.
- Three plans: Free, Plus, Pro. Allowlists and defaults live in Postgres.
- Founder edits `plans` / `models` / `plan_models`; the picker and `/api/chat` follow. See [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md).

### 2.4 Platform Matrix

| Capability | Web (Next.js 15) | Mobile (Expo, PR6) |
| :--- | :--- | :--- |
| Primary interaction | Markdown, LaTeX, code | Touch-first chat |
| Voice & speech | v1.1 | v1.1 (RevenueCat IAP) |
| Agent Studio | Desktop builder | Later; web-created agents chat on mobile |
| Monetization | Stripe Checkout + Portal | RevenueCat, v1.1 |

## 3. Scope

### In-scope (Web MVP)

- Starter curated seed + Studio. Free sees `free_tier` agents; Plus/Pro see all curated. Custom caps from `plans`.
- Streaming conversation with markdown and math.
- Episodic memory for Plus/Pro.
- Tools: web search, math solver, memory saver (`code_sandbox` stub).
- Google (Apple later) OAuth.
- Stripe Checkout for Plus and Pro.
- Model picker from the catalog. Daily **AI credits**, not message counts.

### Out of scope (backlog / later)

- Rating an agent 1–5 ([TODO-004](backlog/ideas/004-rate-an-agent.md)).
- Remix an agent ([TODO-005](backlog/ideas/005-remix-an-agent.md)).
- Ensembles: sequential multi-character jobs ([TODO-008](backlog/ideas/008-ensembles.md)). Still not group chat.
- Community agent marketplace / creator payouts.
- Multi-agent group chats.
- Offline local models.
- In-app admin for plans/models (MVP: table editor / SQL).
- Native voice, push, Expo (Expo is PR6 after Web MVP).

## 4. Monetization

Seed prices and limits are **row defaults** in `public.plans`. Changing a row changes the product. Do not hardcode dollar amounts or model names in UI copy that cannot be overridden.

The canonical seed table lives in [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md) §3. Live truth is Postgres.

Upgrade prompts: locked agent, daily credit cap, locked model (403 with the plan’s allowed list — never silently run a higher-tier model), Studio over `max_custom_agents`, or a Free attempt to create a private role.

Public custom agents are a house listing, not a marketplace. Conversations stay per user. See [`adr/0004-public-custom-agents-are-a-house-listing.md`](adr/0004-public-custom-agents-are-a-house-listing.md).
