# [MAYA-101] Inverted Conversation History Limit Loads Oldest Messages Instead of Newest

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-101 |
| **Issue Type** | 🐛 Bug |
| **Status** | Open / Ready for Review |
| **Priority** | 🔴 P0 (Blocker) |
| **Severity** | Critical |
| **Component** | Backend (Chat Context Loader) & Frontend (House SSR) |
| **Affects Versions** | Web MVP (PR2 / PR3) |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Core Backend Pod |

---

## 1. Summary
When loading conversation history for both the AI streaming route (`POST /api/chat`) and the initial Server-Side Render (SSR) of the House page (`/chat/[agentId]`), the query sorts by `created_at ASC` and applies `.limit(HISTORY_WINDOW)` (20 messages).

In conversations with more than 20 messages, this query returns the **first 20 messages ever sent** (from message 1 to 20), omitting the latest messages (e.g., messages 21 through 60). As a result, the LLM suffers from complete conversational amnesia regarding recent discussion, and the UI fails to render recent messages upon page reload.

---

## 2. Code Reference
- [`apps/web/lib/chat/load-context.ts:131-137`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/load-context.ts#L131-L137):
  ```ts
  const messagesResult = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversation.id)
    .in("role", ["user", "assistant"])
    .order("created_at", { ascending: true })
    .limit(HISTORY_WINDOW);
  ```
- [`apps/web/lib/house/load.ts:142-148`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/house/load.ts#L142-L148):
  ```ts
  const messagesResult = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", summary.id)
    .in("role", ["user", "assistant"])
    .order("created_at", { ascending: true })
    .limit(HISTORY_WINDOW);
  ```

---

## 3. Steps to Reproduce
1. Sign in to Maya Chat and open a thread with Marcus or Dr. Priya.
2. Send 25 consecutive back-and-forth messages (total message count in DB reaches 50 turns).
3. On turn 26, ask the agent: *"What did I just ask you in my previous sentence?"*
4. Refresh the page in the browser (`Cmd + R` / `F5`).

---

## 4. Expected Behavior
- The LLM should receive the most recent 20 messages as conversational context and accurately answer the user's question about recent turns.
- After page refresh, the transcript should render the latest messages up to the current turn.

---

## 5. Actual Behavior
- The LLM receives messages 1 through 20 (the oldest opening exchanges). It hallucinates or states that it has no record of the recent question.
- After page refresh, the user only sees the opening 20 messages from the start of the chat; the last 30 messages disappear from the screen until subsequent messages are sent.

---

## 6. Root Cause Analysis (RCA)
PostgreSQL evaluates `.order("created_at", { ascending: true }).limit(20)` by ordering from oldest to newest first, then truncating the result set after the first 20 records. To retrieve the 20 most recent messages, the query must order descending (`DESC`), take 20 rows, and then reverse the array to restore chronological order for the model.

---

## 7. Proposed Solution & Code Fix

### In `apps/web/lib/chat/load-context.ts`:
```diff
-   const messagesResult = await supabase
-     .from("messages")
-     .select("role, content")
-     .eq("conversation_id", conversation.id)
-     .in("role", ["user", "assistant"])
-     .order("created_at", { ascending: true })
-     .limit(HISTORY_WINDOW);
+   const messagesResult = await supabase
+     .from("messages")
+     .select("role, content")
+     .eq("conversation_id", conversation.id)
+     .in("role", ["user", "assistant"])
+     .order("created_at", { ascending: false })
+     .limit(HISTORY_WINDOW);

    if (messagesResult.error) {
      return { ok: false, reason: "dropped" };
    }

    const history: Array<{ role: "user" | "assistant"; content: string }> = [];
-   for (const row of messagesResult.data ?? []) {
+   const rows = (messagesResult.data ?? []).reverse();
+   for (const row of rows) {
      if (row.role === "user" || row.role === "assistant") {
        history.push({ role: row.role, content: row.content });
      }
    }
```

Apply the identical `.order("created_at", { ascending: false }).limit(HISTORY_WINDOW)` and `.reverse()` pattern in `apps/web/lib/house/load.ts`.

---

## 8. Acceptance Criteria (AC)
- [ ] In any conversation with >20 turns, the LLM response context contains the immediate preceding turns.
- [ ] Hard page refresh on `/chat/[agentId]?conversationId=...` displays the most recent turns.
- [ ] Unit test in `load-context.test.ts` asserts that given 30 mock DB message records, `loadConversationHistory` returns turns 11 through 30 in chronological order.
