---
id: TODO-008
title: "Ensembles: sequential multi-character jobs"
status: idea
area: web
priority: p2
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-17
---

# [TODO-008] Ensembles: sequential multi-character jobs

## Overview

- **What:** A user runs a job (learn a topic, founder brief, draft-and-critique) as **one named Ensemble**: ordered seats of existing Agents, each still a 1:1 Chat, with a shared **Brief** handed forward. A **Model** alias can be pinned per seat. Curated ensembles ship as catalog; users can later assemble their own in Studio.
- **Why:** Hard jobs need more than one character — assess then teach then quiz — and different models are good at different seats. Still named people, not a workflow builder.

Words: [`CONTEXT.md`](../../../CONTEXT.md) (**Ensemble**, **Seat**, **Run**, **Brief**, **Model**). Do not start while [`docs/NOW.md`](../../NOW.md) has an open MVP slice unless named. Depends on [TODO-006](006-catalog-driven-first-party-bill.md) and the launch company ([TODO-007](007-inbuilt-catalog-jobs-voices.md)). Do not seed generic “Researcher Bot” seats.

This is **not** group chat, not a DAG, not CrewAI / n8n. Sequential, user-in-the-loop, one person on stage. That is the later shape for “multi-agent.”

## How a run feels (v1)

1. Pick an ensemble card (Home / Explore) or start one they own.
2. Short intake becomes the opening Brief.
3. Chat with seat 1. Color wash is that agent’s.
4. **Next** lets the user edit the Brief (or a cheap model drafts a summary) and opens seat 2 as a new Conversation under the same Run.
5. Skip, restage, or stop. Template edits never rewrite this run.

v1.1 (not this slice): **Run the rest** — auto-advance remaining seats. Still 1:1. Still not a graph engine.

## Built-in ensembles

Cast from live launch-company characters. Swap in later wave 1 names when [TODO-010](010-inbuilt-catalog-wave-1-rest.md) ships.

### Learn a topic

| # | Seat job | Cast | Model | Tools |
| :---: | :--- | :--- | :--- | :--- |
| 1 | Assess | Guide / coach | Plan default / cheap | none |
| 2 | Plan | Guide | Mid (`grok`) | none |
| 3 | Teach | Explainer (Priya-class) | Mid / frontier per plan | `math_solver` if STEM |
| 4 | Quiz | Tester | Cheap | none |
| 5 | Feedback | Coach | Cheap / mid | none |

### Founder brief

| # | Seat job | Cast | Model | Tools |
| :---: | :--- | :--- | :--- | :--- |
| 1 | Landscape | Researcher | Cheap / search-strong (`gemini-flash`) | `web_search` (Pro) |
| 2 | Demand | Researcher / analyst | Cheap / mid | `web_search` |
| 3 | Competitive | Analyst | Mid | `web_search` |
| 4 | Technical plan | Builder (Alex-class) | Mid / frontier | none |
| 5 | Review | Coach (Meera-class) | Frontier if allowed, else mid | none |

### Draft and critique

Writer seat → coach seat. Two seats.

Do not ship a believer pair as an ensemble in v1 — it reads as group chat.

## User-created ensembles

Studio grows a second sheet: pick agents the user can see, order seats, one-line job per seat, optional Model pin, optional extra instructions **on top of** the agent’s instructions (never replacing them, never copying a foreign `system_prompt`).

- Remix a curated ensemble: copy seats, swap agents, change Models. Same rule as [TODO-005](005-remix-an-agent.md).
- New plan column `max_custom_ensembles`. Seed: Free `0`, Plus small, Pro larger or `null`.
- Free tasting: one curated ensemble with `free_tier` and cheap Models only. Custom ensembles are Plus+.
- Maya ([TODO-002](002-maya-super-agent-host-matchmaker.md)) may later recommend an ensemble. Not required to ship this.

## Acceptance

- [ ] Chrome: **Ensemble**, **Start**, **Brief**, **Next**, **Create ensemble**. Stamp is seat count, not “workflow.”
- [ ] Starting a run snapshots seats, takes intake into the Brief, opens seat 1 as a normal Conversation.
- [ ] **Next** writes the Brief and opens the next seat. Skip / restage / stop work.
- [ ] Each seat stays 1:1. Memories stay `(user_id, agent_id)`. The Brief is the only cross-seat state.
- [ ] Seat Model uses existing `plan_models`. Illegal alias → plan default or **403**. Tools = agent ∩ plan.
- [ ] Credits: each seat turn is the existing engine. Mid-run 402 pauses the run.
- [ ] Non-goals: group chat; DAG / parallel / conditionals; autonomous unattended runs; marketplace of ensembles; shipping before the launch handful.

## Touches

- `supabase/migrations/` — `ensembles`, `ensemble_seats`, `ensemble_runs`, `conversations.ensemble_run_id`, `plans.max_custom_ensembles`, RLS
- `packages/shared/` — Zod, prompt compiler Brief overlay
- `apps/web/app/(app)/` — ensemble card, run surface (Chat + thin acts rail), Studio sheet, Brief
- `apps/web/lib/ui-copy.ts`

## Notes

- Sequence: launch company (TODO-007) → this. Optional Maya recommend later.
- Paywalls: locked ensemble, credits, locked Model.
- ADR when the first migration lands (1:1 + Brief vs group chat vs DAG).

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests: compiler overlay, RLS, snapshot, 403 Model)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, archive this file and drop it from the open index
