# [MAYA-110] Unbounded, Unpaginated Conversation Loading per User

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-110 |
| **Issue Type** | ⚡ Performance & Scalability |
| **Status** | Open / Ready for Review |
| **Priority** | 🟢 P3 (Low) |
| **Severity** | Minor |
| **Component** | Backend / House & Conversations API |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
Both the House page loader (`loadHouse()`) and the conversation listing endpoint (`GET /api/conversations`) execute unconstrained `SELECT` queries across `public.conversations` with no `LIMIT` or pagination:

```ts
supabase
  .from("conversations")
  .select("id, agent_id, title, updated_at")
  .eq("user_id", input.userId)
  .order("updated_at", { ascending: false });
```

While acceptable for brand-new accounts with 1–5 conversations, power users who maintain 50–500 threads over months of usage will experience progressive latency degradation, as every page click or thread switch forces the server to serialize and transmit their entire historical conversation index.

---

## 2. Code Reference
- [`apps/web/lib/house/load.ts:72-76`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/house/load.ts#L72-L76):
  ```ts
  supabase
    .from("conversations")
    .select("id, agent_id, title, updated_at")
    .eq("user_id", input.userId)
    .order("updated_at", { ascending: false })
  ```
- [`apps/web/app/api/conversations/route.ts:84-90`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/app/api/conversations/route.ts#L84-L90):
  ```ts
  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .eq("agent_id", agentId)
    .order("updated_at", { ascending: false });
  ```

---

## 3. Steps to Reproduce
1. Generate 500 conversation records for a test user.
2. Load `/chat/[agentId]`.
3. Observe payload size and database query execution timing.

---

## 4. Expected Behavior
- The UI displays recent conversations bounded to a sensible ceiling (e.g., top 30–50 threads per agent/user), with cursor-based pagination or infinite scrolling for older archives.

---

## 5. Actual Behavior
- The entire conversation table partition for that user is scanned and returned in a single unpaginated block.

---

## 6. Proposed Solution & Architecture

Add a reasonable default limit (e.g. 50 threads) in `apps/web/lib/house/load.ts`:
```diff
  supabase
    .from("conversations")
    .select("id, agent_id, title, updated_at")
    .eq("user_id", input.userId)
    .order("updated_at", { ascending: false })
+   .limit(50);
```

For `GET /api/conversations`, support standard cursor-based pagination parameters:
```ts
const limit = Math.min(Number(searchParams.get("limit") ?? 30), 100);
const before = searchParams.get("before"); // ISO timestamp or cursor
```

---

## 7. Acceptance Criteria (AC)
- [ ] Conversation listings are capped with a sensible upper bound on initial page render.
- [ ] Query latency remains constant under heavy account usage.
