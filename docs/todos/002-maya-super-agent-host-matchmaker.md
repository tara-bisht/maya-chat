---
id: TODO-002
title: "Maya Super Agent: Resident House Host & Persona Matchmaker Engine"
status: ready
area: ai-engine
priority: p1
target_slice: PR5
created_at: 2026-09-12
updated_at: 2026-09-12
---

# [TODO-002] Maya Super Agent: Resident House Host & Persona Matchmaker Engine

## 💡 Overview & Motivation
- **The Problem**: When a user visits Maya Chat with a specific need (e.g. *"I'm terrified of my calculus midterm"*, or *"I need a ruthless review of my startup pitch deck"*), they often experience decision paralysis looking at the gallery or don't know which agent fits best.
- **The Opportunity**: Position **Maya** as the Resident House Host & Repertory Director. Maya listens to what the user wants to accomplish, matches them with the ideal persona with reasoned justification, and provides a 1-click button to enter the dialogue. If no agent in the repertory fits, she offers an immediate handoff into Studio to co-create one (`TODO-001`). She also acts as an in-universe concierge explaining daily credit allowances, plan tiers, and features.

---

## 🎯 Acceptance Criteria & Scope

- [ ] **Maya House Host Persona**:
  - Persona specification: The Resident Host & Artistic Director of Maya Chat. Warm, perceptive, witty, theatrical, and deeply knowledgeable about every player in the touring company.
  - Familiar with all 8 curated agents' distinct voices, tools, and domain boundaries (Marcus, Priya, Alex, Nonna, Viktor, Valerian, Barnaby, Ren).
- [ ] **Intelligent Agent Matchmaker Tool (`matchAgent`)**:
  - A structured LLM tool that evaluates user goals against available agents:
    - Analyzes query sentiment, subject matter, and required tone.
    - Recommends 1–2 top candidates with explicit rationale (*"Priya will give you rigorous proofs and clever math puns, while Marcus will roast your procrastination"*).
    - Returns actionable metadata: `agentId`, `name`, `tagline`, `costumeId`, and direct deep link `href: /chat/[agentId]`.
- [ ] **Studio Co-Creation Gateway**:
  - Detects when a user asks for a character not currently in the repertory (e.g., *"a 1920s hardboiled noir detective"*).
  - Offers a direct handoff button to the conversational studio (`/studio/new`) pre-populated with the user's concept (`TODO-001`).
- [ ] **Platform Concierge Q&A**:
  - Accurately answers questions about daily credit allowances, plan tiers (Free vs Plus vs Pro), model selection allowlists, and memory/tools without breaking character.
- [ ] **Streaming API Endpoint**:
  - `POST /api/maya/concierge` streaming route handler using Vercel AI SDK and OpenRouter with tool-calling capabilities.

---

## 🧩 Affected Components & Files

- **AI Engine / Prompts**:
  - `apps/web/lib/maya/host-prompt.ts` — Maya's system prompt, persona directives, company catalog context, and house rules.
  - `apps/web/lib/maya/matchmaker.ts` — agent catalog indexer, similarity/filtering logic, and tool definition.
- **API Routes**:
  - `apps/web/app/api/maya/concierge/route.ts` — streaming route handler executing the matchmaking tools.
- **Shared Schemas**:
  - `packages/shared/src/maya.ts` — Zod schemas for concierge messages, matchmaker tool parameters, and response structures.

---

## 🛠️ Implementation Notes & Technical References

- **Tool Definition**:
  ```ts
  tools: {
    recommendAgent: tool({
      description: "Recommend a specific curated or custom agent to the user",
      parameters: z.object({
        agentId: z.string(),
        reason: z.string(),
        suggestedOpeningPrompt: z.string().optional(),
      }),
      execute: async ({ agentId, reason, suggestedOpeningPrompt }) => {
        return { agentId, reason, suggestedOpeningPrompt };
      },
    }),
    suggestStudioCreation: tool({
      description: "Suggest creating a new custom agent when no existing agent fits",
      parameters: z.object({
        concept: z.string(),
        suggestedName: z.string(),
      }),
      execute: async (data) => data,
    }),
  }
  ```
- **Context Injection**:
  Inject a lightweight summary of all 8 curated agents and public agents into Maya's prompt context to keep latency and token costs minimal.

---

## 📋 Execution Checklist

- [ ] Step 1: Create feature branch `feat/maya-host-matchmaker` from `main`
- [ ] Step 2: Define `apps/web/lib/maya/host-prompt.ts` and repertory catalog summary
- [ ] Step 3: Implement `apps/web/lib/maya/matchmaker.ts` tool declarations
- [ ] Step 4: Create `POST /api/maya/concierge` streaming endpoint
- [ ] Step 5: Test matchmaking across distinct problem domains (math, coding, emotional support, philosophy, out-of-scope personas)
- [ ] Step 6: Verify `pnpm turbo lint typecheck test`
- [ ] Step 7: Open PR and squash-merge to `main`
