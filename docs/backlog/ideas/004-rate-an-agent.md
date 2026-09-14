---
id: TODO-004
title: "Rate an agent (1–5)"
status: idea
area: web
priority: p2
target_slice: later
created_at: 2026-09-14
updated_at: 2026-09-14
---

# [TODO-004] Rate an agent (1–5)

## Overview

- **What:** A signed-in member can score an agent they can see, 1 through 5. One rating per `(user_id, agent_id)`. Playbills may later show an aggregate.
- **Why:** Signal which inbuilt and public custom agents actually land, without turning Explore into a store ranking.

Words: [`CONTEXT.md`](../../../CONTEXT.md) (**Rating**). Do not start while [`docs/NOW.md`](../../NOW.md) has an open MVP slice unless named.

## Acceptance

- [ ] Signed-in user rates a visible agent (curated, or public custom, or a custom they own).
- [ ] Upsert one row per user per agent; changing the score replaces the previous one.
- [ ] Playbill can show an aggregate (count + mean) without exposing who voted.
- [ ] Non-goals: ranking feed, pay-to-boost, rating a private agent you do not own, anonymous ratings.

## Touches

- `supabase/migrations/` — `agent_ratings` (or equivalent) + RLS
- `apps/web/components/` — playbill control
- `packages/shared/` — Zod for the score

## Notes

- Table is not designed here. Owner writes; everyone who can see the agent may read the aggregate.
- Not a marketplace rank. Public custom agents stay a house listing ([ADR 0004](../../adr/0004-public-custom-agents-are-a-house-listing.md)).
