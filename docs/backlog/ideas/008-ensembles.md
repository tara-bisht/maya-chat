---
id: TODO-008
title: "Ensembles: sequential multi-character jobs"
status: idea
area: web
priority: p2
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-14
---

# [TODO-008] Ensembles: sequential multi-character jobs

## Overview

- **What:** A user runs a job (learn a topic, founder brief, draft-and-critique) as **one named Ensemble**: ordered seats of existing Agents, each still a 1:1 House Conversation, with a shared **Brief** handed forward. Voices (model aliases) can be pinned per seat. Curated ensembles ship as catalog; users can later assemble their own in Studio.
- **Why:** Hard jobs need more than one character — assess then teach then quiz, or research then plan then review — and different models are good at different seats. Maya stays a repertory of named people, not a generic workflow builder.

Words: [`CONTEXT.md`](../../../CONTEXT.md) (**Ensemble**, **Seat**, **Run**, **Brief**, **Voice**). Do not start while [`docs/NOW.md`](../../NOW.md) has an open MVP slice unless this todo is named. Depends on [TODO-006](006-catalog-driven-first-party-bill.md) (catalog-backed wall) and [TODO-007](007-inbuilt-catalog-jobs-voices.md) (researcher / coach / guide characters). Do not seed generic “Researcher Bot” seats.

This is **not** group chat (parked in the PRD), not CrewAI / n8n / Grok Rhai workflows, not a DAG, and not a Skill entity. “Skill” in the pitch is job + tools + pinned Voice + seat instructions.

## How a run feels (v1)

User-in-the-loop, sequential:

1. Pick an ensemble playbill (Home / Explore) or start one they own.
2. Short intake (topic, goal, constraints) becomes the opening Brief.
3. Talk to seat 1 in House. Costume wash is that agent’s.
4. **Next** lets the user edit the Brief (or a cheap model drafts a summary) and opens seat 2 as a new Conversation under the same Run. Earlier chats stay on the rail, nested under the run.
5. Skip, restage, or stop. Editing the ensemble template never rewrites this run (copy-on-start snapshot).

v1.1 (not this slice): **Run the rest** — auto-advance remaining seats; user jumps in if they want. Still 1:1 threads. Still not a graph engine. Looping teach → quiz → feedback is a **Restage** button, not a cycle node.

## Built-in ensembles

Curated rows (`user_id` null, `is_curated` true), same pattern as curated agents. Cast from live company characters after TODO-007. Until wave 1 ships, bind to starter names and swap.

### Learn a topic

Intake: topic, goal (exam / fluency / teach-back), current level.

| # | Seat job | Cast | Voice | Tools |
| :---: | :--- | :--- | :--- | :--- |
| 1 | Assess | Guide / coach | Plan default / cheap | none |
| 2 | Plan | Guide | Mid (`grok`) | none |
| 3 | Teach | Explainer (Priya-class) | Mid / frontier per plan | `math_solver` if STEM |
| 4 | Quiz | Tester | Cheap | none |
| 5 | Feedback | Coach | Cheap / mid | none |

### Founder brief

Intake: idea, audience, constraints (solo, stack, timeline).

| # | Seat job | Cast | Voice | Tools |
| :---: | :--- | :--- | :--- | :--- |
| 1 | Landscape | Researcher | Cheap / search-strong (`gemini-flash`) | `web_search` (Pro) |
| 2 | Demand | Researcher / analyst | Cheap / mid | `web_search` |
| 3 | Competitive | Analyst | Mid | `web_search` |
| 4 | Technical plan | Builder (Alex-class) | Mid / frontier | none |
| 5 | Review | Coach (Meera-class) | Frontier if allowed, else mid | none |

### Draft and critique

Writer seat → coach seat. Two seats; proves handoff without a five-act burn.

Do not ship a believer pair as an ensemble in v1 — it reads as group chat.

## User-created ensembles

Studio grows a second sheet: pick agents the user can see (own custom, curated they may use, not foreign private), order seats, one-line job per seat, optional Voice pin, optional extra instructions **on top of** the agent’s backstory (never replacing it, never copying a foreign `system_prompt`).

- Remix a curated ensemble: copy seats, swap agents, change Voices. Same rule as [TODO-005](005-remix-an-agent.md): do not copy another owner’s backstory.
- New plan column `max_custom_ensembles`. Do not overload `max_custom_agents`. Seed: Free `0`, Plus small, Pro larger or `null`.
- Free tasting: one curated ensemble with `free_tier` and cheap Voices only, so the feature is visible. Custom ensembles are Plus+.
- Maya host ([TODO-002](002-maya-super-agent-host-matchmaker.md)) may later recommend an ensemble. Conversational casting ([TODO-001](001-conversational-agent-creator.md)) may later cast one. Neither is required to ship this.

## Acceptance

- [ ] Glossary and chrome words already in [`CONTEXT.md`](../../../CONTEXT.md). Keep them if this file moves.
- [ ] Curated ensembles are catalog rows, playbills on Home / Explore. No fifth nav tab. Stamp is seat count, not “workflow.” Costume flood from the palette — no new CSS variable per ensemble.
- [ ] Starting a run snapshots seats, takes intake into the Brief, opens seat 1 as a normal Conversation (`POST /api/chat` unchanged in contract besides optional run overlay).
- [ ] **Next** writes the Brief (user edit or cheap-model summary) and opens the next seat. Skip / restage / stop work. Template edits do not mutate in-flight runs.
- [ ] Each seat Conversation stays 1:1. Memories stay `(user_id, agent_id)`. The Brief is the only cross-seat state, injected by the prompt compiler like profile/memories.
- [ ] Seat Voice uses existing `plan_models`. Missing or illegal alias → plan default or **403**, never silent Claude. Tools = agent ∩ plan.
- [ ] Credits: each seat turn is the existing credit engine. Mid-run 402 pauses the run and keeps the Brief. Copy must warn that a five-seat run can spend a daily allowance.
- [ ] Custom ensembles respect `max_custom_ensembles`, public/private/archive like agents. Free cannot create them.
- [ ] RLS: owner sees own ensembles/runs; curated select like agents; never leak seat instructions or foreign backstories (`select *` ban applies).
- [ ] Non-goals: group chat; DAG / parallel / conditionals / loop-as-engine; autonomous unattended runs; Skill packs / MCP as composition; marketplace of ensembles; in-app catalog admin; implementing before Web MVP unless named.

## Touches

- `supabase/migrations/` — `ensembles`, `ensemble_seats`, `ensemble_runs`, `conversations.ensemble_run_id`, `plans.max_custom_ensembles`, RLS
- `packages/shared/` — Zod for ensemble upsert, run intake, Brief; prompt compiler run overlay
- `apps/web/app/(app)/` — ensemble playbill, run surface (House + thin acts rail), Studio sheet, Brief ticket
- `apps/web/app/api/chat` — Brief overlay only; no second runtime
- `apps/web/lib/ui-copy.ts` — **Ensemble**, **Start**, **Brief**, **Next**, **Create ensemble**
- Seed SQL for the three curated ensembles once TODO-007 characters exist

## Notes

- **Reuse chat.** Node route, `maxDuration = 60`, OpenRouter only. A run is N conversations, not a new `usage_events` type in v1. Auto-advance needs chained requests or a longer job — v1.1.
- **Copy-on-start:** `ensemble_runs` stores a JSON snapshot of seats (`agent_id`, job label, model pin, instructions).
- **Handoff:** cheap model (plan default / flash) summarizes the seat into the Brief unless the user edited it. User edit always wins.
- **Schema sketch** (not DDL):

```text
ensembles (id, user_id null for curated, name, tagline, costume, is_curated, is_public, free_tier, archived_at)
ensemble_seats (ensemble_id, position, agent_id, job_label, default_model_id?, instructions)
ensemble_runs (id, user_id, ensemble_id, seats_snapshot jsonb, brief, current_position, status)
conversations.ensemble_run_id nullable
```

- **UX:** DESIGN.md. Next is the acid CTA. Skip / restage are ghosts. Brief is a ticket sheet, not a third inspector column on desktop v1. Paywall tickets: locked ensemble, credits, locked Voice.
- **ADR:** write when the first migration lands (1:1 + Brief vs group chat vs DAG is hard to reverse). Not in this docs PR.
- Sequence: PR4c → PR5 → TODO-006 → TODO-007 → this → optional TODO-002 recommend an ensemble → later Studio sheet, remix, Run the rest.

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests where the slice needs them: compiler overlay, RLS, snapshot, 403 Voice)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, move this file to archive and drop it from the open index
