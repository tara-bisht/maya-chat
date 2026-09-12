---
id: TODO-001
title: "Conversational Agent Creator: 'Maya' AI Casting Director"
status: ready
area: web
priority: p1
target_slice: PR5
created_at: 2026-09-12
updated_at: 2026-09-12
---

# [TODO-001] Conversational Agent Creator: "Maya" AI Casting Director

## 💡 Overview & Motivation
- **The Problem**: Creating a custom agent via [`apps/web/components/studio/casting-form.tsx`](../../apps/web/components/studio/casting-form.tsx) requires users to manually write system prompt backstories, formulate concise taglines, and manually balance numeric tone sliders (`warmth`, `directness`, `humor`). This creates cognitive friction for casual users and often leads to dry or uninspiring prompts.
- **The Opportunity**: Introduce **Maya**, the Resident Casting Director. Users chat with Maya in natural language (*"Make me an eccentric Renaissance alchemist who explains quantum physics using potion recipes"*). Maya converses with the user, probes for missing mandatory fields (`name`, core persona boundaries, tone), and interactively synthesizes a complete, production-ready character profile.

---

## 🎯 Acceptance Criteria & Scope

- [ ] **Conversational Casting Session**:
  - A chat dialogue powered by a specialized system prompt for Maya: she acts as an expert theatrical casting director and persona architect who is sharp, witty, concise, and asks 1–2 focused questions at a time.
  - Maya actively detects missing mandatory fields (`name`, `tagline`, role boundaries) and prompts the user for them if omitted.
- [ ] **Structured Output / Real-time Extraction**:
  - As Maya converses, she emits structured updates conforming to `StudioUpsert` via AI tool-calling (`draftAgentProfile`):
    - `name`: string (1–40 chars)
    - `tagline`: string (1–160 chars)
    - `backstory` (`system_prompt`): rich markdown formatted instructions including identity, behavioral loop, tone rules, and few-shot dialogue
    - `tone`: `{ warmth: 0..1, directness: 0..1, humor: 0..1 }`
    - `costumeId`: recommended palette (`marcus`, `priya`, `alex`, `nonna`, `viktor`, `valerian`, `barnaby`, `ren`, `custom`)
    - `toolsEnabled`: recommended tool subset (`memory_saver`, `web_search`, `math_solver`)
    - `languagePreset`: detected language (e.g. `en`, `es`, `fr`, etc.)
- [ ] **Split-Screen Studio Workspace (`/studio/new`)**:
  - **Left Pane**: Chat dialogue with Maya.
  - **Right Pane**: Reactive Playbill Card that renders the live agent preview as Maya populates or revises traits.
- [ ] **Interactive Refinements**:
  - Users can request conversational adjustments (*"Make her slightly friendlier"*, *"Rename him Silas"*, *"Give him web search"*), and Maya updates the draft in real time.
- [ ] **Manual Fallback / Advanced Mode**:
  - A tab or toggle allowing users to view the raw form/sliders to make manual micro-adjustments before saving.
- [ ] **One-Click Cast Action**:
  - A primary "Cast Agent" button commits the finalized draft to the existing `saveCastingNotes()` server action, redirecting the user to the newly cast agent's chat screen.
- [ ] **Non-goals**:
  - Voice audio chat during the casting session (deferred to v1.1).
  - Conversational editing of existing agents in phase 1 (phase 1 strictly targets `/studio/new`).

---

## 🧩 Affected Components & Files

- **Backend / AI Engine**:
  - `apps/web/app/api/studio/cast/route.ts` — streaming Route Handler using Vercel AI SDK and OpenRouter with tool emission.
  - `apps/web/lib/studio/maya-casting-prompt.ts` — Maya's system prompt, persona directives, and few-shot casting dialogues.
  - `packages/shared/src/studio.ts` — casting tool schemas and validation helpers.
- **Frontend / Studio Components**:
  - `apps/web/app/(app)/studio/new/page.tsx` — layout host for the conversational casting studio.
  - `apps/web/components/studio/maya-casting-studio.tsx` — split-screen state container.
  - `apps/web/components/studio/maya-chat-pane.tsx` — chat feed and input bar with Maya.
  - `apps/web/components/studio/casting-preview-card.tsx` — reactive Maya Playbill card displaying current draft attributes.
  - `apps/web/components/studio/casting-form.tsx` — retained as the "Manual Edit / Advanced" sheet tab.

---

## 🛠️ Implementation Notes & Technical References

- **Tool Calling Pattern**:
  Use `streamText` from `ai` with a tool definition:
  ```ts
  tools: {
    updateAgentDraft: tool({
      description: "Update the drafted character sheet for the custom agent",
      parameters: studioUpsertSchema.partial(),
      execute: async (draft) => draft,
    }),
  }
  ```
- **Entitlement Guards**:
  Respect existing `loadStudioContext()` and `evaluateStudioWrite()`. If a user is at their custom agent cap (`maxCustomAgents`), render the standard `PaywallTicket` before starting the session.
- **Design Alignment**:
  Adhere to [`docs/DESIGN.md`](../DESIGN.md): Maya Street Cast aesthetic, Night Wall (`#14110F`), Fraunces serif headers, Playbill ticket borders, and costume tokens.

---

## 📋 Execution Checklist

- [ ] Step 1: Create feature branch `feat/studio-maya-casting` from `main`
- [ ] Step 2: Implement `apps/web/lib/studio/maya-casting-prompt.ts` with Maya's persona and extraction tool definitions
- [ ] Step 3: Create `apps/web/app/api/studio/cast/route.ts` streaming route handler
- [ ] Step 4: Build `apps/web/components/studio/casting-preview-card.tsx` for real-time playbill rendering
- [ ] Step 5: Build `apps/web/components/studio/maya-casting-studio.tsx` and integrate into `/studio/new`
- [ ] Step 6: Connect "Cast Agent" button to `saveCastingNotes()`
- [ ] Step 7: Run verification tests: `pnpm turbo lint typecheck test`
- [ ] Step 8: Open PR with `gh pr create --fill` and squash-merge once CI is green
