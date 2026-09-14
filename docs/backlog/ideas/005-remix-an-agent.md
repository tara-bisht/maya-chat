---
id: TODO-005
title: "Remix an agent into Studio"
status: idea
area: web
priority: p2
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-14
---

# [TODO-005] Remix an agent into Studio

## Overview

- **What:** From a playbill the user can see, **Remix** opens Studio with public fields (name, tagline, costume, tone) as a draft of a **new custom** agent.
- **Why:** The inbuilt catalog will be large; people should start from a voice they like without stealing the source backstory.

Words: [`CONTEXT.md`](../../../CONTEXT.md) (**Remix**). Counts against `plans.max_custom_agents`. Backstory / `system_prompt` is **newly authored** — never copied from curated or another owner. Conversational casting ([TODO-001](001-conversational-agent-creator.md)) can fill that backstory later.

## Acceptance

- [ ] Remix is available on curated agents and on public custom agents the viewer can see.
- [ ] Creates a new custom row for the remixer, not an edit of the source.
- [ ] Prefills public playbill fields only. `system_prompt` starts empty or from Maya-casting, never from the source row.
- [ ] Studio quota and the Free public-only gate still apply; 402 when over cap.
- [ ] Non-goals: copying `system_prompt`, forking conversations or memories, remix as a store listing, payouts.

## Touches

- `apps/web/app/(app)/studio/`
- `apps/web/lib/studio/`
- `packages/shared/src/studio.ts`

## Notes

- ADR 0004 already forbids remix of someone else’s backstory. This todo is playbill-only.
- Do not start while [`docs/NOW.md`](../../NOW.md) has an open MVP slice unless named.
