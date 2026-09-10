# [MAYA-103] Unbounded Public Agent Table Scan on Every Chat Page Load

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-103 |
| **Issue Type** | ⚡ Performance & Scalability |
| **Status** | Done |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major |
| **Component** | Backend / House SSR Loader |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
On every Server-Side Rendered (SSR) page load of `/chat/[agentId]`, `loadHouse()` executes an unrestricted `SELECT` on `public.agents`:
```ts
supabase.from("agents").select(HOUSE_AGENT_COLUMNS)
```
Under PostgreSQL Row-Level Security (RLS), authenticated users have permission to read:
1. All curated agents (`is_curated = true`)
2. All live public agents (`is_public = true AND archived_at IS NULL`)
3. All agents owned by the user (`user_id = auth.uid()`)

Because there is no `.eq()` or `.limit()` filter in SQL, this query fetches **every public custom agent created by every user on the entire platform** into Node.js server memory. Immediately afterward, JavaScript discards all non-curated, non-owned, and non-active agents in memory:
```ts
const live = input.agents.filter((agent) => {
  if (agent.archived_at) return false;
  if (agent.is_curated) return true;
  return agent.user_id === input.viewerId || agent.id === input.activeAgentId;
});
```

---

## 2. Code Reference
- [`apps/web/lib/house/load.ts:77`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/house/load.ts#L77):
  ```ts
  const [
    agentResult,
    entitlementResult,
    conversationResult,
    agentsResult, // <--- Unbounded query
    profileResult,
  ] = await Promise.all([
    ...
    supabase.from("agents").select(HOUSE_AGENT_COLUMNS),
    ...
  ]);
  ```
- [`apps/web/lib/house/threads.ts:60-68`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/house/threads.ts#L60-L68):
  ```ts
  export function buildCast(input: { ... }): CastMember[] {
    const live = input.agents.filter((agent) => {
      if (agent.archived_at) return false;
      if (agent.is_curated) return true;
      return agent.user_id === input.viewerId || agent.id === input.activeAgentId;
    });
    ...
  }
  ```

---

## 3. Steps to Reproduce
1. In the database, seed 1,000 public custom agent rows distributed across multiple test users:
   ```sql
   INSERT INTO public.agents (name, tagline, category, system_prompt, is_curated, is_public, user_id)
   SELECT 'Bot ' || i, 'Tagline', 'custom', 'Prompt', false, true, auth.uid()
   FROM generate_series(1, 1000) AS i;
   ```
2. Navigate to `/chat/00000000-0000-0000-0000-000000000001` (Marcus).
3. Inspect network payloads and server memory profiler during the SSR request.

---

## 4. Expected Behavior
- The server queries only the agents needed for the navigation rail:
  - The 8 curated agents
  - The current user's own custom agents
  - The active agent being viewed (if it is a public agent created by another user)
- Payload size is bounded (<20 rows).

---

## 5. Actual Behavior
- The database transmits all 1,000+ public agent rows over the network to the Next.js server.
- The Next.js process allocates memory to deserialize all 1,000+ rows.
- `buildCast()` loops through and discards all 1,000 public rows except curated and owned agents.
- Page TTFB degrades severely as community agents are created.

---

## 6. Root Cause Analysis (RCA)
Over-reliance on client/in-memory filtering instead of pushing query predicate constraints down to PostgreSQL. While `gallery/load.ts` correctly filters curated and user agents separately, `house/load.ts` omitted the SQL filter.

---

## 7. Proposed Solution & Code Fix

Filter directly in PostgreSQL within `apps/web/lib/house/load.ts`:

```diff
-   supabase.from("agents").select(HOUSE_AGENT_COLUMNS),
+   supabase
+     .from("agents")
+     .select(HOUSE_AGENT_COLUMNS)
+     .or(`is_curated.eq.true,user_id.eq.${input.userId},id.eq.${input.agentId}`),
```

This ensures PostgreSQL uses existing indexes (`agents_user_id_idx`, primary key `id`, and partial indexes) and returns only the relevant ~10–15 rows.

---

## 8. Acceptance Criteria (AC)
- [ ] `loadHouse()` query response on `agents` never returns unowned public third-party agents other than the currently active agent.
- [ ] Query execution time and network transfer remain constant regardless of the total count of public custom agents in `public.agents`.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid performance issue; severity overstated for current scale |
| **Status** | Done |
| **Engineering priority** | P2 (QA filed P1) |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |
| **Shipped** | [#7](https://github.com/tara-bisht/maya-chat/pull/7) on `main` |

**Comment:** Confirmed. `loadHouse` selects `HOUSE_AGENT_COLUMNS` from `agents` with no predicate. RLS for authenticated users is curated **or** live public **or** own, so every public custom agent on the platform is deserialized in Node, then `buildCast()` keeps only curated, owned, and the active id. Gallery already splits this correctly: curated, own live custom, house listing `.limit(24)`.

This is not a DBA-grade sequential scan of the whole table — it is an RLS-filtered unbounded select. With eight curated rows and a handful of Studio characters it is not a user-visible incident. It *will* rot TTFB as public custom agents grow, and the filter is one query change, so we fix it now rather than wait for scale.

Cast rail only needs: the eight curated agents, the viewer’s live custom agents, and the active agent if it is someone else’s public character. Take the `.or(is_curated.eq.true,user_id.eq.…,id.eq.…)` idea; also keep archived rows out. Indexes `agents_user_id_idx` and PK `id` cover it.

Do not treat this as a production blocker. Ride the 101/102 hotfix.
