-- MAYA-111: chat_agent_prompt is service_role only. Do not bind auth.uid()
-- (service-role JWT has a null uid and would return no prompt).
-- Authorization is loadChatAgent + canChat on the user JWT, then this RPC.
-- MAYA-112: authenticated must not INSERT usage_events; consume_chat_turn()
-- is the only writer.
-- MAYA-113: cap empty conversations at 5 (route and Data API).

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
    and a.archived_at is null;
$$;

revoke all on function public.chat_agent_prompt(uuid) from public;
revoke all on function public.chat_agent_prompt(uuid) from anon;
revoke all on function public.chat_agent_prompt(uuid) from authenticated;
grant execute on function public.chat_agent_prompt(uuid) to service_role;

drop policy if exists "Users insert own usage" on public.usage_events;
revoke insert on table public.usage_events from authenticated;

create or replace function private.enforce_empty_conversation_cap()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_empty integer;
  v_cap constant integer := 5;
begin
  v_uid := (select auth.uid());
  if v_uid is null then
    return new;
  end if;

  if new.user_id is distinct from v_uid then
    raise exception 'conversation_owner_required' using errcode = 'P0001';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_uid::text));

  select count(*)::integer
    into v_empty
  from public.conversations as c
  where c.user_id = v_uid
    and not exists (
      select 1
      from public.messages as m
      where m.conversation_id = c.id
    );

  if v_empty >= v_cap then
    raise exception 'empty_conversation_cap' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_empty_conversation_cap() from public;
revoke all on function private.enforce_empty_conversation_cap() from anon, authenticated;

drop trigger if exists conversations_enforce_empty_cap on public.conversations;
create trigger conversations_enforce_empty_cap
  before insert on public.conversations
  for each row execute function private.enforce_empty_conversation_cap();
