import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import * as seed from "./seed";
import type {
  Achievement,
  Announcement,
  Club,
  ClubMember,
  MediaItem,
  NewsArticle,
  Program,
  SchoolDocument,
  SchoolEvent,
  SiteContent,
  StaffMember,
  Stat,
  StudentProject,
  Subject,
} from "@/lib/types";

/**
 * Public data access layer.
 *
 * Every reader is a `use cache` function tagged by content type. The admin
 * panel calls `revalidateTag`/`updateTag` for the matching tag after a write,
 * and the short `minutes` lifetime makes scheduled posts appear on time.
 *
 * With Supabase configured, rows come from the database through the anon role
 * (RLS only exposes published rows whose publish time has passed). Without it,
 * the site renders the local seed so it is never blank in development.
 */

export const TAGS = {
  news: "news",
  announcements: "announcements",
  events: "events",
  programs: "programs",
  staff: "staff",
  clubs: "clubs",
  projects: "projects",
  achievements: "achievements",
  media: "media",
  documents: "documents",
  stats: "stats",
  site: "site",
} as const;

function live<T extends { status: string; published_at: string | null }>(rows: T[]): T[] {
  const now = Date.now();
  return rows.filter(
    (r) => r.status === "published" && (!r.published_at || new Date(r.published_at).getTime() <= now),
  );
}

function byDateDesc<T extends { published_at: string | null }>(a: T, b: T) {
  return (b.published_at ?? "").localeCompare(a.published_at ?? "");
}

function logError(scope: string, error: unknown) {
  console.error(`[content:${scope}]`, error);
}

/* ---------------------------------------------------------------- site */

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(TAGS.site);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) return seed.siteContent;
  const { data, error } = await sb.from("site_content").select("key, value");
  if (error) {
    logError("site", error);
    return seed.siteContent;
  }
  const merged = { ...seed.siteContent } as Record<string, unknown>;
  for (const row of data ?? []) {
    const base = merged[row.key];
    merged[row.key] =
      base && typeof base === "object" && !Array.isArray(base) && row.value && typeof row.value === "object"
        ? { ...(base as object), ...(row.value as object) }
        : row.value;
  }
  return merged as unknown as SiteContent;
}

export async function getStats(): Promise<Stat[]> {
  "use cache";
  cacheTag(TAGS.stats);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) return seed.stats.filter((s) => s.verification === "verified");
  const { data, error } = await sb.from("stats").select("*").eq("verification", "verified").order("sort_order");
  if (error) {
    logError("stats", error);
    return [];
  }
  return (data ?? []) as Stat[];
}

/* ---------------------------------------------------------------- news */

export async function getNews(limit = 50): Promise<NewsArticle[]> {
  "use cache";
  cacheTag(TAGS.news);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) return live(seed.news).sort(byDateDesc).slice(0, limit);
  const { data, error } = await sb
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    logError("news", error);
    return [];
  }
  return (data ?? []) as NewsArticle[];
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  "use cache";
  cacheTag(TAGS.news, `news:${slug}`);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) return live(seed.news).find((n) => n.slug === slug) ?? null;
  const { data, error } = await sb.from("news").select("*").eq("slug", slug).maybeSingle();
  if (error) logError("news-article", error);
  return (data as NewsArticle) ?? null;
}

export async function getNewsSlugs(): Promise<string[]> {
  const items = await getNews(200);
  return items.map((n) => n.slug);
}

/* ------------------------------------------------------- announcements */

export async function getAnnouncements(limit = 50): Promise<Announcement[]> {
  "use cache";
  cacheTag(TAGS.announcements);
  cacheLife("minutes");
  const now = Date.now();
  const notExpired = (a: Announcement) => !a.expires_at || new Date(a.expires_at).getTime() > now;
  const sb = getPublicClient();
  if (!sb) return live(seed.announcements).filter(notExpired).sort(byDateDesc).slice(0, limit);
  const { data, error } = await sb
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    logError("announcements", error);
    return [];
  }
  return ((data ?? []) as Announcement[]).filter(notExpired);
}

/* -------------------------------------------------------------- events */

export async function getEvents(): Promise<SchoolEvent[]> {
  "use cache";
  cacheTag(TAGS.events);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) return live(seed.events).sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const { data, error } = await sb.from("events").select("*").order("starts_at", { ascending: true });
  if (error) {
    logError("events", error);
    return [];
  }
  return (data ?? []) as SchoolEvent[];
}

/**
 * Events split around the start of today. Computed inside a cached scope so
 * the clock read happens once per cache window, not during prerender.
 */
export async function getEventsSplit(): Promise<{ upcoming: SchoolEvent[]; past: SchoolEvent[]; today: string }> {
  "use cache";
  cacheTag(TAGS.events);
  cacheLife("minutes");
  const all = await getEvents();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const t = startOfToday.getTime();
  const end = (e: SchoolEvent) => new Date(e.ends_at ?? e.starts_at).getTime();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Belgrade", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return {
    today,
    upcoming: all.filter((e) => end(e) >= t),
    past: all.filter((e) => end(e) < t).reverse(),
  };
}

export async function getUpcomingEvents(limit = 6): Promise<SchoolEvent[]> {
  const { upcoming } = await getEventsSplit();
  return upcoming.slice(0, limit);
}

/* ------------------------------------------------------------ programs */

export async function getPrograms(): Promise<Program[]> {
  "use cache";
  cacheTag(TAGS.programs);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) return live(seed.programs).sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await sb.from("programs").select("*").order("sort_order");
  if (error) {
    logError("programs", error);
    return [];
  }
  return (data ?? []) as Program[];
}

export async function getProgram(slug: string): Promise<{ program: Program; subjects: Subject[] } | null> {
  "use cache";
  cacheTag(TAGS.programs, `program:${slug}`);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) {
    const program = live(seed.programs).find((p) => p.slug === slug);
    if (!program) return null;
    return {
      program,
      subjects: seed.subjects.filter((s) => s.program_id === program.id).sort((a, b) => a.sort_order - b.sort_order),
    };
  }
  const { data: program, error } = await sb.from("programs").select("*").eq("slug", slug).maybeSingle();
  if (error) logError("program", error);
  if (!program) return null;
  const { data: subjects } = await sb
    .from("subjects")
    .select("*")
    .eq("program_id", program.id)
    .order("sort_order");
  return { program: program as Program, subjects: (subjects ?? []) as Subject[] };
}

/* --------------------------------------------------------------- staff */

export async function getStaff(): Promise<StaffMember[]> {
  "use cache";
  cacheTag(TAGS.staff);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) return live(seed.staff).sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await sb.from("staff").select("*").order("sort_order");
  if (error) {
    logError("staff", error);
    return [];
  }
  return (data ?? []) as StaffMember[];
}

/* --------------------------------------------------------------- clubs */

export async function getClubs(): Promise<Club[]> {
  "use cache";
  cacheTag(TAGS.clubs);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) return live(seed.clubs).sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await sb.from("clubs").select("*").order("sort_order");
  if (error) {
    logError("clubs", error);
    return [];
  }
  return (data ?? []) as Club[];
}

export async function getMediaClub(): Promise<{
  club: Club | null;
  members: ClubMember[];
  media: MediaItem[];
  projects: StudentProject[];
}> {
  "use cache";
  cacheTag(TAGS.clubs, TAGS.media, TAGS.projects);
  cacheLife("minutes");
  const clubs = await getClubs();
  const club = clubs.find((c) => c.is_media_club) ?? null;
  const sb = getPublicClient();
  if (!club) return { club: null, members: [], media: [], projects: [] };
  if (!sb) {
    return {
      club,
      members: seed.clubMembers.filter((m) => m.club_id === club.id),
      media: live(seed.media).filter((m) => m.club_id === club.id),
      projects: live(seed.projects).filter((p) => p.club_id === club.id),
    };
  }
  const [members, media, projects] = await Promise.all([
    sb.from("club_members").select("*").eq("club_id", club.id).order("sort_order"),
    sb.from("media_items").select("*").eq("club_id", club.id).order("published_at", { ascending: false }),
    sb.from("projects").select("*").eq("club_id", club.id).order("published_at", { ascending: false }),
  ]);
  return {
    club,
    members: (members.data ?? []) as ClubMember[],
    media: (media.data ?? []) as MediaItem[],
    projects: (projects.data ?? []) as StudentProject[],
  };
}

/* ------------------------------------------------- projects & awards */

export async function getProjects(): Promise<StudentProject[]> {
  "use cache";
  cacheTag(TAGS.projects);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) return live(seed.projects).sort(byDateDesc);
  const { data, error } = await sb.from("projects").select("*").order("published_at", { ascending: false });
  if (error) {
    logError("projects", error);
    return [];
  }
  return (data ?? []) as StudentProject[];
}

export async function getAchievements(): Promise<Achievement[]> {
  "use cache";
  cacheTag(TAGS.achievements);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) return live(seed.achievements);
  const { data, error } = await sb.from("achievements").select("*").order("year", { ascending: false });
  if (error) {
    logError("achievements", error);
    return [];
  }
  return (data ?? []) as Achievement[];
}

/* --------------------------------------------------- media & documents */

export async function getMedia(): Promise<MediaItem[]> {
  "use cache";
  cacheTag(TAGS.media);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) return live(seed.media).sort(byDateDesc);
  const { data, error } = await sb.from("media_items").select("*").order("published_at", { ascending: false });
  if (error) {
    logError("media", error);
    return [];
  }
  return (data ?? []) as MediaItem[];
}

export async function getDocuments(): Promise<SchoolDocument[]> {
  "use cache";
  cacheTag(TAGS.documents);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) return live(seed.documents).sort(byDateDesc);
  const { data, error } = await sb.from("documents").select("*").order("published_at", { ascending: false });
  if (error) {
    logError("documents", error);
    return [];
  }
  return (data ?? []) as SchoolDocument[];
}
