# Supabase

Phase 1 writes migrations here. Do not paste `architecture.md` blindly: chat is Node, embeddings dim is pinned at scaffold (prefer 1024), authorize on `entitlements.plan`, and curated access uses `agents.free_tier`.

Seed agents: [`../docs/seed-agents.sql`](../docs/seed-agents.sql). Catalog SQL: [`../docs/technical-plan.md`](../docs/technical-plan.md) §6.

```bash
pnpm dlx supabase init   # if config.toml is missing
pnpm dlx supabase start  # local Postgres + Auth + Studio
```
