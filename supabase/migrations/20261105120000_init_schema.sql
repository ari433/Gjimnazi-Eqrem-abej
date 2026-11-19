-- =====================================================================
-- Gjimnazi "Eqrem Çabej" — CMS schema
-- Roles:    admin > editor > contributor > viewer
-- Security: every table has RLS. Public (anon) sees only published rows
--           whose publish time has passed. Staff permissions are enforced
--           here, not in the browser.
-- =====================================================================


-- ---------------------------------------------------------------- types
do $$ begin
  create type public.app_role as enum ('admin', 'editor', 'contributor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.publish_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.verification as enum ('verified', 'pending');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Role helpers. SECURITY DEFINER so policies can read profiles without
-- recursing through profiles' own RLS. search_path pinned for safety.
create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select coalesce(public.current_app_role() = 'admin', false) $$;

create or replace function public.is_editor()
returns boolean language sql stable security definer set search_path = ''
as $$ select coalesce(public.current_app_role() in ('admin', 'editor'), false) $$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = ''
as $$ select coalesce(public.current_app_role() in ('admin', 'editor', 'contributor'), false) $$;

revoke all on function public.current_app_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_editor() from public;
revoke all on function public.is_staff() from public;
grant execute on function public.current_app_role() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_editor() to anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;

-- New auth users get a 'viewer' profile. An admin promotes them.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only admins may change roles (blocks self-promotion through the API).
create or replace function public.guard_role_change()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  -- auth.uid() is null only for trusted contexts (SQL editor, service role);
  -- anon cannot reach this table at all because of RLS.
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  if new.id = (select auth.uid()) and new.role is distinct from old.role then
    raise exception 'Admins cannot change their own role';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_role_change();

create policy "profiles: read own or staff reads all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_staff());

create policy "profiles: update own name"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "profiles: admin updates any"
  on public.profiles for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------- shared helpers
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- When something is published without a time, stamp it now.
create or replace function public.stamp_published_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------- content tables
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 200),
  excerpt text not null default '' check (char_length(excerpt) <= 400),
  body text not null default '',
  category text not null default 'Lajme',
  cover_url text,
  cover_alt text,
  featured boolean not null default false,
  author_name text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  body text not null default '',
  audience text not null default 'Të gjithë',
  priority text not null default 'normal' check (priority in ('normal', 'important', 'urgent')),
  expires_at timestamptz,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 200),
  description text not null default '',
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  category text not null default 'Shkolla',
  cover_url text,
  verification public.verification not null default 'verified',
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  short_name text not null default '',
  tagline text not null default '',
  summary text not null default '',
  overview text not null default '',
  outcomes text[] not null default '{}',
  pathways text[] not null default '{}',
  grades text not null default '',
  cover_url text,
  sort_order int not null default 0,
  verification public.verification not null default 'pending',
  source_note text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  name text not null,
  grade text,
  hours_per_week numeric(4, 1) check (hours_per_week is null or hours_per_week >= 0),
  description text,
  sort_order int not null default 0,
  verification public.verification not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subjects_program_idx on public.subjects (program_id);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  department text,
  bio text,
  photo_url text,
  email text,
  is_leadership boolean not null default false,
  sort_order int not null default 0,
  verification public.verification not null default 'pending',
  source_note text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  summary text not null default '',
  description text not null default '',
  meeting_info text,
  cover_url text,
  is_media_club boolean not null default false,
  sort_order int not null default 0,
  verification public.verification not null default 'pending',
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists clubs_one_media_club on public.clubs (is_media_club) where is_media_club;

-- Student members: display names only (consent from guardians required).
create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  display_name text not null,
  role text not null default '',
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists club_members_club_idx on public.club_members (club_id);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text not null default '',
  body text not null default '',
  team text,
  school_year text,
  cover_url text,
  club_id uuid references public.clubs (id) on delete set null,
  link_url text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  year text not null,
  category text not null default 'Gara',
  verification public.verification not null default 'pending',
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'image' check (kind in ('image', 'video', 'podcast')),
  title text not null,
  caption text,
  url text not null,
  thumbnail_url text,
  album text,
  club_id uuid references public.clubs (id) on delete set null,
  width int,
  height int,
  taken_at date,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'Të përgjithshme',
  file_url text not null,
  file_size bigint,
  file_type text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value numeric not null,
  suffix text,
  source text not null,
  year text not null,
  sort_order int not null default 0,
  verification public.verification not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Editable homepage and site-wide blocks (hero, intro, contact, socials …)
create table if not exists public.site_content (
  key text primary key check (key in ('hero', 'intro', 'history', 'enrollment', 'contact', 'socials', 'student_info')),
  value jsonb not null,
  updated_by uuid references auth.users (id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject text not null check (char_length(subject) between 2 and 200),
  message text not null check (char_length(message) between 10 and 5000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- triggers
do $$
declare t text;
begin
  foreach t in array array['profiles','news','announcements','events','programs','subjects','staff','clubs',
                           'club_members','projects','achievements','media_items','documents','stats','site_content']
  loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
  foreach t in array array['news','announcements','events','programs','staff','clubs','projects','achievements','media_items','documents']
  loop
    execute format('drop trigger if exists %I_stamp on public.%I', t, t);
    execute format('create trigger %I_stamp before insert or update on public.%I for each row execute function public.stamp_published_at()', t, t);
  end loop;
end $$;

create index if not exists news_published_idx on public.news (status, published_at desc);
create index if not exists announcements_published_idx on public.announcements (status, published_at desc);
create index if not exists events_starts_idx on public.events (status, starts_at);
create index if not exists media_published_idx on public.media_items (status, published_at desc);
create index if not exists documents_published_idx on public.documents (status, published_at desc);

-- ------------------------------------------------------------------ RLS
do $$
declare t text;
begin
  foreach t in array array['news','announcements','events','programs','subjects','staff','clubs','club_members',
                           'projects','achievements','media_items','documents','stats','site_content','contact_messages']
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;

  -- Publishable tables: public sees published + due; staff sees everything;
  -- editors write.
  foreach t in array array['announcements','events','programs','staff','clubs','projects','achievements','media_items','documents']
  loop
    execute format($p$
      create policy "%1$s: public reads published" on public.%1$I for select to anon, authenticated
      using (status = 'published' and (published_at is null or published_at <= now()))$p$, t);
    execute format($p$
      create policy "%1$s: staff reads all" on public.%1$I for select to authenticated
      using (public.is_staff())$p$, t);
    execute format($p$
      create policy "%1$s: editors insert" on public.%1$I for insert to authenticated
      with check (public.is_editor())$p$, t);
    execute format($p$
      create policy "%1$s: editors update" on public.%1$I for update to authenticated
      using (public.is_editor()) with check (public.is_editor())$p$, t);
    execute format($p$
      create policy "%1$s: editors delete" on public.%1$I for delete to authenticated
      using (public.is_editor())$p$, t);
  end loop;
end $$;

-- News: contributors may write their own drafts; only editors publish.
create policy "news: public reads published" on public.news for select to anon, authenticated
  using (status = 'published' and (published_at is null or published_at <= now()));
create policy "news: staff reads all" on public.news for select to authenticated
  using (public.is_staff());
create policy "news: staff inserts" on public.news for insert to authenticated
  with check (public.is_editor() or (public.is_staff() and status = 'draft' and created_by = (select auth.uid())));
create policy "news: staff updates" on public.news for update to authenticated
  using (public.is_editor() or (public.is_staff() and created_by = (select auth.uid()) and status = 'draft'))
  with check (public.is_editor() or (public.is_staff() and created_by = (select auth.uid()) and status = 'draft'));
create policy "news: editors delete" on public.news for delete to authenticated
  using (public.is_editor());

-- Child rows follow their parent's visibility.
create policy "subjects: public reads with program" on public.subjects for select to anon, authenticated
  using (exists (select 1 from public.programs p where p.id = program_id
                 and p.status = 'published' and (p.published_at is null or p.published_at <= now())));
create policy "subjects: staff reads all" on public.subjects for select to authenticated using (public.is_staff());
create policy "subjects: editors write" on public.subjects for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

create policy "club_members: public reads with club" on public.club_members for select to anon, authenticated
  using (exists (select 1 from public.clubs c where c.id = club_id
                 and c.status = 'published' and (c.published_at is null or c.published_at <= now())));
create policy "club_members: staff reads all" on public.club_members for select to authenticated using (public.is_staff());
create policy "club_members: editors write" on public.club_members for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

create policy "stats: public reads verified" on public.stats for select to anon, authenticated
  using (verification = 'verified');
create policy "stats: staff reads all" on public.stats for select to authenticated using (public.is_staff());
create policy "stats: editors write" on public.stats for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

create policy "site_content: public reads" on public.site_content for select to anon, authenticated using (true);
create policy "site_content: editors write" on public.site_content for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

-- Contact form: anyone may submit (insert only); never readable publicly.
create policy "contact: anyone submits" on public.contact_messages for insert to anon, authenticated
  with check (handled = false);
create policy "contact: editors read" on public.contact_messages for select to authenticated using (public.is_editor());
create policy "contact: editors update" on public.contact_messages for update to authenticated
  using (public.is_editor()) with check (public.is_editor());
create policy "contact: editors delete" on public.contact_messages for delete to authenticated using (public.is_editor());

-- -------------------------------------------------------------- storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 52428800,
   array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm','audio/mpeg','audio/mp4']),
  ('documents', 'documents', true, 26214400,
   array['application/pdf','application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
         'image/jpeg','image/png'])
on conflict (id) do nothing;

create policy "media: staff uploads" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());
create policy "media: editors update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_editor());
create policy "media: editors delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_editor());

create policy "documents: editors upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and public.is_editor());
create policy "documents: editors update" on storage.objects for update to authenticated
  using (bucket_id = 'documents' and public.is_editor());
create policy "documents: editors delete" on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and public.is_editor());
