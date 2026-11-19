-- =====================================================================
-- German translations (*_de columns) and richer news/staff fields.
-- Additive only: existing rows and policies are untouched. Empty German
-- fields fall back to Albanian on the website.
-- =====================================================================

alter table public.news
  add column if not exists show_date boolean not null default true,
  add column if not exists gallery text[] not null default '{}',
  add column if not exists source_url text,
  add column if not exists title_de text,
  add column if not exists excerpt_de text,
  add column if not exists body_de text,
  add column if not exists category_de text,
  add column if not exists cover_alt_de text;

alter table public.announcements
  add column if not exists title_de text,
  add column if not exists body_de text,
  add column if not exists audience_de text;

alter table public.events
  add column if not exists title_de text,
  add column if not exists description_de text,
  add column if not exists location_de text,
  add column if not exists category_de text;

alter table public.programs
  add column if not exists name_de text,
  add column if not exists short_name_de text,
  add column if not exists tagline_de text,
  add column if not exists summary_de text,
  add column if not exists overview_de text,
  add column if not exists grades_de text,
  add column if not exists source_note_de text,
  add column if not exists outcomes_de text[] not null default '{}',
  add column if not exists pathways_de text[] not null default '{}';

alter table public.subjects
  add column if not exists name_de text,
  add column if not exists description_de text;

alter table public.staff
  add column if not exists role_title_de text,
  add column if not exists department_de text,
  add column if not exists bio_de text,
  add column if not exists source_note_de text,
  add column if not exists video_url text;

alter table public.clubs
  add column if not exists name_de text,
  add column if not exists summary_de text,
  add column if not exists description_de text,
  add column if not exists meeting_info_de text;

alter table public.club_members add column if not exists role_de text;

alter table public.projects
  add column if not exists title_de text,
  add column if not exists summary_de text,
  add column if not exists body_de text;

alter table public.achievements
  add column if not exists title_de text,
  add column if not exists description_de text,
  add column if not exists category_de text,
  add column if not exists link_url text;

alter table public.media_items
  add column if not exists title_de text,
  add column if not exists caption_de text,
  add column if not exists album_de text;

alter table public.documents
  add column if not exists title_de text,
  add column if not exists description_de text,
  add column if not exists category_de text;

alter table public.stats
  add column if not exists label_de text,
  add column if not exists source_de text;

-- Site blocks: German versions are stored as "<key>_de".
alter table public.site_content drop constraint if exists site_content_key_check;
alter table public.site_content add constraint site_content_key_check check (
  key in ('hero', 'intro', 'history', 'enrollment', 'contact', 'socials', 'student_info',
          'hero_de', 'intro_de', 'history_de', 'enrollment_de', 'student_info_de')
);
