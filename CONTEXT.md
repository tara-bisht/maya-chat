# Maya Chat

A consumer chat product where every conversation is with a named character, not a generic assistant. Maya is the host who gets you to that character, or helps you make one. The launch company is a handful of official specialists covering mass use cases; the table can hold more later.

## Language

**Agent**:
A named character the user talks to, with a system prompt, tone, tools, and costume. Either curated or custom.
_Avoid_: Bot, assistant, copilot, persona-as-UI-theme, job-title SKU (“Resume Bot”)

**Maya**:
The host character. Matches the user to an Agent, helps them create one, and explains the product. Always free. Not a generic worker.
_Avoid_: Super agent as the product, orchestrator, default ChatGPT, copilot

**Handoff**:
Maya sending the user into a 1:1 Chat with an Agent, via an agent card (**Chat with {name}**).
_Avoid_: Mid-thread engine swap, group thread, delegation bus, shared canvas, Talk to {name}

**Curated agent**:
A first-party inbuilt character owned by the system (`user_id` is null, `is_curated` is true). Count is catalog data, not a product constant.
_Avoid_: Starter bot, default persona, NPC, “the eight agents” as the product

**Launch company**:
The handful of official curated agents that cover mass use cases at first ship (Maya plus twelve specialists). Named characters, not job-title bots. Architecture can hold more later.
_Avoid_: Thousands as the launch promise, closed repertory of eight, specialist SKU names on posters

**Starter company**:
The original seed rows in [`docs/curated-agents.md`](docs/curated-agents.md) and [`docs/seed-agents.sql`](docs/seed-agents.sql). Subset of the launch company.
_Avoid_: Final catalog, closed repertory

**Custom agent**:
A user-owned character created in Studio. Counted against `plans.max_custom_agents` (a plan row, not a hardcoded eight).
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
A curated agent with `free_tier = true`. Seed: Maya, Marcus, and Dr. Priya. The flag is the gate, not “2 of N.” Plus and Pro see every curated agent. Maya is always free.
_Avoid_: Free agent limit, first N agents, `curated_agent_limit` as a runtime gate

**Company**:
The first-party repertory — every curated agent. Gallery copy says **Featured agents**, not “your bots.” First ship is the **Launch company**; size follows the catalog after that.
_Avoid_: Roster of chatbots, AI team, a fixed eight, thousands as the headline

**Ensemble**:
A named job made of ordered seats (learn a topic, founder brief). Curated or user-owned. Used as one unit. Each seat is still a 1:1 Conversation with one Agent.
_Avoid_: Workflow, pipeline, crew, swarm, DAG, multi-agent, orchestration, AI team

**Seat**:
One place in an Ensemble: which Agent, what this step is for, optional pinned Model. Chrome shows the agent name and the job (`Assess`, `Quiz`).
_Avoid_: Skill, role class, specialist bot, the word seat in chrome (billing already uses Plan for that word)

**Category**:
The Explore / marketplace section a curated agent sits in. Labels: Work, Learning, Advice, Debate, Everyday, Play. Custom agents are not on this bill.
_Avoid_: Professional / Fun / Niche / Believer / Sage / Canon as Explore tabs, department, genre

**Archetype**:
Editorial casting recipe on a curated agent (professional, blend, niche, believer, coach, companion, researcher, improviser, guide, fantasy, sage, canon). How we write them, not an Explore tab.
_Avoid_: Persona type, class, character class, Voice (retired; the LLM is Model)

**Blend**:
A curated agent whose job and personality would not normally share a room — math × flirty, Stoic × roast. Maya’s signature recipe.
_Avoid_: Fun agent as a category, quirky skin, personality pack

**Tag**:
A queryable chip on a curated agent (`f1`, `email`, `capitalism`). Matchmaker and filters use tags; chrome may show a few.
_Avoid_: Category, hashtag, topic as the browse axis

**Believer**:
A curated debate character with a declared stance. Argue-with, not convert-you. Shipped in pairs.
_Avoid_: Opinion bot, ideology pack, political preset

**Sage**:
A curated agent who answers from a named teaching or historical mind. Public-domain names allowed (Aurelius, Siddhartha, Krishna). Living people and estate-controlled modern figures become originals in that tradition (Pia, Marigold). Distinct from Marcus, who is a Stoic **blend**.
_Avoid_: Celebrity bot, séance, priest, licensed likeness

**Canon**:
A curated agent who is a character with a remembered world — public-domain literary (Holmes, Hamlet, Elizabeth) or an original pastiche (Voss, Rook, Wick, Cerys). You talk *to* them. Nyx is a DM; that is **fantasy**.
_Avoid_: Licensed TV/film impersonation, “talk to celebrities” as a tab, wiki dump

**Studio**:
Where a user creates or edits a custom agent. Default path is talking to Maya; the form is Advanced. Chrome fields: Name, Description, Language, Color, Instructions, Tone, Tools, Model, Public / Private.
_Avoid_: Agent builder IDE, prompt playground, Agent Forge, Backstory, Costume, Tagline, Voice

**Rating**:
A signed-in member’s score from 1 to 5 on an agent they can see. One row per `(user_id, agent_id)`. A playbill may show an aggregate later. Not shipped.
_Avoid_: Marketplace rank, likes, stars-as-currency

**Remix**:
Create a new custom agent from another agent’s public playbill (name, tagline, costume, tone as a starting point). Backstory / `system_prompt` is newly authored. Non-owners never receive a curated or foreign custom prompt. Not shipped.
_Avoid_: Fork the prompt, clone the thread, steal the backstory

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
Internal name for the chat screen (code and design). Chrome: **Chat**.
_Avoid_: House in chrome, “the house is open,” ChatGPT bubbles, iMessage, beige document

**Conversation**:
One thread of messages between one user and one agent. Nested under that agent. Table `conversations`. UI: **chat** / **New chat**.
_Avoid_: session, room, untitled “New Chat” as a DB leftover shown raw

**Thread**:
A Conversation in the agent rail. Same object as Conversation. UI: **Chats**.
_Avoid_: DM

**Run**:
One execution of an Ensemble. Snapshot of seats at start so later template edits do not mutate it. Contains one Conversation per seat.
_Avoid_: Session, pipeline run, job id in chrome, group thread

**Brief**:
The shared write-up handed seat to seat in a Run (goal, notes, last output). User-editable. Not memory.
_Avoid_: Global memory, shared embeddings, context dump, ChatGPT-style memory dump

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
Internal name for an agent poster (linocut, name, description, optional Plus sticker). Chrome has no word for it — it is the agent card.
_Avoid_: Playbill, feature tile, white card with a 3px stripe

**Costume**:
Internal name for the agent’s flood color. Chrome: **Color**.
_Avoid_: Costume, costume flood, theme, skin in chrome

**Costume palette**:
The reused set of flood inks posters pick from. Many agents share a flood. A new character does not require a new ink.
_Avoid_: Per-character theme token, unique hex per agent

**Model**:
The LLM the agent replies with. Chrome: **Model: {alias}** (`grok`, `claude`, `gpt`). Speech audio, if we ship it later, is **Speech** — never Voice.
_Avoid_: Voice, Voice through, provider badge, “powered by Claude”

**Default model**:
The suggested model alias on an Agent. The user may change it to any alias on their plan. Never a silent upgrade past the plan.
_Avoid_: Recommended Voice, auto router, best-model magic

**Model picker**:
Chat header control listing catalog aliases. Locked rows stamp the plan that unlocks them. Clients send `modelId`, never a gateway slug.
_Avoid_: Voice picker, provider dropdown, raw OpenRouter id on the wire, BYOK key field

**Profile**:
The member’s global profile at `/settings`: name, preferred language, bio, plan, and **Your agents**. Every agent is told the bio. It is not a costume.
_Avoid_: Wristband, custom instructions, user persona, “account settings” as the product name

## UI labels

Chrome uses the same words as other AI apps. Agent *replies* stay opinionated. Strings live in `apps/web/lib/ui-copy.ts`.

| Do not put in chrome | Use |
|---|---|
| Voice / Voice through {alias} | Model / Model: {alias} |
| House / The house is open | Chat |
| Backstory | Instructions |
| Costume / Costume flood | Color |
| Tagline | Description |
| Playbill | (no label — it is the agent card) |
| Talk to {name} | Chat with {name} |
| Memory saver | Memory |
| Wristband / Wristband check | Profile / Sign in |
| Super agent / Orchestrator / Forge | Maya |
| Delegate / Route to specialist | Chat with {name} |
| Casting notes / Cast someone / Agent Forge | Create agent / Edit agent |
| Cast a bill / Create lineup | Create ensemble |
| Workflow / pipeline / crew / swarm | Ensemble / Start |
| Source-to-agent / BYOK | Create agent / Plan |
| Act I / Role 3 / specialist | Agent name + job (Assess, Quiz) |
| Shared memory / context dump | Brief |
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
| Philosophy (section) | Debate |
| Productivity (section) | Work |
| Wellbeing (section) | Advice |
| Lifestyle (section) | Everyday |
