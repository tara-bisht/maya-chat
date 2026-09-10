-- Chat needs the system prompt server-side. Authenticated column grants
-- (Studio) must not put curated prompts on the Data API.

grant select (tone_settings) on table public.agents to authenticated;

create or replace function public.chat_agent_prompt(p_agent_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select a.system_prompt
  from public.agents as a
  where a.id = p_agent_id
    and (select auth.uid()) is not null
    and a.archived_at is null
    and (
      a.is_curated = true
      or a.user_id = (select auth.uid())
      or a.is_public = true
    );
$$;

revoke all on function public.chat_agent_prompt(uuid) from public;
revoke all on function public.chat_agent_prompt(uuid) from anon;
grant execute on function public.chat_agent_prompt(uuid) to authenticated, service_role;
