# NOW

Living status. Update this file when a slice merges to `main`. Product identity: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md). Sequence detail: [`implementation-plan.md`](implementation-plan.md). Open work: [`backlog/README.md`](backlog/README.md).

**Date:** 2026-09-17

## Product lock

Specialized named agents, a **Model** from any listed lab, personality you can steer. **Maya is the host, not the worker.** First ship is Maya plus twelve official specialists, not thousands and not job-title bots. Full write-up: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md). Chrome words: [`../CONTEXT.md`](../CONTEXT.md).

## On `main` today

Signed-in web: Google auth, gallery, streaming chat, prompt compiler, Studio form, AI credits, model picker with 50+ frontier models, catalog-driven seats, universal curated agent access on Free, Plus/Pro episodic memory, Stripe Checkout and Customer Portal, Maya as signed-in home with Your agents roster routing, pause/switch tickets, trailing Add, and in-chat Create agent card. Not Phase 0.

## Catalog

Launch company (Maya + twelve specialists) is the first-party bill: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md) §3. Live seed today is Maya and the eight in [`curated-agents.md`](curated-agents.md) plus four coming-soon posters (Jules, Meera, Kenji, Sofia). Helena is the Work-writing seat still to seed. Free sees Maya plus all curated specialists on Free-tier models. Plus/Pro unlock higher models and memories.

How further seats are written: [`catalog/taxonomy.md`](catalog/taxonomy.md). Rest of wave 1: [`TODO-010`](backlog/ideas/010-inbuilt-catalog-wave-1-rest.md). Wave 2: [`TODO-009`](backlog/ideas/009-inbuilt-catalog-sages-canon.md). Both wait on the launch handful.

Marketing/playbill copy still uses a hardcoded `COMPANY` array. Runtime chat loads `public.agents`.

## Next slice

1. **PR5** — harden, Sentry, production URL ([MAYA-117](backlog/defects/MAYA-117-assistant-persist-best-effort-history-divergence.md), [MAYA-122](backlog/defects/MAYA-122-env-validation-sentry-ratelimit-service-role-hygiene.md))
2. **Launch company on the wall** — catalog-backed bill ([TODO-006](backlog/ideas/006-catalog-driven-first-party-bill.md)), then Helena + promote Jules/Meera/Kenji/Sofia ([TODO-007](backlog/ideas/007-inbuilt-catalog-jobs-voices.md))
3. **Conversational create remainder** — `/studio/new` chat default + live preview ([TODO-001](backlog/ideas/001-conversational-agent-creator.md))
4. **PR6** — Expo against the same API (not before PR5)

## Do not start unless named

`⌘K` Maya ([TODO-003](backlog/ideas/003-global-maya-concierge-ui.md)), rest of wave 1 ([TODO-010](backlog/ideas/010-inbuilt-catalog-wave-1-rest.md)), wave 2 ([TODO-009](backlog/ideas/009-inbuilt-catalog-sages-canon.md)), ensembles ([TODO-008](backlog/ideas/008-ensembles.md)), rating ([TODO-004](backlog/ideas/004-rate-an-agent.md)), remix ([TODO-005](backlog/ideas/005-remix-an-agent.md)), Expo, speech, source-as-create-input, artifact dock, BYOK. Finish the open MVP slice (PR5) before those.

## Open P0

[MAYA-119](backlog/defects/MAYA-119-committed-stage-credential-in-env-example.md) — rotate the exposed stage publishable key (ops; placeholders already in git).
