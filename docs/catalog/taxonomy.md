# Inbuilt catalog: jobs × archetypes

How first-party characters are *written* and how they *sit on the wall*. Starter prompts: [`../curated-agents.md`](../curated-agents.md). Wave 1 names: [`wave-1.md`](wave-1.md). Words: [`../../CONTEXT.md`](../../CONTEXT.md). Schema + seed: [`../backlog/ideas/007-inbuilt-catalog-jobs-voices.md`](../backlog/ideas/007-inbuilt-catalog-jobs-voices.md).

The company can grow to thousands. It does not grow by adding generic specialists (“Email Writer”). Every inbuilt agent is a named character: a **job** they are good at, plus an **archetype** you would not get from a bland assistant.

Marcus is the recipe: mindset job × sarcastic Stoic. Priya is the other: math job × flirty professor. Repeat that across more jobs.

## Two axes

| Axis | What | Where |
| :--- | :--- | :--- |
| Job | Why the thread exists (email, F1, proof, dungeon) | Browse `category` on Explore |
| Archetype | How we cast them (blend, niche, believer, coach) | Editorial `archetype` + `tags` |

Professional / Fun / Niche / Believer are **archetypes**, not Explore sections. Fun blends scatter across every section. That is the product.

## Browse (Explore)

Keep the live category ids. Relabel four. Add `play` in the schema slice ([TODO-007](../backlog/ideas/007-inbuilt-catalog-jobs-voices.md)). Studio stays `custom` and off this bill.

| `category` id | Explore label | Jobs on the wall |
| :--- | :--- | :--- |
| `productivity` | Work | Email, decks, code, meetings, interviews, career writing |
| `learning` | Learning | Tutoring, proofs, language, research explainers |
| `wellbeing` | Advice | Burnout, habits, relationships, grounding |
| `philosophy` | Debate | Stoics, ethics, ideology, believer characters |
| `lifestyle` | Everyday | Taste, fandoms, casual niche (F1, cricket, food, cinema) |
| `play` | Play | Fantasy, games, entertainment bits (schema: TODO-007) |
| `custom` | — | Studio only |

Viktor is seed-`productivity` (fitness/discipline). Recategorize to `wellbeing` when wave 1 seeds so he does not sit under Work.

## Archetypes (editorial)

How we write a sheet. Not an Explore tab.

| Archetype | Recipe | Seed today |
| :--- | :--- | :--- |
| professional | High-utility craft, still a person with taste | Alex; Kenji / Meera / Sofia coming soon |
| blend | Serious skill × unexpected personality | Marcus, Priya, Viktor, Valerian |
| niche | Obsessive domain; canon unprompted | Jules coming soon |
| believer | Declared stance; debate partner, not a textbook | — |
| coach | Feedback that stings and is specific | Meera |
| companion | Casual hang, vent, no project | Barnaby, Ren, Nonna |
| researcher | Briefing with sources and caveats | — |
| improviser | Yes-and, then a shortlist | — |
| guide | Planning and how-to | Viktor |
| fantasy | TTRPG, worldbuilding, bit characters (games/story, not adult) | — |

Tags on every curated row (examples): `email`, `decks`, `f1`, `cricket`, `capitalism`, `fantasy`, `brainstorm`, `research`, `hinglish`. Matchmaker ([TODO-002](../backlog/ideas/002-maya-super-agent-host-matchmaker.md)) retrieves on tags + archetype + category. Do not stuff every bio into Maya’s prompt.

Hinglish and Hindi are first-class on several jobs (cricket, tax, exam drill). They are not a category.

## Jobs to cover

| Job | Category | Archetype |
| :--- | :--- | :--- |
| Email, Slack, recaps | Work | professional |
| Decks, talks | Work | professional, coach |
| Code, architecture | Work | professional (Alex) |
| Interviews, resumes | Work | professional (Kenji) |
| Study, proofs | Learning | blend (Priya) |
| Research, “what to read” | Learning | researcher |
| Language practice | Learning | guide |
| Brainstorm, naming, plot | Play or Work | improviser |
| Draft / design critique | Work / Learning | coach (Meera) |
| Advice, vent, burnout | Advice | companion, coach (Nonna) |
| Fitness, habits | Advice | guide (Viktor) |
| Money (not personalized advice) | Learning | professional (Sofia), blend (Valerian) |
| Argue a worldview | Debate | believer |
| Sports / fandom | Everyday | niche |
| Movies, recaps | Everyday | niche (Jules) |
| Casual hang | Everyday / Advice | companion |
| Fantasy, TTRPG | Play | fantasy |
| Entertainment bits | Play | blend |

## Believer rails

Believers are characters, not oracles. Playbill sits in Debate (or Play if the bit is purely comic). Stamp the stance in the tagline.

- Stay in character. No professional licenses. No medical, legal, or personalized financial instruction. No recruitment. No live-person impersonation.
- Ship **pairs**, not a single sermon (Cato with Rosa). A house with only one ideology reads as a pamphlet.
- Conspiracy-as-comedy (Helios): argue the bit; refuse harm (violence, scams, medical advice); offer the paired physicist (Valerian) when they want the actual sky. Viktor already covers paranoid humor without a disc-shaped Earth.
- Flirty blends: adult-to-adult, never involving minors (same as Priya).
- Fantasy: TTRPG/story. Not a dating-app companion in wave 1.

## Scale rules

1. Catalog-backed wall ([TODO-006](../backlog/ideas/006-catalog-driven-first-party-bill.md)) before a large seed. Do not grow `COMPANY` in TypeScript.
2. Costume is a **palette** of reused floods (~24 inks). Seed characters keep their current floods. A new row picks a palette id; it does not add a CSS variable.
3. Gallery selects an explicit column list. Never `system_prompt` to the client.
4. Free-tier stays a tasting menu (`free_tier` flag). Wave 1 default: Marcus + Priya.
5. Matchmaker becomes load-bearing around ~20 live seats ([TODO-002](../backlog/ideas/002-maya-super-agent-host-matchmaker.md)).
