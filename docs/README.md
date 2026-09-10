# Maya Chat: Multi-Agent Persona, Memory & Tools Platform

```yaml
---
project_id: "PRJ-MAYA-001"
title: "Maya Chat: Multi-Agent Persona, Memory & Tools Platform (Web & Mobile)"
status: "Implementation & Build Phase"
stage: "BUILD_MVP"
lead_agent: "team-mates/cto"
assigned_squad:
  - "team-mates/vp-webapps"
  - "team-mates/vp-mobile-apps"
  - "team-mates/vp-backend"
  - "team-mates/vp-databases"
  - "team-mates/head-of-design"
tech_stack: "Next.js 15, Expo, TypeScript, Tailwind / NativeWind, Supabase (PostgreSQL + pgvector + RLS), Vercel AI SDK + AI Gateway (multi-model), Stripe Plus/Pro (RevenueCat in v1.1)"
target_timeline: "14-Day Web MVP + 7-Day Mobile v1 (see roadmap.md)"
monetization: "Free / Plus $9/mo / Pro $19/mo — configurable model allowlists per plan"
---
```

## 📚 Project Documentation Hub

| Document | Purpose & Focus | Audience |
| :--- | :--- | :--- |
| 🚀 **[Project Description](PROJECT_DESCRIPTION.md)** | **Handover brief**:<br>• Product, Free / Plus / Pro packaging<br>• Configurable model catalog via one LLM gateway<br>• Architecture snapshot and doc map | Founder, CTO, Engineering |
| 📄 **[Product Requirements Document (PRD)](prd.md)** | **The "What" & "Why"**:<br>• Executive summary & multi-agent persona vision<br>• Core product pillars, scope boundaries & 3-tier monetization | Product Manager, Marketing, Founder |
| 🧱 **[Tech Stack](tech-stack.md)** | **Locked engineering defaults**:<br>• Next.js 15 + Expo + Supabase + Vercel AI Gateway (one key, many labs)<br>• Node runtime for chat (not Edge), Stripe Plus/Pro, RevenueCat later<br>• Rejected alternatives and env inventory | CTO, Engineering Pod |
| 🗺️ **[High-Level Technical Plan](technical-plan.md)** | **System design for build**:<br>• Chat lifecycle, prompt compiler, `plans` / `models` / `plan_models`<br>• API surface, auth, security, failure modes | CTO, Engineering Pod |
| 📅 **[Roadmap](roadmap.md)** | **Phased delivery**:<br>• Days 1–14 Web MVP, Days 15–21 Mobile v1<br>• Phase exits, cuts, v1.1 deferrals (voice, IAP, sandbox) | Founder, CTO, Pod Leads |
| 🎭 **[Curated Agents Catalog & Prompt Specs](curated-agents.md)** | **Out-of-the-Box Interesting Personas**:<br>• 8 curated agents (Marcus + Dr. Priya free; six more on Plus/Pro)<br>• Production system prompts, tone slider matrices, behavioral loops & few-shot dialogues | Prompt Engineers, Fullstack Pod, QA |
| 🗄️ **[Database Agent Seeds (SQL)](seed-agents.sql)** | **Supabase DB Seeds**:<br>• Executable PostgreSQL migration seeding `public.agents` with all curated prompts, tool arrays, and tone configs | Database / Backend Engineers |
| 🎨 **[Design System (DESIGN.md)](DESIGN.md)** | **Visual identity**:<br>• Maya Street Cast: night wall, costume floods, acid tickets<br>• Fraunces + Bricolage Grotesque, festival lineup posters | Head of Design, Web/Mobile, any UI agent |
| 🖥️ **[Web app (`apps/web`)](apps/web)** | **Night-wall lobby + Next.js 15 shell**:<br>• Character-first landing (festival lineup, not a chatbot)<br>• Maya Street Cast tokens, costume-flood playbills | Founder, Web, Design |
| 🛠️ **[Technical Architecture Blueprint](architecture.md)** | **Original schema & monorepo sketch**:<br>• Turborepo layout, Postgres + pgvector + RLS SQL<br>• §4 14-day dual-track checklist is **superseded by [roadmap.md](roadmap.md)** | CTO, Engineering Pod |
| 📐 **[Implementation Plan](implementation-plan.md)** | **PR-level build sequence**:<br>• Locked decisions, vertical slices, ordered PRs<br>• Phase 0 scaffold through Web MVP | Founder, Engineering |
| 📖 **[Domain glossary (`CONTEXT.md`)](../CONTEXT.md)** | **Words**: agent, company, plan, entitlement, house, playbill, costume | Everyone |

---

## 🎯 Brand Manifesto & Overview

### *"Don't talk to a boring AI chatbot. Give your AI personality and character."*

Every conversation, question, and discussion cannot and should not be a generic AI experience. Talking to an AI shouldn't feel like chatting with a sterile corporate helpdesk. Every conversation deserves a distinct character tailored to what you're doing:

- **Learning Maths**: You need an instructor with academic rigor, pedagogical patience, and engaging energy (like Dr. Priya) — not dry textbook definitions.
- **Discussing Movies**: You need a passionate cinephile with taste, sharp critiques, and cultural references — not a Wikipedia synopsis.
- **Relationship & Life Advice**: You need deep emotional grounding, fierce protective wisdom, or tough love (like Nonna Maria or Marcus) — not canned disclaimers.

Instead of talking to a generic AI bot, have conversations with personality and character based on the conversation topic. Users can choose from our **pre-built curated repertory company** or **create custom characters** as per their exact needs in the Agent Studio.

### The Starter Repertory Company
- **Marcus (The Savage Stoic)**: Roasts your self-pity and excuses before giving razor-sharp Epictetian philosophy.
- **Dr. Priya (The Flirty STEM Prof)**: Flirts with clever math and CS puns while rigorously teaching calculus, data structures, and algorithms.
- **Alex (The Exhausted 10x Tech Lead)**: Cynically sighs at over-engineered architectures while delivering bulletproof, production-grade code.
- **Nonna Maria (The Fierce Italian Grandma)**: Dramatically scolds you for burnout and skipping meals while providing deep life grounding and self-care routines.
- **Viktor (The Tin-Foil Drill Sergeant)**: Hilariously frames procrastination as an enemy psy-op while enforcing science-backed workout and productivity discipline.
- **Valerian (The Cosmic Polymath)**: Explains the deep laws of physics and gives prudent wealth advice through evocative poetic verse and pristine math.
- **Barnaby (The Cynical Apartment Cat)**: A haughty housecat who exposes the absurdity of human stress, dating games, and hustle culture with deadpan feline sarcasm.
- **Ren (The Shy Metaphysician)**: A gentle, introverted classmate with an encyclopedic philosophical mind who treats existential questions with luminous empathy.
