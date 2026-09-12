# Maya Chat — To-Dos & Ideas Backlog

A centralized, markdown-based workspace to organize ideas, technical debt spikes, feature proposals, and to-dos before they are scheduled into [`docs/implementation-plan.md`](../implementation-plan.md) or [`docs/roadmap.md`](../roadmap.md).

---

## Backlog Index

| ID | Title | Area | Priority | Status | Target Slice | File |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **[TODO-001](./001-conversational-agent-creator.md)** | Conversational Agent Creator: "Maya" AI Casting Director | Web / AI | P1 | Ready | PR5 | [001-conversational-agent-creator.md](./001-conversational-agent-creator.md) |
| **[TODO-002](./002-maya-super-agent-host-matchmaker.md)** | Maya Super Agent: Resident House Host & Persona Matchmaker Engine | AI / Engine | P1 | Ready | PR5 | [002-maya-super-agent-host-matchmaker.md](./002-maya-super-agent-host-matchmaker.md) |
| **[TODO-003](./003-global-maya-concierge-ui.md)** | Global Maya Concierge UI: Command Palette (`⌘K`) & Floating Host Pass | Web / UI | P2 | Ready | PR6 | [003-global-maya-concierge-ui.md](./003-global-maya-concierge-ui.md) |
| *Example* | *Voice input & audio playback prototype* | Web / AI | P2 | Idea | v1.1 | *See [`_template.md`](./_template.md)* |

---

## Status Definitions

- **Idea**: Nascent brainstorm, preliminary thoughts, or exploratory concept.
- **Ready**: Scoped with concrete acceptance criteria, identified target files, and ready to be picked up.
- **In Progress**: Active branch created and implementation is underway.
- **Done**: Implemented, verified, and merged to `main` via PR.
- **Dropped**: Evaluated and discarded (keep file with rationale or move to `archive/`).

---

## How to Create a New To-Do

1. Copy [`_template.md`](./_template.md) to a new file in this directory:
   ```bash
   cp docs/todos/_template.md docs/todos/001-<short-slug>.md
   ```
2. Fill out the YAML frontmatter (`id`, `title`, `area`, `priority`, `status`, `target_slice`).
3. Complete the sections:
   - **Overview & Motivation**: Why this is valuable.
   - **Acceptance Criteria & Scope**: Specific checkable checkboxes.
   - **Affected Components & Files**: Exact paths (`apps/web/...`, `packages/shared/...`).
   - **Implementation Notes**: Architecture notes, references to docs or seed files.
   - **Execution Checklist**: Concrete steps for git and tests.
4. Add a row to the **Backlog Index** table above.

---

## How to Pick Up & Work on a To-Do

1. Update the to-do file and table status to `In Progress`.
2. Follow the repository's git workflow from [`docs/git.md`](../git.md):
   ```bash
   git fetch origin
   git switch main
   git pull --ff-only
   git switch -c feat/<short-slug>
   ```
3. Implement the changes test-first or incrementally:
   - Run verification locally before committing:
     ```bash
     pnpm turbo lint typecheck test
     ```
4. Commit using Conventional Commits (`feat(...)`, `fix(...)`, `docs(...)`):
   ```bash
   git commit -m "feat(web): add voice input controls"
   ```
5. Push branch and open PR:
   ```bash
   git push -u origin HEAD
   gh pr create --fill
   ```
6. Once merged, update the to-do file frontmatter to `status: done` and check off the item in the index table.
