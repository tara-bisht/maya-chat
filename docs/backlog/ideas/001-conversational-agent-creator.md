---
id: TODO-001
title: "Conversational create agent (Maya)"
status: ready
area: web
priority: p1
target_slice: after TODO-002
created_at: 2026-09-12
updated_at: 2026-09-17
---

# [TODO-001] Conversational create agent (Maya)

## Overview

- **What:** Creating a custom agent is a chat with Maya. She asks 1–2 questions at a time and fills Name, Description, Instructions, Color, Tone, Language, Tools, and default Model. The existing form stays **Advanced**. **Create agent** saves via `saveCastingNotes()` and opens that chat.
- **Why:** Most people will not fill a character sheet. Personality control still has to be easy.

Depends on [TODO-002](002-maya-super-agent-host-matchmaker.md) (Maya exists as host). Do not start while PR4c / PR5 are open unless named.

## Acceptance

- [ ] `/studio/new` default: chat with Maya, live agent card on the side. Advanced tab is today’s form.
- [ ] Tool updates a draft: `name`, `tagline` (chrome: Description), `backstory` / `system_prompt` (chrome: Instructions), `tone`, `costumeId` (chrome: Color), `toolsEnabled`, `languagePreset`, default model alias on the plan.
- [ ] Missing required fields: Maya asks. User can say “make her friendlier” and the card updates.
- [ ] Primary button: **Create agent**. Same studio caps and Free public-only gate; 402 paywall ticket if over cap.
- [ ] Non-goals: speech audio; editing an existing agent in this slice; source URL/PDF ingest; “Cast Agent.”

## Touches

- `apps/web/app/api/studio/cast/route.ts`
- `apps/web/lib/studio/` — Maya create prompt
- `apps/web/app/(app)/studio/new/page.tsx`
- `apps/web/components/studio/` — chat pane + preview card; `casting-form.tsx` stays Advanced
- `packages/shared/src/studio.ts`

## Notes

- Chrome: Create agent, Description, Instructions, Color, Model. Not Cast, Voice, Backstory, Costume, Playbill.
- Sequence: PR5 → TODO-002 → this.

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement (tests: draft tool, caps, Create agent saves)
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, archive this file and drop it from the open index
