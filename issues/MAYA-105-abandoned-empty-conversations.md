# [MAYA-105] Premature Conversation Creation Leaves Orphaned Empty Threads in DB & UI

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-105 |
| **Issue Type** | 🐛 Bug / UX & Data Hygiene |
| **Status** | Open / Ready for Review |
| **Priority** | 🟡 P2 (Medium) |
| **Severity** | Moderate |
| **Component** | Frontend (House View) & Backend (Conversations API) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
When a user sends their first message to an agent from an uninitialized view (`/chat/[agentId]`), the client performs a two-step operation:
1. It calls `POST /api/conversations` to create a blank conversation row (`title: ""`).
2. It calls `sendMessage({ text })` to send the prompt to `POST /api/chat`.

If step 2 fails (e.g., HTTP 429 daily limit reached, OpenRouter outage, network drop, user closes tab), the empty conversation record remains in `public.conversations`. 

Furthermore, `GET /api/conversations` selects all user conversations with no filter on message count. As users click around or encounter quota limits, their sidebar rail becomes cluttered with empty, abandoned "New chat" ghost threads that have 0 messages.

---

## 2. Code Reference
- [`apps/web/components/house/house-view.tsx:77-97`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/components/house/house-view.tsx#L77-L97):
  ```ts
  if (!conversationIdRef.current) {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agentId: house.agent.id }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.id) {
      setWellError(payload.error === "quota" ? "quota" : "dropped");
      return;
    }
    conversationIdRef.current = payload.id;
    window.history.replaceState(null, "", houseHref(house.agent.id, payload.id));
  }
  setWellError(null);
  await sendMessage({ text });
  ```
- [`apps/web/app/api/conversations/route.ts:43-52`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/conversations/route.ts#L43-L52):
  ```ts
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      agent_id: loaded.agent.id,
      title: "",
    })
    .select("id")
    .single();
  ```

---

## 3. Steps to Reproduce
1. Log in with a user that has reached their daily message cap (or simulate an API failure on `/api/chat`).
2. Navigate to Marcus (`/chat/00000000-0000-0000-0000-000000000001`).
3. Type a message and hit Enter.
4. The message fails to send with "Daily limit reached".
5. Look at the database `conversations` table or reload the page and inspect the Chats list.
6. Observe that a conversation row was created despite 0 messages being stored.

---

## 4. Expected Behavior
- A conversation should only be created when the first user message is successfully accepted and persisted.
- Unsent or aborted messages should not leave empty conversation artifacts in the user's thread list.

---

## 5. Actual Behavior
- Multiple empty conversation records accumulate with `title = ""` and no messages.
- The UI displays repeated "New chat" entries in the left rail that lead to empty pages.

---

## 6. Proposed Solution & Architecture Options

### Option A (Recommended): Create Conversation Lazily inside `POST /api/chat`
Instead of having the client make a separate preparatory `POST /api/conversations` call:
1. Allow `conversationId` in `chatRequestSchema` to be optional (or pass `null`).
2. If `conversationId` is null, `POST /api/chat` creates the conversation row and inserts the first message in the same server handler after quota verification passes.
3. Return the new `conversationId` to the client in stream headers or metadata.

### Option B: Filter Empty Conversations in Query
In `loadHouse()` and `GET /api/conversations`, filter out conversations that have 0 messages:
```sql
SELECT c.*
FROM public.conversations c
WHERE c.user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.messages m WHERE m.conversation_id = c.id
  );
```

---

## 7. Acceptance Criteria (AC)
- [ ] Attempting to chat while offline or over quota does not create an empty conversation row.
- [ ] Conversations with 0 messages do not appear in the sidebar/thread list.
- [ ] No ghost threads appear upon page reload.
