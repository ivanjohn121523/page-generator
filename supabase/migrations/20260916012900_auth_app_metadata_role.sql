-- App authorization lives in Auth app_metadata (JWT), not user_metadata.
-- user_metadata can be changed by the signed-in user; app_metadata cannot.
-- profiles.role is a copy for listing users in the app.

create or replace function public.set_auth_app_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.raw_app_meta_data :=
    coalesce(new.raw_app_meta_data, '{}'::jsonb)
    || jsonb_build_object(
      'role',
      coalesce(nullif(new.raw_app_meta_data->>'role', ''), 'user')
    );
  return new;
end;
$$;

drop trigger if exists on_auth_user_set_app_role on auth.users;
create trigger on_auth_user_set_app_role
  before insert on auth.users
  for each row execute function public.set_auth_app_role();

update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'user')
where coalesce(raw_app_meta_data->>'role', '') = '';

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
    coalesce(nullif(new.raw_app_meta_data->>'role', ''), 'user')
  );
  return new;
end;
$$;
