-- House rail: threads for one user grouped by agent, newest first.
create index if not exists conversations_user_agent_updated_idx
  on public.conversations (user_id, agent_id, updated_at desc);
