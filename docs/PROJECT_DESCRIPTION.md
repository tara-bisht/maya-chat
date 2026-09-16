# Project Description: Maya Chat

```yaml
---
document_id: "DESC-MAYA-001"
title: "Maya Chat: Project Description"
version: "3.0.0"
date: "2026-09-17"
status: "PRODUCT-LOCK"
author: "Kamal Bisht (Founder)"
target_audience: "Product, Engineering, Design"
portfolio_id: "PRJ-MAYA-001"
primary_domain: "Consumer chat — specialized named agents, plan-gated models from every lab"
target_stack: "Next.js 15, Expo (later), TypeScript, Supabase (Postgres + pgvector + RLS), OpenRouter + Vercel AI SDK, Stripe"
monetization: "Free / Plus / Pro — model allowlists configurable in Postgres"
---
```

This file is **what the product is**. Screens: [`DESIGN.md`](DESIGN.md). Words: [`../CONTEXT.md`](../CONTEXT.md). Shipped vs next: [`NOW.md`](NOW.md). How a turn flows: [`technical-plan.md`](technical-plan.md).

It supersedes the 2026-09-14 handover on identity and sequencing. Stack, plans, and catalog tables below are unchanged unless a section says otherwise.

Related locks: [`adr/0005-maya-is-the-host.md`](adr/0005-maya-is-the-host.md), [`adr/0006-launch-company-is-a-handful.md`](adr/0006-launch-company-is-a-handful.md), [`adr/0007-plain-chrome-language.md`](adr/0007-plain-chrome-language.md).

---

## 1. The product, in one page

People already use AI for many jobs: write the email, debug the function, learn the proof, take advice, practice the interview, stay on the workout. Today those jobs all hit the same bland assistant.

**Maya Chat is specialized AI you can actually steer.** Every conversation is with a named character who is good at a job, has a personality you can feel, and speaks through a model you chose — from any lab we list, not one vendor.

That is the whole product. Everything else is a door into it.

| Pillar | What the user gets |
| :--- | :--- |
| **Specialist, not bland** | A named Agent with a job, a voice, and a behavioral loop. Marcus is not Priya. Priya is not Alex. |
| **Use-case first** | You come for a job (code, study, advice, career, fitness). You leave talking to a person who does that job. |
| **Personality you control** | Official agents arrive fully in character. Your own agents: talk them into existence, then tune tone, language, tools, and backstory. |
| **Any lab, one picker** | Voice is the model. Grok, Claude, GPT, Gemini, DeepSeek, and the rest sit in one list, gated by plan. |

**Maya** is how you get there without staring at a wall of posters. She is the host: she matches you, she helps you make an agent, she explains the house. She is not a second ChatGPT who also writes your code.

**Multi-agent** is how hard jobs get a second and third specialist, later — still one person on stage at a time. It is not a workflow builder and not a group chat.

The current app already *is* this product in the middle (House, Studio, Voice, credits). The business brief is a louder *door* (Maya) and a fuller *company* (official agents across mass use cases). We take both. We do not replace the character with an orchestrator OS.

---

## 2. What it looks like

Street Cast stays the *look*: night wall, color-flood posters, attributed chat. Chrome copy does not. Buttons and forms use the same words as ChatGPT, Claude, and Gemini: Agent, Chat, Model, Instructions, Memory, Plan, Credits.

### Three doors (how it is easy)

Most people will not fill out a character sheet. Most people also will not know which poster to click. So the app has three equally valid starts:

1. **Pick.** Browse official agents by category. Tap one. Chat. This is already Home / Explore.
2. **Ask Maya.** “I have a calculus midterm.” She hands you Priya. “I need a ruthless look at this email.” She hands you Helena (or Alex, if it is really a design review). One tap: **Chat with {name}.**
3. **Make.** “Build me a sarcastic lifting coach who speaks Hinglish and remembers my injuries.” Maya fills the sheet while you watch the card. Save. You are in that chat. The old form stays as **Advanced**.

Chrome: Home, Explore, Create agent, Profile, Model. Maya’s *replies* can be warm and sharp. The buttons do not say orchestrate, delegate, voice, or house.

### Screens

**Landing (logged out).** The company on the night wall. One sentence: give your AI a personality. Acid CTA: **Get started.** Ghost: **Sign in.** Guests can browse the public bill. Talking requires an account. Do not lead with architecture diagrams or “meet your super agent.”

**First signed-in minute.** You land in **chat with Maya**, plus the official agents underneath. Recents are one row per agent you already know. You are not dropped into an empty generic box, and you are not forced to pick from eight names before you understand the product.

**Maya (host chat).** She asks one or two questions, then puts **agent cards** in the well: Chat with Priya / Chat with Alex / Create this agent. She will have a short conversation to figure you out. She will not debug your repo or grade your homework. If the right official agent is Plus-locked, the card is still readable; the paywall is on **Chat**.

**Specialist chat.** This is where time is spent. Header: square portrait, name, **Model: {alias}**, About, plan chip. Transcript is attributed dialogue — their color on their turn, cream ticket on yours. Composer anchored. Quota and locked-model states are paywall tickets in the well, not toasts.

**Explore.** The official handful, grouped by mass category: Work, Learning, Advice, Debate, Everyday, Play. Coming-soon posters stay stamped. Custom agents are not this bill.

**Create agent.** Default: talk to Maya, live card on the side, **Create agent** commits. Advanced: Name, Description, Language, Color, Instructions, Tone, Tools, Model, Public / Private. Free cannot make private agents.

**Profile.** Name, language, bio (every agent is told this), plan, your agents, credits. Not a control plane.

**Mobile (after web).** Same doors, bottom tabs, no rail. Studio may wait; chatting with official agents and Maya does not.

### What you will not see in the first product

- A default generic assistant who does every job
- Job-title posters (“Resume Bot”, “YC Pitch Critic”)
- Several agents talking in one thread
- A DAG / pipeline canvas
- User-pasted API keys (BYOK)
- A third inspector column or live HTML studio as the default chrome
- Community storefronts or creator payouts

---

## 3. Official company (the handful)

We ship **Maya + twelve official specialists** that cover how mass users actually use AI. Each is a named character with a job × personality. The catalog table can hold thousands later; **the first product is this company**, fully written, not a promise of scale.

| Agent | Mass job | Category | Notes |
| :--- | :--- | :--- | :--- |
| **Maya** | Get you to the right person, or make one | — | Host. Always free. |
| **Marcus** | Mindset, excuses, what is up to you | Debate | Live. Free-tier. Roast blend — not Aurelius. |
| **Dr. Priya** | Maths, CS, proofs | Learning | Live. Free-tier. |
| **Alex** | Code, architecture, review | Work | Live. The full-stack seat. |
| **Helena** | Email, Slack, “just send it” | Work | Promote / seed. The work-writing seat. |
| **Kenji** | Interviews, take-homes, career practice | Work | Promote from coming soon. |
| **Meera** | Drafts, ledes, critique | Learning | Promote from coming soon. |
| **Sofia** | Money, plain language | Learning | Promote from coming soon. Education, not advice. |
| **Nonna Maria** | Care, burnout, eat something | Advice | Live. |
| **Viktor** | Fitness, habits, show up | Advice | Live. |
| **Jules** | Movies, taste, the cut | Everyday | Promote from coming soon. |
| **Barnaby** | Reality check, low-stakes hang | Everyday | Live. |
| **Ren** | Philosophy, sitting with the question | Debate | Live. |

Twelve specialists + the host. Valerian stays in the house as an extra live seat; he is not required to *explain* the product. Wave 2 sages (Aurelius, Krishna, Siddhartha) and canon characters are the next catalog drop, still named people, still public-domain or original — never living celebrities, never “Osho on the poster.”

**Casting rule:** if the business names a SKU (pitch critic, salary negotiator, visual explainer), we cast a *person* who does that job, or we map it onto someone already in this table. We do not put the SKU on the wall.

Free sees Maya, Marcus, and Priya. Plus and Pro see the whole company. Locked posters stay readable.

---

## 4. Models: every lab, one picker

“Best model for the job, from any lab” is a **catalog + picker**, not a stack of vendor SDKs and not BYOK in this product.

- One gateway: **OpenRouter**. Clients send a **model alias** (`grok`, `claude`, `gpt`). Never a raw vendor id.
- Founder adds or moves a lab by editing `models` / `plan_models`. No deploy.
- Each Agent has a **default model**. Maya and Create agent pick a sensible default for custom agents. The user may change it to any alias on their plan. Illegal alias → **403**, never a silent upgrade.
- Chrome: **Model: {alias}.** Locked rows stamp the plan that unlocks them. Never “Voice.”

Seed allowlist (defaults; live truth is Postgres):

| Alias | Gateway id | Free | Plus | Pro |
| :--- | :--- | :---: | :---: | :---: |
| `gemini-flash` | `google/gemini-2.5-flash` | ✓ | ✓ | ✓ |
| `grok-fast` | `x-ai/grok-4.20` | ✓ | ✓ | ✓ |
| `deepseek` | `deepseek/deepseek-chat` | | ✓ | ✓ |
| `qwen` | `qwen/qwen3-235b-a22b` | | ✓ | ✓ |
| `grok` | `x-ai/grok-4.5` | | ✓ | ✓ |
| `gpt` | `openai/gpt-5.4` | | ✓ | ✓ |
| `claude` | `anthropic/claude-sonnet-4.5` | | | ✓ |
| `kimi` | `moonshotai/kimi-k2.5` | | | ✓ |

Plan defaults: Free → `gemini-flash`, Plus → `grok`, Pro → `claude`.

Bring-your-own-key is a later power feature. It is not how v1 is “multi-lab.”

---

## 5. Personality and output

**Official agents.** Voice is locked in the prompt. That is the point of picking Marcus instead of Priya. No personality dial that turns them into a generic helper.

**Custom agents.** You control:

- Identity and backstory (what they are for)
- Tone sliders (warmth, directness, humor)
- Language (including Hinglish / Hindi)
- Tools (memory, math, search — intersected with the plan)
- Recommended Voice
- Public / private (private is Plus+)

Default creation path is conversation with Maya. The form is the same fields, for people who want sliders.

**Output in v1.** Attributed chat: markdown, math, code fences. That is enough for the launch jobs. A split “artifact dock” (live HTML, PDF export) is a later surface for agents that truly need it (a visual explainer), not the default chrome.

---

## 6. Memory

Two tiers, already in the model:

- **Profile** (global): name, language, bio. Every agent is told this. Maya also remembers high-level preferences and who you have already met — host memory, not a dump of specialist sessions.
- **Episodic memory** (scoped): `pgvector` rows keyed `(user_id, agent_id)`. Plus and Pro only. Priya does not see what you told Nonna.

When Maya hands you to an agent, she may pass a **short brief** (the job you stated). She does not pour her whole transcript into Alex.

A memory inspector (view / prune per agent) comes after retrieve actually ships.

---

## 7. Plans (Free / Plus / Pro)

Three plans. Seed prices and limits are **defaults in `public.plans`**. Change the row; the app follows.

| | **Free** | **Plus** | **Pro** |
| :--- | :--- | :--- | :--- |
| Price (seed) | $0 | **$9 / mo** or **$90 / yr** | **$19 / mo** or **$190 / yr** |
| Daily credits | 1,500 | 4,000 | 9,000 |
| Official agents | Maya + `free_tier` (Marcus, Priya) | Whole company | Whole company |
| Custom agents | 3, public only | 10, public or private | Unlimited (`null`) |
| Vector memory | No | Yes | Yes |
| Tools | none (short-term chat only) | `memory_saver`, `math_solver` | those + `web_search` |
| **Models** | Fast/cheap allowlist | Mid-tier allowlist | All enabled models |

Stripe products: **Plus** and **Pro**. Webhook maps `price_id` → `plans.id`. `entitlements.plan` is `free | plus | pro`.

Paywalls the user will actually hit: locked official agent, daily credits, locked Voice, custom-agent cap, Free trying to go private.

---

## 8. What we build first

The spine on `main` is already the specialist product (auth, House, compiler, Studio form, Voice, credits). It is not yet a complete *business* or a complete *door*.

Do this in order. Do not skip the spine for Maya, and do not grow the catalog past the handful before Maya exists.

| Order | What | Why this is first | Done when |
| :--- | :--- | :--- | :--- |
| **1. Spine** | PR4c memory retrieve + Stripe Checkout/Portal. PR5 production, Sentry, persist/quota defects. Rotate the exposed stage key. | Without pay and memory, Maya is a demo. | A stranger signs in, talks to Priya, hits a Plus Voice or agent, pays, and the picker changes. |
| **2. Door** | Maya as host: matchmaker + playbill handoff + always-free. Signed-in home starts with her. | This is the UX the business wants, without making her the worker. | “I have a midterm” → Priya card → House. Plus-locked cards still read. |
| **3. Company** | Catalog-backed wall. Promote Jules, Meera, Kenji, Sofia. Seed Helena so Work writing has a person. | The handful has to cover mass jobs, as people, on the wall Maya points at. | Explore shows the launch company from `public.agents`, not a hardcoded eight. |
| **4. Make** | Conversational create (Maya fills the sheet, form is Advanced). | Personality control has to be easy or custom dies behind a form. | Talk → live playbill → Create agent → that chat. Caps and private rules unchanged. |

That block **is** the first product. A new user can pick, ask, or make; they can choose a Voice from any listed lab; official agents cover the mass jobs; they can pay.

---

## 9. What comes after (not first)

Keep these in the backlog. Do not start them while the table in §8 is open, unless a P0 defect interrupts.

| Later | Shape | Not |
| :--- | :--- | :--- |
| **Ensembles** | Sequential 1:1 seats, shared Brief, user taps Next. “Learn this” = assess → teach → quiz. | Group chat, DAG runner, shared memory bus |
| **Source as casting input** | Paste a URL or PDF into Maya’s *create* path; she writes the same sheet. | A separate “source-to-workflow compiler” product |
| **Wave 2 catalog** | Aurelius, Krishna, Siddhartha, canon characters — public-domain or original names | Living people, estate names, licensed TV |
| **Artifact dock** | For agents that emit widgets or docs | Default split-screen IDE |
| **Memory inspector** | View / prune one agent’s memories | Global ChatGPT memory dump |
| **Remix** | New custom from a public playbill; new backstory | Fork someone else’s prompt |
| **Expo** | Same API, after web MVP | Store IAP before Stripe works on web |
| **BYOK, marketplace, teams** | Phase 3 if ever | v1 “flexibility” |

---

## 10. Architecture (unchanged spine)

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
- **Personas:** `@maya/shared` prompt compiler. Curated `system_prompt` is server-only.
- **Maya** is an Agent row plus host tools (recommend, draft custom). Handoff opens a normal 1:1 Conversation. No second runtime.
- **Memory:** `pgvector` per `(user_id, agent_id)`. Plus and Pro only.
- **Billing:** Stripe Checkout + Portal.

Non-negotiables: Zod on every route, RLS on every table, no provider API keys on the client, no `@ai-sdk/openai` + `@ai-sdk/anthropic` + … stack.

Configurable means Postgres: `models`, `plans`, `plan_models`, `entitlements`. MVP config UX is the table editor.

---

## 11. Doc map

| Doc | Use |
| :--- | :--- |
| **This file** | What the product is, how it looks, what is first |
| [`prd.md`](prd.md) | Scope checklist (follow this file on identity) |
| [`NOW.md`](NOW.md) | Shipped vs next slice |
| [`DESIGN.md`](DESIGN.md) | Visual identity |
| [`tech-stack.md`](tech-stack.md) | Locked libraries, gateway, env |
| [`technical-plan.md`](technical-plan.md) | Schema, chat lifecycle, APIs |
| [`implementation-plan.md`](implementation-plan.md) | Remaining PR write-ups |
| [`backlog/README.md`](backlog/README.md) | Open work |
| [`../CONTEXT.md`](../CONTEXT.md) | Domain glossary |
| [`curated-agents.md`](curated-agents.md) | Official prompts |
| [`catalog/taxonomy.md`](catalog/taxonomy.md) | How we write the next seats |
