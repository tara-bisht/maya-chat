# Maya Chat

Consumer chat: every conversation is with a named character. Glossary: [`CONTEXT.md`](CONTEXT.md). Screens and tokens: [`docs/DESIGN.md`](docs/DESIGN.md). Build sequence: [`docs/implementation-plan.md`](docs/implementation-plan.md).

## Git

Full workflow: [`docs/git.md`](docs/git.md).

1. Update `main`, then create `<type>/<slug>` (`feat/pr1-auth-rls`, `fix/…`, `chore/…`, `docs/…`) before product edits.
2. Conventional Commits (`feat(auth): add Google callback`). Stage only this slice.
3. Open a PR against `main` with `/pr-creator`. Squash-merge with `gh pr merge --squash --delete-branch` after CI `check` is green.
4. Map product work to the next open slice in `docs/implementation-plan.md` (PR0–PR6). Finish PR(N-1) on `main` before starting `feat/prN`.
5. Keep `.env*`, service-role keys, Stripe secrets, and gateway keys out of git. `.env.example` is names only.

Push feature branches. Merge through GitHub. Production is `main`.
