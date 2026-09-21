-- Site rows are owned by a profile. id is the site id, not the user id.
-- owner_id must stay a uuid FK so a user can have many websites.

create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text,
  slug text,
  tagline text,
  theme jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists websites_owner_id_idx
  on public.websites (owner_id);

create unique index if not exists websites_owner_id_slug_idx
  on public.websites (owner_id, slug);

alter table public.websites enable row level security;

revoke all on table public.websites from public, anon;
grant select, insert, update, delete on table public.websites to authenticated;

drop policy if exists "websites_select_own" on public.websites;
create policy "websites_select_own"
  on public.websites
  for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "websites_insert_own" on public.websites;
create policy "websites_insert_own"
  on public.websites
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "websites_update_own" on public.websites;
create policy "websites_update_own"
  on public.websites
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "websites_delete_own" on public.websites;
create policy "websites_delete_own"
  on public.websites
  for delete
  to authenticated
  using (auth.uid() = owner_id);

drop trigger if exists websites_set_updated_at on public.websites;
create trigger websites_set_updated_at
  before update on public.websites
  for each row execute function public.set_updated_at();
