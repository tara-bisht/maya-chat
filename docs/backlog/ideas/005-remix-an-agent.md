---
id: TODO-005
title: "Remix an agent into Studio"
status: idea
area: web
priority: p2
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-17
---

# [TODO-005] Remix an agent into Studio

## Overview

- **What:** From an agent card the user can see, **Remix** opens Studio with public fields (name, description, color, tone) as a draft of a **new custom** agent.
- **Why:** People should start from a character they like without stealing the source instructions.

Words: [`CONTEXT.md`](../../../CONTEXT.md) (**Remix**). Counts against `plans.max_custom_agents`. Instructions / `system_prompt` are **newly authored** — never copied from curated or another owner. Conversational create ([TODO-001](001-conversational-agent-creator.md)) can fill those instructions later.

## Acceptance

- [ ] Remix is available on curated agents and on public custom agents the viewer can see.
- [ ] Creates a new custom row for the remixer, not an edit of the source.
- [ ] Prefills public card fields only. `system_prompt` starts empty or from Maya create, never from the source row.
- [ ] Studio quota and the Free public-only gate still apply; 402 when over cap.
- [ ] Non-goals: copying `system_prompt`, forking conversations or memories, remix as a store listing, payouts.

## Touches

- `apps/web/app/(app)/studio/`
- `apps/web/lib/studio/`
- `packages/shared/src/studio.ts`

## Notes

- ADR 0004 already forbids remix of someone else’s instructions. This todo is public-card-only.
- Do not start while [`docs/NOW.md`](../../NOW.md) has an open MVP slice unless named.
