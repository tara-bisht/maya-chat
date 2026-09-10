# Maya Chat

Don't talk to a boring AI chatbot. Give your AI personality and character.

Web + later mobile product: eight curated agents, custom Studio characters, plan-gated models through one LLM gateway, Stripe Plus/Pro.

## Docs

Start at [`docs/README.md`](docs/README.md). Implementation sequence: [`docs/implementation-plan.md`](docs/implementation-plan.md). Glossary: [`CONTEXT.md`](CONTEXT.md).

## Repo

```
apps/web            Next.js 15 (lobby + later chat/API)
packages/shared     Zod, compiler, plan helpers (Phase 1+)
packages/database   Generated Supabase types (Phase 1)
supabase/           Local config + migrations (Phase 1)
```

## Phase 0

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000). Paper, Fraunces wordmark, eight playbills. Auth, chat, and Stripe are later PRs.

## Git

GitHub Flow. Branch, PR, squash-merge to `main`. Rules: [`docs/git.md`](docs/git.md). How to contribute: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Commands

| Command | What |
| :--- | :--- |
| `pnpm dev` | Next.js on :3000 |
| `pnpm typecheck` | `tsc --noEmit` across packages |
| `pnpm lint` | ESLint (web) |
| `pnpm test` | Vitest in `@maya/shared` |
