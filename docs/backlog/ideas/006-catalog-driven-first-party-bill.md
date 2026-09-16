---
id: TODO-006
title: "Catalog-driven first-party bill"
status: ready
area: web
priority: p1
target_slice: after PR5
created_at: 2026-09-14
updated_at: 2026-09-17
---

# [TODO-006] Catalog-driven first-party bill

## Overview

- **What:** Landing, Explore, and the public marketplace bill read live curated agents from `public.agents` (plus coming-soon posters), not a hardcoded `COMPANY` array in `apps/web/lib/company.ts`.
- **Why:** The launch company (Maya + twelve specialists) cannot grow if the wall is a TypeScript snapshot. Runtime chat already loads `public.agents`.

Do not start while PR4c / PR5 are open unless named. Do not implement in a docs-only PR. Launch seed ([TODO-007](007-inbuilt-catalog-jobs-voices.md)) waits on this bill.

## Acceptance

- [ ] Featured / Explore / marketplace live posters come from curated, non-archived `agents` rows (explicit column list; never `system_prompt`).
- [ ] Coming-soon posters stay a separate catalog until they become `agents` rows ([TODO-007](007-inbuilt-catalog-jobs-voices.md) promotes Jules, Meera, Kenji, Sofia).
- [ ] Adding a curated seed row is enough for it to appear on the wall after data deploy, without editing `COMPANY`.
- [ ] Pagination or category queries so a large catalog does not load on first paint ([MAYA-103](../../archive/issues/MAYA-103-unbounded-public-agents-scan.md) pattern).
- [ ] Non-goals: in-app catalog admin; importing the rest of wave 1 in this slice ([TODO-010](010-inbuilt-catalog-wave-1-rest.md)); stuffing every inbuilt prompt into Maya ([TODO-002](002-maya-super-agent-host-matchmaker.md) must retrieve).

## Touches

- `apps/web/lib/company.ts`
- `apps/web/lib/marketplace/bill.ts`
- `apps/web/lib/landing.ts`
- Gallery / Explore loaders

## Notes

- [ADR 0002](../../adr/0002-marketplace-is-first-party-bill.md) said live posters stay `COMPANY`. This todo revises that.
- First ship is the launch handful, not thousands. Architecture can hold more later.
- Sequence: PR5 → this → [TODO-007](007-inbuilt-catalog-jobs-voices.md). Maya host ([TODO-002](002-maya-super-agent-host-matchmaker.md)) can ship in parallel.

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests: wall from `agents`, no `system_prompt` on the client)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, archive this file and drop it from the open index
