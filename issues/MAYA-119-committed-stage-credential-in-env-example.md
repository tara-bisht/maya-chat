# [MAYA-119] Live Stage Credential Material Committed in `.env.example`

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-119 |
| **Issue Type** | 🔐 Secret Hygiene |
| **Status** | Todo |
| **Priority** | 🔴 P0 (Critical) |
| **Severity** | High (topology leak, key rotation forced, git-history taint) |
| **Component** | Repo Hygiene / Env |
| **Affects Versions** | All |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Platform Pod |

---

## 1. Summary
`apps/web/.env.example` commits a live stage Supabase URL + live `sb_publishable_` key, violating `docs/git.md:79` ("Committed: `.env.example` (names only)") and `AGENTS.md` (`.env.example` is names only). Publishable keys are client-public by design, but baking a real project ref (`mhuxzwbd…`) + real key into git history leaks environment topology, contradicts the root `.env.example` (correctly empty), and forces rotation. Root `.env.example:3-4` comments also leak stage/prod refs.

---

## 2. Code Reference
- [`apps/web/.env.example:1-2`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/.env.example#L1-L2):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://mhuxzwbdqyuksjcfdyqj.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_71DClkWe96BX2a2lmYmaPw_lP0B_28-
  ```
- [`.env.example:1-19`](file:///Users/kamalbisht/Documents/maya-chat/.env.example#L1-L19): root file correctly empty-valued; lines 3-4 comments name stage/prod refs (`mhuxzwbd…`, `fheihguz…`).
- [`docs/git.md:77-82`](file:///Users/kamalbisht/Documents/maya-chat/docs/git.md#L77-L82): never commit service-role/Stripe/gateway keys; `.env.example` names only.
- [`apps/web/.gitignore:34`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/.gitignore#L34) + [`.gitignore:7`](file:///Users/kamalbisht/Documents/maya-chat/.gitignore#L7): `.env*` ignored (examples are the exception — must be placeholders).

---

## 3. Steps to Reproduce
1. `git show HEAD:apps/web/.env.example` — real URL + key visible to any clone/fork.
2. `git log -p -- apps/web/.env.example` — key persists across history even if later scrubbed.
3. Compare `git show HEAD:.env.example` — empty (correct) vs app example (live).

---

## 4. Expected Behavior
- Both `.env.example` files contain names + placeholder values only (e.g. `https://<stage-ref>.supabase.co`, `sb_publishable_<placeholder>`). No live project refs, no live keys, in values or comments.

---

## 5. Actual Behavior
- Live stage topology + key in tracked file + history. Divergent duplicates (app vs root) guarantee misconfig (app example also omits `OPENROUTER_API_KEY`, `NEXT_PUBLIC_APP_URL` comment, Google OAuth vars).

---

## 6. Root Cause Analysis (RCA)
Developer copied a working local `.env.local` into `.env.example` for convenience and committed it. No pre-commit secret scan or CI check rejects live `sb_publishable_` / URLs in examples.

---

## 7. Proposed Solution & Code Fix
- Replace values with placeholders; replace project IDs in root comments with `<stage-ref>` / `<prod-ref>`; delete duplicate or generate app example from root.
- Rotate the exposed stage publishable key if the project was ever live (publishable rotation is cheap; do it).
- Add CI grep guard: fail if `apps/web/.env.example` matches `sb_publishable_[A-Za-z0-9]` or `https://*.supabase.co` with non-placeholder host.

---

## 8. Acceptance Criteria (AC)
- [ ] `apps/web/.env.example` + root `.env.example` contain zero live hosts/keys (grep clean).
- [ ] Stage key rotated if live (confirm in Supabase dashboard).
- [ ] Single source for examples (no drift between root/app).
- [ ] CI secret-scan guard added.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid policy violation |
| **Status** | Todo |
| **Engineering priority** | P0 (unchanged — `docs/git.md` names-only) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Confirmed. `apps/web/.env.example` commits a live stage URL (`mhuxzwbd…`) and a live `sb_publishable_` key. Root `.env.example` values are empty (correct) but comments name stage/prod refs. Publishable keys are client-public by design — this is topology leak + policy break, not a service-role leak. Still forbidden: “Committed: `.env.example` (names only).”

**Do this:**

- Replace values with placeholders (`https://<project-ref>.supabase.co`, `sb_publishable_<placeholder>`). Replace project IDs in root comments with `<stage-ref>` / `<prod-ref>`.
- Human: rotate the exposed stage publishable key in the Supabase dashboard (not a git change).
- Do **not** rewrite git history in this PR.
- Optional: CI grep that `*.env.example` has no live `sb_publishable_` / `*.supabase.co` host.

Can ship in the same docs/hygiene PR as 118’s `git.md` line, or a one-file fix ahead of it.
