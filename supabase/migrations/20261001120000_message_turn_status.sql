-- MAYA-117: one user row per client send, one assistant reply, and a status
-- when the reply never lands (abort or a failed save).

alter table public.messages
  add column if not exists client_msg_id text,
  add column if not exists reply_to uuid,
  add column if not exists turn_status text not null default 'complete';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'messages_reply_to_fkey'
      and conrelid = 'public.messages'::regclass
  ) then
    alter table public.messages
      add constraint messages_reply_to_fkey
      foreign key (reply_to) references public.messages (id) on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'messages_turn_status_check'
      and conrelid = 'public.messages'::regclass
  ) then
    alter table public.messages
      add constraint messages_turn_status_check
      check (turn_status in ('pending', 'complete', 'interrupted', 'unsaved'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'messages_client_msg_id_len_check'
      and conrelid = 'public.messages'::regclass
  ) then
    alter table public.messages
      add constraint messages_client_msg_id_len_check
      check (
        client_msg_id is null
        or char_length(client_msg_id) between 1 and 128
      );
  end if;
end $$;

create unique index if not exists messages_conversation_client_msg_uidx
  on public.messages (conversation_id, client_msg_id)
  where client_msg_id is not null;

create unique index if not exists messages_reply_to_uidx
  on public.messages (reply_to)
  where reply_to is not null;

comment on column public.messages.client_msg_id is
  'Client id of the user send. The same id does not insert a second user row.';

comment on column public.messages.reply_to is
  'Assistant row points at the user row it answers. At most one reply.';

comment on column public.messages.turn_status is
  'User row: pending until the assistant row is stored, then complete. interrupted on abort, unsaved when the reply did not store.';
