# Maya Chat

Consumer chat: every conversation is with a named character.

| Question | Read |
| :--- | :--- |
| Words | [`CONTEXT.md`](CONTEXT.md) |
| Screens and tokens | [`docs/DESIGN.md`](docs/DESIGN.md) |
| Shipped / next slice | [`docs/NOW.md`](docs/NOW.md) |
| Open work | [`docs/backlog/README.md`](docs/backlog/README.md) |
| How a turn flows | [`docs/technical-plan.md`](docs/technical-plan.md) |
| Libraries and env | [`docs/tech-stack.md`](docs/tech-stack.md) |
| Git / PR | [`docs/git.md`](docs/git.md) |

## Git

Full workflow: [`docs/git.md`](docs/git.md). Isolated worktree per task (git-worktree-workflow skill).

1. Fetch `origin/main`, then create `<type>/<slug>` in a new worktree before product edits.
2. Conventional Commits (`feat(auth): add Google callback`). Stage only this slice.
3. Open a PR against `main` with `/pr-creator`. Squash-merge with `gh pr merge --squash --delete-branch` after CI `check` is green.
4. Read [`docs/NOW.md`](docs/NOW.md) before product work. Finish the open MVP slice before a backlog idea unless the user names that todo. P0 defects may interrupt.
5. Keep `.env*`, service-role keys, Stripe secrets, and gateway keys out of git. `.env.example` is names only.

Push feature branches. Merge through GitHub. Production is `main`.
