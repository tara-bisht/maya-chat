-- Atomic daily chat quota: lock, count, insert in one transaction.
-- Callers must be authenticated; uid is always auth.uid(), never an argument.

create or replace function public.consume_chat_turn()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_limit integer;
  v_used integer;
  v_today timestamptz;
begin
  v_uid := (select auth.uid());
  if v_uid is null then
    return false;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_uid::text));

  v_today := pg_catalog.timezone(
    'utc',
    pg_catalog.date_trunc(
      'day',
      pg_catalog.timezone('utc', pg_catalog.now())
    )
  );

  select p.daily_message_limit
    into v_limit
  from public.entitlements as e
  inner join public.plans as p on p.id = e.plan
  where e.user_id = v_uid;

  if not found then
    return false;
  end if;

  select count(*)::integer
    into v_used
  from public.usage_events as u
  where u.user_id = v_uid
    and u.event_type = 'chat_turn'
    and u.created_at >= v_today;

  if v_limit is not null and v_used >= v_limit then
    return false;
  end if;

  insert into public.usage_events (user_id, event_type)
  values (v_uid, 'chat_turn');

  return true;
end;
$$;

revoke all on function public.consume_chat_turn() from public;
revoke all on function public.consume_chat_turn() from anon;
grant execute on function public.consume_chat_turn() to authenticated;
