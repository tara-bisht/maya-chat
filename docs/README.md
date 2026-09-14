# Maya Chat docs

Which file answers which question. Product one-liner: every conversation is with a named character.

| Question | Read |
| :--- | :--- |
| Words | [`../CONTEXT.md`](../CONTEXT.md) |
| What / why | [`prd.md`](prd.md) |
| Handover + seed plans/models table | [`PROJECT_DESCRIPTION.md`](PROJECT_DESCRIPTION.md) |
| Screens and tokens | [`DESIGN.md`](DESIGN.md) |
| Shipped / next slice | [`NOW.md`](NOW.md) |
| Remaining PR write-ups | [`implementation-plan.md`](implementation-plan.md) |
| Open work | [`backlog/README.md`](backlog/README.md) |
| How a turn flows | [`technical-plan.md`](technical-plan.md) |
| Libraries and env | [`tech-stack.md`](tech-stack.md) |
| Starter character prompts | [`curated-agents.md`](curated-agents.md) + [`seed-agents.sql`](seed-agents.sql) |
| How the inbuilt catalog grows | [`catalog/taxonomy.md`](catalog/taxonomy.md) + [`catalog/wave-1.md`](catalog/wave-1.md) + [`catalog/wave-2.md`](catalog/wave-2.md) |
| Git / PR | [`git.md`](git.md) |
| Hard-to-reverse why | [`adr/`](adr/) |
| Schema sketch (archived) | [`archive/architecture.md`](archive/architecture.md) |

Postgres `plans` / `models` / `plan_models` are live truth for prices, credits, and model allowlists. The seed table in `PROJECT_DESCRIPTION.md` is the narrative copy of that catalog.

The inbuilt (curated) catalog is unbounded. [`curated-agents.md`](curated-agents.md) is the starter seed, not a cap of eight.
