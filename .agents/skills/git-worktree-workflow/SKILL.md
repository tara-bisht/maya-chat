---
name: git-worktree-workflow
description: Use when implementing, fixing, refactoring, or changing files in Maya Chat, especially when the checkout is dirty, multiple agents may work in parallel, or a branch or worktree already exists.
---

# Git Worktree Workflow

Use one isolated Git worktree and one short-lived branch per implementation
task. The primary checkout is coordination space, not an editing space. This
keeps parallel agents from switching branches, overwriting local changes, or
sharing an ambiguous working tree.

For agent execution, this skill supersedes any direct `git switch main` recipe
in `AGENTS.md` or `docs/git.md`: update the remote reference and create the
task worktree without switching the primary checkout.

## When to Use

Use this skill before any file-changing implementation, bugfix, refactor,
documentation change, or tooling change.

Do not create another worktree for read-only exploration, code review, or a
task already running in the correct dedicated worktree. Never nest a worktree
inside another worktree.

## Start Here

Run these commands from the checkout you were given, without changing its
branch. If the harness provides a managed worktree operation, use it; otherwise
use the Git fallback below.

```bash
repo="$(git rev-parse --show-toplevel)"
git_dir="$(cd "$(git rev-parse --git-dir)" && pwd -P)"
git_common="$(cd "$(git rev-parse --git-common-dir)" && pwd -P)"
superproject="$(git rev-parse --show-superproject-working-tree 2>/dev/null || true)"
git -C "$repo" status --short --branch
git -C "$repo" branch --show-current
git -C "$repo" worktree list --porcelain
```

When `git_dir` differs from `git_common` and `superproject` is empty, you are
already in a linked worktree. Continue there only if its branch belongs to this
task. Otherwise re-root `repo` to the primary path (the first `worktree` entry)
and rerun the inspection before creating a separate one:

```bash
repo="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"
```

A submodule can also have different Git directories, so do not classify it as
a worktree when `superproject` is non-empty.

If the checkout is dirty, preserve it. Do not switch branches, stash, reset,
clean, or commit unrelated changes. If it is already a dedicated worktree for
this task, continue there. Otherwise create a new one.

## Create the Worktree

1. Choose a lowercase branch name from `docs/git.md`: `feat/`, `fix/`,
   `chore/`, `docs/`, or `hotfix/`, followed by a short hyphenated slug. Put
   the implementation-plan id in the name when applicable, such as
   `feat/pr2-marcus-stream`.
2. Fetch the base without switching the primary checkout:

   ```bash
   git -C "$repo" fetch origin || exit 1
   git -C "$repo" show-ref --verify --quiet refs/remotes/origin/main || exit 1
   git -C "$repo" check-ignore -q .worktrees || exit 1
   ```

   Use `origin/main` as the default base. Use a user-specified base only when
   the task explicitly depends on another branch or commit.
3. Check both the branch and path before creating anything:

   ```bash
   branch="feat/<short-slug>"
   path="$repo/.worktrees/<short-slug>"
   git -C "$repo" show-ref --verify --quiet "refs/heads/$branch" && exit 1
   git -C "$repo" show-ref --verify --quiet "refs/remotes/origin/$branch" && exit 1
   test ! -e "$path" || exit 1
   ```

   An existing branch or path is not permission to reuse it. Choose a unique
   name or ask the user who owns it. Never use `--ignore-other-worktrees`.
4. Create the isolated checkout from the fetched base:

   ```bash
   git -C "$repo" worktree add -b "$branch" "$path" origin/main
   git -C "$path" status --short --branch
   ```

   From this point on, run all reads, edits, tests, commits, and pushes with
   the new worktree as the tool working directory. Do not continue editing the
   primary checkout.

## Parallel Development Rules

- One agent, one task, one branch, one worktree.
- Never edit, switch, reset, or remove another agent's worktree.
- Never reuse a branch that is checked out elsewhere.
- Do not silently copy dirty files from the primary checkout into the new one.
  Ask if the user intends those changes to be part of the task.
- Do not copy `.env`, `.env.local`, service keys, credentials, or other
  secrets. Use the repository's approved environment setup and ask when a
  local secret is required.
- Install dependencies in the new worktree only when needed, using the
  repository's lockfile-preserving command (for this repository, normally
  `pnpm install --frozen-lockfile`).
- Keep the branch focused and leave unrelated dirty files untouched.

## Bypass Requests

The isolated-worktree rule is the default even when the change is small or
the user says it will be quick. If the user explicitly authorizes editing the
current checkout, first report the risk and verify that no other agent owns
it. Do not bypass isolation merely because creating a worktree is inconvenient.

## Finish and Clean Up

Before committing or opening a PR, verify from the task worktree:

```bash
git status --short --branch
git diff --check
```

Follow `docs/git.md` for checks, Conventional Commits, pushing, and PRs. Keep
the worktree until the PR is merged or the user asks to abandon it.

After merge, clean up only after checking the latest remote state:

```bash
git -C "$repo" fetch --prune origin || exit 1
git -C "$repo" show-ref --verify --quiet "refs/heads/$branch" || exit 1
git -C "$repo" show-ref --verify --quiet refs/remotes/origin/main || exit 1
unmerged="$(git -C "$repo" log --cherry-pick --right-only --no-merges --format=%H \
  "refs/remotes/origin/main...refs/heads/$branch")"
test -z "$unmerged" || exit 1
status="$(git -C "$path" status --porcelain=v1 --ignored --untracked-files=all)"
if [ -n "$status" ]; then
  printf '%s\n' "$status"
  exit 1
fi
current="$(git rev-parse --show-toplevel)"
test "$current" != "$path" || exit 1
git -C "$repo" worktree remove "$path" || exit 1
test ! -e "$path" || exit 1
git -C "$repo" branch -d "$branch" || exit 1
git -C "$repo" worktree prune
```

The `git log --cherry-pick --right-only` check handles both ordinary and
squash-merged PRs. If it prints a commit, the branch is not proven merged.
Before running the cleanup block, show the user any non-empty `status` output
and stop. Do not use `git worktree remove --force`, `git clean`, `rm -rf`, or
`git branch -D` without explicit, targeted approval.

## Common Mistakes

| Mistake | Correct response |
| --- | --- |
| Editing the primary checkout because the change is small | Create `.worktrees/<slug>` first |
| Stashing to make branch switching possible | Leave the primary checkout untouched |
| Reusing a busy branch or worktree | Choose a unique branch/path or ask for ownership |
| Starting from stale local `main` | Fetch and create from `origin/main` |
| Copying `.env.local` into a worktree | Keep secrets out; use approved environment setup |
| Force-removing a dirty worktree | Stop, report files, and request targeted approval |

## Quick Reference

```text
inspect primary -> fetch origin -> choose unique branch/path
-> worktree add from origin/main -> work only there
-> verify -> commit/push/PR -> verify merged -> safe cleanup
```
