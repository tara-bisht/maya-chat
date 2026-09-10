-- Free may cast 3 public custom agents. Plus 10. Pro unlimited.
-- Also install the quota/privacy trigger and owner-sheet RPC if missing.

update public.plans set max_custom_agents = 3 where id = 'free';
update public.plans set max_custom_agents = 10 where id = 'plus';
update public.plans set max_custom_agents = null where id = 'pro';

create index if not exists agents_user_live_custom_idx
  on public.agents (user_id)
  where is_curated = false and archived_at is null;

create index if not exists agents_house_listing_idx
  on public.agents (created_at desc)
  where is_public = true and is_curated = false and archived_at is null;

drop policy if exists "Users select curated public or own agents" on public.agents;
drop policy if exists "Users insert own custom agents" on public.agents;
drop policy if exists "Users update own custom agents" on public.agents;
drop policy if exists "Users delete own custom agents" on public.agents;

create policy "Users select curated public or own agents"
  on public.agents
  for select
  to authenticated
  using (
    is_curated = true
    or (is_public = true and archived_at is null)
    or (select auth.uid()) = user_id
  );

create policy "Users insert own custom agents"
  on public.agents
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and is_curated = false
    and user_id is not null
    and category = 'custom'
  );

create policy "Users update own custom agents"
  on public.agents
  for update
  to authenticated
  using ((select auth.uid()) = user_id and is_curated = false)
  with check ((select auth.uid()) = user_id and is_curated = false);

revoke select, insert, update, delete on table public.agents from authenticated;
revoke all on table public.agents from anon;

grant select (
  id,
  user_id,
  name,
  tagline,
  avatar_url,
  category,
  language_preset,
  costume_id,
  tools_enabled,
  tone_settings,
  is_curated,
  is_public,
  free_tier,
  archived_at,
  created_at,
  updated_at
) on table public.agents to authenticated;

grant insert (
  id,
  user_id,
  name,
  tagline,
  avatar_url,
  category,
  system_prompt,
  language_preset,
  tone_settings,
  tools_enabled,
  is_public,
  costume_id
) on table public.agents to authenticated;

grant update (
  name,
  tagline,
  avatar_url,
  system_prompt,
  language_preset,
  tone_settings,
  tools_enabled,
  is_public,
  costume_id,
  archived_at,
  updated_at
) on table public.agents to authenticated;

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;
grant usage on schema private to postgres, service_role;

create or replace function private.enforce_custom_agent_quota()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_plan text;
  v_max integer;
  v_live integer;
  v_becoming_live boolean;
begin
  if new.is_curated then
    return new;
  end if;

  v_uid := (select auth.uid());

  if v_uid is null or new.user_id is distinct from v_uid then
    raise exception 'studio_owner_required' using errcode = 'P0001';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_uid::text));

  select e.plan, p.max_custom_agents
    into v_plan, v_max
  from public.entitlements as e
  inner join public.plans as p on p.id = e.plan
  where e.user_id = v_uid;

  if v_plan is null then
    raise exception 'studio_no_entitlement' using errcode = 'P0001';
  end if;

  if tg_op = 'INSERT' then
    if new.is_public = false and v_plan = 'free' then
      raise exception 'studio_private_forbidden' using errcode = 'P0001';
    end if;
  elsif tg_op = 'UPDATE' then
    if old.is_public = true and new.is_public = false and v_plan = 'free' then
      raise exception 'studio_private_forbidden' using errcode = 'P0001';
    end if;
  end if;

  v_becoming_live :=
    (tg_op = 'INSERT' and new.archived_at is null)
    or (
      tg_op = 'UPDATE'
      and old.archived_at is not null
      and new.archived_at is null
    );

  if v_becoming_live and v_max is not null then
    select count(*)::integer
      into v_live
    from public.agents as a
    where a.user_id = v_uid
      and a.is_curated = false
      and a.archived_at is null;

    if v_live >= v_max then
      raise exception 'studio_cap' using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_custom_agent_quota() from public;
revoke all on function private.enforce_custom_agent_quota() from anon, authenticated;

drop trigger if exists agents_enforce_custom_quota on public.agents;
create trigger agents_enforce_custom_quota
  before insert or update on public.agents
  for each row execute function private.enforce_custom_agent_quota();

create or replace function public.own_custom_agent_sheet(p_id uuid)
returns public.agents
language sql
stable
security definer
set search_path = ''
as $$
  select a.*
  from public.agents as a
  where a.id = p_id
    and a.user_id = (select auth.uid())
    and a.is_curated = false;
$$;

revoke all on function public.own_custom_agent_sheet(uuid) from public;
revoke all on function public.own_custom_agent_sheet(uuid) from anon;
grant execute on function public.own_custom_agent_sheet(uuid) to authenticated, service_role;
