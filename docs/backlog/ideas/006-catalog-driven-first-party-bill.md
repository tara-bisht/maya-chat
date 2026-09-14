---
id: TODO-006
title: "Catalog-driven first-party bill"
status: idea
area: web
priority: p1
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-14
---

# [TODO-006] Catalog-driven first-party bill

## Overview

- **What:** Landing, Explore, and the public marketplace bill read live curated agents from `public.agents` (plus coming-soon posters), not a hardcoded eight-row `COMPANY` in `apps/web/lib/company.ts`.
- **Why:** Docs now treat the inbuilt catalog as unbounded. The wall cannot stay an eight-row TypeScript array.

Runtime chat already loads `public.agents`. This is the marketing/playbill counterpart. Do not implement in a docs-only PR.

## Acceptance

- [ ] Featured / Explore / marketplace live posters come from curated, non-archived `agents` rows (explicit column list; never `system_prompt`).
- [ ] Coming-soon posters stay a separate catalog (today `COMING_SOON` in `bill.ts`) until they become `agents` rows.
- [ ] Adding a curated seed row is enough for it to appear on the wall after deploy of data, without editing `COMPANY`.
- [ ] Pagination or category queries so thousands of rows do not load on first paint ([MAYA-103](../../archive/issues/MAYA-103-unbounded-public-agents-scan.md) pattern).
- [ ] Non-goals: in-app catalog admin, importing thousands of prompts in this slice, stuffing every inbuilt prompt into a matchmaker context ([TODO-002](002-maya-super-agent-host-matchmaker.md) must retrieve).

## Touches

- `apps/web/lib/company.ts`
- `apps/web/lib/marketplace/bill.ts`
- `apps/web/lib/landing.ts`
- Gallery / Explore loaders

## Notes

- [ADR 0002](../../adr/0002-marketplace-is-first-party-bill.md) said live posters stay `COMPANY`. This todo revises that once the bill is catalog-backed.
- Matchmaker and concierge must retrieve over the catalog, not inject every starter bio.
- Wave 1 seed ([TODO-007](007-inbuilt-catalog-jobs-voices.md)) and wave 2 sage/canon seed ([TODO-009](009-inbuilt-catalog-sages-canon.md)) wait on this bill. Do not grow `COMPANY` to sixteen (or twenty-eight) rows.
