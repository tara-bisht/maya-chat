# Inbuilt catalog: jobs × archetypes

How first-party characters are *written* and how they *sit on the wall*. Starter prompts: [`../curated-agents.md`](../curated-agents.md). Launch handful: [`../backlog/ideas/007-inbuilt-catalog-jobs-voices.md`](../backlog/ideas/007-inbuilt-catalog-jobs-voices.md). Rest of wave 1: [`../backlog/ideas/010-inbuilt-catalog-wave-1-rest.md`](../backlog/ideas/010-inbuilt-catalog-wave-1-rest.md). Wave 2: [`../backlog/ideas/009-inbuilt-catalog-sages-canon.md`](../backlog/ideas/009-inbuilt-catalog-sages-canon.md). Words: [`../../CONTEXT.md`](../../CONTEXT.md).

The company can grow to thousands. It does not grow by adding generic specialists (“Email Writer”). Every inbuilt agent is a named character: a **job** they are good at, plus an **archetype** you would not get from a bland assistant.

Marcus is the recipe: mindset job × sarcastic Stoic. Priya is the other: math job × flirty professor. Repeat that across more jobs.

## Two axes

| Axis | What | Where |
| :--- | :--- | :--- |
| Job | Why the thread exists (email, F1, proof, dungeon) | Browse `category` on Explore |
| Archetype | How we cast them (blend, sage, canon, believer) | Editorial `archetype` + `tags` |

Professional / Fun / Niche / Believer / Sage / Canon are **archetypes**, not Explore sections. Fun blends scatter across every section. That is the product.

## Browse (Explore)

Keep the live category ids. Relabel four. Add `play` in the schema slice ([TODO-010](../backlog/ideas/010-inbuilt-catalog-wave-1-rest.md)). Studio stays `custom` and off this bill.

| `category` id | Explore label | Jobs on the wall |
| :--- | :--- | :--- |
| `productivity` | Work | Email, decks, code, meetings, interviews, career writing |
| `learning` | Learning | Tutoring, proofs, language, research explainers |
| `wellbeing` | Advice | Burnout, habits, relationships, grounding |
| `philosophy` | Debate | Stoics, ethics, ideology, believer characters, teaching sages |
| `lifestyle` | Everyday | Taste, fandoms, casual niche (F1, cricket, food, cinema) |
| `play` | Play | Fantasy, games, talk-to-a-character, entertainment bits (schema: TODO-010) |
| `custom` | — | Studio only |

Viktor is seed-`productivity` (fitness/discipline). Recategorize to `wellbeing` when the rest of wave 1 seeds ([TODO-010](../backlog/ideas/010-inbuilt-catalog-wave-1-rest.md)) so he does not sit under Work.

## Archetypes (editorial)

How we write a sheet. Not an Explore tab.

| Archetype | Recipe | Seed today |
| :--- | :--- | :--- |
| professional | High-utility craft, still a person with taste | Alex; Kenji / Meera / Sofia coming soon |
| blend | Serious skill × unexpected personality | Marcus, Priya, Viktor, Valerian |
| niche | Obsessive domain; the field’s lore unprompted | Jules coming soon |
| believer | Declared stance; debate partner, not a textbook | — |
| coach | Feedback that stings and is specific | Meera |
| companion | Casual hang, vent, no project | Barnaby, Ren, Nonna |
| researcher | Briefing with sources and caveats | — |
| improviser | Yes-and, then a shortlist | — |
| guide | Planning and how-to | Viktor |
| fantasy | TTRPG, worldbuilding, bit characters (games/story, not adult) | — |
| sage | Answers from a named teaching or historical mind | — (wave 2) |
| canon | A character with a remembered world (public-domain literary or original pastiche) | — (wave 2) |

Sage vs believer: a sage argues from a **text or tradition**; a believer argues a **stance**. Aurelius is a sage. Cato is a believer.

Sage vs blend: Marcus is Stoic × roast. Aurelius is the *Meditations* notebook without the Ramsay overlay.

Canon vs fantasy: Nyx is a **DM** (you play). Holmes / Wick **are** the character (you talk to them).

Existing **Marcus** is an original sarcastic Stoic. He is not Marcus Aurelius. The Meditations seat is **Aurelius**.

Tags on every curated row (examples): `email`, `decks`, `f1`, `cricket`, `capitalism`, `fantasy`, `brainstorm`, `research`, `hinglish`, `stoic`, `gita`, `buddhism`, `thought-experiment`, `literary`, `magic-school`. Matchmaker ([TODO-002](../backlog/ideas/002-maya-super-agent-host-matchmaker.md)) retrieves on tags + archetype + category. Do not stuff every bio into Maya’s prompt.

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
| Advice from a teaching (Stoic, Gita, Four Noble Truths) | Advice or Debate | sage |
| Wonder / thought-experiment science | Learning | sage (original name; not an estate) |
| Imagination / story-plus-wonder | Play | sage (original name; not an estate) |
| Sports / fandom | Everyday | niche |
| Movies, recaps | Everyday | niche (Jules) |
| Casual hang | Everyday / Advice | companion |
| Fantasy, TTRPG | Play | fantasy |
| Talk to a public-domain literary character | Play | canon |
| Talk to an original in a popular type | Play | canon |
| Entertainment bits | Play | blend |

## Believer rails

Believers are characters, not oracles. Playbill sits in Debate (or Play if the bit is purely comic). Stamp the stance in the tagline.

- Stay in character. No professional licenses. No medical, legal, or personalized financial instruction. No recruitment. No live-person impersonation.
- Ship **pairs**, not a single sermon (Cato with Rosa). A house with only one ideology reads as a pamphlet.
- Conspiracy-as-comedy (Helios): argue the bit; refuse harm (violence, scams, medical advice); offer the paired physicist (Valerian) when they want the actual sky. Viktor already covers paranoid humor without a disc-shaped Earth.
- Flirty blends: adult-to-adult, never involving minors (same as Priya).
- Fantasy: TTRPG/story. Not a dating-app companion in wave 1.

## Sage and canon rails

Naming lock: **public-domain names + original pastiches**. The job is real; the poster name is either a public-domain teacher/literary character or an original Maya character who does that job.

- **Living people:** never a first-party name or likeness.
- **Estate-controlled modern figures** (Einstein, Disney, anyone whose name is a company): original Maya sage. Do not put that name on the poster.
- **Copyrighted TV/film:** never first-party without a license. No Heisenberg, Hogwarts, Westeros, or Citadel-of-Ricks. Original worlds only. Taglines must not name the show.
- **Public-domain historical / literary:** allowed. Playbill honesty: “Based on the writings of …” / “The book, on the night wall.” Not a séance.
- **Religious** (Siddhartha, Krishna): teacher of the text, not God-on-the-app, not a sect, not a fatwa. Crisis / harm → human help (same as Lila). Drop from the seed PR if too hot (same pattern as Helios).
- **Crime antihero:** fiction only. No real synthesis, laundering, or how-to.
- **Avatars:** linocut / wheatpaste. No celebrity likeness ([`DESIGN.md`](../DESIGN.md)).
- **Studio:** members may cast what they want; the first-party catalog is the house brand. Licensed-looking Studio casts are a later content-policy todo.

A sage with no behavioral loop is Wikipedia in a toga. A canon sheet that reads as a clone of a show: rewrite the world, do not ship the clone.

## Scale rules

1. Catalog-backed wall ([TODO-006](../backlog/ideas/006-catalog-driven-first-party-bill.md)) before a large seed. Do not grow `COMPANY` in TypeScript.
2. Costume is a **palette** of reused floods (~24 inks). Seed characters keep their current floods. A new row picks a palette id; it does not add a CSS variable.
3. Gallery selects an explicit column list. Never `system_prompt` to the client.
4. Free-tier stays a tasting menu (`free_tier` flag). Default: Maya + Marcus + Priya.
5. Maya host ([TODO-002](../backlog/ideas/002-maya-super-agent-host-matchmaker.md)) ships with the launch handful, not after ~20 seats.
6. Wave 2 seed ([TODO-009](../backlog/ideas/009-inbuilt-catalog-sages-canon.md)) waits on the catalog-backed bill and the [TODO-010](../backlog/ideas/010-inbuilt-catalog-wave-1-rest.md) schema (`sage` / `canon` on the archetype enum). Do not fold sages into the launch company.
