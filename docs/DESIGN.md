---
version: tool
name: Maya Tool
description: A dark working chat. Named specialists, a model picker, and a result you can read. No posters.
colors:
  stage: "#0E0F12"
  panel: "#13151A"
  raised: "#1C1F26"
  ink: "#F3F1EC"
  muted: "#A39E95"
  line: "#2A2D34"
  sheet: "#F7F6F3"
  sheet-ink: "#1C1A17"
  ready: "#1F6B45"
  primary: "#F3F1EC"
  on-primary: "#141311"
typography:
  ui:
    fontFamily: IBM Plex Sans
    fontSize: 14px
  mono:
    fontFamily: IBM Plex Mono
    fontSize: 12px
rounded:
  control: 8px
  sheet: 12px
---

# Design system: Maya Tool

Maya Chat is a dark instrument for talking to a named agent. The useful thing on screen is the conversation, the model, and the sheet you are about to use. Costume color is an 8px dot beside a name. It does not paint the page, the message, or a poster.

This file replaces Street Cast (night wall, acid orange, Fraunces, hard offset shadows, grain, tilted posters). Chrome words stay in [`../CONTEXT.md`](../CONTEXT.md).

## Color

- **Stage** `#0E0F12` is the page.
- **Panel** `#13151A` is the chats column and quiet cards.
- **Raised** `#1C1F26` is the active row, the user bubble, and the selected tab.
- **Line** `#2A2D34` is the only border.
- **Ink** `#F3F1EC` is type on the stage. **Muted** `#A39E95` is secondary type.
- **Sheet** `#F7F6F3` with **sheet ink** `#1C1A17` is for something you read or pay for: a paywall, a plan, a proposed agent. One sheet, not a stack of tickets.
- **Primary** is an ink fill with near-black type. New chat, Send, Get started, and Upgrade use it.
- **Ready** `#1F6B45` is a rare status word. It is not a second brand color.
- Costume hexes stay in CSS only as the dot. No wash, no flood, no sticker.

No grain overlay. No hard offset shadow. No tilt. No acid orange. No stub yellow.

## Type

IBM Plex Sans for UI and transcript. IBM Plex Mono for model ids and credit figures. IBM Plex Sans Devanagari stays beside the sans for Hindi and Hinglish.

The wordmark is “Maya” in Plex at the landing size, and a 28px ink square with a night “M” on the rail. No italic display face.

## Shell

Signed-in pages are three regions:

1. A **72px rail**: mark, Home, Explore, Create, and the account control.
2. A **286px chats column**: New chat, search, one row per recent thread (title, time, agent name), credits with the reset time.
3. The **stage**.

Collapse hides the chats column and leaves the rail. Under 1024px the rail and chats column live in the drawer. Chat keeps a menu button in its header. There is no bottom tab bar.

The active chat row is a raised fill. It does not wear a costume stripe.

## Chat

Header: name, category, tagline, **Chat | About**, model, credits.

Transcript sits in a column about 46rem wide. The user’s turn is a raised bubble on the right. The agent’s turn is text on the left, name in small type with the costume dot. Tools and Maya’s handoff sit in a panel under her reply: **Chat with {name}** is the primary button.

About replaces the transcript in the same stage. Escape or Chat returns to the thread. It is not a modal ticket.

The composer is a dark well with a hairline and an ink send square. Enter sends. Shift+Enter breaks the line. The model control lives in the header.

## Directory, landing, and forms

Explore and the public company are rows or quiet cards: portrait circle, name, plan as words, one line. Categories stay Work, Learning, Advice, Debate, Everyday, Play.

Landing is the same stage color, a short headline, an ink **Get started**, and the company list. Login is a dark panel. Studio and settings are dark forms with hairline fields; color is a dot plus a selected border, not a flood. Plan is a sheet per tier with an ink upgrade button.

## Voice

Buttons say the same things as before: Home, Explore, Create agent, Profile, Chat, Model, Credits, Plan. Agent replies stay in character. The chrome does not.
