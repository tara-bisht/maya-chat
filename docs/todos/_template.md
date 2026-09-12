---
id: TODO-XXX
title: "<Descriptive Title>"
status: idea # idea | ready | in-progress | done | dropped
area: web # web | shared | database | ai-engine | billing | tooling
priority: p2 # p0 (blocker) | p1 (high) | p2 (medium) | p3 (low)
target_slice: unassigned # e.g. PR4, v1.1, or unassigned
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
---

# [TODO-XXX] <Descriptive Title>

## 💡 Overview & Motivation
- **What is this?** A concise summary of the idea, technical debt item, or feature task.
- **Why do this?** What problem does it solve, what friction does it remove, or what user value does it unlock?

## 🎯 Acceptance Criteria & Scope
- [ ] Criterion 1: Concrete, observable outcome
- [ ] Criterion 2: Behavior verified
- [ ] Non-goal / Out of scope: Clearly mark what this task will *not* attempt to do

## 🧩 Affected Components & Files
List specific files, directories, or packages likely impacted:
- `apps/web/...`
- `packages/shared/...`
- `packages/database/...`
- `supabase/migrations/...`

## 🛠️ Implementation Notes & Technical References
- **Relevant Docs**: [`docs/technical-plan.md`](../technical-plan.md), [`docs/DESIGN.md`](../DESIGN.md), [`CONTEXT.md`](../../CONTEXT.md)
- **Proposed Approach**: Key technical decisions, library choices, API signatures, or SQL considerations.
- **Edge Cases & Failure Modes**: Error handling, quotas, network failures, or auth guards.

## 📋 Execution Checklist
- [ ] Step 1: Create feature branch `feat/<short-slug>` from `main`
- [ ] Step 2: Implement changes (with tests where applicable)
- [ ] Step 3: Run `pnpm turbo lint typecheck test` locally
- [ ] Step 4: Open PR with `gh pr create --fill`
- [ ] Step 5: Verify CI passes, squash-merge to `main`, and mark this to-do as `done`
