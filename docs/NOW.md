# NOW

Living status. Update this file when a slice merges to `main`. Sequence detail: [`implementation-plan.md`](implementation-plan.md). Open work: [`backlog/README.md`](backlog/README.md).

**Date:** 2026-09-14

## On `main` today

Signed-in web: Google auth, gallery, House streaming chat, prompt compiler, Studio custom agents, AI credits, voice picker, catalog-driven seats. Not Phase 0.

## Catalog

Starter seed is the named first-party players in [`curated-agents.md`](curated-agents.md) plus coming-soon posters on Explore. Curated count is **not** a product constant — the house can hold thousands of inbuilt agents. Free sees `agents.free_tier`; Plus/Pro see every live curated row.

How the company grows (jobs × archetypes, not generic bots): [`catalog/taxonomy.md`](catalog/taxonomy.md). Wave 1 roster: [`catalog/wave-1.md`](catalog/wave-1.md). Schema + seed: [`TODO-007`](backlog/ideas/007-inbuilt-catalog-jobs-voices.md) after the bill is catalog-backed ([`TODO-006`](backlog/ideas/006-catalog-driven-first-party-bill.md)).

Marketing/playbill copy still uses a hardcoded `COMPANY` array ([`TODO-006`](backlog/ideas/006-catalog-driven-first-party-bill.md)). Runtime chat loads `public.agents`.

## Next slice

1. **PR4c** — pgvector retrieve + Stripe Checkout/Portal for Plus and Pro
2. **PR5** — harden, Sentry, production URL
3. **PR6** — Expo against the same API (not before PR5)

## Do not start unless named

Rating ([TODO-004](backlog/ideas/004-rate-an-agent.md)), remix ([TODO-005](backlog/ideas/005-remix-an-agent.md)), conversational casting, Maya host, Expo, voice, catalog seed ([TODO-007](backlog/ideas/007-inbuilt-catalog-jobs-voices.md)), ensembles ([TODO-008](backlog/ideas/008-ensembles.md)). Finish the open MVP slice first.

## Open P0

[MAYA-119](backlog/defects/MAYA-119-committed-stage-credential-in-env-example.md) — rotate the exposed stage publishable key (ops; placeholders already in git).
