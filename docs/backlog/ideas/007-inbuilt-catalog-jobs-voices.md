---
id: TODO-007
title: "Inbuilt catalog: jobs × archetypes (schema + wave 1)"
status: ready
area: web
priority: p1
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-14
---

# [TODO-007] Inbuilt catalog: jobs × archetypes

## Overview

- **What:** Make the first-party company grow as named characters across jobs (email, F1, debate, fantasy, research) without generic “Email Writer” bots. Schema for `play` + `archetype` + `tags` + costume palette, then seed wave 1 from [`docs/catalog/wave-1.md`](../../catalog/wave-1.md).
- **Why:** The starter eight plus four coming-soon posters do not cover the jobs people actually do with AI. Taxonomy is already written ([`docs/catalog/taxonomy.md`](../../catalog/taxonomy.md)). This todo is the data and seed.

Depends on [TODO-006](006-catalog-driven-first-party-bill.md): do not grow `COMPANY` in TypeScript. Do not start while NOW has an open MVP slice unless this todo is named.

## Acceptance

- [ ] `agents.category` CHECK includes `play`. Explore labels: Work / Learning / Advice / Debate / Everyday / Play ([taxonomy](../../catalog/taxonomy.md)).
- [ ] Curated rows have editorial `archetype` and `tags text[]`. Gallery never selects `system_prompt`.
- [ ] Costume floods are a reused palette; wave 1 adds no per-character CSS variables.
- [ ] Wave 1 seed: promote Jules, Meera, Kenji, Sofia; add Helena, Rafi, Theo, Lila, Pace, Aunty Shanti, Cato, Rosa, Helios, Quill, Spark, Nyx. Helios ships with believer rails; drop only if we decide the bit is too hot.
- [ ] Cato ships with Rosa. Viktor recategorizes to `wellbeing`. Free-tier stays Marcus + Priya unless Helena is explicitly opened.
- [ ] Each new sheet has a behavioral loop as sharp as Marcus. Production prompts live in [`curated-agents.md`](../../curated-agents.md) (or `docs/catalog/` split) plus seed SQL.
- [ ] Non-goals: thousands of imported prompts, in-app catalog admin, matchmaker ([TODO-002](002-maya-super-agent-host-matchmaker.md) follows once the wall is dense), NSFW companions, expanding Free to the whole wave.

## Touches

- `supabase/migrations/` (category CHECK, archetype, tags, listing_status or coming-soon stay static)
- `packages/shared` `AGENT_CATEGORIES`
- `apps/web/lib/marketplace/bill.ts` (Play section once players exist)
- `docs/seed-agents.sql` / `docs/curated-agents.md`
- Costume palette tokens in `DESIGN.md` + CSS — reuse, do not mint one ink per name

## Notes

- Sequence: TODO-006 → this schema → wave 1 seed → TODO-002 matchmaker.
- Believer rails: [`taxonomy.md`](../../catalog/taxonomy.md). Helios is conspiracy-as-comedy, paired with Valerian.
- Pagination / per-category fetch: [MAYA-103](../../archive/issues/MAYA-103-unbounded-public-agents-scan.md) via TODO-006.

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests where the slice needs them)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, move this file to archive and drop it from the open index
