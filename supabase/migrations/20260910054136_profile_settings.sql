-- Wristband copy: constrain profiles, stop authenticated writes to the plan cache.

-- Existing rows must pass the checks we add below.
update public.profiles
set display_name = left(display_name, 80)
where display_name is not null
  and char_length(display_name) > 80;

update public.profiles
set display_name = null
where display_name is not null
  and char_length(btrim(display_name)) = 0;

update public.profiles
set global_bio = left(global_bio, 500)
where global_bio is not null
  and char_length(global_bio) > 500;

update public.profiles
set preferred_language = 'en'
where preferred_language not in ('en', 'hinglish', 'hi', 'slang');

alter table public.profiles
  add constraint profiles_preferred_language_chk
    check (preferred_language in ('en', 'hinglish', 'hi', 'slang')),
  add constraint profiles_display_name_len_chk
    check (display_name is null or char_length(display_name) between 1 and 80),
  add constraint profiles_global_bio_len_chk
    check (global_bio is null or char_length(global_bio) <= 500);

-- Members may edit identity fields only. profiles.plan is a Stripe cache.
revoke update on table public.profiles from authenticated;
grant update (display_name, preferred_language, global_bio)
  on table public.profiles to authenticated;

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

  insert into public.profiles (id, display_name, preferred_language, plan)
  values (
    new.id,
    raw_name,
    raw_lang,
    'free'
  );

  insert into public.entitlements (user_id, plan, status, source)
  values (new.id, 'free', 'active', 'manual');

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
