---
id: TODO-002
title: "Maya host + matchmaker"
status: done
area: web
priority: p1
target_slice: shipped in PR #40 and PR #41
created_at: 2026-09-12
updated_at: 2026-09-17
---

# [TODO-002] Maya host + matchmaker

## Overview

- **What:** Maya is the free host. Signed-in home starts in **chat with Maya**. She matches you to an official or public custom agent and hands off with a **Chat with {name}** card. If nothing fits, she offers **Create agent** ([TODO-001](001-conversational-agent-creator.md) can fill the sheet; a stub link to `/studio/new` is enough until then). She answers plan, credit, and model questions. She does **not** do the specialist’s job.
- **Why:** People should not have to stare at a wall of posters to start. Maya is the door, not a second ChatGPT.

Words: [`CONTEXT.md`](../../../CONTEXT.md) (**Maya**, **Handoff**). Product: [`PROJECT_DESCRIPTION.md`](../../PROJECT_DESCRIPTION.md). Do not start while PR4c / PR5 are open unless named. [`TODO-003`](003-global-maya-concierge-ui.md) (`⌘K`) is later — this slice is a real chat, not a palette.

## Acceptance

- [x] Maya is a curated `agents` row, `free_tier = true`, always chat-able on Free. Seeded in `docs/seed-agents.sql` and `supabase/seed.sql` (shipped in PR #40).
- [x] After sign-in, empty recents land in Maya’s chat. Recents stay one row per agent (shipped in PR #40).
- [x] `recommendAgent` returns 1–2 live agents the user may talk to, with a short reason and `href` to `/chat/{agentId}`. Chrome: **Chat with {name}**. Plus-locked cards stay readable; paywall is on Chat (shipped in PR #41).
- [x] `suggestCreateAgent` when nothing fits. Button: **Create agent** (not Cast / Forge / Talk to) (shipped in PR #41).
- [x] Maya refuses specialist work (code review, proofs, workouts). She hands off (shipped in PR #41).
- [x] Retrieve a shortlist from the live catalog. Do not stuff every inbuilt prompt into context (shipped in PR #41).
- [x] Streaming route (existing `/api/chat` with Maya’s id, or `POST /api/maya/concierge`). Same OpenRouter gateway, credits, 403-on-locked-model rules (shipped in PR #41).
- [x] Non-goals: Maya writing the user’s code or grading homework; group thread / mid-chat engine swap; `⌘K` drawer ([TODO-003](../ideas/003-global-maya-concierge-ui.md)); conversational create ([TODO-001](../ideas/001-conversational-agent-creator.md)); source-to-agent.

## Touches

- `docs/seed-agents.sql` / `docs/curated-agents.md` — Maya row
- `apps/web/lib/maya/` — host prompt, matchmaker tools
- `apps/web/app/api/` — host route or chat path
- `apps/web/app/(app)/gallery/` — first-run → Maya
- `packages/shared/` — Zod for recommend / create-agent cards

## Notes

- Chrome: Maya, Chat with {name}, Create agent, Model. Not Super agent, House Host, Voice, Talk to.
- Shipped: Landed signed-in home on Maya (#40) and routed Maya through Your agents with roster matching, pause/switch tickets, Add tickets, and Create agent card (#41).

## Checklist

- [x] Worktree + branch per [`git.md`](../../git.md)
- [x] Implement (tests: handoff cards, free-tier Maya, she does not take specialist jobs)
- [x] `pnpm turbo lint typecheck test`
- [x] PR via `/pr-creator`; after merge, archive this file and drop it from the open index (merged in #40, #41)
