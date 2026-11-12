/**
 * Content model for the school website.
 * Mirrors the Supabase schema in supabase/migrations. Every public-facing
 * record can carry `verification` so unconfirmed content is labelled in the UI.
 * Fields ending in `_de` hold the German translation; the data layer swaps
 * them in for /de pages (see lib/content/localize.ts).
 */

export type PublishStatus = "draft" | "published" | "archived";
export type Verification = "verified" | "pending";
export type Role = "admin" | "editor" | "contributor" | "viewer";
type T = string | null;

/** Fields every public record shares. `is_example` marks local demo content. */
export interface BaseRecord {
  id: string;
  status: PublishStatus;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
  is_example?: boolean;
  /** Set by the data layer when German was requested but no translation exists. */
  untranslated?: boolean;
}

export interface NewsArticle extends BaseRecord {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_url: string | null;
  cover_alt: string | null;
  featured: boolean;
  author_name: string | null;
  /** false when the exact publication date is unknown: no date is shown. */
  show_date: boolean;
  /** Extra photos shown under the article. */
  gallery: string[];
  source_url: string | null;
  title_de?: T;
  excerpt_de?: T;
  body_de?: T;
  category_de?: T;
  cover_alt_de?: T;
}

export interface Announcement extends BaseRecord {
  title: string;
  body: string;
  audience: string;
  priority: "normal" | "important" | "urgent";
  expires_at: string | null;
  title_de?: T;
  body_de?: T;
  audience_de?: T;
}

export interface SchoolEvent extends BaseRecord {
  slug: string;
  title: string;
  description: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  category: string;
  cover_url: string | null;
  verification: Verification;
  title_de?: T;
  description_de?: T;
  location_de?: T;
  category_de?: T;
}

export interface Program extends BaseRecord {
  slug: string;
  name: string;
  short_name: string;
  tagline: string;
  summary: string;
  overview: string;
  outcomes: string[];
  pathways: string[];
  grades: string;
  cover_url: string | null;
  sort_order: number;
  verification: Verification;
  source_note: string | null;
  name_de?: T;
  short_name_de?: T;
  tagline_de?: T;
  summary_de?: T;
  overview_de?: T;
  grades_de?: T;
  source_note_de?: T;
  outcomes_de?: string[] | null;
  pathways_de?: string[] | null;
}

export interface Subject {
  id: string;
  program_id: string;
  name: string;
  grade: string | null;
  hours_per_week: number | null;
  description: string | null;
  sort_order: number;
  verification: Verification;
  name_de?: T;
  description_de?: T;
  untranslated?: boolean;
}

export interface StaffMember extends BaseRecord {
  full_name: string;
  role_title: string;
  department: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  is_leadership: boolean;
  sort_order: number;
  verification: Verification;
  source_note: string | null;
  video_url: string | null;
  role_title_de?: T;
  department_de?: T;
  bio_de?: T;
  source_note_de?: T;
}

export interface Club extends BaseRecord {
  slug: string;
  name: string;
  summary: string;
  description: string;
  meeting_info: string | null;
  cover_url: string | null;
  is_media_club: boolean;
  sort_order: number;
  verification: Verification;
  name_de?: T;
  summary_de?: T;
  description_de?: T;
  meeting_info_de?: T;
}

export interface ClubMember {
  id: string;
  club_id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  sort_order: number;
  role_de?: T;
  untranslated?: boolean;
}

export interface StudentProject extends BaseRecord {
  slug: string;
  title: string;
  summary: string;
  body: string;
  team: string | null;
  school_year: string | null;
  cover_url: string | null;
  club_id: string | null;
  link_url: string | null;
  title_de?: T;
  summary_de?: T;
  body_de?: T;
}

export interface Achievement extends BaseRecord {
  title: string;
  description: string;
  year: string;
  category: string;
  verification: Verification;
  link_url: string | null;
  title_de?: T;
  description_de?: T;
  category_de?: T;
}

export type MediaKind = "image" | "video" | "podcast";

export interface MediaItem extends BaseRecord {
  kind: MediaKind;
  title: string;
  caption: string | null;
  url: string;
  thumbnail_url: string | null;
  album: string | null;
  club_id: string | null;
  width: number | null;
  height: number | null;
  taken_at: string | null;
  title_de?: T;
  caption_de?: T;
  album_de?: T;
}

export interface SchoolDocument extends BaseRecord {
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  title_de?: T;
  description_de?: T;
  category_de?: T;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  source: string;
  year: string;
  sort_order: number;
  verification: Verification;
  label_de?: T;
  source_de?: T;
  untranslated?: boolean;
}

export interface TimelineEntry {
  period: string;
  title: string;
  text: string;
}

export interface SiteContent {
  hero: {
    title: string;
    lede: string;
    image_url: string | null;
    image_alt: string | null;
    primary_cta: { label: string; href: string };
    secondary_cta: { label: string; href: string };
  };
  intro: { heading: string; body: string; vision: string; mission: string; source: string | null };
  history: TimelineEntry[];
  enrollment: { heading: string; body: string; cta_label: string; cta_href: string; verification: Verification };
  contact: {
    address: string;
    city: string;
    phone: string | null;
    email: string | null;
    hours: string | null;
    map_query: string;
  };
  socials: { label: string; href: string; verified: boolean }[];
  student_info: { heading: string; items: { title: string; body: string; verification: Verification }[] };
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
}
