-- PR4c: Stripe event idempotency, drop dual plan cache, pin embedding model.

comment on column public.agent_memories.embedding is
  'openai/text-embedding-3-small @ 1024 via OpenRouter';

create table public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

revoke all on table public.stripe_events from public, anon, authenticated;
grant select, insert on table public.stripe_events to service_role;

-- entitlements.plan is the only writable plan column.
alter table public.profiles drop column if exists plan;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  raw_name text;
  raw_lang text;
begin
  raw_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    pg_catalog.split_part(coalesce(new.email, ''), '@', 1)
  );
  raw_name := nullif(pg_catalog.btrim(raw_name), '');
  if raw_name is not null then
    raw_name := pg_catalog.left(raw_name, 80);
  end if;

  raw_lang := coalesce(new.raw_user_meta_data ->> 'preferred_language', 'en');
  if raw_lang not in ('en', 'hinglish', 'hi', 'slang') then
    raw_lang := 'en';
  end if;

  insert into public.profiles (id, display_name, preferred_language)
  values (
    new.id,
    raw_name,
    raw_lang
  );

  insert into public.entitlements (user_id, plan, status, source)
  values (new.id, 'free', 'active', 'manual');

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
