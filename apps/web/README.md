# `apps/web`

Next.js 15 App Router. Maya Street Cast tokens live in `app/globals.css`. Marketing lobby is `/`; auth stub is `/login`.

OpenRouter is the sole LLM gateway (`lib/openrouter`, `OPENROUTER_API_KEY`). Chat, gallery, Studio, and `/api/*` arrive in later PRs. See [`../../docs/implementation-plan.md`](../../docs/implementation-plan.md).

```bash
# After adding OPENROUTER_API_KEY to .env.local
pnpm --filter web openrouter:ping
```
