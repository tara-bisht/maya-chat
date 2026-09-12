---
id: TODO-003
title: "Global Maya Concierge UI: Command Palette (`⌘K`) & Floating Host Pass"
status: ready
area: web
priority: p2
target_slice: PR6
created_at: 2026-09-12
updated_at: 2026-09-12
---

# [TODO-003] Global Maya Concierge UI: Command Palette (`⌘K`) & Floating Host Pass

## 💡 Overview & Motivation
- **The Problem**: Confining Maya to a single landing page or standalone route restricts utility. Users deep inside a conversation or browsing the gallery shouldn't have to leave what they are doing just to ask Maya for a recommendation, check daily allowance usage, or explore other agents.
- **The Opportunity**: Introduce an ambient, universally accessible interface for Maya. Users can press `⌘K` / `Ctrl+K` or tap a persistent "Host Pass" icon to summon a slide-over concierge drawer without losing context.

---

## 🎯 Acceptance Criteria & Scope

- [ ] **Universal Keyboard Shortcut (`⌘K` / `Ctrl+K`)**:
  - Global hotkey listener mounted in the application shell that toggles the Maya Concierge interface.
  - Automatically disables when typing in text inputs/textareas unless explicitly targeted.
- [ ] **Persistent Night-Wall Host Badge**:
  - A subtle theatrical ticket badge in the navigation rail / header adhering to Maya Street Cast tokens (`#14110F`, acid yellow accent, Fraunces font).
- [ ] **Non-Destructive Slide-Over Drawer / Modal**:
  - Opens as an overlay that preserves scroll positions, draft chat inputs, and route states behind it.
  - Smooth animation, fully responsive on both desktop and mobile viewport dimensions.
- [ ] **Interactive Rich Response Cards**:
  - When Maya recommends an agent via `recommendAgent` tool call, render an interactive Playbill Card with costume badge and a "Talk to [Agent] ➡️" button.
  - Clicking an agent recommendation seamlessly navigates to `/chat/[agentId]` and closes the drawer.
  - When Maya suggests creating a custom agent, render a "Step into Studio 🎬" action button.

---

## 🧩 Affected Components & Files

- **Frontend / Client Components**:
  - `apps/web/components/maya/maya-concierge-modal.tsx` — slide-over drawer and modal container.
  - `apps/web/components/maya/maya-host-badge.tsx` — navigation trigger button.
  - `apps/web/components/maya/maya-recommendation-card.tsx` — rich interactive Playbill recommendation card.
  - `apps/web/components/app/app-shell.tsx` — mounts global keyboard listener and modal.
  - `apps/web/hooks/use-maya-concierge.ts` — React hook managing open/closed state and chat history.

---

## 🛠️ Implementation Notes & Technical References

- **Design System Alignment**:
  - Follow [`docs/DESIGN.md`](../DESIGN.md): Night Wall `#14110F`, backdrop blur (`backdrop-blur-md bg-black/60`), Bricolage Grotesque body text, Fraunces serif wordmark, acid yellow `#E2F86E` accents.
- **Client State**:
  - Concierge conversation can be session-ephemeral or persisted in local storage so users can reopen `⌘K` and see their recent dialogue with Maya.

---

## 📋 Execution Checklist

- [ ] Step 1: Create feature branch `feat/maya-concierge-ui` from `main`
- [ ] Step 2: Implement `apps/web/hooks/use-maya-concierge.ts` and `useHotkeys` listener for `⌘K`
- [ ] Step 3: Build `apps/web/components/maya/maya-concierge-modal.tsx` with streaming chat UI
- [ ] Step 4: Build `apps/web/components/maya/maya-recommendation-card.tsx` for rich agent cards
- [ ] Step 5: Mount `MayaHostBadge` in the desktop rail and mobile header
- [ ] Step 6: Test keyboard shortcuts, ESC to close, backdrop dismiss, and navigation transitions
- [ ] Step 7: Run `pnpm turbo lint typecheck test`
- [ ] Step 8: Open PR and squash-merge to `main`
