# [MAYA-109] `match_agent_memories` RPC Fails for Service Role & Global HNSW Lacks Tenant Scoping

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-109 |
| **Issue Type** | 🐛 Bug & Database Architecture |
| **Status** | Open / Ready for Review |
| **Priority** | 🟡 P2 (Medium) |
| **Severity** | Moderate |
| **Component** | Database (pgvector / Memory RPC) |
| **Affects Versions** | Web MVP (Phase 4 Preparation) |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Database Pod |

---

## 1. Summary
Two database design flaws impact the episodic vector memory system (`public.agent_memories` and `match_agent_memories`):

1. **Service Role Incompatibility**:
   `match_agent_memories` is declared as `security invoker` and hardcodes:
   ```sql
   WHERE m.user_id = (select auth.uid())
   ```
   When invoked from a backend background worker, offline agent simulation, or administrative tool using the `SUPABASE_SERVICE_ROLE_KEY`, `auth.uid()` is `NULL`. Consequently, the query evaluates `m.user_id = NULL` and silently returns **0 rows**.

2. **Global HNSW Index on Multi-Tenant Vector Table**:
   In `init_schema.sql:128`, a single global HNSW index is created on `embedding`:
   ```sql
   create index agent_memories_embedding_idx
     on public.agent_memories
     using hnsw (embedding extensions.vector_cosine_ops);
   ```
   In pgvector, an HNSW index represents a single monolithic search graph. When a vector similarity query filters on `(user_id, agent_id)`, pgvector must traverse the global graph and discard non-matching tenant nodes. As the table grows to hundreds of thousands of memories across thousands of users, searching for a single user's memories often exhausts `ef_search` without finding enough tenant matches, causing degraded recall or triggering expensive sequential scans.

---

## 2. Code Reference
- [`supabase/migrations/20260910000001_init_schema.sql:128-130`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L128-L130):
  ```sql
  create index agent_memories_embedding_idx
    on public.agent_memories
    using hnsw (embedding extensions.vector_cosine_ops);
  ```
- [`supabase/migrations/20260910000001_init_schema.sql:518-545`](file:///Users/kamalbisht/Documents/maya-chat/supabase/migrations/20260910000001_init_schema.sql#L518-L545):
  ```sql
  create or replace function public.match_agent_memories(
    p_agent_id uuid,
    p_query extensions.vector(1024),
    p_match_count integer default 8
  )
  ...
  where m.user_id = (select auth.uid())
    and m.agent_id = p_agent_id
    and m.embedding is not null
  ...
  ```

---

## 3. Steps to Reproduce
1. Insert test memory records for user `USER_A` and agent `AGENT_1`.
2. Using `@maya/database`'s `createServiceSupabaseClient()` (service-role key), execute:
   ```ts
   const { data, error } = await serviceClient.rpc("match_agent_memories", {
     p_agent_id: AGENT_1,
     p_query: testVector,
   });
   ```
3. Observe that `data` is `[]` (empty array) because `auth.uid()` evaluated to `NULL`.

---

## 4. Expected Behavior
- Service-role calls can specify an explicit target `p_user_id` when performing memory retrieval or synthesis.
- Authenticated client calls automatically default to `auth.uid()`.
- Multi-tenant vector searches maintain low latency and high recall even as the total database size scales.

---

## 5. Actual Behavior
- Background/worker retrieval fails completely.
- Global HNSW traversal degrades under multi-tenant volume.

---

## 6. Proposed Solution & Migration

Update `match_agent_memories` to accept an optional `p_user_id` with security validation:

```sql
create or replace function public.match_agent_memories(
  p_agent_id uuid,
  p_query extensions.vector(1024),
  p_match_count integer default 8,
  p_user_id uuid default null
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity double precision
)
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  v_effective_uid uuid;
begin
  -- Resolve user: explicit parameter for service_role, or auth.uid() for authenticated users
  if (select auth.jwt() ->> 'role') = 'service_role' then
    v_effective_uid := coalesce(p_user_id, (select auth.uid()));
  else
    v_effective_uid := (select auth.uid());
  end if;

  if v_effective_uid is null then
    return;
  end if;

  return query
  select
    m.id,
    m.content,
    m.metadata,
    1 - (m.embedding <=> p_query) as similarity
  from public.agent_memories as m
  where m.user_id = v_effective_uid
    and m.agent_id = p_agent_id
    and m.embedding is not null
  order by m.embedding <=> p_query
  limit least(coalesce(p_match_count, 8), 16);
end;
$$;
```

For indexing: For high-volume multi-tenancy in pgvector, ensure `hnsw.iterative_scan = 'relaxed_order'` is configured or evaluate IVFFlat with partitioned tables if tenant graph isolation is required.

---

## 7. Acceptance Criteria (AC)
- [ ] Calling `match_agent_memories` via `service_role` with an explicit `p_user_id` successfully returns nearest neighbor memories.
- [ ] Calling `match_agent_memories` as `authenticated` with someone else's `p_user_id` ignores the parameter and uses `auth.uid()`.
