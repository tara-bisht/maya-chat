# Git and GitHub

Maya Chat is two people (`tara-bisht` admin, `bishtk435` write) shipping a PR-sequenced product. **GitHub Flow.** Production is `main`. Every change, including chores and docs, lands through a pull request.

```
feature branch  →  pull request  →  CI green  →  squash-merge to main  →  Vercel prod
```

Build slices live in [`implementation-plan.md`](implementation-plan.md) (PR0–PR6). Deploy: Vercel preview on the PR, production on `main` ([`technical-plan.md`](technical-plan.md) §15).

---

## Branches

`main` is always shippable. Short-lived branches only:

```
<type>/<short-slug>
```

| Type | Use | Example |
| :--- | :--- | :--- |
| `feat/` | Product slice | `feat/pr1-auth-rls` |
| `fix/` | Bug | `fix/ci-pnpm-version` |
| `chore/` | Tooling, git, deps | `chore/git-github-hygiene` |
| `docs/` | Docs only | `docs/compiler-notes` |
| `hotfix/` | Production break | `hotfix/stripe-webhook-500` |

- Lowercase, hyphens. No `kamal/…`, no `wip`.
- When the work **is** an implementation-plan slice, put the id in the name (`feat/pr2-marcus-stream`).
- Open `feat/prN` after `PR(N-1)` is on `main`, unless the packages do not overlap.

Start every slice from current `main`:

```bash
git fetch origin
git switch main
git pull --ff-only
git switch -c feat/pr1-auth-rls
```

Push the branch (`git push -u origin HEAD`). Do not push `main`.

---

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), imperative, present tense, ≤ 72 characters:

```
feat(auth): add Google OAuth callback
fix(ci): let packageManager pin pnpm
chore(git): add PR template and branch rules
```

Body only when the *why* is not in the subject. Focused commits on the branch are fine while working. **Squash to one conventional commit before opening the PR** so reviewers see one commit. Squash-merge still makes `main` one commit per PR.

Stage the files that belong to this slice. Leave unrelated dirty files unstaged. Never `git add -A` if `.DS_Store`, `*.tsbuildinfo`, or `.env*` are in the tree.

---

## Pull requests

Agents: `/pr-creator` (canonical skill: `.agents/skills/pr-creator`).

- Base: `main`. Title matches the single commit (`feat(auth): …`).
- Fill the template: summary, plan id (`PR1` or `n/a`), test plan.
- Independently reviewable: `pnpm turbo lint typecheck test build` green. Zod if the PR adds a route. RLS if it adds a table.
- Visual UI: attach screenshots as a **PR comment** (`gh pr comment --attach`). Do not commit screenshot files.
- Apply one kind label and the matching area labels (below). Request review from the other person.
- During the sprint, squash-merge after CI is green even with zero approvals **if** a PR still exists (preview + bisect). After the sprint, prefer one approval.
- Delete the branch on merge.

```bash
gh pr create --base main --title "feat(auth): …"
gh pr merge --squash --delete-branch
```

---

## Secrets and noise

Committed: `.env.example` (names only).

Never committed: `.env`, `.env.local`, service-role keys, Stripe secrets, gateway keys, `.DS_Store`, `*.tsbuildinfo`, `.supabase/`.

---

## Local checks (same as CI)

```bash
pnpm turbo lint typecheck test build
```

CI is `.github/workflows/ci.yml`. pnpm version comes from `package.json` `packageManager`. Node 22.

---

## Owner settings (`tara-bisht`)

Write collaborators cannot apply these. Do this once on GitHub after the hygiene PR merges.

### Merge button

**Settings → General → Pull Requests**

- Enable **squash merge** only
- Disable merge commits and rebase merge
- Enable **automatically delete head branches**

```bash
gh repo edit tara-bisht/maya-chat \
  --enable-squash-merge \
  --disable-merge-commit \
  --disable-rebase-merge \
  --delete-branch-on-merge \
  --enable-issues \
  --disable-wiki
```

### Ruleset on `main`

**Settings → Rules → Rulesets → New**

- Target: branch `main`
- Require a pull request (approvals: **0** during the sprint; raise to 1 later)
- Require status check `check` (the CI job name) to pass
- Block force pushes
- Block deletions
- Do not let write collaborators bypass

Until this ruleset exists, `git push origin main` still works. After it exists, it must fail.

### Labels

Kind (exactly one):

```bash
gh label create feat --description "New product work" --color 0E8A16
gh label create fix --description "Bug" --color D73A4A
gh label create chore --description "Tooling and repo" --color F9D0C4
gh label create docs --description "Documentation" --color 0075CA
gh label create enhancement --description "Improvement that is not a new feature" --color A2EEEF
gh label create hotfix --description "Production break" --color B60205
```

Human-applied:

```bash
gh label create blocked --description "Waiting on a decision or person" --color B60205
```

Area (every match):

```bash
gh label create ui --description "User-facing screens, components, copy" --color 1D76DB
gh label create styling --description "Tokens, CSS, theme, layout" --color BFD4F2
gh label create db --description "Migrations, RLS, schema" --color FBCA04
gh label create functional --description "Product behavior / business logic" --color C2E0C6
gh label create api --description "Route handlers and server actions" --color 0052CC
gh label create auth --description "OAuth, session, login" --color 006B75
gh label create ci --description "GitHub Actions, turbo, package manager" --color 5319E7
```

Implementation-plan slice:

```bash
gh label create phase-0 --description "Scaffold" --color EDEDED
gh label create phase-1 --description "Data + auth" --color EDEDED
gh label create phase-2 --description "Gallery + chat" --color EDEDED
gh label create phase-3 --description "Compiler + tools + Studio" --color EDEDED
gh label create phase-4 --description "Memory + catalog + Stripe" --color EDEDED
gh label create phase-5 --description "Harden + Web MVP" --color EDEDED
gh label create phase-6 --description "Mobile v1" --color EDEDED
```

---

## Why not Git Flow

No `develop`, no long-lived `release/*`. Two people, one production branch, preview deploys on PRs. Git Flow would add merge steps without extra safety.
