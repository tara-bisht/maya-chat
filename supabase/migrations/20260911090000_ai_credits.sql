-- AI credits replace daily_message_limit. Model allowlist is enforced in
-- reserve_chat_turn (plan_models ∩ models.is_enabled). Writes stay RPC-only.

-- ---------------------------------------------------------------------------
-- Catalog knobs
-- ---------------------------------------------------------------------------

create table public.catalog_settings (
  id integer primary key check (id = 1),
  credit_scale integer not null default 10000 check (credit_scale > 0)
);

insert into public.catalog_settings (id, credit_scale)
values (1, 10000)
on conflict (id) do nothing;

alter table public.catalog_settings enable row level security;

create policy "Authenticated read catalog_settings"
  on public.catalog_settings
  for select
  to authenticated
  using (true);

grant select on table public.catalog_settings to authenticated;
grant select, insert, update, delete on table public.catalog_settings to service_role;

alter table public.models
  add column if not exists input_usd_per_million numeric(12, 6),
  add column if not exists output_usd_per_million numeric(12, 6),
  add column if not exists min_turn_credits integer not null default 1
    check (min_turn_credits >= 1),
  add column if not exists max_output_tokens integer not null default 2048
    check (max_output_tokens > 0);

update public.models set
  input_usd_per_million = 0.15,
  output_usd_per_million = 0.47
where id = 'qwen-flash';

update public.models set
  input_usd_per_million = 0.30,
  output_usd_per_million = 2.50
where id = 'gemini-flash';

update public.models set
  input_usd_per_million = 1.25,
  output_usd_per_million = 2.50
where id = 'grok-fast';

update public.models set
  input_usd_per_million = 0.27,
  output_usd_per_million = 1.00
where id = 'deepseek';

update public.models set
  input_usd_per_million = 0.46,
  output_usd_per_million = 1.82
where id = 'qwen';

update public.models set
  input_usd_per_million = 2.00,
  output_usd_per_million = 6.00
where id = 'grok';

update public.models set
  input_usd_per_million = 2.50,
  output_usd_per_million = 15.00
where id = 'gpt';

update public.models set
  input_usd_per_million = 3.00,
  output_usd_per_million = 15.00
where id = 'claude';

update public.models set
  input_usd_per_million = 0.44,
  output_usd_per_million = 2.00
where id = 'kimi';

update public.models
set
  input_usd_per_million = 1.00,
  output_usd_per_million = 3.00
where input_usd_per_million is null
   or output_usd_per_million is null;

alter table public.models
  alter column input_usd_per_million set not null,
  alter column output_usd_per_million set not null;

alter table public.models
  drop constraint if exists models_gateway_id_key;

alter table public.models
  add constraint models_gateway_id_key unique (gateway_id);

alter table public.plans
  add column if not exists daily_credit_limit integer,
  add column if not exists monthly_credit_limit integer,
  add column if not exists max_turns_per_day integer;

update public.plans set
  daily_credit_limit = 1500,
  monthly_credit_limit = 20000,
  max_turns_per_day = 80
where id = 'free';

update public.plans set
  daily_credit_limit = 4000,
  monthly_credit_limit = 80000,
  max_turns_per_day = 250
where id = 'plus';

update public.plans set
  daily_credit_limit = 9000,
  monthly_credit_limit = 180000,
  max_turns_per_day = 400
where id = 'pro';

update public.plans set
  daily_credit_limit = 1500,
  monthly_credit_limit = 20000,
  max_turns_per_day = 80
where daily_credit_limit is null;

alter table public.plans
  alter column daily_credit_limit set not null,
  alter column monthly_credit_limit set not null,
  alter column max_turns_per_day set not null;

alter table public.plans
  drop constraint if exists plans_daily_credit_limit_check,
  drop constraint if exists plans_monthly_credit_limit_check,
  drop constraint if exists plans_max_turns_per_day_check;

alter table public.plans
  add constraint plans_daily_credit_limit_check check (daily_credit_limit >= 0),
  add constraint plans_monthly_credit_limit_check check (monthly_credit_limit >= 0),
  add constraint plans_max_turns_per_day_check check (max_turns_per_day >= 0);

drop function if exists public.consume_chat_turn();

alter table public.plans drop column if exists daily_message_limit;

-- ---------------------------------------------------------------------------
-- Preference + attribution
-- ---------------------------------------------------------------------------

alter table public.conversations
  add column if not exists model_id text references public.models (id) on delete set null;

alter table public.profiles
  add column if not exists preferred_model_id text references public.models (id) on delete set null;

alter table public.messages
  add column if not exists model_id text references public.models (id) on delete set null;

alter table public.usage_events
  add column if not exists model_id text references public.models (id),
  add column if not exists conversation_id uuid references public.conversations (id) on delete set null,
  add column if not exists status text,
  add column if not exists reserved_credits integer,
  add column if not exists settled_credits integer,
  add column if not exists prompt_tokens integer,
  add column if not exists completion_tokens integer,
  add column if not exists openrouter_cost_usd numeric(12, 8),
  add column if not exists openrouter_generation_id text;

update public.usage_events
set
  model_id = 'qwen-flash',
  status = 'settled',
  reserved_credits = 0,
  settled_credits = 0,
  prompt_tokens = 0,
  completion_tokens = 0
where model_id is null
   or status is null
   or reserved_credits is null
   or settled_credits is null
   or prompt_tokens is null
   or completion_tokens is null;

alter table public.usage_events
  alter column model_id set not null,
  alter column status set not null,
  alter column reserved_credits set not null,
  alter column settled_credits set not null,
  alter column prompt_tokens set not null,
  alter column completion_tokens set not null;

alter table public.usage_events
  alter column reserved_credits set default 0,
  alter column settled_credits set default 0,
  alter column prompt_tokens set default 0,
  alter column completion_tokens set default 0,
  alter column status set default 'settled';

alter table public.usage_events
  drop constraint if exists usage_events_status_check,
  drop constraint if exists usage_events_reserved_credits_check,
  drop constraint if exists usage_events_settled_credits_check,
  drop constraint if exists usage_events_prompt_tokens_check,
  drop constraint if exists usage_events_completion_tokens_check;

alter table public.usage_events
  add constraint usage_events_status_check check (status in ('reserved', 'settled')),
  add constraint usage_events_reserved_credits_check check (reserved_credits >= 0),
  add constraint usage_events_settled_credits_check check (settled_credits >= 0),
  add constraint usage_events_prompt_tokens_check check (prompt_tokens >= 0),
  add constraint usage_events_completion_tokens_check check (completion_tokens >= 0);

create index if not exists usage_events_model_id_idx on public.usage_events (model_id);
create index if not exists usage_events_conversation_id_idx
  on public.usage_events (conversation_id);

-- ---------------------------------------------------------------------------
-- Hot-path balances (do not SUM usage_events on every turn)
-- ---------------------------------------------------------------------------

create table public.credit_days (
  user_id uuid not null references auth.users (id) on delete cascade,
  day_utc date not null,
  reserved_credits integer not null default 0 check (reserved_credits >= 0),
  settled_credits integer not null default 0 check (settled_credits >= 0),
  turn_count integer not null default 0 check (turn_count >= 0),
  primary key (user_id, day_utc)
);

create table public.credit_months (
  user_id uuid not null references auth.users (id) on delete cascade,
  month_utc date not null,
  reserved_credits integer not null default 0 check (reserved_credits >= 0),
  settled_credits integer not null default 0 check (settled_credits >= 0),
  primary key (user_id, month_utc)
);

alter table public.credit_days enable row level security;
alter table public.credit_months enable row level security;

grant select, insert, update, delete on table public.credit_days to service_role;
grant select, insert, update, delete on table public.credit_months to service_role;

-- Hide gateway dollars from the Data API. RLS still scopes rows to the owner.
revoke select on table public.usage_events from authenticated;
grant select (
  id,
  user_id,
  event_type,
  created_at,
  model_id,
  conversation_id,
  status,
  reserved_credits,
  settled_credits,
  prompt_tokens,
  completion_tokens
) on table public.usage_events to authenticated;

-- ---------------------------------------------------------------------------
-- RPCs
-- ---------------------------------------------------------------------------

create or replace function public.credit_balance()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_today date;
  v_month date;
  v_daily_limit integer;
  v_monthly_limit integer;
  v_max_turns integer;
  v_day_reserved integer := 0;
  v_day_settled integer := 0;
  v_turn_count integer := 0;
  v_month_reserved integer := 0;
  v_month_settled integer := 0;
  v_daily_used integer;
  v_monthly_used integer;
begin
  v_uid := (select auth.uid());
  if v_uid is null then
    return jsonb_build_object('ok', false, 'reason', 'unauthorized');
  end if;

  v_today := (pg_catalog.timezone('utc', pg_catalog.now()))::date;
  v_month := pg_catalog.date_trunc('month', v_today::timestamp)::date;

  select p.daily_credit_limit, p.monthly_credit_limit, p.max_turns_per_day
    into v_daily_limit, v_monthly_limit, v_max_turns
  from public.entitlements as e
  inner join public.plans as p on p.id = e.plan
  where e.user_id = v_uid;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'unauthorized');
  end if;

  select d.reserved_credits, d.settled_credits, d.turn_count
    into v_day_reserved, v_day_settled, v_turn_count
  from public.credit_days as d
  where d.user_id = v_uid
    and d.day_utc = v_today;

  select m.reserved_credits, m.settled_credits
    into v_month_reserved, v_month_settled
  from public.credit_months as m
  where m.user_id = v_uid
    and m.month_utc = v_month;

  v_day_reserved := coalesce(v_day_reserved, 0);
  v_day_settled := coalesce(v_day_settled, 0);
  v_turn_count := coalesce(v_turn_count, 0);
  v_month_reserved := coalesce(v_month_reserved, 0);
  v_month_settled := coalesce(v_month_settled, 0);
  v_daily_used := v_day_reserved + v_day_settled;
  v_monthly_used := v_month_reserved + v_month_settled;

  return jsonb_build_object(
    'ok', true,
    'dailyLimit', v_daily_limit,
    'dailyUsed', v_daily_used,
    'dailyRemaining', greatest(0, v_daily_limit - v_daily_used),
    'monthlyLimit', v_monthly_limit,
    'monthlyUsed', v_monthly_used,
    'monthlyRemaining', greatest(0, v_monthly_limit - v_monthly_used),
    'resetsAt', (v_today + 1)::text || 'T00:00:00.000Z',
    'turnCount', v_turn_count,
    'maxTurns', v_max_turns
  );
end;
$$;

create or replace function public.reserve_chat_turn(
  p_model_id text,
  p_reserve_credits integer,
  p_conversation_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_plan text;
  v_today date;
  v_month date;
  v_daily_limit integer;
  v_monthly_limit integer;
  v_max_turns integer;
  v_min_turn integer;
  v_enabled boolean;
  v_day_reserved integer := 0;
  v_day_settled integer := 0;
  v_turn_count integer := 0;
  v_month_reserved integer := 0;
  v_month_settled integer := 0;
  v_daily_used integer;
  v_monthly_used integer;
  v_daily_remaining integer;
  v_monthly_remaining integer;
  v_reserve integer;
  v_event_id uuid;
  v_allowed text[];
begin
  v_uid := (select auth.uid());
  if v_uid is null then
    return jsonb_build_object('ok', false, 'reason', 'unauthorized');
  end if;

  if p_model_id is null or p_reserve_credits is null or p_reserve_credits < 1 then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_uid::text));

  v_today := (pg_catalog.timezone('utc', pg_catalog.now()))::date;
  v_month := pg_catalog.date_trunc('month', v_today::timestamp)::date;

  select e.plan, p.daily_credit_limit, p.monthly_credit_limit, p.max_turns_per_day
    into v_plan, v_daily_limit, v_monthly_limit, v_max_turns
  from public.entitlements as e
  inner join public.plans as p on p.id = e.plan
  where e.user_id = v_uid;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'unauthorized');
  end if;

  select coalesce(
    array_agg(pm.model_id order by m.sort_order),
    '{}'::text[]
  )
    into v_allowed
  from public.plan_models as pm
  inner join public.models as m on m.id = pm.model_id
  where pm.plan_id = v_plan
    and m.is_enabled = true;

  select m.is_enabled, m.min_turn_credits
    into v_enabled, v_min_turn
  from public.models as m
  inner join public.plan_models as pm
    on pm.model_id = m.id
   and pm.plan_id = v_plan
  where m.id = p_model_id;

  if not found or v_enabled is not true then
    return jsonb_build_object(
      'ok', false,
      'reason', 'forbidden_model',
      'allowed', to_jsonb(coalesce(v_allowed, '{}'::text[]))
    );
  end if;

  if p_conversation_id is not null then
    if not exists (
      select 1
      from public.conversations as c
      where c.id = p_conversation_id
        and c.user_id = v_uid
    ) then
      return jsonb_build_object('ok', false, 'reason', 'not_found');
    end if;
  end if;

  insert into public.credit_days (user_id, day_utc)
  values (v_uid, v_today)
  on conflict (user_id, day_utc) do nothing;

  insert into public.credit_months (user_id, month_utc)
  values (v_uid, v_month)
  on conflict (user_id, month_utc) do nothing;

  select d.reserved_credits, d.settled_credits, d.turn_count
    into v_day_reserved, v_day_settled, v_turn_count
  from public.credit_days as d
  where d.user_id = v_uid
    and d.day_utc = v_today
  for update;

  select m.reserved_credits, m.settled_credits
    into v_month_reserved, v_month_settled
  from public.credit_months as m
  where m.user_id = v_uid
    and m.month_utc = v_month
  for update;

  v_daily_used := v_day_reserved + v_day_settled;
  v_monthly_used := v_month_reserved + v_month_settled;
  v_daily_remaining := v_daily_limit - v_daily_used;
  v_monthly_remaining := v_monthly_limit - v_monthly_used;

  if v_turn_count >= v_max_turns then
    return jsonb_build_object(
      'ok', false,
      'reason', 'quota',
      'remaining', greatest(0, v_daily_remaining),
      'resetsAt', (v_today + 1)::text || 'T00:00:00.000Z'
    );
  end if;

  if v_daily_remaining < v_min_turn then
    return jsonb_build_object(
      'ok', false,
      'reason', 'quota',
      'remaining', greatest(0, v_daily_remaining),
      'resetsAt', (v_today + 1)::text || 'T00:00:00.000Z'
    );
  end if;

  if v_monthly_remaining < v_min_turn then
    return jsonb_build_object(
      'ok', false,
      'reason', 'quota_month',
      'remaining', greatest(0, v_monthly_remaining)
    );
  end if;

  v_reserve := least(p_reserve_credits, v_daily_remaining, v_monthly_remaining);
  if v_reserve < v_min_turn then
    return jsonb_build_object(
      'ok', false,
      'reason', 'quota',
      'remaining', greatest(0, v_daily_remaining),
      'resetsAt', (v_today + 1)::text || 'T00:00:00.000Z'
    );
  end if;

  insert into public.usage_events (
    user_id,
    event_type,
    model_id,
    conversation_id,
    status,
    reserved_credits,
    settled_credits
  )
  values (
    v_uid,
    'chat_turn',
    p_model_id,
    p_conversation_id,
    'reserved',
    v_reserve,
    0
  )
  returning id into v_event_id;

  update public.credit_days
  set
    reserved_credits = reserved_credits + v_reserve,
    turn_count = turn_count + 1
  where user_id = v_uid
    and day_utc = v_today;

  update public.credit_months
  set reserved_credits = reserved_credits + v_reserve
  where user_id = v_uid
    and month_utc = v_month;

  return jsonb_build_object(
    'ok', true,
    'eventId', v_event_id,
    'reserved', v_reserve,
    'remaining', greatest(0, v_daily_remaining - v_reserve),
    'dailyLimit', v_daily_limit
  );
end;
$$;

create or replace function public.settle_chat_turn(
  p_event_id uuid,
  p_settled_credits integer,
  p_prompt_tokens integer default 0,
  p_completion_tokens integer default 0,
  p_cost numeric default null,
  p_generation_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_today date;
  v_month date;
  v_reserved integer;
  v_status text;
  v_event_user uuid;
  v_event_day date;
  v_event_month date;
  v_settled integer;
  v_day_reserved integer;
  v_month_reserved integer;
begin
  v_uid := (select auth.uid());
  if v_uid is null then
    return jsonb_build_object('ok', false, 'reason', 'unauthorized');
  end if;

  if p_event_id is null then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_uid::text));

  select
    u.user_id,
    u.status,
    u.reserved_credits,
    (pg_catalog.timezone('utc', u.created_at))::date
    into v_event_user, v_status, v_reserved, v_event_day
  from public.usage_events as u
  where u.id = p_event_id;

  if not found or v_event_user is distinct from v_uid then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  v_settled := greatest(1, coalesce(p_settled_credits, v_reserved, 1));
  v_event_month := pg_catalog.date_trunc('month', v_event_day::timestamp)::date;
  v_today := (pg_catalog.timezone('utc', pg_catalog.now()))::date;
  v_month := pg_catalog.date_trunc('month', v_today::timestamp)::date;

  if v_status = 'settled' then
    return jsonb_build_object(
      'ok', true,
      'settled', (
        select e.settled_credits
        from public.usage_events as e
        where e.id = p_event_id
      ),
      'idempotent', true
    );
  end if;

  update public.usage_events
  set
    status = 'settled',
    settled_credits = v_settled,
    prompt_tokens = greatest(0, coalesce(p_prompt_tokens, 0)),
    completion_tokens = greatest(0, coalesce(p_completion_tokens, 0)),
    openrouter_cost_usd = p_cost,
    openrouter_generation_id = p_generation_id
  where id = p_event_id;

  select d.reserved_credits
    into v_day_reserved
  from public.credit_days as d
  where d.user_id = v_uid
    and d.day_utc = v_event_day
  for update;

  if found then
    update public.credit_days
    set
      reserved_credits = greatest(0, reserved_credits - v_reserved),
      settled_credits = settled_credits + v_settled
    where user_id = v_uid
      and day_utc = v_event_day;
  elsif v_event_day = v_today then
    insert into public.credit_days (
      user_id,
      day_utc,
      reserved_credits,
      settled_credits,
      turn_count
    )
    values (v_uid, v_event_day, 0, v_settled, 1)
    on conflict (user_id, day_utc) do update
      set settled_credits = public.credit_days.settled_credits + v_settled;
  end if;

  select m.reserved_credits
    into v_month_reserved
  from public.credit_months as m
  where m.user_id = v_uid
    and m.month_utc = v_event_month
  for update;

  if found then
    update public.credit_months
    set
      reserved_credits = greatest(0, reserved_credits - v_reserved),
      settled_credits = settled_credits + v_settled
    where user_id = v_uid
      and month_utc = v_event_month;
  elsif v_event_month = v_month then
    insert into public.credit_months (
      user_id,
      month_utc,
      reserved_credits,
      settled_credits
    )
    values (v_uid, v_event_month, 0, v_settled)
    on conflict (user_id, month_utc) do update
      set settled_credits = public.credit_months.settled_credits + v_settled;
  end if;

  return jsonb_build_object('ok', true, 'settled', v_settled);
end;
$$;

revoke all on function public.credit_balance() from public;
revoke all on function public.credit_balance() from anon;
revoke all on function public.reserve_chat_turn(text, integer, uuid) from public;
revoke all on function public.reserve_chat_turn(text, integer, uuid) from anon;
revoke all on function public.settle_chat_turn(uuid, integer, integer, integer, numeric, text) from public;
revoke all on function public.settle_chat_turn(uuid, integer, integer, integer, numeric, text) from anon;

grant execute on function public.credit_balance() to authenticated;
grant execute on function public.reserve_chat_turn(text, integer, uuid) to authenticated;
grant execute on function public.settle_chat_turn(uuid, integer, integer, integer, numeric, text) to authenticated;
