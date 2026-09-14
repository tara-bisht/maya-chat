---
id: TODO-009
title: "Inbuilt catalog: sage and canon wave 2 seed"
status: ready
area: web
priority: p1
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-14
---

# [TODO-009] Inbuilt catalog: sage and canon wave 2 seed

## Overview

- **What:** Seed ~12 curated rows so people can take advice from a teaching mind and talk to a character who remembers a world. Sheets: [`docs/catalog/wave-2.md`](../../catalog/wave-2.md). Taxonomy: [`docs/catalog/taxonomy.md`](../../catalog/taxonomy.md).
- **Why:** The wall should cover “advice from a Stoic / Gita / Buddhist teacher” and “talk to Holmes or an original magic-school student” without becoming a celebrity or licensed-TV catalog.

Depends on [TODO-006](006-catalog-driven-first-party-bill.md) (do not grow `COMPANY` in TypeScript) and [TODO-007](007-inbuilt-catalog-jobs-voices.md) (`play` plus `archetype` including `sage` and `canon`). Do not start while NOW has an open MVP slice unless this todo is named. Do not fold these rows into the wave 1 seed.

## Acceptance

- [ ] Seed: Aurelius, Siddhartha, Krishna, Pia, Marigold, Holmes, Hamlet, Elizabeth, Voss, Rook, Wick, Cerys from [`wave-2.md`](../../catalog/wave-2.md).
- [ ] Each row has `archetype` `sage` or `canon`, tags, reused costume palette, linocut (no celebrity likeness). Gallery never selects `system_prompt`.
- [ ] Existing Marcus stays the sarcastic Stoic blend. Aurelius is the *Meditations* sage.
- [ ] Public-domain playbills stamp writings/book honesty. Original pastiches (Voss, Rook, Wick, Cerys) do not name a show and do not clone its world.
- [ ] Krishna and Siddhartha ship with religious rails; drop only if we decide the seats are too hot.
- [ ] Free-tier stays Marcus + Priya. Crime antihero (Voss): fiction only, no how-to.
- [ ] Each sheet has a behavioral loop as sharp as Marcus. Production prompts live in [`curated-agents.md`](../../curated-agents.md) (or `docs/catalog/` split) plus seed SQL.
- [ ] Non-goals: licensed TV/film first-party (Walter White, Rick, Harry Potter, GOT), living-celebrity seats, photoreal portraits, hundreds of literary imports, Studio content policy, expanding Free to this wave.

## Touches

- `docs/seed-agents.sql` / `docs/curated-agents.md`
- `apps/web/lib/marketplace/bill.ts` only if Play/Debate sections need copy once rows exist (catalog-backed via TODO-006)
- Avatars under `/public/avatars/` — linocut, cream + flood, no celebrity likeness

## Notes

- Sequence: TODO-006 → TODO-007 schema + wave 1 → this seed → TODO-002 matchmaker.
- Rails: [`taxonomy.md`](../../catalog/taxonomy.md) § Sage and canon rails.
- Naming lock: public-domain names + original pastiches.
- [TODO-008](008-ensembles.md) is ensembles (sequential multi-character jobs). This id is the sage/canon seed.

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests where the slice needs them)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, move this file to archive and drop it from the open index
