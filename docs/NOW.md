# NOW

Living status. Update this file when a slice merges to `main`. Product identity: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md). Sequence detail: [`implementation-plan.md`](implementation-plan.md). Open work: [`backlog/README.md`](backlog/README.md).

**Date:** 2026-09-17

## Product lock

Specialized named agents, Voice from any listed lab, personality you can steer. **Maya is the host, not the worker.** First ship is Maya plus twelve official specialists, not thousands and not job-title bots. Full write-up: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md).

## On `main` today

Signed-in web: Google auth, gallery, streaming chat, prompt compiler, Studio form, AI credits, model picker, catalog-driven seats. Maya host, conversational create, and Stripe Checkout are **not** on `main`. Not Phase 0.

## Catalog

Launch company (Maya + twelve specialists) is the first-party bill: [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md) §3. Live seed today is the eight in [`curated-agents.md`](curated-agents.md) plus four coming-soon posters (Jules, Meera, Kenji, Sofia). Helena is the Work-writing seat still to seed. Free sees Maya (once she exists) plus `agents.free_tier` (Marcus, Priya). Plus/Pro see every live curated row.

How further seats are written: [`catalog/taxonomy.md`](catalog/taxonomy.md). Wave 1 / wave 2 remain later catalog drops after the launch handful is on a catalog-backed wall ([`TODO-006`](backlog/ideas/006-catalog-driven-first-party-bill.md)).

Marketing/playbill copy still uses a hardcoded `COMPANY` array. Runtime chat loads `public.agents`.

## Next slice

1. **PR4c** — pgvector retrieve + Stripe Checkout/Portal for Plus and Pro
2. **PR5** — harden, Sentry, production URL
3. **Maya host** — matchmaker + handoff; signed-in home starts with her ([TODO-002](backlog/ideas/002-maya-super-agent-host-matchmaker.md), [TODO-003](backlog/ideas/003-global-maya-concierge-ui.md))
4. **Launch company on the wall** — catalog-backed bill ([TODO-006](backlog/ideas/006-catalog-driven-first-party-bill.md)), promote Jules/Meera/Kenji/Sofia, seed Helena
5. **Conversational create** — Maya fills the sheet ([TODO-001](backlog/ideas/001-conversational-agent-creator.md))
6. **PR6** — Expo against the same API (not before PR5)

## Do not start unless named

Rating ([TODO-004](backlog/ideas/004-rate-an-agent.md)), remix ([TODO-005](backlog/ideas/005-remix-an-agent.md)), ensembles ([TODO-008](backlog/ideas/008-ensembles.md)), wave 2 sages/canon ([TODO-009](backlog/ideas/009-inbuilt-catalog-sages-canon.md)), Expo, native voice, source-as-casting-input, artifact dock, BYOK. Finish the open MVP spine (PR4c / PR5) before the Maya door.

## Open P0

[MAYA-119](backlog/defects/MAYA-119-committed-stage-credential-in-env-example.md) — rotate the exposed stage publishable key (ops; placeholders already in git).
