# Contributing

GitHub Flow. Branch, pull request, squash-merge to `main`.

The rules: [`docs/git.md`](docs/git.md). Product slices: [`docs/implementation-plan.md`](docs/implementation-plan.md). Words: [`CONTEXT.md`](CONTEXT.md).

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feat/<slug>
```

Before you open the PR:

```bash
pnpm turbo lint typecheck test
```
