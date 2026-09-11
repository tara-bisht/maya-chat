---
version: beta
name: Maya Street Cast
description: A touring company wheatpasted onto a night wall. Festival lineup, not a PDF program. Costume floods, acid tickets, cream type.
colors:
  night: "#14110F"
  cream: "#F6EFE4"
  cream-dim: "#E4D8C8"
  acid: "#FF4D2E"
  acid-hover: "#E03A1C"
  on-acid: "#14110F"
  stub: "#D6F25C"
  on-stub: "#14110F"
  rule: "#3A342E"
  ink-soft: "#B7A99A"
  code-well: "#0C0A09"
  on-code: "#E4D8C8"
  overlay: "#14110F99"
  costume-marcus: "#1F5A3C"
  costume-priya: "#9B1B4E"
  costume-alex: "#3A2418"
  costume-nonna: "#B33A1C"
  costume-viktor: "#4A6324"
  costume-valerian: "#24306E"
  costume-barnaby: "#8A3F16"
  costume-ren: "#3A4A58"
  costume-custom: "#5C4636"
  costume-jules: "#4A1638"
  costume-meera: "#1A3F3A"
  costume-kenji: "#2E2450"
  costume-sofia: "#7A4A12"
typography:
  display:
    fontFamily: Fraunces
    fontSize: 88px
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Fraunces
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.1
  headline-sm:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.15
  body-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Bricolage Grotesque
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.35
  label-md:
    fontFamily: Bricolage Grotesque
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
  label-caps:
    fontFamily: Bricolage Grotesque
    fontSize: 11px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: 0.08em
  code:
    fontFamily: IBM Plex Mono
    fontSize: 14px
  code-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
rounded:
  sm: 4px
  md: 10px
  lg: 14px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  measure: 42rem
  rail: 268px
  margin-mobile: 16px
  margin-desktop: 32px
components:
  button-primary:
    backgroundColor: "{colors.acid}"
    textColor: "{colors.on-acid}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 44px
    shadow: "4px 4px 0 {colors.cream}"
  button-primary-hover:
    backgroundColor: "{colors.acid-hover}"
  button-secondary:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.night}"
    border: "2px solid {colors.night}"
    rounded: "{rounded.md}"
    height: 44px
    shadow: "4px 4px 0 {colors.night}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.cream}"
    typography: "{typography.body-sm}"
  button-send:
    backgroundColor: "{colors.acid}"
    textColor: "{colors.on-acid}"
    rounded: "{rounded.md}"
    size: 44px
  input-field:
    backgroundColor: "{colors.cream-dim}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
    height: 44px
  textarea-composer:
    backgroundColor: "{colors.cream-dim}"
    textColor: "{colors.night}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
  playbill-poster:
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: 16px
    shadow: "6px 6px 0 {colors.cream}"
    tilt: "-3deg to +3deg"
  sticker-plus:
    backgroundColor: "{colors.stub}"
    textColor: "{colors.on-stub}"
    typography: "{typography.label-caps}"
    rotate: -8deg
    shadow: "3px 3px 0 {colors.cream}"
  sticker-free:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.night}"
    typography: "{typography.label-caps}"
    rotate: -6deg
    shadow: "3px 3px 0 {colors.acid}"
  sticker-next-bill:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.cream}"
    typography: "{typography.label-caps}"
    rotate: -4deg
    shadow: "3px 3px 0 {colors.cream}"
  chat-message-user:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.night}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    shadow: "4px 4px 0 {colors.acid}"
  chat-message-agent:
    textColor: "{colors.cream}"
    typography: "{typography.body-lg}"
  model-picker:
    textColor: "{colors.ink-soft}"
    typography: "{typography.code-sm}"
    height: 32px
  tool-chip:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.cream}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.sm}"
  tool-chip-done:
    backgroundColor: "{colors.stub}"
    textColor: "{colors.on-stub}"
    typography: "{typography.code-sm}"
  paywall-ticket:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.night}"
    rounded: "{rounded.lg}"
    shadow: "8px 8px 0 {colors.acid}"
  nav-rail:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
    typography: "{typography.body-sm}"
  ticket-footer:
    backgroundColor: "{colors.stub}"
    textColor: "{colors.on-stub}"
    border: "2px dashed {colors.night}"
    shadow: "6px 6px 0 {colors.acid}"
  auth-ticket:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.night}"
    rounded: "{rounded.md}"
    rotate: -1.5deg
    shadow: "8px 8px 0 {colors.acid}"
    width: 24rem
---

# Design System: Maya Street Cast

Maya Chat is a touring repertory of opinionated AI personas. This file is the visual language: a night wall of wheatpasted playbills, not a quiet beige brochure and not a generic SaaS dashboard.

This is the live system in `apps/web`. It **supersedes** the old “Maya House” quiet-program spec (paper, IBM Plex, one dusty lacquer chip, 3px costume rails).

---

## Overview

The reference object is **a festival lineup wheatpasted onto a city wall after dark.** Overlapping posters. Costume color floods. Cream type. One acid ticket for the move that matters. A 7% film-grain overlay sits on the whole product (`pointer-events: none`) so the night feels printed, not vector-clean.

The lobby (landing, Home/gallery, marketplace, studio, pricing) is the wall: the eight agents *are* the page. `/marketplace` is the public catalog — live posters plus coming-soon posters, grouped by category. Chat requires sign-in. Chat is the same night with the posters dropped to a rail and a wash — the character still owns the color, the chrome does not become a beige document.

**North star:** the company is loud. The product looks like a show, not a settings panel.

Personality: cool, graphic, a little rude. Not cute. Not enterprise. Not cyberpunk-purple-AI. Not “quiet luxury.” Density is poster density in the lobby and reading density in chat.

Night-first. Cream type on night paper. Costume floods own whole posters and agent-message washes. They still do not recolor the app shell (header, composer, tabs stay night).

Hinglish and Hindi are first-class. Load IBM Plex Sans Devanagari for unicode-range. Do not fake Devanagari. No mandalas, paisleys, or flag palettes.

shadcn/ui is an implementation convenience. Map its CSS variables to these tokens. Default zinc, `rounded-md` as 8px, and blurry `shadow-sm` are not Maya. House radius is **10px**. House shadow is a **hard offset**, never a blur.

---

## Colors

**Night and cream**

- **Night** `{colors.night}` (`#14110F`): the wall. Warm near-black. Never cool gray, never `#000`, never `#FFF`.
- **Cream** `{colors.cream}` (`#F6EFE4`): type on night, user tickets, wordmark, Free stickers.
- **Cream-dim** `{colors.cream-dim}` (`#E4D8C8`): secondary type, composer fill.
- **Ink-soft** `{colors.ink-soft}` (`#B7A99A`): captions, model alias, timestamps.
- **Rule** `{colors.rule}` (`#3A342E`): hairlines on night. If you need a line, this — not a glow.

**The two loud inks**

- **Acid** `{colors.acid}` (`#FF4D2E`): the go action. Primary buttons, focus rings, “Meet the company,” buy a seat, auth-ticket offset. One acid *fill* per view unless the view is a paywall. Acid may also appear as an offset shadow on cream/stub objects.
- **Acid hover** `{colors.acid-hover}` (`#E03A1C`).
- **On acid** `{colors.on-acid}` (`#14110F`): night text on acid fills.
- **Stub** `{colors.stub}` (`#D6F25C`): Plus/Pro die-cut stickers, “Tonight’s lineup,” remembered, footer ticket. Night text on stub (`{colors.on-stub}`).

Error uses acid. Do not invent a second error red. Selection is acid fill, night type.

**Costume floods** — whole posters, message washes, portrait grounds. Cream type on these fills (they are dark enough for AA). Never the page background. Never the primary button.

| Actor | Token | Hex | Live CSS |
| :--- | :--- | :--- | :--- |
| Marcus | `{colors.costume-marcus}` | `#1F5A3C` moss | `--maya-costume-marcus` / `bg-costume-marcus` |
| Dr. Priya | `{colors.costume-priya}` | `#9B1B4E` magenta | `--maya-costume-priya` |
| Alex | `{colors.costume-alex}` | `#3A2418` espresso | `--maya-costume-alex` |
| Nonna Maria | `{colors.costume-nonna}` | `#B33A1C` tomato | `--maya-costume-nonna` |
| Viktor | `{colors.costume-viktor}` | `#4A6324` olive | `--maya-costume-viktor` |
| Valerian | `{colors.costume-valerian}` | `#24306E` indigo | `--maya-costume-valerian` |
| Barnaby | `{colors.costume-barnaby}` | `#8A3F16` tawny | `--maya-costume-barnaby` |
| Ren | `{colors.costume-ren}` | `#3A4A58` slate | `--maya-costume-ren` |
| Custom | `{colors.costume-custom}` | `#5C4636` | until Studio picks |
| Jules | `{colors.costume-jules}` | `#4A1638` velvet | `--maya-costume-jules` |
| Meera | `{colors.costume-meera}` | `#1A3F3A` pine | `--maya-costume-meera` |
| Kenji | `{colors.costume-kenji}` | `#2E2450` dusk | `--maya-costume-kenji` |
| Sofia | `{colors.costume-sofia}` | `#7A4A12` brass | `--maya-costume-sofia` |

**Code well** `{colors.code-well}` (`#0C0A09`) with `{colors.on-code}`. Overlay `{colors.overlay}`. No backdrop blur.

**Grain.** Fixed full-viewport SVG turbulence at **7% opacity**, `pointer-events: none`, above content. Do not skip it — the wall looks plastic without it.

---

## Typography

Three voices.

- **Fraunces italic** is the show type. Wordmark, agent names, landing display, auth title. Huge, tight, allowed to sit against a poster. Not for long chat body.
- **Bricolage Grotesque** is the working type. UI, chat transcript, forms, taglines. Weights **400 / 600 / 800**. Wonky, modern, not IBM. Load **IBM Plex Sans Devanagari** beside it for Hindi/Hinglish.
- **IBM Plex Mono** is the machine: `grok-fast`, `memory_saver`, code fences.

Inter, Geist, Satoshi, Plus Jakarta, Space Grotesk, Poppins, Montserrat, and IBM Plex Sans (Latin) are not brand type.

**Roles**

- `{typography.display}` — Fraunces italic, `clamp(3.25rem, 11vw, 5.75rem)` / 500 / 0.92 / −0.04em. Landing only. Max ~16ch. Break like a poster.
- `{typography.headline-lg}` — Fraunces italic 32px / 600 on posters (`Dr. Priya`).
- `{typography.headline-md}` — Fraunces italic 28px. Auth title, nested titles.
- `{typography.headline-sm}` — Fraunces italic 24px. Footer wordmark, empty-state quotes.
- `{typography.body-lg}` — Bricolage 18px. Landing body, chat transcript.
- `{typography.body-md}` — Bricolage 16px. App body.
- `{typography.body-sm}` — Bricolage 14px / 600. Taglines, secondary sentences, ghost links.
- `{typography.label-md}` — Bricolage 14px / 600. Buttons. Sentence case.
- `{typography.label-caps}` — Bricolage 11px / 800 / +0.08em. `YOU`, `MARCUS`, `PLUS`, `FREE`, `PHILOSOPHY`, timestamps.
- `{typography.code}` / `{typography.code-sm}` — Plex Mono 14 / 12.

The wordmark is the word *Maya* in Fraunces italic, cream on night (night on cream/stub tickets). No orb, no sparkle, no neural node. A small acid square stamp is optional and rare.

---

## Layout

8px rhythm. Chat and paywall prose sit in `{spacing.measure}` (42rem). The **lobby is full-bleed** — do not trap the landing in a blog column. Outer margin `{spacing.margin-mobile}` / `{spacing.margin-desktop}` (16 / 32).

**Desktop shell (app).** `{spacing.rail}` (~268px) cast rail on night, cream names, costume portrait squares. Nested threads under the agent. The stage is the rest. No third inspector column in v1.

**Gallery / landing wall.** CSS grid: 1 column mobile, 2 tablet, 4 desktop. Gap 32px. Odd columns on large screens drop `2rem` (`translate-y-8`) so the wall staggers. Each poster carries its own tilt. Not a perfectly aligned card row. Not a horizontal “logo strip.”

Poster tilts (index 0–7, degrees): `-2.8, 2.4, -1.6, 3.2, -2.2, 1.8, -3.1, 2.1`.

**Studio.** Single column character sheet on night, cream fields, costume floods as the picker. Max 40rem.

**Mobile.** Bottom tabs on night. Acid only on the active label. Composer above the home indicator. 44px minimum. Landing chrome stays one row (wordmark, ghost Sign in, acid CTA). Jump links live in the footer, not under the bar. No hamburger.

**Composer.** Anchored, cream-dim fill, 1px rule, acid send square. Not a floating glass pill.

---

## Elevation

This is **stickers on a wall**, not Material.

| Layer | Treatment |
| :--- | :--- |
| Page | `{colors.night}` + 7% grain |
| Poster | costume flood + cream type + **hard offset** `6px 6px 0 cream` |
| Auth / paywall ticket | cream + **hard offset** `8px 8px 0 acid` |
| Footer ticket | stub + dashed night border + `6px 6px 0 acid`, rotate −0.6° |
| Chat well | night |
| Agent turn | costume flood at ~88% + cream type |
| User turn | cream ticket, night type, `4px 4px 0 acid` |
| Code | `{colors.code-well}` |

No drop-shadow blur. No `backdrop-filter`. Hover on `.poster`: keep the tilt, translate −3px −3px, grow offset to 9px. 180ms `cubic-bezier(0.2, 0, 0, 1)`. Nothing bounces. `prefers-reduced-motion`: no transform.

Focus: 2px acid ring, 2px offset.

---

## Shapes

- `{rounded.sm}` 4px — chips, stamps
- `{rounded.md}` 10px — posters, buttons, tickets, avatars, inputs
- `{rounded.lg}` 14px — paywall ticket
- `{rounded.full}` — unread dot and caret only. Never buttons. Never the composer.

Avatars are **squares** `{rounded.md}` inside the poster, full-bleed linocut, `object-cover`, slight scale (~1.12) so the crop is a playbill headshot. Not circles. Not initials in a pastel tile.

Icons: 1.5px stroke, cream (night on cream tickets). Lucide restroked. No sparkles.

---

## Components

### Buttons

`{components.button-primary}`: acid fill, night type, 44px, `{rounded.md}`, Bricolage 14/600, sentence case, cream hard offset `4px 4px 0`. Hover `{colors.acid-hover}`. One acid fill per view.

Secondary (`{components.button-secondary}`): cream fill, 2px night border, night type, night hard offset — Google/Apple on the auth ticket.

Ghost: cream (or night, on tickets) underline on hover. Sign in, Back to the wall, Stripe portal.

Send: 44×44 acid square, arrow. Not a circle. Not a FAB inside the textarea.

Disabled: 40% opacity, keep the offset. Loading: label → ellipsis, no spinner rainbow.

### Playbill posters

The gallery unit is `{components.playbill-poster}`: a **costume-flood poster**, not a white card with a stripe.

- Full `{colors.costume-*}` background, 16px padding, `{rounded.md}`
- Square linocut on top, `{rounded.md}` crop
- Category in `{typography.label-caps}` cream at ~80%
- Short name in Fraunces italic 32px cream
- Tagline in Bricolage 14px cream at ~90%
- **Free** sticker (`{components.sticker-free}`): cream, night type, −6°, acid offset, top-right
- **Plus / Pro** sticker (`{components.sticker-plus}`): stub, night type, −8°, cream offset, top-right. Not a grey wash. Not a padlock on the face
- **Next bill** sticker (`{components.sticker-next-bill}`): rule fill, cream type, −4°, cream offset. Coming-soon posters stay costume-flooded. No Talk href.
- Tilt from the index list. Stagger on desktop
- Hover: lift, do not glow

### Chat

Attributed dialogue on night. Still not iMessage.

```
MARCUS                                          14:02
Your feelings are valid, but your excuses are pathetic.

YOU
My boss ignored the extra hours I put in.
```

- Agent (`{components.chat-message-agent}`): costume wash, 8px left, name in `{typography.label-caps}`, body `{typography.body-lg}` cream
- User (`{components.chat-message-user}`): cream ticket, night body, acid offset, attribution `YOU`
- Tools: `{components.tool-chip}` pending, `{components.tool-chip-done}` stub when done. Real tool ids in mono
- Model picker: Plex Mono, ink-soft, **Voice through {alias}**. Options from `GET /api/models`

### Paywall ticket

`{components.paywall-ticket}`: cream card, acid offset, stub sticker. Sits **in the stage** on locked agent, daily cap, or locked model. Copy is catalog-true. Never imply the request already ran on a higher model.

### Auth ticket

`{components.auth-ticket}`: 24rem cream card, −1.5°, 8px acid offset. Wordmark + “Sign in.” Google/Apple as secondary. Ghost “Back.”

### Footer ticket

`{components.ticket-footer}`: stub fill, dashed night border, acid offset, slight rotate. Wordmark + one Bricolage line. Not a hairline footer.

### Navigation

`{components.nav-rail}`: night, stacked 32px square portraits, cream names, last-thread in ink-soft. Active agent: costume wash or 3px costume rail + cream name. Nested threads indent 16px. Unread: 6px acid `{rounded.full}` dot.

Mobile tab bar: night, hairline rule on top, 44px items, cream glyphs, acid only on the active label.

---

## Voice & Copy

The visual language stays theatrical (night wall, posters, tickets). Chrome copy is plain so a new user can navigate without a glossary. Agent voices stay opinionated. The send button may not roast.

**Hooks (unchanged)**

- "Don't talk to a boring AI chatbot. Give your AI personality and character."
- "Every conversation deserves a character."
- "Give your AI a personality."

**Allowed register (chrome)**

- "Home." / "Explore." / "Create agent." / "Profile."
- "Meet the agents." / "Create an agent."
- "Sign in." / "Get started."
- "Start with a voice. Or write yours."
- "Marcus is listening."
- "Alex is on Plus. Marcus and Dr. Priya are free."
- "Daily limit reached. Fifty messages. Come back tomorrow, or upgrade."
- "You have not created an agent yet."
- "Continue chatting."
- "Coming soon."
- "Opinionated AI — yours, or one we already wrote. Not a helpdesk. Not a copilot."
- "Loading…"

**Forbidden register**

- Unlock / supercharge / harness / unleash
- Companion, copilot (in marketing), assistant-with-a-sparkle
- "What's on your mind?" as a global placeholder
- Wristband, Casting notes, Daily curtain, Back to the wall, Tonight's company
- "Oops, something went wrong!" without a next step
- Emoji in chrome

**Paywall (prices and model names still come from `plans` / `models`)**

- Locked agent: "Alex is on Plus. Marcus and Dr. Priya are free."
- Quota: "Daily limit reached. {limit} messages. Come back tomorrow, or upgrade."
- Locked model: "This model is not on your plan. Your models: {allowlist}."

**Empty thread.** The agent's tagline in Fraunces italic cream. Not "Start a conversation with your AI."

**Errors.** Cream sentence + one ghost action ("Try again"). Stream fail: "The line dropped." No stack traces. No toast pile-up; the ticket sits in the well.

---

## Agent identity

The company is eight linocut portraits plus user-made roles. Identity is a **costume flood**, not a theme.

**Portrait rules** (seeded at `/avatars/*.jpg`)

| File | Actor |
| :--- | :--- |
| `/avatars/marcus-stoic.jpg` | Marcus |
| `/avatars/dr-priya-stem.jpg` | Dr. Priya |
| `/avatars/alex-tech-lead.jpg` | Alex |
| `/avatars/nonna-maria.jpg` | Nonna Maria |
| `/avatars/viktor-drill-sergeant.jpg` | Viktor |
| `/avatars/valerian-polymath.jpg` | Valerian |
| `/avatars/barnaby-cat.jpg` | Barnaby |
| `/avatars/ren-philosopher.jpg` | Ren |
| `/avatars/jules-cinephile.jpg` | Jules (coming soon) |
| `/avatars/meera-editor.jpg` | Meera (coming soon) |
| `/avatars/kenji-panel.jpg` | Kenji (coming soon) |
| `/avatars/sofia-economist.jpg` | Sofia (coming soon) |

- Square, two-ink linocut / wheatpaste. Cream + that agent's costume flood.
- Cropped like a playbill headshot. No photoreal skin. No celebrity likeness. No anime. No chibi.
- Works at 32px (rail) and ~240px (poster). Test both.
- Custom agents: square ink monogram on `{colors.costume-custom}` until a portrait exists. No generated “friendly AI face.”

**Where costume appears**

1. Entire playbill poster fill
2. Portrait ground
3. Agent-message wash in chat
4. Optional 8px square swatch in Studio's costume picker
5. 3px rail on the active cast-rail row

**Where costume does not appear:** page background, primary button, focus ring, tab bar fill, marketing hero gradient.

Studio may pick from the costume tokens. It may not accept an arbitrary hex that turns the house into a skin.

---

## Motion

- Interactive (hover, press, focus): **180ms**, `cubic-bezier(0.2, 0, 0, 1)`
- Panel / dialog: **220ms**, same curve
- Nothing in **app chrome** exceeds **220ms**
- Chat: streaming tokens are the long-running motion. Caret is a 6px acid square that blinks at 1Hz
- Lobby only (`(marketing)`): CSS loops are allowed — wheatpaste sticker float (~5s, 8px), circular stub stamp (~14s), stub scribble draw-on on the H1 (~0.7s), scripted House-window typewriter after the first scene. Not live chat. Not Framer. Not bounce. First paint still shows the full first turn.
- `prefers-reduced-motion`: durations 0ms; caret static; posters lose tilt/hover translate; lobby loops off; scribble already drawn; typewriter snaps to full text

No page-load shimmer. First paint of night + grain + “Setting the house…” in `{typography.label-caps}` is enough. No layout animation on the rail. No message-bubble pop.

---

## Iconography

Stroke icons, 1.5px, rounded caps, 20/24px, cream on night. Lucide is the implementation default if paths are restroked.

Allowed metaphors: mask / program (agent), paper plane (send), sliders (studio), ticket (billing). Forbidden: sparkles, magic wand, neural net, robot head, chat-bubble-with-dots as the brand glyph.

Favicon: a small acid square with a night *M* in Fraunces italic, or the wordmark at small size. Not a gradient.

---

## Screen language

These are generation rules for MVP surfaces. If a control is not named here, inherit Overview.

### Landing — `(marketing)` lobby wall

Night, full bleed, grain on. Featured posters are a start, not a closed roster — Studio is the product. Sections after the wall are **wall artifacts** (scene posters, cream tickets, stub notes) — not a SaaS features essay, not a blog column. Do not lead marketing with “eight agents.”

1. Sticky header. Desktop: floating night ticket (`sticky top-3`), cream 2px edge, 6px acid offset — wordmark left, jump links optically centered, ghost “Sign in” + acid “Create an agent.” right (`#studio`). Sign in and the CTA stay on screen while the wall scrolls. Mobile: sticky top, night fill, hairline rule; one row — wordmark, ghost Sign in, acid CTA. Jump links are not in the mobile bar (they stay in the footer). No hamburger. One acid fill in the chrome. No second Sign in in the hero.
2. Hero: stacked, H1 centered. `{typography.display}` italic — “Give your AI a personality.” *personality* carries a stub **SVG scribble** underline (hand-drawn stroke, `preserveAspectRatio="none"`, not a rectangle, not a second acid fill). Then one centered `{typography.body-lg}` cream-dim sentence that names the sterile-chatbot contrast and tells you to cast a character or write one. No Studio die-cut. No “Start with a voice. Or write yours.” under the H1. Under the copy: a House window — night fill, cream 2px edge, 8px acid offset. Desktop: centered, `max-w-5xl`, 16:10 frame; rail lists the live company (not three voices) + You ticket + costume-wash reply + dummy composer. Click a rail row to switch the voice. Mobile: same window as a phone stack (chips, well, composer) — not a letterboxed 16:10. First paint shows the full first turn. Later turns may type, then cycle, unless hover/focus or `prefers-reduced-motion`. Wheatpaste stamps (existing Free/Plus recipe) may float on the window. Not a wheatpaste quote fan, not Apple laptop chrome, not a three-column icon row. No model alias. No live chat. No second Sign in in the copy block. No “eight agents.”
3. `#company`: Fraunces italic “Start with a voice” + featured posters on the staggered wall. No numbered act, no document kicker row. Examples, not the whole product. No three-column icon row.
4. `#usual`: one shared You ticket, then four replies — cream “Assistant” leftover (struck hedge) plus three costume-flood nights (Marcus, Nonna Maria, Barnaby). Title: “Same question. Different night.” Prompt chips swap the question and all four replies. Scripted, not live chat.
5. `#nights`: three costume-flood scene posters (maths / advice / code), each with a nested House scrap (You ticket + wash). The moment picks the personality; if none fit, you write one. Title only — no numbered act.
6. `#house`: three cream tickets — pick or create, talk, they remember. Acid hard offset. Cream/stub pills for the meaning already in the body. Hover is the existing ticket lift. Step marks `01`–`03` live on the tickets, not as a section index.
7. `#studio`: one cream character sheet, 8px acid offset, rotate −1°. Title: “Write the personality.” Ghost “Sign in.” This is the platform, not a side door. No numbered act.
8. `#seats`: three cream tickets (Free / Plus / Pro). Acid CTA only on Free (“Get started”). Plus/Pro are ghost. Seed copy until `plans` is live. Do not sell “all eight agents.” Title: “Plans.”
9. `#notes`: native `<details>` FAQ. Desktop: title left, accordion right. Mobile stacked. Fraunces questions, Bricolage answers. Lead with “Can I make my own agent?” Title: “Before you start.” No FAQ index stamp.
10. Closing band, then footer. Night band, Fraunces italic “The house is open.” Cream secondary CTA (header keeps the one acid fill) + ghost “See plans.” Optional rotating stub-stroke stamp. Then `{components.ticket-footer}` with jump links. Copy: “Opinionated AI — yours, or one we already wrote. Not a helpdesk. Not a copilot.”

Primary CTA: “Create an agent.” Secondary: “Sign in.” Free plan: “Get started.”

### Auth — `/login`

`{components.auth-ticket}` on night. “Sign in.” Helper: “Continue with Google. Apple lands later.” Ghost: “Back.” No mascot, no split-screen photo, no “members only.”

### Gallery — `(app)/gallery`

Signed-in home. Left sidebar (icon + label nav, recents, your agents) is **collapsible** on desktop (`{spacing.rail}` expanded, 72px collapsed, persisted in `localStorage`). Recents are **one row per agent** — that agent's latest live thread — not a ChatGPT list of transcripts. Older threads stay nested under the agent in House. Header: greeting left; right is two groups — acid **Create agent**, then the account cluster (Free **Upgrade** glued to a 40px avatar). Credits live on the rail footer and in House, not in the lobby header. Mobile: top bar (wordmark, Upgrade on Free, avatar, menu), bottom nav (Home / Explore / Create / Profile) with icons, menu drawer. Main column: Continue chatting, Featured agents, Your agents, From other people. Sticky in-page tabs skip empty sections and underline the active one (cream, not a second acid fill). Section titles are Fraunces italic with no kicker + rule stack. Locked curated posters keep the Plus sticker and stay fully readable. Opening a card opens **that agent's** latest thread — not a global chat. Signed-in posters sit on a straight grid like the landing company wall (no wheatpaste tilt). Public `/marketplace` still tilts.

Profile menu: avatar initial, dropdown with Profile, Your agents, Upgrade/Plan, Sign out. Free shows **Upgrade** beside the avatar; Plus/Pro keep the plan name in the menu, not as a header sibling. Both go to in-app `/plan`. Authenticated paywalls never link the landing `/#seats`.

### Explore — `(app)/explore`

Same AppShell as Home. Category bill of the eight live agents plus four coming-soon posters. Chat links go to `/chat/{id}`. Signed-in `/marketplace` redirects here. Guests stay on public `/marketplace`.

Empty custom list: “You have not created an agent yet.” + acid “Create agent.”

Custom stamps: Public / Private.

### Chat — `(app)/chat/[conversationId]`

Night stage. Header: 32px square portrait, Fraunces italic name, model alias, About, the same plan chip + profile menu as the lobby (Upgrade hidden on small screens). Transcript is attributed dialogue in `{spacing.measure}`. Composer anchored. Quota and 403 render as `{components.paywall-ticket}` in the well.

### Studio — `(app)/studio`

Title in Fraunces italic: “Create agent” / “Edit agent.” Fields in document order: name, tagline, language preset, costume flood, backstory, tone faders, tool toggles, Public / Private. Save is the one acid button. Preview pane is optional (roadmap cut). Feels like a marked-up character sheet on night paper, not an IDE. Free locks Private with “Private agents are Plus.” Cap overage is a paywall ticket, not a toast. `/studio` index redirects to Profile `#your-agents`.

### Pricing

Three cream tickets on night, acid offset only on the plan the user can buy (Plus if Free; Pro if Plus; portal if Pro). Plan name in Fraunces italic. Price from `plans`. Model list in Plex Mono from the catalog. No “Most Popular” ribbon. No yearly toggle animation.

### Settings — Profile `/settings`

Night, cream fields. Display name, preferred language, bio, plan, **Your agents** (Chat + Edit). Upgrade ghost (Free) or Manage plan (paid) → `/plan`. Sign out ghost. No hero.

### Empty, error, loading

- Empty thread: agent tagline as Fraunces italic cream pull-quote
- Stream failure: “Something went wrong.” + ghost “Try again.”
- 429 / 402: paywall ticket, not a toast
- Loading: night + grain + `{typography.label-caps}` “Loading…”

### Mobile (Phase 6)

Same tokens via NativeWind. Bottom tabs. Chat is a stack. No rail; agents are the Gallery tab. Composer above the home indicator. 44px minimum. Studio may be absent in v1 mobile.

---

## Do's and Don'ts

- **Do** let costume color own posters and agent washes. **Don't** beige-card everything. **Don't** ship Maya House paper/lacquer.
- **Do** stagger and tilt the lineup. **Don't** ship a justified SaaS card grid.
- **Do** use one acid *fill* per view. Acid as an offset shadow on cream/stub is allowed. **Don't** acid the whole header.
- **Do** hard offset shadows. **Don't** blur, glass, mesh gradient, or `shadow-sm`.
- **Do** Bricolage + Fraunces italic + Plex Mono. **Don't** Inter, Geist, or IBM Plex Sans for Latin UI.
- **Do** nest conversations under agents. **Don't** a ChatGPT sidebar of untitled chats.
- **Do** typeset chat as attributed dialogue. **Don't** iMessage / WhatsApp bubbles.
- **Do** keep grain at ~7%. **Don't** skip it for a “clean” dark UI.
- **Do** stamp Free/Plus on still-visible posters. **Don't** grey-out locked agents until they are unreadable.
- **Do** read plan names, prices, and model aliases from the catalog. **Don't** hardcode "$9", "Claude", or "GPT" in marketing components.
- **Don't** purple, bloom, sparkles, neural logos, `#FFFFFF` canvas.
- **Don't** write "Unlock your potential," "Meet your AI companion," or "Start chatting."
- **Do** WCAG AA: cream on night, cream on costume floods, night on acid and stub.

---

## Implementation notes

Shipped in `apps/web`. Keep this file and the CSS in lockstep.

- Tokens: `apps/web/app/globals.css` (`--maya-*`, shadcn aliases, `@theme inline`).
- Fonts: `next/font` — Fraunces (italic + 400–600), Bricolage Grotesque (400, 600, 800), IBM Plex Sans Devanagari, IBM Plex Mono. CSS variables `--font-fraunces`, `--font-bricolage`, `--font-plex-devanagari`, `--font-plex-mono`.
- Poster class: `.poster` uses `--tilt` and the cream offset; hover in CSS, not JS.
- Lineup data: `apps/web/lib/company.ts`. Runtime catalog still comes from `public.agents`.
- Avatars: `/avatars/*.jpg` (not SVG). Paths must match `docs/seed-agents.sql`.
- shadcn map: `--background: night`, `--foreground: cream`, `--primary: acid`, `--accent: stub`, `--radius: 10px`.
- NativeWind in Phase 6 consumes the same CSS variable names.
- Do not add a second component library to “get the look.” Restyle shadcn.
