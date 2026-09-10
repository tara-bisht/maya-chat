# Supabase

Phase 1 schema lives in `migrations/`. Seed curated agents from `seed.sql` (copy of `docs/seed-agents.sql`). Catalog rows (`models`, `plans`, `plan_models`) are in the first migration.

Do not paste `architecture.md` blindly: chat is Node, embeddings dim is 1024, authorize on `entitlements.plan`, curated access uses `agents.free_tier`.

| Env | Project | API URL |
| :--- | :--- | :--- |
| **dev** | `supabase start` (Docker) | `http://127.0.0.1:54321` |
| **stage** | `maya-chat-stage` (`mhuxzwbdqyuksjcfdyqj`) | `https://mhuxzwbdqyuksjcfdyqj.supabase.co` |
| **prod** | existing project (`fheihguzmvhciotkziew`) — rename to `maya-chat-prod` in the dashboard | `https://fheihguzmvhciotkziew.supabase.co` |

```bash
pnpm dlx supabase start   # local Postgres + Auth + Studio
```

Google OAuth is enabled in `config.toml` for local. Set `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` in the environment. Cloud projects need the same client pasted under Auth → Providers → Google.
