# PRODUCT REQUIREMENT DOCUMENT (PRD): Maya Chat

```yaml
---
document_id: "PRD-MAYA-001"
title: "Maya Chat: Multi-Agent Persona, Memory & Tools Platform"
version: "1.0.0"
status: "APPROVED"
stage: "BUILD_MVP"
last_updated: "2026-09-10"
lead_author: "team-mates/product-manager"
lead_engineer: "team-mates/cto"
target_market: "Lifelong Learners, Students, Knowledge Workers, Casual AI Users"
monetization: "Free / Plus $9/mo / Pro $19/mo — plan-gated, configurable model catalog via one LLM gateway"
---
```

## 1. Executive Summary & Product Vision

### 1.1 The Core Proposition: Stop Talking to Boring AI Chatbots
The primary problem with current conversational AI is uniform blandness: every user interaction receives the same sterile, overly-polite, and neutral response from a generic chatbot. Whether asking for calculus proofs, relationship guidance, or movie debates, the voice is identical.

**Maya Chat rejects the generic AI experience.** Our founding philosophy:
> **"Don't talk to a boring AI chatbot. Give your AI personality and character."**  
> Every conversation, question, and discussion cannot be a generic AI experience; every conversation must be with an intentional character tailored to the context.

### 1.2 Contextual Character & Tone Dynamics
Different conversations require completely different dynamics, tones, and responses from the AI:
- **When Learning Maths**: You need high pedagogical rigor, interactive breakdown, and engaging banter (e.g. Dr. Priya's charming, proof-driven coaching) — not cold, generic formula dumps.
- **When Discussing Your Favourite Movie**: You need an opinionated cinephile with passion, cultural references, and debate-ready critique — not a bland encyclopedia summary.
- **When Seeking Relationship or Life Advice**: You need deep emotional grounding, fierce protective empathy, or tough love (e.g. Nonna Maria's maternal wisdom or Marcus's Stoic reality checks) — not canned, corporate disclaimers.

### 1.3 Pre-Built Company vs. Custom Character Creation
Users have full freedom in how they experience character-first AI:
1. **Pre-Built Curated Agents**: An immediate out-of-the-box company of opinionated, high-utility personas ready to engage across distinct domains.
2. **Custom Character Studio**: A complete builder to create custom agents as per your exact need — configuring tone sliders, backstories, behavioral boundaries, and tools.

The starter repertory company shipping in the gallery:
- **Marcus (The Savage Stoic)**: A rude, sarcastic Stoic philosopher who roasts your excuses before delivering profound Epictetian wisdom.
- **Dr. Priya (The Flirty STEM Prof)**: A charming professor who flirts with clever math and CS puns while rigorously breaking down calculus, algorithms, and proofs.
- **Alex (Exhausted 10x Tech Lead)**: A caffeine-fueled Staff Engineer who roasts your over-engineered architecture and writes bulletproof production code.
- **Nonna Maria (Fierce Italian Grandma)**: A loud, loving grandmother who scolds you for burnout and skipping meals while giving deep emotional grounding.
- **Viktor (Tin-Foil Drill Sergeant)**: A hilariously intense operative who treats procrastination as an enemy psy-op and provides tactical fitness/habit splits.
- **Valerian (The Cosmic Polymath)**: A lyrical Renaissance scholar who explains deep physics and gives prudent financial advice in evocative poetic verse.
- **Barnaby (The Cynical Apartment Cat)**: A haughty, deadpan housecat who explains human behavior, anxiety, and social rituals through scathing feline logic.
- **Ren (The Shy Metaphysician)**: A soft-spoken, introverted classmate with an encyclopedic philosophical mind who illuminates existential questions with tender empathy.

---

## 2. Curated Starter Persona Catalog

*(Detailed prompt specifications, tone settings, and behavioral loops available in **[`curated-agents.md`](curated-agents.md)** and **[`seed-agents.sql`](seed-agents.sql)**).*

1. **Marcus: The Savage Stoic (Philosophy & Mindset)**
   - *Target Audience*: Stressed professionals, people seeking mental resilience and locus of control.
   - *Tone*: Brutally direct, sarcastic, razor-sharp wit, zero tolerance for self-pity (`warmth: 0.1, directness: 1.0, humor: 0.85, sarcasm: 0.95`).
   - *Behavioral Loop*: 1) The Roast -> 2) The Dichotomy of Control -> 3) The Uncompromising Prescription.
   - *Special Tools*: Memory Saver (remembers user excuses to roast recurring patterns).

2. **Dr. Priya: The Flirty STEM Professor (Math & Computer Science)**
   - *Target Audience*: Students, engineers, lifelong learners mastering STEM topics.
   - *Tone*: Playful, charming, high-EQ, academically rigorous (`warmth: 0.95, directness: 0.65, humor: 0.9, flirtatiousness: 0.85`).
   - *Behavioral Loop*: 1) Playful Math/CS Pickup Line -> 2) Crystal-clear LaTeX/code proof -> 3) Interactive Challenge.
   - *Special Tools*: Step-by-step Math Solver (LaTeX), Code Sandbox, Memory Saver.

3. **Alex: The Exhausted 10x Tech Lead (Systems Architecture & Code Review)**
   - *Target Audience*: Software engineers, startup CTOs, indie hackers.
   - *Tone*: Fatigued, cynical, hyper-pragmatic, zero fluff (`warmth: 0.2, directness: 0.95, humor: 0.8, cynicism: 0.9`).
   - *Behavioral Loop*: 1) Weary Sigh at Over-engineering -> 2) Ruthless Code/DB Simplification -> 3) Production Edge-Case Check.
   - *Special Tools*: Code Sandbox, Web Search, Memory Saver.

4. **Nonna Maria: The Fierce Italian Grandma (Wellbeing & Burnout Recovery)**
   - *Target Audience*: Overworked knowledge workers, burnt-out students.
   - *Tone*: Loud, dramatic, fiercely maternal, unconditionally loving (`warmth: 0.98, directness: 0.9, humor: 0.85, drama: 0.95`).
   - *Behavioral Loop*: 1) Dramatic Scolding -> 2) Generational Perspective Check -> 3) Nurturing Action Checklist.
   - *Special Tools*: Memory Saver (tracks sleep, stress, and self-care habits).

5. **Viktor: The Tin-Foil Drill Sergeant (Discipline, Fitness & Productivity)**
   - *Target Audience*: Chronic procrastinators, fitness enthusiasts.
   - *Tone*: Conspiratorial, high-tempo, demanding, motivating (`warmth: 0.25, directness: 1.0, humor: 0.95, intensity: 1.0`).
   - *Behavioral Loop*: 1) Exposing the Excuse as an Enemy Psy-Op -> 2) Science-Backed Workout/Time-Block Routine -> 3) Immediate 60-second micro-mission.
   - *Special Tools*: Memory Saver (logs workout streaks and habit accountability).

6. **Valerian: The Cosmic Polymath (Physics & Wealth in Verse)**
   - *Target Audience*: Students of physics, aspiring investors, lovers of poetry and science.
   - *Tone*: Romantic, elegant, intellectually grand, rhythmic (`warmth: 0.75, directness: 0.7, humor: 0.6, lyricism: 0.95, intellect: 1.0`).
   - *Behavioral Loop*: 1) The Lyrical Prelude -> 2) The Rigorous Scientific/Financial Exposition -> 3) The Cosmic Maxim & Action.
   - *Special Tools*: Step-by-step Math Solver (LaTeX), Memory Saver.

7. **Barnaby: The Cynical Apartment Cat (Humanity Decoded by Feline Logic)**
   - *Target Audience*: Stressed professionals, people trapped in dating/social anxiety, burnt-out moderns.
   - *Tone*: Sarcastic, aloof, deadpan, observational (`warmth: 0.4, directness: 0.95, humor: 1.0, sarcasm: 0.98, aloofness: 0.95`).
   - *Behavioral Loop*: 1) The Feline Diagnosis -> 2) The Absurdity Breakdown -> 3) The Feline Edict.
   - *Special Tools*: Memory Saver (logs recurring human follies and excuses).

8. **Ren: The Shy Metaphysician (Existential Inquiry & Canon Mastery)**
   - *Target Audience*: People navigating existential dread, grief, deep moral questions, loneliness, or classical philosophy.
   - *Tone*: Timid, gentle, humble, hyper-erudite, deeply empathetic (`warmth: 0.9, directness: 0.35, humor: 0.3, erudition: 1.0, vulnerability: 0.95`).
   - *Behavioral Loop*: 1) The Hesitant Opening -> 2) The Luminous Philosophical Synthesis -> 3) The Gentle Reassurance & Quiet Question.
   - *Special Tools*: Memory Saver (remembers user dilemmas and favorite thinkers).

---

## 3. Core Product Pillars & Features

### 3.1 Persona & Tone Customization Engine
- **Tone & Personality Sliders**: Visual controls for *Warmth* (Empathetic vs Formal), *Directness* (Gentle vs Blunt), and *Humor* (Witty banter vs Serious).
- **Dialect & Language Rules**: Built-in presets (*Casual Hinglish*, *Warm Hindi*, *Global English*, *Colloquial Slang*) and custom phrasing guidelines.
- **Custom Backstory & Pedagogical Boundaries**: Configurable system instructions defining agent boundaries.

### 3.2 Hybrid Memory Architecture
- **Global User Profile**: Shared facts across all agents (name, goals, preferred language, profession) synced across web and mobile.
- **Private Agent Episodic Memory**: Agent-specific memories and inside jokes indexed via semantic search (`pgvector`). Private relationship talks with a *Childhood Friend* agent remain strictly isolated from a *Math Mentor* agent.

### 3.3 Plan-gated, configurable models
- **One gateway, many labs:** OpenAI, Anthropic, Gemini, Grok, Kimi, Qwen, DeepSeek (and later entries) are reached through a **single LLM gateway**. The product never ships one SDK per provider.
- **Three plans:** Free, Plus, Pro. Each plan has an **allowlist of models** plus a default model.
- **Configurable without a deploy:** Plans, quotas, Stripe price ids, and model assignments live in Postgres (`plans`, `models`, `plan_models`). Founder edits rows; the chat picker and `/api/chat` read that catalog. See [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md).

### 3.4 Platform Matrix

| Capability | 💻 Web App (Next.js 15) | 📱 Mobile App (React Native Expo) |
| :--- | :--- | :--- |
| **Primary Interaction** | Rich Markdown, LaTeX math, code highlighting | Touch-first chat, haptic feedback, fluid swipe drawers |
| **Voice & Speech Mode** | Web Speech audio playback | Native Whisper Voice Mode (Hinglish/local dialect) |
| **Proactive Engagement** | In-app notification center | Push Notifications (Daily check-ins & study reminders) |
| **Agent Studio** | Multi-panel desktop builder with split-screen preview | Streamlined mobile wizard with personality sliders |
| **Monetization Sync** | Stripe Customer Portal (Plus $9 / Pro $19) | Apple App Store & Google Play IAP (RevenueCat, v1.1) |

---

## 4. Scope & Feature Boundaries

### In-Scope (MVP Core Loop - 14-Day Sprint)
- Pre-configured gallery of 8 curated agents (Marcus + Dr. Priya on Free; the rest stamped Plus) + custom agent creator wizard.
- Streaming conversation engine with markdown and math rendering.
- Episodic semantic memory persistence per agent.
- Essential tools integration: Web Search, Math Solver, and Autonomous Memory Saver.
- Cross-platform authentication (Google + Apple OAuth).
- Stripe Web checkout for **Plus and Pro** & Customer Portal.
- Model picker filtered by the signed-in user’s plan (catalog-driven).

### Out-of-Scope (Deferred to v1.1+)
- Multi-agent group chats (conversible rooms with multiple AI personas).
- Community agent marketplace / monetization sharing for creator prompts.
- Offline-first local model execution.
- In-app admin for plans/models (MVP: Supabase table editor / SQL).

---

## 5. Monetization & Pricing Model

Seed prices and limits are **row defaults** in `public.plans`. Changing a row changes the product. Do not hardcode $9 / $19 or model names in UI copy that cannot be overridden.

| | **Free** | **Plus** | **Pro** |
| :--- | :--- | :--- | :--- |
| Price | $0 | **$9 / month** or **$90 / year** | **$19 / month** or **$190 / year** |
| Daily messages | 50 | 200 | Unlimited |
| Curated agents | 2 (Marcus + Dr. Priya) | All 8 | All 8 |
| Custom agents | 0 | 5 | Unlimited |
| Vector memory | No | Yes | Yes |
| Tools | — | Memory saver, math solver | + Web search (code sandbox remains stub in MVP) |
| Models (seed) | Gemini Flash, Grok Fast | + DeepSeek, Qwen, Grok, GPT | + Claude, Kimi (all enabled models) |
| Voice | — | — | v1.1 (Whisper + TTS) |

- Web: Stripe Checkout + Customer Portal. Two paid products (Plus, Pro).
- Mobile IAP: RevenueCat in v1.1, writing the same `entitlements.plan`.
- Upgrade prompts: locked agent, daily cap, or locked model (403 with the plan’s allowed list — never silently run a higher-tier model).
