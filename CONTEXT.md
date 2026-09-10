# Maya Chat

A consumer chat product where every conversation is with a named character, not a generic assistant. The company is a touring lineup wheatpasted on a night wall.

## Language

**Agent**:
A named character the user talks to, with a system prompt, tone, tools, and costume. Either curated or custom.
_Avoid_: Bot, assistant, copilot, persona-as-UI-theme

**Curated agent**:
One of the eight first-party repertory players, owned by the system (`user_id` is null, `is_curated` is true).
_Avoid_: Starter bot, default persona, NPC

**Custom agent**:
A user-owned character created in Studio. Counted against `plans.max_custom_agents`.
_Avoid_: Private bot, user persona

**Free-tier agent**:
A curated agent with `free_tier = true`. Only Marcus and Dr. Priya. Plus and Pro see every curated agent.
_Avoid_: Free agent limit, first N agents, `curated_agent_limit` as a runtime gate

**Company**:
The eight curated agents as a repertory. Gallery copy says “the company,” not “your bots.”
_Avoid_: Roster of chatbots, AI team

**Studio**:
The character sheet where a user creates or edits a custom agent (name, tagline, language, costume, backstory, tone sliders, tool toggles).
_Avoid_: Agent builder IDE, prompt playground

**Plan**:
A catalog row in `plans`: `free`, `plus`, or `pro`. Quotas, tools, prices, and default model live here, not in application `if` branches.
_Avoid_: Tier hardcoded in code, `isPro`

**Entitlement**:
This user’s current plan, written by Stripe (or later RevenueCat) into `entitlements`. Chat authorization reads this row.
_Avoid_: Client `isPro` flag, `profiles.is_pro`

**Model alias**:
The public id in `models.id` (`grok-fast`, `claude`). Clients send this. Never a raw gateway string.
_Avoid_: Provider model name in the client, `gateway_id` on the wire

**Gateway id**:
The vendor string stored on `models.gateway_id` and passed to `streamText` (`xai/grok-4-1-fast`).
_Avoid_: Per-provider SDK model object

**Prompt compiler**:
The `@maya/shared` function that builds the system string: identity, optional tone overlay, language, profile, memories, tool policy.
_Avoid_: String concat in the route handler

**Episodic memory**:
A vector row private to `(user_id, agent_id)`. Plus and Pro only. One agent must not retrieve another agent’s memories.
_Avoid_: Global memory, shared embeddings, ChatGPT-style memory dump

**House**:
Chat on night paper: attributed dialogue, costume wash on the agent’s turn, cream ticket for the user.
_Avoid_: ChatGPT chrome, iMessage bubbles, beige document, per-agent app theme

**Lobby**:
Landing, gallery, studio, pricing: the night wall / festival lineup before the play.
_Avoid_: Dashboard, marketing SaaS layout, quiet beige brochure

**Playbill**:
A costume-flood poster for an agent: linocut portrait, Fraunces name, tagline, optional Plus sticker. Tilted, overlapping.
_Avoid_: Feature tile, white card with a 3px stripe, avatar list row

**Costume**:
The agent’s flood color. Owns the poster and the chat wash. Never the page background or the acid CTA.
_Avoid_: Theme, skin, brand color per app chrome

**Voice**:
In the UI, the model the agent speaks through (`Voice through grok-fast`). Not speech audio (that is v1.1).
_Avoid_: Provider badge, “powered by Claude”
