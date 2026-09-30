# Backlog

Open work is tracked on [GitHub Issues](https://github.com/tara-bisht/maya-chat/issues). This folder keeps the spec for each open item. Change status on the issue. When an item is done or dropped, close the issue and move the spec to [`docs/archive/`](../archive/).

Current slice: [`docs/NOW.md`](../NOW.md). Product identity: [`docs/PROJECT_DESCRIPTION.md`](../PROJECT_DESCRIPTION.md). Git: [`docs/git.md`](../git.md).

Do not start an idea while NOW has an open MVP slice (PR5) unless the user names the todo. P0 defects may interrupt.

Sequence after the spine: catalog-backed wall ([TODO-006](https://github.com/tara-bisht/maya-chat/issues/61)) → launch company ([TODO-007](https://github.com/tara-bisht/maya-chat/issues/62)) → conversational create ([TODO-001](https://github.com/tara-bisht/maya-chat/issues/63)). Maya host ([TODO-002](../archive/ideas/002-maya-super-agent-host-matchmaker.md)) is shipped on `main`. Chrome words: [`CONTEXT.md`](../../CONTEXT.md).

## Open index

| ID | Title | Kind | Priority | Status | Target | Issue |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| [MAYA-119](defects/MAYA-119-committed-stage-credential-in-env-example.md) | Rotate exposed stage publishable key | defect | P0 | todo | ops | [#55](https://github.com/tara-bisht/maya-chat/issues/55) |
| [MAYA-117](defects/MAYA-117-assistant-persist-best-effort-history-divergence.md) | Assistant persist best-effort diverges stream from DB | defect | P1 | backlog | PR5 | [#56](https://github.com/tara-bisht/maya-chat/issues/56) |
| [MAYA-109](defects/MAYA-109-memory-rpc-service-role-failure.md) | `match_agent_memories` service-role `p_user_id` for a future worker | defect | P2 | backlog | later | [#57](https://github.com/tara-bisht/maya-chat/issues/57) |
| [MAYA-121](defects/MAYA-121-agents-delete-dead-signup-not-idempotent-missing-guards.md) | Signup idempotency and schema guards | defect | P2 | backlog | later | [#58](https://github.com/tara-bisht/maya-chat/issues/58) |
| [MAYA-122](defects/MAYA-122-env-validation-sentry-ratelimit-service-role-hygiene.md) | Env validation, Sentry, burst limit | defect | P2 | backlog | PR5 | [#59](https://github.com/tara-bisht/maya-chat/issues/59) |
| [MAYA-110](defects/MAYA-110-unbounded-user-conversations-query.md) | Unbounded conversations query on the rail | defect | P3 | backlog | later | [#60](https://github.com/tara-bisht/maya-chat/issues/60) |
| [TODO-006](ideas/006-catalog-driven-first-party-bill.md) | Catalog-driven first-party bill | idea | P1 | ready | after PR5 | [#61](https://github.com/tara-bisht/maya-chat/issues/61) |
| [TODO-007](ideas/007-inbuilt-catalog-jobs-voices.md) | Launch company: Maya, Helena, promote coming soon | idea | P1 | ready | after TODO-006 | [#62](https://github.com/tara-bisht/maya-chat/issues/62) |
| [TODO-001](ideas/001-conversational-agent-creator.md) | Conversational create agent (Maya) | idea | P1 | ready | after PR5 | [#63](https://github.com/tara-bisht/maya-chat/issues/63) |
| [TODO-003](ideas/003-global-maya-concierge-ui.md) | Maya from anywhere (`⌘K`) | idea | P2 | idea | later | [#64](https://github.com/tara-bisht/maya-chat/issues/64) |
| [TODO-010](ideas/010-inbuilt-catalog-wave-1-rest.md) | Inbuilt catalog: rest of wave 1 | idea | P1 | idea | later | [#65](https://github.com/tara-bisht/maya-chat/issues/65) |
| [TODO-009](ideas/009-inbuilt-catalog-sages-canon.md) | Inbuilt catalog: sage and canon wave 2 | idea | P1 | idea | later | [#66](https://github.com/tara-bisht/maya-chat/issues/66) |
| [TODO-008](ideas/008-ensembles.md) | Ensembles: sequential multi-character jobs | idea | P2 | idea | later | [#67](https://github.com/tara-bisht/maya-chat/issues/67) |
| [TODO-004](ideas/004-rate-an-agent.md) | Rate an agent (1–5) | idea | P2 | idea | later | [#68](https://github.com/tara-bisht/maya-chat/issues/68) |
| [TODO-005](ideas/005-remix-an-agent.md) | Remix an agent into Studio | idea | P2 | idea | later | [#69](https://github.com/tara-bisht/maya-chat/issues/69) |

## Status

`idea` · `ready` · `in-progress` · `todo` (ops) · `backlog` · `done` · `dropped`

`idea`, `ready`, `backlog`, and `todo` are also GitHub labels. `in-progress` means that issue is the slice underway. `done` and `dropped` close the issue and leave this table. Keep the spec in [`docs/archive/`](../archive/).

The index records the status at migration. When this table and the issue disagree, the issue wins.

## Add an item

1. Open a GitHub issue. Title starts with the id (`MAYA-123:` or `TODO-011:`). Body is the spec. Labels: `feat` or `fix`, one priority (`p0`–`p3`), and one status (`idea`, `ready`, `backlog`, `todo`).
2. Copy [`_template.md`](_template.md) to `ideas/NNN-<slug>.md` or add a defect under `defects/`. Set `github` to the issue URL.
3. Add **one** row to the open index.

Git workflow is [`docs/git.md`](../git.md) plus the worktree skill. Do not duplicate git recipes here.
