---
name: feature-browser-check
description: >
  While implementing or fixing a user-facing feature, open it in a browser
  already signed in as the project's test user. Add any data that screen
  needs to the test seed, and add one Playwright spec when the repository
  already has a suite.
---

# Feature browser check

Exercise a user-facing change as the project's test user, in a browser that is already signed in. Session setup belongs to `agent-test-login`.

## When to use

Use this skill while implementing or fixing a screen, flow, or visual state a person sees.

A change with no user-facing screen is finished without this pass.

## 1. Open a signed-in browser

Read the testing doc `agent-test-login` maintains. When the doc or the session is missing, run that skill first. When that skill is not installed, stop and say the logged-in session is missing.

Start the app the way the repo documents. Open the feature on the doc's app URL with the session already loaded.

Done when the doc's signed-in check is visible on the way to the feature. A login page means the session is stale: refresh it with the doc's command and open the feature again.

## 2. Make the feature reachable

The seeded user can reach the new screen without a manual setup step. Add rows this screen needs to the seed that doc names, in this change. A finished setup in the seed stays finished.

Give each new control the visible label a person uses. Find it by that role and name. Add `data-testid` when two controls on the screen share a name.

Done when the seeded user lands on the feature from the app, and the seed change is in the same working tree as the feature.

## 3. Walk the change

In the signed-in browser, walk the success path. Also walk an empty state and an error state when this change has them.

Done when each of those states was visible, and the reply names the URL and what was on screen. Leave the password and cookie values out of the reply.

## 4. Add a Playwright spec

When the repo has a Playwright config or an end-to-end script, add one spec for the path you walked. Load the same session file the testing doc names. Match the style of the existing specs, then run that spec.

When the repo has no Playwright suite, the browser pass is the record.

Done when that spec passes, or the repo has no suite and the walk in step 3 succeeded.
