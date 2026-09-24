---
name: visual-decision
description: >
  When a person must decide and the choice would be hard to scan in chat:
  several options or a long approval, or two or more UI directions. Publish
  one local HTML page that shows the choices visually, with a basic mockup
  for a UI choice, and a short reply they paste back.
---

# Visual decision

Publish one HTML page when a person needs to choose and reading the choice in chat would be the hard part. Wait for their reply before implementing it.

## When to use

Use the page when any of these is true:

- Three or more options
- Each option needs more than one short sentence to judge
- The choice is between two or more user interfaces

Ask in chat when the choice is yes/no, or two options that each fit on one line and neither is a UI.

Done when the question is either a page or a short chat message.

## Build the page

Copy this skill's `assets/template.html` to `/tmp/visual-decision-<slug>.html`.

Replace the JSON inside `#decision`. Replace or remove the example `<template id="mock-...">` elements. Leave the page CSS and the script as they are.

The example file is one settings-layout question. Match that shape:

- `title` and `intro` are one sentence each
- `sections` holds the questions on this page. Use one section. Add another only when the sections are one approval and still fit on one screen
- `sections[].id` is a short token (`layout`). It is the key in the reply
- `sections[].prompt` is the question
- `sections[].select` is `one` or `many`
- `options[].id`, `title`, and `summary`. The summary is one sentence
- `options[].recommended` is optional. At most one option per `one` section
- `options[].detail` is optional extra, hidden until the person opens it
- `options[].mock` is the id of a `<template id="mock-<id>">` when the option is a UI

For a UI choice, give every option in that section a mock. Use the same sample names and text in each mock, and draw only the difference being chosen (layout, hierarchy, or density) as a simple static screen. A `<style>` inside the template is safe: the page mounts each mock in a shadow root.

Done when the file opens without a JSON error, every option shows its title and summary, every UI option shows a mock, and the feedback box lists each section id.

## Hand it over

Open the file in the default browser. On macOS that is `open <path>`. Tell the person the file path. The page is one file with no network, so they can open it or send that file.

Ask them to choose on the page and paste the feedback box back.

Done when the browser is open and implementation has not started. A reply that still contains `(none)` for a section is not a decision. Wait for a reply that names an option for every section.

## Read the reply

```text
layout: sidebar
density: comfortable

Notes: keep Save at the bottom of the open section
```

A `many` section lists ids separated by commas. Treat `Notes` as a constraint on the chosen options.
