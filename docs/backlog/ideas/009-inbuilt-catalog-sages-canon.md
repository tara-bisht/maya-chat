---
id: TODO-009
title: "Inbuilt catalog: sage and canon wave 2"
status: idea
area: web
priority: p1
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-17
---

# [TODO-009] Inbuilt catalog: sage and canon wave 2

## Overview

- **What:** Seed ~12 curated rows so people can take advice from a teaching mind and talk to a character who remembers a world. Sheets: [`docs/catalog/wave-2.md`](../../catalog/wave-2.md).
- **Why:** Cover “advice from a Stoic / Gita / Buddhist teacher” and “talk to Holmes or an original magic-school student” without a celebrity or licensed-TV catalog.

Depends on [TODO-006](006-catalog-driven-first-party-bill.md) and [TODO-010](010-inbuilt-catalog-wave-1-rest.md) (`play` plus `archetype` including `sage` and `canon`). Do not start while NOW has an open MVP slice unless named. Do not fold these rows into the launch company ([TODO-007](007-inbuilt-catalog-jobs-voices.md)).

## Acceptance

- [ ] Seed: Aurelius, Siddhartha, Krishna, Pia, Marigold, Holmes, Hamlet, Elizabeth, Voss, Rook, Wick, Cerys from [`wave-2.md`](../../catalog/wave-2.md).
- [ ] Each row has `archetype` `sage` or `canon`, tags, reused color palette, linocut (no celebrity likeness). Gallery never selects `system_prompt`.
- [ ] Existing Marcus stays the sarcastic Stoic blend. Aurelius is the *Meditations* sage.
- [ ] Public-domain posters stamp writings/book honesty. Original pastiches do not name a show.
- [ ] Krishna and Siddhartha ship with religious rails; drop only if too hot.
- [ ] Free-tier stays Maya + Marcus + Priya. Crime antihero (Voss): fiction only, no how-to.
- [ ] Each sheet has a behavioral loop as sharp as Marcus.
- [ ] Non-goals: licensed TV/film first-party; living-celebrity seats (no Osho); photoreal portraits; hundreds of literary imports; expanding Free to this wave.

## Touches

- `docs/seed-agents.sql` / `docs/curated-agents.md`
- Avatars under `/public/avatars/`

## Notes

- Sequence: TODO-007 launch handful → TODO-010 rest of wave 1 → this.
- Naming lock: public-domain names + original pastiches. [`taxonomy.md`](../../catalog/taxonomy.md).

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests where the slice needs them)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, archive this file and drop it from the open index
