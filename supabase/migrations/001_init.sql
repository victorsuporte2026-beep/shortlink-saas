create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.workspace_role as enum ('owner', 'admin', 'member');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.safe_slug(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'));
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext not null unique,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  primary key (workspace_id, user_id)
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null,
  slug citext not null unique,
  destination_url text not null,
  description text,
  is_active boolean not null default true,
  is_public boolean not null default true,
  expires_at timestamptz,
  last_clicked_at timestamptz,
  click_count bigint not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint links_slug_format check (slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint links_destination_protocol check (destination_url ~* '^https?://')
);

create table if not exists public.click_events (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.links(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  clicked_at timestamptz not null default timezone('utc', now()),
  ip_hash text,
  country text,
  city text,
  referer text,
  user_agent text,
  device_type text,
  path text
);

create index if not exists idx_workspace_members_user_id on public.workspace_members(user_id);
create index if not exists idx_links_workspace_id on public.links(workspace_id);
create index if not exists idx_links_click_count on public.links(workspace_id, click_count desc);
create index if not exists idx_click_events_workspace_id on public.click_events(workspace_id);
create index if not exists idx_click_events_link_id on public.click_events(link_id);
create index if not exists idx_click_events_clicked_at on public.click_events(clicked_at desc);

create or replace function public.generate_short_slug()
returns citext
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := lower(encode(gen_random_bytes(4), 'hex'));
    exit when not exists (select 1 from public.links where slug = candidate);
  end loop;

  return candidate::citext;
end;
$$;

alter table public.links alter column slug set default public.generate_short_slug();

create or replace function public.normalize_link_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug is null or trim(new.slug::text) = '' then
    new.slug := public.generate_short_slug();
  else
    new.slug := public.safe_slug(new.slug::text)::citext;
  end if;

  return new;
end;
$$;

create or replace function public.handle_click_event_insert()
returns trigger
language plpgsql
as $$
begin
  update public.links
  set click_count = click_count + 1,
      last_clicked_at = new.clicked_at
  where id = new.link_id;

  return new;
end;
$$;

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

  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(coalesce(new.raw_user_meta_data ->> 'full_name', ''), '')
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at
  before update on public.workspaces
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_links_updated_at on public.links;
create trigger trg_links_updated_at
  before update on public.links
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_links_normalize_slug on public.links;
create trigger trg_links_normalize_slug
  before insert or update of slug on public.links
  for each row execute procedure public.normalize_link_slug();

drop trigger if exists trg_click_events_counter on public.click_events;
create trigger trg_click_events_counter
  after insert on public.click_events
  for each row execute procedure public.handle_click_event_insert();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.links enable row level security;
alter table public.click_events enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "workspaces_select_for_members" on public.workspaces;
create policy "workspaces_select_for_members"
  on public.workspaces
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = workspaces.id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "workspaces_update_for_owners_admins" on public.workspaces;
create policy "workspaces_update_for_owners_admins"
  on public.workspaces
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = workspaces.id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = workspaces.id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
  );

drop policy if exists "workspace_members_select_own" on public.workspace_members;
create policy "workspace_members_select_own"
  on public.workspace_members
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "links_select_for_members" on public.links;
create policy "links_select_for_members"
  on public.links
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = links.workspace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "links_insert_for_members" on public.links;
create policy "links_insert_for_members"
  on public.links
  for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = links.workspace_id
        and wm.user_id = auth.uid()
    )
  );

drop policy if exists "links_update_for_creator_or_admin" on public.links;
create policy "links_update_for_creator_or_admin"
  on public.links
  for update
  to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = links.workspace_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
  )
  with check (
    created_by = auth.uid()
    or exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = links.workspace_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
  );

drop policy if exists "links_delete_for_creator_or_admin" on public.links;
create policy "links_delete_for_creator_or_admin"
  on public.links
  for delete
  to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = links.workspace_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner', 'admin')
    )
  );

drop policy if exists "click_events_select_for_members" on public.click_events;
create policy "click_events_select_for_members"
  on public.click_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = click_events.workspace_id
        and wm.user_id = auth.uid()
    )
  );
