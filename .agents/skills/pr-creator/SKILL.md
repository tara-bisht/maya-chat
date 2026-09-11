---
name: pr-creator
description: >
  Open a Maya Chat pull request against main: squash the branch to one
  conventional commit, fill the PR template, apply kind and area labels,
  and attach UI screenshots as a PR comment (never commit them). Use when
  the user asks to create a PR, open a pull request, file a pull request,
  run gh pr create, or runs /pr-creator.
---

# pr-creator

Open a reviewable PR against `main`. Branch names, commit format, CI command, and secrets: [`docs/git.md`](../../../docs/git.md). Stop after the PR URL is posted. Do not merge.

## Steps

### 1. Preconditions

Collect: `gh auth status`, `git branch --show-current`, `git status`, `git log --oneline origin/main..HEAD`, `gh pr view --json number,url,reviews` (ok if none).

Done when all of these hold, or the skill has stopped with a reason:

- Authenticated to GitHub.
- Current branch is not `main` and matches `<type>/<short-slug>` in `docs/git.md`.
- The working tree is this slice only. Unrelated dirty files stay unstaged. `.env*`, screenshots, `.DS_Store`, `*.tsbuildinfo` stay out of the index.
- If a PR already exists for the branch: skip create. Repair labels, description, and screenshots only. Squash only when that existing PR has no reviews, or the user asked to squash.

### 2. Sync

```bash
git fetch origin
git rebase origin/main
```

Done when `HEAD` is rebased on `origin/main`, or the skill has stopped on conflicts.

### 3. Squash

If `git rev-list --count origin/main..HEAD` is greater than 1 (and step 1 allows squash):

```bash
git reset --soft origin/main
git commit -m "<type>(<scope>): <imperative subject>"
```

Subject is conventional, present tense, ≤ 72 characters — it is the PR title. If the branch already has an upstream, `git push --force-with-lease`.

Done when the PR branch is one commit ahead of `origin/main`, or it already was.

### 4. Checks

Run `pnpm turbo lint typecheck test build`. New routes: Zod is on the test plan. New tables: RLS is on the test plan. Fix failures or stop — do not open a red PR on purpose.

Done when the command is green, or the skill has stopped on failure.

### 5. Push

```bash
git push -u origin HEAD
```

Done when `origin` has this branch. Never push `main`.

### 6. Create

Base: `main`. Title: the single commit subject. Body fills [`.github/pull_request_template.md`](../../../.github/pull_request_template.md) with real content (not the HTML comments):

- **Summary** — what changed and why.
- **Plan id** — `PR0`–`PR6` from `docs/implementation-plan.md` when this is that slice; otherwise `n/a`.
- **Test plan** — tick what was actually run. UI screenshot checkbox is for the comment in step 8, not a committed file.
- **Notes** — cuts, follow-ups, secrets that stayed out.

```bash
gh pr create --base main --title "<commit subject>" --body "<filled template>" --reviewer <other>
```

The other person is `tara-bisht` or `bishtk435`, whichever is not `gh api user --jq .login`. If the PR already existed, `gh pr edit` the title/body/reviewer instead of creating.

Done when `gh pr view --json url,number` returns a PR.

### 7. Labels

Pick **one kind** and **every matching area** from the tables below. If the work is an implementation-plan slice, also `phase-N`. Create a missing label with the matching `gh label create` line in `docs/git.md`, then:

```bash
gh pr edit <n> --add-label <kind>,<area>,...
```

Done when `gh pr view --json labels` includes that set.

### 8. Screenshots

If the diff is visual UI (gate below): capture with browser tools the way a reviewer would look at the change. Desktop always; mobile too when layout or styling moved. Include the empty / error / flag states the PR actually changes.

Write files under `$TMPDIR/maya-pr-screenshots/` (or equivalent). Leave them unstaged.

`gh --attach` needs `gh` ≥ 2.99. If older, stop and tell the user to upgrade — still do not commit images.

```bash
gh pr comment <n> --body "## Screenshots" --attach "$TMPDIR/maya-pr-screenshots/desktop.png"
```

Repeat `--attach` for each shot. Done when the comment exists, or the gate skipped screenshots (say why).

### 9. Report

Reply with the PR URL, labels, whether squash happened, and whether screenshots were posted. Stop.

## Kind (exactly one)

Map the conventional-commit type / what the user called it:

| User says | Label |
| :--- | :--- |
| feature, feat | `feat` |
| bug, fix | `fix` |
| chore | `chore` |
| docs | `docs` |
| enhancement | `enhancement` |
| hotfix | `hotfix` |

## Area (every match)

From paths in `git diff --name-only origin/main...HEAD`:

| Label | When the diff includes |
| :--- | :--- |
| `ui` | `apps/web/app/`, `apps/web/components/`, `apps/promo/`, `marketing/promo/src/` |
| `styling` | `*.css`, `**/theme/**`, `docs/DESIGN.md` |
| `db` | `supabase/`, `packages/database/` |
| `api` | `apps/web/app/api/`, server `actions.ts` |
| `auth` | `**/auth/**`, `apps/web/app/login/`, `apps/web/middleware.ts` |
| `ci` | `.github/workflows/`, `turbo.json`, package-manager / CI config |
| `functional` | Product behavior in `apps/web/lib/` or `packages/shared/` not covered above |

`ui` and `styling` together when both structure and look changed. Docs-only PRs: kind `docs`, no area required. `blocked` is human-applied.

## Screenshot gate

Visual UI when the diff touches `apps/web/app/`, `apps/web/components/`, `apps/web/app/globals.css`, `docs/DESIGN.md` tokens the UI consumes, `apps/promo/`, or `marketing/promo/src/`.

Skip for db-only, API-only, CI-only, or docs-only PRs.
