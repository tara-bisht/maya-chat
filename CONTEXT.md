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
The gallery section of public custom agents the signed-in user does not own. UI label: **From other people**.
_Avoid_: Marketplace, explore feed, community tab

**Archive**:
Soft-removal of a custom agent (`archived_at` set). Leaves Home and blocks new threads; the row remains for existing conversations.
_Avoid_: Hard delete, unpublish

**Free-tier agent**:
A curated agent with `free_tier = true`. Only Marcus and Dr. Priya. Plus and Pro see every curated agent.
_Avoid_: Free agent limit, first N agents, `curated_agent_limit` as a runtime gate

**Company**:
The eight curated agents as a repertory. Gallery copy says **Featured agents**, not “your bots.”
_Avoid_: Roster of chatbots, AI team

**Studio**:
The character sheet where a user creates or edits a custom agent (name, tagline, language, costume, backstory, tone sliders, tool toggles).
_Avoid_: Agent builder IDE, prompt playground

**Plan**:
A catalog row in `plans`: `free`, `plus`, or `pro`. Credit allowances, tools, prices, and default model live here, not in application `if` branches.
_Avoid_: Tier hardcoded in code, `isPro`

**AI credit**:
Integer unit of model usage. Derived from OpenRouter `usage.cost`. Chrome label: **credits**. Users never see dollars.
_Avoid_: Points, tokens-as-currency, coins, wallet, compute points, API cost

**Allowance**:
The plan’s daily credit grant. Resets 00:00 UTC. Unused credits do not roll over. A silent monthly cap is the whale fuse.
_Avoid_: Message cap, daily_message_limit

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
One thread of messages between one user and one agent. Nested under that agent. Table `conversations`. UI: **chat** / **New chat**.
_Avoid_: session, room, untitled “New Chat” as a DB leftover shown raw

**Thread**:
A Conversation in the agent rail. Same object as Conversation. UI: **Chats**.
_Avoid_: DM

**Lobby**:
Landing, marketplace, and signed-in Home (gallery), Explore, Studio, Profile: night-wall surfaces before chat.
_Avoid_: Marketing SaaS layout, quiet beige brochure. Do not name the UI “Dashboard.”

**Marketplace**:
The public, unauthenticated bill of first-party players — the company plus coming-soon posters — organized by category. Browse is open; talking requires sign-in. Signed-in users see the same bill at **Explore** (`/explore`) inside AppShell; `/marketplace` redirects them there.
_Avoid_: Agent store, App Store for bots, community marketplace, listing of user-owned custom agents

**Coming-soon player**:
A first-party character announced on the marketplace who is not a chat-able `agents` row. Stamp: **Coming soon**. No Chat link.
_Avoid_: Draft agent, unpublished bot, disabled custom agent

**Playbill**:
A costume-flood poster for an agent: linocut portrait, Fraunces name, tagline, optional Plus sticker. Tilted, overlapping.
_Avoid_: Feature tile, white card with a 3px stripe, avatar list row

**Costume**:
The agent’s flood color. Owns the poster and the chat wash. Never the page background or the acid CTA.
_Avoid_: Theme, skin, brand color per app chrome

**Voice**:
The model the agent speaks through. Chat chrome shows **Voice through {alias}**. Not speech audio (that is v1.1).
_Avoid_: Provider badge, “powered by Claude”

**Model picker**:
House chrome control listing catalog aliases. Locked rows stamp the plan that unlocks them. Clients send `modelId`, never a gateway slug.
_Avoid_: Provider dropdown, raw OpenRouter id on the wire

**Profile**:
The member’s global profile at `/settings`: name, preferred language, bio, plan, and **Your agents**. Every agent is told the bio. It is not a costume.
_Avoid_: Wristband, custom instructions, user persona, “account settings” as the product name

## UI labels

Chrome is plain. Agent voices stay opinionated. Strings live in `apps/web/lib/ui-copy.ts`.

| Do not put in chrome | Use |
|---|---|
| Wristband / Wristband check | Profile / Sign in |
| Casting notes / Cast someone | Create agent / Edit agent |
| Tonight's company / The lineup | Home / Featured agents |
| Your roles / On your wall | Your agents |
| House listing / Also on the wall | From other people |
| House (stamp) | Public |
| Next bill | Coming soon |
| Back to the wall | Home |
| Nights / The player | Chats / About |
| Seat / Buy a better seat | Plan / Upgrade |
| Daily curtain / The line dropped | Daily limit reached / Something went wrong |
| Setting the house… | Loading… |
