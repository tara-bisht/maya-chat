# [MAYA-111] `chat_agent_prompt` RPC Leaks Any Public Custom System Prompt to Any Authenticated User

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-111 |
| **Issue Type** | 🔴 Security / Prompt-IP Leak |
| **Status** | Done |
| **Priority** | 🔴 P0 (Critical) |
| **Severity** | Critical (IP theft, trust breach) |
| **Component** | Database (RLS / RPC) & API (Chat Prompt) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Core Backend Pod |

---

## 1. Summary
`public.chat_agent_prompt(p_agent_id)` returns `system_prompt` for **any** live public custom agent to **any** authenticated caller. The House UI correctly hides `backstory` from strangers (`public-agent.ts` nulls it unless `canEdit`, `character-sheet.tsx` only renders when `canEdit`), but an attacker can bypass the UI entirely by calling the RPC from the browser console and reading a stranger's private Studio prompt verbatim. This violates `CONTEXT.md:20` ("backstory stays server-side for non-owners").

---

## 2. Code Reference
- [`supabase/migrations/20260910061406_chat_agent_prompt.sql:6-27`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910061406_chat_agent_prompt.sql#L6-L27):
  ```sql
  create or replace function public.chat_agent_prompt(p_agent_id uuid)
  ...
  security definer
  ...
    select a.system_prompt
    from public.agents as a
    where a.id = p_agent_id
      and (select auth.uid()) is not null
      and a.archived_at is null
      and (
        a.is_curated = true
        or a.user_id = (select auth.uid())
        or a.is_public = true   -- <--- any authed user reads any public prompt
      );
  ...
  grant execute on function public.chat_agent_prompt(uuid) to authenticated, service_role;
  ```
- [`apps/web/lib/house/public-agent.ts:66`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/house/public-agent.ts#L66): nulls `backstory` unless `canEdit` (UI guard, bypassed by RPC).
- [`apps/web/components/house/character-sheet.tsx:74-76`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/components/house/character-sheet.tsx#L74-L76): only renders `backstory` when `canEdit`.
- [`apps/web/lib/chat/load-context.ts:37`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/load-context.ts#L37): server-side `rpc("chat_agent_prompt")` is the legitimate chat-path caller.

---

## 3. Steps to Reproduce
1. As User A, create a public custom agent in Studio with a distinctive secret backstory (e.g. `"My secret recipe is X"`).
2. As User B (different account, signed in), open DevTools console on any authenticated page.
3. Run:
   ```ts
   const { data } = await supabase.rpc("chat_agent_prompt", { p_agent_id: "<UserA-public-agent-uuid>" });
   console.log(data);
   ```
4. Observe User A's full `system_prompt` returned to User B.

---

## 4. Expected Behavior
- Strangers chatting with a public custom agent get in-character replies (server compiles the prompt internally) but can never read the raw `system_prompt` via Data API.
- Only the owner (via `own_custom_agent_sheet`) and the server-side chat path can resolve a custom prompt. Curated prompts stay server-side per column grants.

---

## 5. Actual Behavior
- Any signed-in user can read any live public custom prompt in one RPC call. UI hiding is cosmetic.

---

## 6. Root Cause Analysis (RCA)
The RPC conflates two authorizations: "may chat with this agent" (curated OR owner OR public) with "may read this agent's system prompt" (should be curated-chat-path OR owner only). Granting `EXECUTE ... TO authenticated` with the chat-wide predicate exports the prompt-read capability to the browser.

---

## 7. Proposed Solution & Code Fix
Do not ship QA sketch as-is. Options (pick one):
- **A (preferred):** `REVOKE EXECUTE ... FROM authenticated`, keep `service_role` only; chat route calls via service client or definer chained from user-JWT server client that the browser cannot invoke directly. Owner reads stay on `own_custom_agent_sheet`.
- **B:** Split predicate: `authenticated` branch returns prompt only when `is_curated = true`; owner branch requires `user_id = auth.uid()`; public-chat streaming resolves prompt server-side without exposing a public RPC.

```sql
revoke all on function public.chat_agent_prompt(uuid) from authenticated;
grant execute on function public.chat_agent_prompt(uuid) to service_role;
```

---

## 8. Acceptance Criteria (AC)
- [x] Stranger `rpc("chat_agent_prompt", {public custom id})` as `authenticated` is denied / returns NULL.
- [x] Owner `own_custom_agent_sheet` still returns own prompt for Studio edit.
- [x] Curated + owned + public chat streaming still works via server path.
- [ ] RLS regression test covers stranger/owner/curated matrix. (Manual: `supabase/tests/grants_prompt_quota.sql`; not in CI.)

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid security bug |
| **Status** | Done |
| **Engineering priority** | P0 (unchanged) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |
| **Shipped** | [#15](https://github.com/tara-bisht/maya-chat/pull/15) on `main` |

**Comment:** Confirmed. `chat_agent_prompt` is `security definer`, granted to `authenticated`, and the predicate includes `is_public = true`. Any signed-in JWT can read any live public custom `system_prompt`. House UI nulls `backstory` unless `canEdit` — cosmetic. CONTEXT: “The backstory stays server-side for non-owners.” Curated prompts leak on the same grant (Trap 2); the public-custom repro is the subset CONTEXT names.

**Do not take Option B** (authenticated may read curated prompts). That re-exports first-party IP on the Data API.

**Do this:**

1. `revoke all … from authenticated`; `grant execute` to `service_role` only.
2. **Rewrite** the function: drop `auth.uid() is not null`. Service-role calls have a null uid, so the current body would return no row and break chat.
3. `loadChatAgent` keeps the agent row + entitlements on the **user** JWT. After `canChat`, fetch `system_prompt` via `createServiceSupabaseClient()` (RPC or `select system_prompt` by id).
4. Owner Studio path stays `own_custom_agent_sheet`. Do **not** grant `system_prompt` on authenticated `SELECT`.

AC: stranger authenticated RPC is denied; owner sheet still works; curated + owned + public custom chat still streams.
