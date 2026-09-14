# Maya Chat

Don't talk to a boring AI chatbot. AI with real personality and character.

Every conversation is with a named character — first-party inbuilt agents (the catalog can grow) or a custom character you write in Studio. Plan-gated models through one LLM gateway. Stripe Plus/Pro.

## Docs

Start at [`docs/README.md`](docs/README.md). What is shipped: [`docs/NOW.md`](docs/NOW.md). Glossary: [`CONTEXT.md`](CONTEXT.md).

## Repo

```
apps/web            Next.js 15 (lobby, gallery, House, Studio, API)
packages/shared     Zod, compiler, plan helpers
packages/database   Generated Supabase types
supabase/           Local config + migrations
```

## Run

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Git

GitHub Flow. Branch, PR, squash-merge to `main`. Rules: [`docs/git.md`](docs/git.md). How to contribute: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Commands

| Command | What |
| :--- | :--- |
| `pnpm dev` | Next.js on :3000 |
| `pnpm typecheck` | `tsc --noEmit` across packages |
| `pnpm lint` | ESLint (web) |
| `pnpm test` | Vitest in `@maya/shared` and `apps/web/lib` |
| `pnpm --filter web openrouter:ping` | Resolve seed OpenRouter slugs (needs `OPENROUTER_API_KEY`) |
