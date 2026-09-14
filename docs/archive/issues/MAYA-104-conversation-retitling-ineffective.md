# [MAYA-104] Auto-Retitling Logic Fails When Conversation Title Defaults to 'New Chat'

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-104 |
| **Issue Type** | 🐛 Bug |
| **Status** | Done |
| **Priority** | 🟡 P2 (Medium) |
| **Severity** | Minor (UX Friction) |
| **Component** | Backend / Conversation Persistence |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
The conversation retitling function (`retitleConversation`) intended to derive a meaningful thread title from the user's first message (e.g., *"How do I solve quadratic equations?"* -> *"How do I solve quadratic equations"*) fails to update the title whenever the conversation was initialized with default values.

In `public.conversations`, the column definition has:
```sql
title text not null default 'New Chat'
```
In `retitleConversation()`, the code checks:
```ts
const nextTitle = input.currentTitle.trim()
  ? input.currentTitle
  : titleFromFirstMessage(input.firstUserText);
```
Because `"New Chat"` is a non-empty string, `input.currentTitle.trim()` evaluates to truthy, preserving `"New Chat"` forever and never applying `titleFromFirstMessage()`.

---

## 2. Code Reference
- [`apps/web/lib/chat/persist.ts:44-60`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/persist.ts#L44-L60):
  ```ts
  export async function retitleConversation(
    supabase: SupabaseClient<Database>,
    input: { conversationId: string; currentTitle: string; firstUserText: string },
  ) {
    const nextTitle = input.currentTitle.trim()
      ? input.currentTitle
      : titleFromFirstMessage(input.firstUserText);

    const { error } = await supabase
      .from("conversations")
      .update({ title: nextTitle })
      .eq("id", input.conversationId);

    if (error) {
      throw new Error("Could not name the night.");
    }
  }
  ```
- [`supabase/migrations/20260910000001_init_schema.sql:56`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L56):
  ```sql
  title text not null default 'New Chat',
  ```
- [`packages/shared/src/chat.ts:8`](file:///Users/kamalbisht/Documents/maya-chat/packages/shared/src/chat.ts#L8):
  ```ts
  export const OPEN_NIGHT_TITLE = "New chat";
  ```

---

## 3. Steps to Reproduce
1. Start a conversation through any pathway where `title` defaults to `"New Chat"` (e.g. database seeds, mobile clients, direct SQL, or API calls omitting `title: ""`).
2. Send a first message: *"Can you explain Newton's third law of motion?"*
3. Check the thread rail on the left or inspect the database row for `conversations.title`.

---

## 4. Expected Behavior
- The conversation title should automatically update from `"New Chat"` to `"Can you explain Newton's third law of motion?"` (truncated to `CONVERSATION_TITLE_MAX`).

---

## 5. Actual Behavior
- The title remains statically set to `"New Chat"`.

---

## 6. Root Cause Analysis (RCA)
The truthiness check treats any non-empty string as an intentional user-chosen title, failing to distinguish between default placeholders (`"New Chat"`, `"New chat"`, `""`) and custom user-edited titles.

---

## 7. Proposed Solution & Code Fix

Define a helper to detect whether a title is a default/placeholder in `packages/shared/src/chat.ts` or directly in `apps/web/lib/chat/persist.ts`:

```ts
function isDefaultConversationTitle(title: string): boolean {
  const normalized = title.trim().toLowerCase();
  return !normalized || normalized === "new chat";
}

export async function retitleConversation(
  supabase: SupabaseClient<Database>,
  input: { conversationId: string; currentTitle: string; firstUserText: string },
) {
  if (!isDefaultConversationTitle(input.currentTitle)) {
    return; // User has already custom-named this conversation.
  }

  const nextTitle = titleFromFirstMessage(input.firstUserText);

  const { error } = await supabase
    .from("conversations")
    .update({ title: nextTitle })
    .eq("id", input.conversationId);

  if (error) {
    throw new Error("Could not name the night.");
  }
}
```

---

## 8. Acceptance Criteria (AC)
- [x] A new conversation initialized with `""`, `"New Chat"`, or `"New chat"` is renamed based on the first user message.
- [x] An existing conversation with a user-edited title (e.g., `"Physics Homework"`) is not overwritten on subsequent messages.
- [x] Added unit test for `isDefaultConversationTitle` covering case-insensitivity and empty strings.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid latent bug; not reproducible on the current web path |
| **Status** | Done |
| **Engineering priority** | P2 |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |
| **Shipped** | [#7](https://github.com/tara-bisht/maya-chat/pull/7) on `main` |

**Comment:** The analysis of `retitleConversation` is right, but the web client does not hit it today. `POST /api/conversations` inserts `title: ""`. Empty trim is falsy, so `titleFromFirstMessage` runs on the first send. QA’s repro (“any pathway where title defaults to `'New Chat'`”) is SQL default, a future mobile omit, or any client that stores the placeholder.

Three strings are in play and they do not match:

- Column default: `'New Chat'`
- UI constant `OPEN_NIGHT_TITLE`: `"New chat"`
- API insert: `""`

Treat `""` / `"New chat"` / `"New Chat"` as untitled (case-insensitive). Do not overwrite a user-edited title such as `"Physics Homework"`. Optional follow-up: change the column default to `''` so API and DB agree.

Tiny hardening. Ship with the hotfix so PR6 (mobile) does not inherit the footgun. The current signed-in web journey is fine.
