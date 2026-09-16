---
id: TODO-010
title: "Inbuilt catalog: rest of wave 1"
status: idea
area: web
priority: p1
target_slice: later
created_at: 2026-09-17
updated_at: 2026-09-17
---

# [TODO-010] Inbuilt catalog: rest of wave 1

## Overview

- **What:** After the launch handful is live ([TODO-007](007-inbuilt-catalog-jobs-voices.md)), add schema for `play` + `archetype` (including `sage` / `canon`) + `tags`, then seed the rest of [`docs/catalog/wave-1.md`](../../catalog/wave-1.md): Rafi, Theo, Lila, Pace, Aunty Shanti, Cato, Rosa, Helios, Quill, Spark, Nyx. Recategorize Viktor to `wellbeing` if not already.
- **Why:** More jobs, still named characters. Not the first ship.

Depends on [TODO-006](006-catalog-driven-first-party-bill.md) and [TODO-007](007-inbuilt-catalog-jobs-voices.md). Do not start while NOW has an open MVP slice unless named. Wave 2 is [TODO-009](009-inbuilt-catalog-sages-canon.md).

## Acceptance

- [ ] `agents.category` CHECK includes `play`. Explore labels: Work / Learning / Advice / Debate / Everyday / Play.
- [ ] Curated rows have editorial `archetype` and `tags text[]`. Enum includes wave 1 values **and** `sage` / `canon` so wave 2 does not migrate twice. Gallery never selects `system_prompt`.
- [ ] Color palette reused; no per-character CSS variables.
- [ ] Seed the remaining wave 1 names from [`wave-1.md`](../../catalog/wave-1.md). Cato ships with Rosa. Helios ships with believer rails; drop only if too hot. Jules / Meera / Kenji / Sofia / Helena are already live from TODO-007 — do not duplicate.
- [ ] Free-tier stays Maya + Marcus + Priya unless a new tasting seat is named.
- [ ] Each sheet has a behavioral loop as sharp as Marcus.
- [ ] Non-goals: launch handful (TODO-007); wave 2; thousands of imports; in-app catalog admin; NSFW companions; job-title SKUs.

## Touches

- `supabase/migrations/` — category CHECK, archetype, tags
- `packages/shared` `AGENT_CATEGORIES`
- `docs/seed-agents.sql` / `docs/curated-agents.md`
- Explore Play section once players exist

## Notes

- Sequence: TODO-007 → this → [TODO-009](009-inbuilt-catalog-sages-canon.md). Maya host already retrieves; do not inject every bio.
- Believer rails: [`taxonomy.md`](../../catalog/taxonomy.md).

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests where the slice needs them)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, archive this file and drop it from the open index
