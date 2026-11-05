/**
 * Content model for the school website.
 * Mirrors the Supabase schema in supabase/migrations. Every public-facing
 * record can carry `verification` so unconfirmed content is labelled in the UI.
 */

export type PublishStatus = "draft" | "published" | "archived";
export type Verification = "verified" | "pending";
export type Role = "admin" | "editor" | "contributor" | "viewer";

/** Fields every public record shares. `is_example` marks local demo content. */
export interface BaseRecord {
  id: string;
  status: PublishStatus;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
  is_example?: boolean;
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
}

export interface Announcement extends BaseRecord {
  title: string;
  body: string;
  audience: string;
  priority: "normal" | "important" | "urgent";
  expires_at: string | null;
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
}

export interface ClubMember {
  id: string;
  club_id: string;
  display_name: string;
  role: string;
  photo_url: string | null;
  sort_order: number;
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
}

export interface Achievement extends BaseRecord {
  title: string;
  description: string;
  year: string;
  category: string;
  verification: Verification;
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
}

export interface SchoolDocument extends BaseRecord {
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
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
