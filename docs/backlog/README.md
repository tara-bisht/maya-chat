# Backlog

Open work only. Done files live in [`docs/archive/`](../archive/). Current slice: [`docs/NOW.md`](../NOW.md). Git: [`docs/git.md`](../git.md).

Do not start an idea while NOW has an open MVP slice unless the user names the todo. P0 defects may interrupt.

## Open index

| ID | Title | Kind | Priority | Status | Target |
| :--- | :--- | :--- | :---: | :--- | :--- |
| [MAYA-119](defects/MAYA-119-committed-stage-credential-in-env-example.md) | Rotate exposed stage publishable key | defect | P0 | todo | ops |
| [MAYA-115](defects/MAYA-115-dual-plan-truth-profiles-vs-entitlements.md) | Dual plan truth `profiles.plan` vs `entitlements.plan` | defect | P1 | backlog | PR4c |
| [MAYA-117](defects/MAYA-117-assistant-persist-best-effort-history-divergence.md) | Assistant persist best-effort diverges stream from DB | defect | P1 | backlog | PR5 |
| [MAYA-109](defects/MAYA-109-memory-rpc-service-role-failure.md) | `match_agent_memories` RPC / tenant isolation | defect | P2 | backlog | PR4c |
| [MAYA-121](defects/MAYA-121-agents-delete-dead-signup-not-idempotent-missing-guards.md) | Signup idempotency and schema guards | defect | P2 | backlog | later |
| [MAYA-122](defects/MAYA-122-env-validation-sentry-ratelimit-service-role-hygiene.md) | Env validation, Sentry, burst limit | defect | P2 | backlog | PR5 |
| [MAYA-110](defects/MAYA-110-unbounded-user-conversations-query.md) | Unbounded conversations query on the rail | defect | P3 | backlog | later |
| [TODO-001](ideas/001-conversational-agent-creator.md) | Conversational agent creator (Maya casting) | idea | P1 | ready | later |
| [TODO-002](ideas/002-maya-super-agent-host-matchmaker.md) | Maya host + catalog matchmaker | idea | P1 | ready | later |
| [TODO-003](ideas/003-global-maya-concierge-ui.md) | Global Maya concierge UI (`⌘K`) | idea | P2 | ready | later |
| [TODO-004](ideas/004-rate-an-agent.md) | Rate an agent (1–5) | idea | P2 | idea | later |
| [TODO-005](ideas/005-remix-an-agent.md) | Remix an agent into Studio | idea | P2 | idea | later |
| [TODO-006](ideas/006-catalog-driven-first-party-bill.md) | Catalog-driven first-party bill | idea | P1 | idea | later |
| [TODO-007](ideas/007-inbuilt-catalog-jobs-voices.md) | Inbuilt catalog: jobs × archetypes (schema + wave 1) | idea | P1 | ready | later |
| [TODO-008](ideas/008-ensembles.md) | Ensembles: sequential multi-character jobs | idea | P2 | idea | later |
| [TODO-009](ideas/009-inbuilt-catalog-sages-canon.md) | Inbuilt catalog: sage and canon wave 2 seed | idea | P1 | ready | later |

## Status

`idea` · `ready` · `in-progress` · `todo` (ops) · `backlog` · `done` · `dropped`

`done` and `dropped` leave this table. Keep the file in [`docs/archive/`](../archive/).

## Add an item

1. Copy [`_template.md`](_template.md) to `ideas/NNN-<slug>.md` or add a defect under `defects/`.
2. Fill frontmatter and acceptance criteria.
3. Add **one** row to the open index.

Git workflow is [`docs/git.md`](../git.md) plus the worktree skill. Do not duplicate git recipes here.
