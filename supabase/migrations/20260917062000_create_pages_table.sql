-- One page per row. The drag-and-drop canvas lives in document, not on websites.

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  name text,
  slug text,
  sort_order integer not null default 0,
  document jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pages_website_id_idx
  on public.pages (website_id);

create unique index if not exists pages_website_id_slug_idx
  on public.pages (website_id, slug);

alter table public.pages enable row level security;

revoke all on table public.pages from public, anon;
grant select, insert, update, delete on table public.pages to authenticated;

drop policy if exists "pages_select_own" on public.pages;
create policy "pages_select_own"
  on public.pages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.websites w
      where w.id = pages.website_id
        and w.owner_id = auth.uid()
    )
  );

drop policy if exists "pages_insert_own" on public.pages;
create policy "pages_insert_own"
  on public.pages
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.websites w
      where w.id = pages.website_id
        and w.owner_id = auth.uid()
    )
  );

drop policy if exists "pages_update_own" on public.pages;
create policy "pages_update_own"
  on public.pages
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.websites w
      where w.id = pages.website_id
        and w.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.websites w
      where w.id = pages.website_id
        and w.owner_id = auth.uid()
    )
  );

drop policy if exists "pages_delete_own" on public.pages;
create policy "pages_delete_own"
  on public.pages
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.websites w
      where w.id = pages.website_id
        and w.owner_id = auth.uid()
    )
  );

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();
