-- App role for signed-up accounts. Auth stays in auth.users; this is not a Postgres login role.

alter table public.profiles
  add column if not exists role text not null default 'user';

update public.profiles
set role = 'user'
where role is null or role not in ('user', 'admin');

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'admin'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  return new;
end;
$$;
