-- Match POST /api/conversations (title: "") so the DB default is not 'New Chat'.
alter table public.conversations
  alter column title set default '';
