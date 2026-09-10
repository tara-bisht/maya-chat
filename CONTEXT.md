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
_Avoid_: Bot, user persona

**Public custom agent**:
A custom agent with `is_public` true and `archived_at` null. Any signed-in user can see the playbill and start their own thread. The backstory stays server-side for non-owners.
_Avoid_: Marketplace listing, community bot, shared prompt, unlisted

**Private custom agent**:
A custom agent with `is_public` false. Only the owner can see or chat. Plus and Pro may create these; Free cannot create them or flip a public row private. Existing private rows are grandfathered on downgrade.
_Avoid_: Hidden bot, secret persona, unlisted

**House listing**:
The gallery section of public custom agents the signed-in user does not own.
_Avoid_: Marketplace, explore feed, community tab

**Archive**:
Soft-removal of a custom agent (`archived_at` set). Leaves the wall and blocks new threads; the row remains for existing conversations.
_Avoid_: Hard delete, unpublish

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
The vendor string stored on `models.gateway_id` and passed to the OpenRouter client (`x-ai/grok-4.20`). Never a raw gateway string on the wire.
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

**Conversation**:
One thread of messages between one user and one agent. Nested under that agent. Table `conversations`.
_Avoid_: Chat, session, room, untitled “New Chat”

**Thread**:
The House word for a Conversation in the cast rail. Same object as Conversation.
_Avoid_: Sidebar chat, history item, DM

**Lobby**:
Landing, gallery, marketplace, studio, pricing: the night wall / festival lineup before the play.
_Avoid_: Dashboard, marketing SaaS layout, quiet beige brochure

**Marketplace**:
The public, unauthenticated bill of first-party players — the company plus coming-soon posters — organized by category. Browse is open; talking requires sign-in.
_Avoid_: Agent store, App Store for bots, community marketplace, listing of user-owned custom agents

**Coming-soon player**:
A first-party character announced on the marketplace who is not a chat-able `agents` row. Stamped Next bill. No Talk thread.
_Avoid_: Draft agent, unpublished bot, disabled custom agent

**Playbill**:
A costume-flood poster for an agent: linocut portrait, Fraunces name, tagline, optional Plus sticker. Tilted, overlapping.
_Avoid_: Feature tile, white card with a 3px stripe, avatar list row

**Costume**:
The agent’s flood color. Owns the poster and the chat wash. Never the page background or the acid CTA.
_Avoid_: Theme, skin, brand color per app chrome

**Voice**:
In the UI, the model the agent speaks through (`Voice through grok-fast`). Not speech audio (that is v1.1).
_Avoid_: Provider badge, “powered by Claude”

**Wristband copy**:
The member’s global profile: name, preferred language, and bio. Every player is told this. It is not a costume and not a custom agent.
_Avoid_: Account page, custom instructions, user persona, settings panel as the product name
