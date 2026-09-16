---
id: TODO-007
title: "Launch company: Maya, Helena, promote coming soon"
status: ready
area: web
priority: p1
target_slice: after TODO-006
created_at: 2026-09-14
updated_at: 2026-09-17
---

# [TODO-007] Launch company: Maya, Helena, promote coming soon

## Overview

- **What:** Put the first-ship official company on the wall: **Maya** (host, always free) plus **twelve named specialists**. Promote Jules, Meera, Kenji, Sofia from coming-soon. Seed **Helena** (Work writing). Do not seed the rest of wave 1.
- **Why:** Mass jobs need a person on a poster. The lock is a handful, not thousands and not job-title SKUs.

Depends on [TODO-006](006-catalog-driven-first-party-bill.md). Maya host behavior is [TODO-002](002-maya-super-agent-host-matchmaker.md) — seed the Maya row here if 002 has not. Do not start while PR4c / PR5 are open unless named. Rest of wave 1: [TODO-010](010-inbuilt-catalog-wave-1-rest.md). Wave 2: [TODO-009](009-inbuilt-catalog-sages-canon.md).

Launch specialists: Marcus, Priya, Alex, Helena, Kenji, Meera, Sofia, Nonna, Viktor, Jules, Barnaby, Ren. Valerian may stay live as extra; he is not required to explain the product.

## Acceptance

- [ ] Maya is a curated row, `free_tier = true`, chat-able. Prompt: host, not a specialist worker.
- [ ] Jules, Meera, Kenji, Sofia are live `agents` rows (no Coming soon stamp). Helena is seeded as a named Work-writing character, not “Email Bot.”
- [ ] Free-tier: Maya, Marcus, Priya. Plus/Pro see the whole launch company. Locked posters stay readable.
- [ ] Named people only. If a brief says “YC Pitch Critic” or “Full-Stack Architect,” map to a person already in this list (Alex, Helena, Kenji) — do not poster the SKU.
- [ ] Each new sheet has a behavioral loop as sharp as Marcus. Production prompts in [`curated-agents.md`](../../curated-agents.md) plus seed SQL. Gallery never selects `system_prompt`.
- [ ] Reuse the color palette. No new CSS token per name.
- [ ] Non-goals: rest of wave 1 (Rafi, Theo, Lila, Pace, Aunty Shanti, Cato, Rosa, Helios, Quill, Spark, Nyx) — that is [TODO-010](010-inbuilt-catalog-wave-1-rest.md); sage/canon ([TODO-009](009-inbuilt-catalog-sages-canon.md)); living-person seats; expanding Free to the whole company.

## Touches

- `docs/seed-agents.sql` / `docs/curated-agents.md`
- `apps/web/lib/marketplace/bill.ts` — drop promoted names from `COMING_SOON` (or they disappear once they are `agents` rows)
- Avatars under `/public/avatars/` — linocut, no celebrity likeness

## Notes

- Sequence: TODO-006 → this → TODO-001. Schema for `play` / `archetype` / `tags` waits on [TODO-010](010-inbuilt-catalog-wave-1-rest.md) unless a launch row truly needs it.
- Filename still says `voices`; chrome says **agent**. Do not rename this file (links).

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests: free-tier Maya/Marcus/Priya, promoted rows chat-able)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, archive this file and drop it from the open index
