# [MAYA-118] CI Never Builds: Broken Production Ships Green

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-118 |
| **Issue Type** | 🔧 CI/CD Gap |
| **Status** | Done |
| **Priority** | 🔴 P0 (Critical) |
| **Severity** | High (broken prod deploys pass checks) |
| **Component** | CI (.github/workflows) / Build |
| **Affects Versions** | All |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Platform Pod |

---

## 1. Summary
CI job `check` runs only `pnpm turbo lint typecheck test` — never `build`. `turbo.json` defines `build` (`.next/**` outputs) and `web/package.json` has `next build --turbopack`, but neither is invoked in CI. Next RSC / env / `next.config.ts` breakage passes required status and squash-merges to `main` (= prod). `docs/git.md` codifies the same gap, so doc + CI share it. No `vercel.json` / preview-build check compensates in-repo.

---

## 2. Code Reference
- [`.github/workflows/ci.yml:19`](file:///Users/kamalbisht/Documents/maya-chat/.github/workflows/ci.yml#L19): `- run: pnpm turbo lint typecheck test` (no `build`).
- [`turbo.json:9-12`](file:///Users/kamalbisht/Documents/maya-chat/turbo.json#L9-L12): `build` with `.next/**, dist/**` outputs (defined, unused in CI).
- [`apps/web/package.json:7`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/package.json#L7): `build: next build --turbopack`.
- [`docs/git.md:66`](file:///Users/kamalbisht/Documents/maya-chat/docs/git.md#L66): documents only `lint typecheck test` as gate.
- [`docs/technical-plan.md:505`](file:///Users/kamalbisht/Documents/maya-chat/docs/technical-plan.md#L505): assumes Vercel preview on PR (dashboard-only, not in repo).

---

## 3. Steps to Reproduce
1. Break `apps/web/next.config.ts` (e.g. typo `transpilePackages`) or reference missing `NEXT_PUBLIC_*` at build time.
2. Push PR — `check` stays green (`lint/typecheck/test` pass, `tsc` doesn't run Next build graph).
3. Squash-merge to `main` → Vercel prod build fails post-merge.

---

## 4. Expected Behavior
- Required `check` (or separate `build` job) runs `next build` with preview env; RSC/env/config breakage blocks merge pre-`main`.

---

## 5. Actual Behavior
- Build-only failures are invisible until Vercel post-merge. `main` = prod can be red while CI is green.

---

## 6. Root Cause Analysis (RCA)
PR0 defined `build` but the CI author copied the fast local loop (`lint typecheck test`) as the gate and never added the slow `build` leg. Docs then enshrined it.

---

## 7. Proposed Solution & Code Fix
```yaml
- run: pnpm turbo lint typecheck test
- run: pnpm turbo build
# or separate job `build` with Vercel preview env + `needs: check`
```
Plus: pin `pnpm/action-setup version: 9` (currently implicit via `packageManager`), add server secrets to `turbo.json globalEnv` so key rotation busts cache (see MAYA-122), update `docs/git.md:66`.

---

## 8. Acceptance Criteria (AC)
- [x] PR breaking `next build` fails required status, cannot squash-merge.
- [x] `main` push runs `build` (or Vercel preview check is wired as required status and documented).
- [x] `docs/git.md` documents `lint typecheck test build`.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid CI gap |
| **Status** | Done |
| **Engineering priority** | P0 (unchanged — `check` is the merge gate) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |
| **Shipped** | [#17](https://github.com/tara-bisht/maya-chat/pull/17) on `main` |

**Comment:** Confirmed. `.github/workflows/ci.yml` runs `pnpm turbo lint typecheck test` only. `turbo.json` defines `build`; `docs/git.md` documents the same short loop. Squash-merge after green `check` can land a Next config / RSC break on `main` (= prod) before Vercel fails.

**Do this:**

- After test: `pnpm turbo build` with **placeholder** `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the job `env:` (not live keys — MAYA-119).
- Update `docs/git.md` local/CI loop to `lint typecheck test build`.
- Hitch from MAYA-122 if cheap: `import "server-only"` in `packages/database/src/service.ts`; add `OPENROUTER_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to `turbo.json` `globalEnv`.

Do not require live OpenRouter in CI; `getOpenRouterModel` is lazy.
