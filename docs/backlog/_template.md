---
id: TODO-XXX
title: "<Descriptive Title>"
status: idea # idea | ready | in-progress | done | dropped
area: web # web | shared | database | ai-engine | billing | tooling
priority: p2 # p0 (blocker) | p1 (high) | p2 (medium) | p3 (low)
target_slice: later # e.g. PR4c, PR5, later
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
---

# [TODO-XXX] <Descriptive Title>

## Overview

- **What:** One or two sentences.
- **Why:** User value or the failure this prevents.

## Acceptance

- [ ] Concrete, observable outcome
- [ ] Non-goal: what this will not do

## Touches

- `apps/web/...`
- `packages/shared/...`
- `supabase/migrations/...`

## Notes

- Docs: [`technical-plan.md`](../technical-plan.md), [`DESIGN.md`](../DESIGN.md), [`CONTEXT.md`](../../CONTEXT.md)
- Approach, edges, quotas.

## Checklist

- [ ] Worktree + branch per [`git.md`](../git.md)
- [ ] Implement (tests where the slice needs them)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, move this file to archive and drop it from the open index
