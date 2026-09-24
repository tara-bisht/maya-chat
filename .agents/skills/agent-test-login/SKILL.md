---
name: agent-test-login
description: >
  When a browser automation run must be signed in: setting up a project for
  Playwright or Chrome DevTools MCP, opening the app in those tools, or a
  fresh window landing on login. Create one local test user, save the
  session, and start both tools from it.
---

# Agent test login

Give Playwright and Chrome DevTools MCP one local test user and a saved session. A fresh browser then opens the app already signed in.

The app's own API still runs as that user. External sign-in providers, outbound email, and payment providers stay on the stub the app uses for local development.

Project facts live in the repository. This skill owns the session setup. Use the paths below only when the repo has none yet.

## When to use

Use this skill when any of these is true:

- The project is being prepared for Playwright or Chrome DevTools MCP
- An agent is about to open an app that has a login wall
- The opened page is the login page
- The user asks for a dummy, test, or agent login

A public page with no signed-in state needs no session. Done when the page has nothing to sign in.

## 1. Read the contract

Look for the test user in this order: the doc `AGENTS.md` points at, `docs/agent-testing.md`, then a Playwright `storageState` or global setup already in the repo.

When one exists, use that user, session path, refresh command, app URL, and signed-in check. Create a second user only when the repo has none.

Done when you can name the user, the session file, and the check that proves the session works, or you have confirmed the repo has no contract yet.

## 2. Write the contract

When the repo has no contract, add `docs/agent-testing.md` and point `AGENTS.md` at it when that file exists. Use these defaults:

```text
App URL: http://127.0.0.1:<the repo's dev port>
Test user: agent@localhost
Secret: AGENT_TEST_PASSWORD in the repo's gitignored env file
Flag: AGENT_TEST_LOGIN=1 in that same env file
Seed: <the repo's seed command>
Refresh: <the repo's package runner> scripts/agent-session.mjs
Session file: playwright/.auth/agent.json
Chrome profile: .agent-browser/chrome-profile
Signed-in check: <a heading or URL that only a signed-in user sees>
```

Ignore `playwright/.auth/` and `.agent-browser/` when those entries are missing. Keep the password, the flag, and the session file in gitignored paths. The session file is a credential. Report its path. Leave the password and cookie values out of replies and logs.

Done when the doc names every line above and Git ignores the session file and the Chrome profile.

## 3. Seed the user

Create the user in the store the local app reads. Use the repo's seed. Add a seed when the repo has none.

Include the profile rows the home screen needs, with setup already finished, so the first page is the product.

Done when the seeded user exists in the local store and a signed-in home does not send the browser into onboarding.

## 4. Mint the session

Use the first path the app already allows:

1. A local password or test login. The refresh script submits it for the seeded user.
2. The auth library's local session API. The script calls it and sets the cookie or storage entry the app's next request already checks.
3. A dev-only route at `/dev/agent-login`. Add it so it creates that session and redirects to the signed-in home. The route responds only when `AGENT_TEST_LOGIN=1` and the host is `localhost` or `127.0.0.1`. Deployed environments leave the variable unset.

Prefer the cookie the server already accepts, and give it an expiry. A cookie with no expiry disappears from the Chrome profile when the refresh script exits. Playwright's storage-state file still restores it. A value that lives only in `sessionStorage` is missing from the next window.

Done when a request as this user reaches a signed-in page, and the route or script is absent from deployed config.

## 5. Save the session

Add `scripts/agent-session.mjs` when the repo has no refresh command. Start the app the way the repo documents, then run the script. Fill in the login step from step 4, and wait for the doc's signed-in check, before trusting it. The script fails when that check is not visible.

```js
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const appUrl = process.env.AGENT_APP_URL;
const loginPath = process.env.AGENT_LOGIN_PATH ?? "/dev/agent-login";
const sessionPath = process.env.AGENT_SESSION_PATH ?? "playwright/.auth/agent.json";
const profileDir = process.env.AGENT_CHROME_PROFILE ?? ".agent-browser/chrome-profile";

fs.mkdirSync(path.dirname(sessionPath), { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(new URL(loginPath, appUrl).toString(), { waitUntil: "load" });
// Password apps: submit the repo's login form here instead of the dev route.
// Then wait for the signed-in check named in the testing doc.
await page.getByRole("heading", { name: "<signed-in check>" }).waitFor();
await context.storageState({ path: sessionPath });
await browser.close();

const state = JSON.parse(fs.readFileSync(sessionPath, "utf8"));
const chrome = await chromium.launchPersistentContext(profileDir, {
  channel: "chrome", // omit this option when only bundled Chromium is installed
});
await chrome.addCookies(state.cookies);
for (const origin of state.origins ?? []) {
  const originPage = await chrome.newPage();
  await originPage.goto(origin.origin);
  await originPage.evaluate((items) => {
    for (const { name, value } of items) localStorage.setItem(name, value);
  }, origin.localStorage);
  await originPage.close();
}
await chrome.close();
```

Use the repo's Playwright dependency. When the repo has none, install `@playwright/test` as a dev dependency with the repo's package manager. Use bundled Chromium for the profile when Google Chrome is not installed, and point Chrome DevTools MCP at that same browser.

Close any Chrome that has the profile open, run the refresh command, and start the browser again afterward. One process owns the profile at a time.

Done when the session file exists and the script's signed-in check passed.

## 6. Start the browser

Playwright tests and scripts load the session file:

```js
storageState: "playwright/.auth/agent.json"
```

Match a `storageState` path the repo already uses.

Playwright MCP starts from that file:

```text
--isolated --storage-state=<session file>
```

When the connected server has the storage capability, restore the same file with its storage-state tool.

Chrome DevTools MCP uses the profile the script wrote:

```text
--user-data-dir=<repo>/.agent-browser/chrome-profile
```

Leave `--isolated` off for that server. Put these arguments in the project MCP config when the repo has one. Leave user-level MCP config unchanged.

Done when the tool that will open the app is pointed at the session file or the Chrome profile.

## 7. Prove it

Start the app the way the repo documents. Open the doc's app URL in that browser.

Done when the signed-in check is visible. A login page means the session is stale: rerun the refresh command and open the URL again.
