---
id: TODO-003
title: "Maya from anywhere (`⌘K`)"
status: idea
area: web
priority: p2
target_slice: later
created_at: 2026-09-12
updated_at: 2026-09-17
---

# [TODO-003] Maya from anywhere (`⌘K`)

## Overview

- **What:** After Maya is a real chat ([TODO-002](002-maya-super-agent-host-matchmaker.md)), let people summon her from any signed-in screen with `⌘K` / `Ctrl+K` or a header control. Overlay; do not destroy the chat they were in. Recommendation cards still say **Chat with {name}** and **Create agent**.
- **Why:** Useful once the host exists. Not the first Maya.

Do not start while PR4c / PR5 are open, and do not start before TODO-002. This is not the door.

## Acceptance

- [ ] Global shortcut, ignored while typing in a field unless targeted.
- [ ] Overlay keeps scroll, composer draft, and route.
- [ ] Reuses TODO-002 tools. Cards: **Chat with {name}**, **Create agent**.
- [ ] Non-goals: replacing Maya’s own chat; Host Pass / ticket badge as the product name; shipping this instead of TODO-002.

## Touches

- `apps/web/components/maya/`
- `apps/web/components/app/app-shell.tsx`

## Notes

- Chrome stays plain. No Host Pass, no “Step into Studio.”
- Design: Street Cast tokens. Do not add backdrop-blur as a new look.

## Checklist

- [ ] Worktree + branch per [`git.md`](../../git.md)
- [ ] Implement after TODO-002
- [ ] `pnpm turbo lint typecheck test`
- [ ] PR via `/pr-creator`; after merge, archive this file and drop it from the open index
