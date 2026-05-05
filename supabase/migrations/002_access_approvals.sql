alter table public.profiles
  add column if not exists approval_status text not null default 'pending',
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references auth.users(id),
  add column if not exists rejected_at timestamptz,
  add column if not exists rejected_by uuid references auth.users(id);

do $$
begin
  alter table public.profiles
    add constraint profiles_approval_status_check
    check (approval_status in ('pending', 'approved', 'rejected'));
exception
  when duplicate_object then null;
end;
$$;

update public.profiles
set approval_status = 'approved',
    approved_at = coalesce(approved_at, timezone('utc', now()))
where approval_status is null
   or approval_status = 'pending';

create index if not exists idx_profiles_approval_status
  on public.profiles(approval_status, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_name text;
  base_slug text;
  candidate_slug text;
  counter integer := 0;
  new_workspace_id uuid;
  initial_approval_status text;
begin
  base_name := coalesce(nullif(split_part(new.email, '@', 1), ''), 'workspace');
  base_slug := public.safe_slug(base_name);

  if base_slug = '' then
    base_slug := 'workspace';
  end if;

  candidate_slug := base_slug;

  loop
    exit when not exists (select 1 from public.workspaces where slug = candidate_slug);
    counter := counter + 1;
    candidate_slug := base_slug || '-' || counter::text;
  end loop;

  initial_approval_status := case
    when lower(new.email) = 'victorsuporte2026@gmail.com' then 'approved'
    else 'pending'
  end;

  insert into public.profiles (id, email, full_name, approval_status, approved_at)
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data ->> 'full_name', ''), ''),
    initial_approval_status,
    case when initial_approval_status = 'approved' then timezone('utc', now()) else null end
  )
  on conflict (id) do nothing;

  insert into public.workspaces (name, slug, owner_user_id)
  values (
    'Workspace de ' || base_name,
    candidate_slug,
    new.id
  )
  returning id into new_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace_id, new.id, 'owner')
  on conflict (workspace_id, user_id) do nothing;

  return new;
end;
$$;
