# `apps/web`

Next.js 15 App Router. Maya Street Cast tokens live in `app/globals.css`. Marketing lobby is `/`. Signed-in app: gallery, Explore, House chat, Studio, settings, plan. APIs under `/api/*`.

OpenRouter is the sole LLM gateway (`lib/openrouter`, `OPENROUTER_API_KEY`). Status: [`../../docs/NOW.md`](../../docs/NOW.md).

```bash
# After adding OPENROUTER_API_KEY to .env.local
pnpm --filter web openrouter:ping
```
