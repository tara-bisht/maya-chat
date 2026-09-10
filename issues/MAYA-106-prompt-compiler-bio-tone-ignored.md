# [MAYA-106] Custom Tone Sliders & User Bio Ignored During Prompt Construction

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-106 |
| **Issue Type** | 🏗️ Architecture & Feature Incompleteness |
| **Status** | Done |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (Core Value Proposition Undermined) |
| **Component** | Shared Domain (`@maya/shared`) & API (`POST /api/chat`) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod / Prompt Engineering |

---

## 1. Summary
A key architectural pillar of Maya Chat is prompt compilation: customizing character interactions based on:
1. User profile context ([`CONTEXT.md:108`](file:///Users/kamalbisht/Documents/maya-chat/CONTEXT.md#L108): *"Every agent is told the bio."*)
2. Tone sliders configured in Studio ([`docs/curated-agents.md:505`](file:///Users/kamalbisht/Documents/maya-chat/docs/curated-agents.md#L505): *"Sliders compile into imperative rules for custom Studio agents only."*)
3. Tool policy injection/stripping based on plan entitlements.

However, the planned `compilePrompt()` function was never implemented. Instead, `POST /api/chat` directly invokes a primitive string helper:
```ts
system: systemPromptWithLanguage(
  agentLoad.agent.system_prompt,
  agentLoad.agent.language_preset,
)
```
Consequently:
- Custom agents created in Studio completely ignore the user's `warmth`, `directness`, and `humor` slider settings.
- Agents are never informed of the user's `global_bio` or `display_name` set on `/settings`.
- The core marketing promise ("give your AI personality and character tailored to your context") is non-operational for custom characters.

---

## 2. Code Reference
- [`apps/web/app/api/chat/route.ts:122-125`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/chat/route.ts#L122-L125):
  ```ts
  system: systemPromptWithLanguage(
    agentLoad.agent.system_prompt,
    agentLoad.agent.language_preset,
  ),
  ```
- [`packages/shared/src/chat.ts:111-122`](file:///Users/kamalbisht/Documents/maya-chat/packages/shared/src/chat.ts#L111-L122):
  ```ts
  export function systemPromptWithLanguage(
    basePrompt: string,
    languagePreset: string | null | undefined,
  ): string {
    const preset = parseLanguagePreset(languagePreset);
    if (preset === "en") {
      return basePrompt;
    }
    const label =
      LANGUAGE_PRESETS.find((item) => item.id === preset)?.label ?? preset;
    return `${basePrompt.trim()}\n\nLanguage: reply in ${label}.`;
  }
  ```
- Compare with specification in [`docs/implementation-plan.md:113-124`](file:///Users/kamalbisht/Documents/maya-chat/docs/implementation-plan.md#L113-L124) (PR3: `compilePrompt()`).

---

## 3. Steps to Reproduce
1. In `/settings`, set:
   - Display Name: *"Alice"*
   - Bio: *"I am an Olympic rowing coach training for the 2028 games."*
2. In `/studio/new`, create a custom agent named *"Coach"*:
   - Warmth: `0.1` (cold)
   - Directness: `1.0` (brutal)
   - Humor: `0.0` (serious)
   - Backstory: *"You are an assistant."*
3. Save the agent and start a chat with Coach.
4. Ask: *"What do you know about me, and what is your attitude?"*
5. Inspect the system prompt sent to OpenRouter in network logs or backend debug console.

---

## 4. Expected Behavior
- The system prompt contains:
  1. Base backstory.
  2. Imperative tone instructions compiled from sliders (e.g., `Tone directives: Extremely direct, blunt, low warmth, zero humor.`).
  3. User context block: `<user_profile>\nName: Alice\nBio: I am an Olympic rowing coach...\n</user_profile>`.
- The agent addresses Alice and acts with extreme directness and cold demeanor.

---

## 5. Actual Behavior
- The system prompt sent to OpenRouter is literally: `"You are an assistant."`
- The model knows nothing about Alice, her rowing bio, or the tone sliders.

---

## 6. Proposed Solution & Architecture

Implement `compilePrompt()` in `packages/shared/src/prompt.ts` with unit tests covering merge order:

```ts
export type CompilePromptInput = {
  isCurated: boolean;
  basePrompt: string;
  languagePreset?: string | null;
  tone?: ToneSettings | null;
  userProfile?: {
    displayName?: string | null;
    bio?: string | null;
  } | null;
  toolsAllowed?: string[];
  toolsEnabled?: string[];
};

export function compilePrompt(input: CompilePromptInput): string {
  const sections: string[] = [input.basePrompt.trim()];

  // 1. Language directive
  const preset = parseLanguagePreset(input.languagePreset);
  if (preset !== "en") {
    const label = LANGUAGE_PRESETS.find((p) => p.id === preset)?.label ?? preset;
    sections.push(`Language Directive:\nReply in ${label}.`);
  }

  // 2. Tone directives (applied ONLY to custom agents, curated prompts are pre-tuned)
  if (!input.isCurated && input.tone) {
    sections.push(compileToneDirectives(input.tone));
  }

  // 3. User Profile injection
  if (input.userProfile?.bio || input.userProfile?.displayName) {
    const parts: string[] = [];
    if (input.userProfile.displayName) parts.push(`Name: ${input.userProfile.displayName}`);
    if (input.userProfile.bio) parts.push(`Bio: ${input.userProfile.bio}`);
    sections.push(`User Context:\n${parts.join("\n")}`);
  }

  return sections.join("\n\n");
}
```

Then in `apps/web/lib/chat/load-context.ts`, load the user's profile (`display_name`, `global_bio`) and compile the final prompt before calling `streamText`.

---

## 7. Acceptance Criteria (AC)
- [ ] Custom agent chat prompts reflect user-adjusted tone sliders.
- [ ] User's bio from `/settings` is reflected in conversation context across all agents.
- [ ] Curated agents do not have tone sliders overlaid (as their prompts are already baked).
- [ ] Unit tests in `@maya/shared` assert prompt merge order and slider handling.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid product gap — incomplete PR3, not a PR2 regression |
| **Status** | Done |
| **Engineering priority** | P1 (unchanged; next feature slice, not the P0 hotfix) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |
| **Shipped** | [#9](https://github.com/tara-bisht/maya-chat/pull/9) on `main` (replay of stacked #8) |

**Comment:** Confirmed. `POST /api/chat` builds the system string with `systemPromptWithLanguage(agent.system_prompt, language_preset)` only. There is no `compilePrompt()`. Language overlay **does** work. Tone sliders and the profile bio do not.

This is not a silent break of a shipped compiler — the compiler was never written. PR2b explicitly left the `<user_profile>` block out. PR3’s exit is compiler tests plus “custom agent from Studio chats with its slider tone.” Studio already persists `tone_settings`; `/settings` already persists `display_name` and `global_bio`. The UI shipped ahead of the compiler, so sliders and bio look broken. That is a real product lie for anyone who uses Studio.

**Not the P0 hotfix.** Next feature slice after 101–105. Merge order stays technical-plan §5: identity → tone overlay (**custom agents only**; curated prompts are pre-tuned) → language → `<user_profile>` → memories (empty until PR4) → tool policy (omit tools the plan does not allow). Put it in `@maya/shared` with Vitest, not a one-off concat in the route. Do not implement QA’s sketch as the final compiler — use it as a starting outline, including the curated-vs-custom split they already have.
