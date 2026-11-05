import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getPublicClient } from "@/lib/supabase/public";
import * as seed from "./seed";
import { localize, localizeAll } from "./localize";
import type { Locale } from "@/lib/i18n";
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
 * Raw readers (`raw*`) are `use cache` functions tagged by content type; the
 * admin panel invalidates the tag after each write, and the short `minutes`
 * lifetime makes scheduled posts appear on time. Exported readers take a
 * locale and swap in German fields on top of the cached rows, so both
 * languages share one cache entry.
 *
 * With Supabase configured, rows come through the anon role (RLS only exposes
 * published rows whose publish time has passed). Without it, the local seed
 * is used so the site is never blank.
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
  return rows.filter((r) => r.status === "published" && (!r.published_at || new Date(r.published_at).getTime() <= now));
}

const byDateDesc = <T extends { published_at: string | null }>(a: T, b: T) => (b.published_at ?? "").localeCompare(a.published_at ?? "");
const bySort = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

function logError(scope: string, error: unknown) {
  console.error(`[content:${scope}]`, error);
}

/** Runs a Supabase list query, or returns the seed when Supabase is not configured. */
async function list<T>(scope: string, fallback: () => T[], run: (sb: NonNullable<ReturnType<typeof getPublicClient>>) => PromiseLike<{ data: unknown; error: unknown }>): Promise<T[]> {
  const sb = getPublicClient();
  if (!sb) return fallback();
  const { data, error } = await run(sb);
  if (error) {
    logError(scope, error);
    return [];
  }
  return (data ?? []) as T[];
}

/* ================================================================ site */

const SITE_KEYS = ["hero", "intro", "history", "enrollment", "contact", "socials", "student_info"] as const;

async function rawSiteRows(): Promise<Record<string, unknown> | null> {
  "use cache";
  cacheTag(TAGS.site);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) return null;
  const { data, error } = await sb.from("site_content").select("key, value");
  if (error) {
    logError("site", error);
    return null;
  }
  return Object.fromEntries((data ?? []).map((r) => [r.key as string, r.value]));
}

export async function getSiteContent(locale: Locale = "sq"): Promise<SiteContent> {
  const base = locale === "de" ? seed.siteContentDe : seed.siteContent;
  const rows = await rawSiteRows();
  if (!rows) return base;
  const merged = { ...base } as Record<string, unknown>;
  for (const key of SITE_KEYS) {
    // Contact details and social links are shared; text blocks are per language
    // ("<key>_de" rows). German never falls back to Albanian text.
    const shared = key === "contact" || key === "socials";
    const value = locale === "de" && !shared ? rows[`${key}_de`] : rows[key];
    if (value === undefined) continue;
    const prev = merged[key];
    merged[key] =
      prev && typeof prev === "object" && !Array.isArray(prev) && value && typeof value === "object" && !Array.isArray(value)
        ? { ...(prev as object), ...(value as object), ...(key === "contact" && locale === "de" ? { city: (prev as SiteContent["contact"]).city } : {}) }
        : value;
  }
  return merged as unknown as SiteContent;
}

async function rawStats(): Promise<Stat[]> {
  "use cache";
  cacheTag(TAGS.stats);
  cacheLife("hours");
  return list("stats", () => seed.stats.filter((s) => s.verification === "verified"), (sb) =>
    sb.from("stats").select("*").eq("verification", "verified").order("sort_order"),
  );
}
export const getStats = async (locale: Locale = "sq") => localizeAll(await rawStats(), locale, "label");

/* ================================================================ news */

async function rawNews(limit: number): Promise<NewsArticle[]> {
  "use cache";
  cacheTag(TAGS.news);
  cacheLife("minutes");
  const rows = await list<NewsArticle>("news", () => live(seed.news).sort(byDateDesc).slice(0, limit), (sb) =>
    sb.from("news").select("*").order("published_at", { ascending: false }).limit(limit),
  );
  return rows.map((n) => ({ ...n, gallery: n.gallery ?? [], show_date: n.show_date ?? true }));
}
export const getNews = async (limit = 50, locale: Locale = "sq") => localizeAll(await rawNews(limit), locale, "title");

export async function getNewsArticle(slug: string, locale: Locale = "sq"): Promise<NewsArticle | null> {
  const all = await rawNews(500);
  const hit = all.find((n) => n.slug === slug);
  return hit ? localize(hit, locale, "title") : null;
}

/* ======================================================= announcements */

async function rawAnnouncements(limit: number): Promise<Announcement[]> {
  "use cache";
  cacheTag(TAGS.announcements);
  cacheLife("minutes");
  const now = Date.now();
  const notExpired = (a: Announcement) => !a.expires_at || new Date(a.expires_at).getTime() > now;
  const rows = await list<Announcement>("announcements", () => live(seed.announcements).sort(byDateDesc), (sb) =>
    sb.from("announcements").select("*").order("published_at", { ascending: false }).limit(limit),
  );
  return rows.filter(notExpired).slice(0, limit);
}
export const getAnnouncements = async (limit = 50, locale: Locale = "sq") => localizeAll(await rawAnnouncements(limit), locale, "title");

/* ============================================================== events */

async function rawEventsSplit(): Promise<{ upcoming: SchoolEvent[]; past: SchoolEvent[]; all: SchoolEvent[]; today: string }> {
  "use cache";
  cacheTag(TAGS.events);
  cacheLife("minutes");
  const all = await list<SchoolEvent>("events", () => live(seed.events).sort((a, b) => a.starts_at.localeCompare(b.starts_at)), (sb) =>
    sb.from("events").select("*").order("starts_at", { ascending: true }),
  );
  // Clock read inside the cached scope: once per cache window, not per prerender.
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Belgrade", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const startOfToday = new Date(`${today}T00:00:00`).getTime();
  const end = (e: SchoolEvent) => new Date(e.ends_at ?? e.starts_at).getTime();
  return { all, today, upcoming: all.filter((e) => end(e) >= startOfToday), past: all.filter((e) => end(e) < startOfToday).reverse() };
}

export async function getEventsSplit(locale: Locale = "sq") {
  const r = await rawEventsSplit();
  return { today: r.today, all: localizeAll(r.all, locale, "title"), upcoming: localizeAll(r.upcoming, locale, "title"), past: localizeAll(r.past, locale, "title") };
}
export const getUpcomingEvents = async (limit = 6, locale: Locale = "sq") => (await getEventsSplit(locale)).upcoming.slice(0, limit);

/* ============================================================ programs */

async function rawPrograms(): Promise<{ programs: Program[]; subjects: Subject[] }> {
  "use cache";
  cacheTag(TAGS.programs);
  cacheLife("hours");
  const sb = getPublicClient();
  if (!sb) return { programs: live(seed.programs).sort(bySort), subjects: [...seed.subjects].sort(bySort) };
  const [p, s] = await Promise.all([sb.from("programs").select("*").order("sort_order"), sb.from("subjects").select("*").order("sort_order")]);
  if (p.error) logError("programs", p.error);
  return { programs: (p.data ?? []) as Program[], subjects: (s.data ?? []) as Subject[] };
}

export async function getPrograms(locale: Locale = "sq"): Promise<(Program & { subjectNames: string[] })[]> {
  const { programs, subjects } = await rawPrograms();
  return programs.map((p) => ({
    ...localize(p, locale, "name"),
    subjectNames: localizeAll(subjects.filter((s) => s.program_id === p.id), locale).map((s) => s.name),
  }));
}

export async function getProgram(slug: string, locale: Locale = "sq"): Promise<{ program: Program; subjects: Subject[] } | null> {
  const { programs, subjects } = await rawPrograms();
  const program = programs.find((p) => p.slug === slug);
  if (!program) return null;
  return { program: localize(program, locale, "name"), subjects: localizeAll(subjects.filter((s) => s.program_id === program.id), locale, "name") };
}

/* =============================================================== staff */

async function rawStaff(): Promise<StaffMember[]> {
  "use cache";
  cacheTag(TAGS.staff);
  cacheLife("hours");
  return list("staff", () => live(seed.staff).sort(bySort), (sb) => sb.from("staff").select("*").order("sort_order"));
}
export const getStaff = async (locale: Locale = "sq") => localizeAll(await rawStaff(), locale, "role_title");

/* =============================================================== clubs */

async function rawClubs(): Promise<Club[]> {
  "use cache";
  cacheTag(TAGS.clubs);
  cacheLife("hours");
  return list("clubs", () => live(seed.clubs).sort(bySort), (sb) => sb.from("clubs").select("*").order("sort_order"));
}
export const getClubs = async (locale: Locale = "sq") => localizeAll(await rawClubs(), locale, "name");

async function rawMediaClubExtras(clubId: string): Promise<{ members: ClubMember[]; media: MediaItem[]; projects: StudentProject[] }> {
  "use cache";
  cacheTag(TAGS.clubs, TAGS.media, TAGS.projects);
  cacheLife("minutes");
  const sb = getPublicClient();
  if (!sb) {
    return {
      members: seed.clubMembers.filter((m) => m.club_id === clubId),
      media: live(seed.media).filter((m) => m.club_id === clubId),
      projects: live(seed.projects).filter((p) => p.club_id === clubId),
    };
  }
  const [members, media, projects] = await Promise.all([
    sb.from("club_members").select("*").eq("club_id", clubId).order("sort_order"),
    sb.from("media_items").select("*").eq("club_id", clubId).order("published_at", { ascending: false }),
    sb.from("projects").select("*").eq("club_id", clubId).order("published_at", { ascending: false }),
  ]);
  return { members: (members.data ?? []) as ClubMember[], media: (media.data ?? []) as MediaItem[], projects: (projects.data ?? []) as StudentProject[] };
}

export async function getMediaClub(locale: Locale = "sq") {
  const club = (await getClubs(locale)).find((c) => c.is_media_club) ?? null;
  if (!club) return { club: null, members: [] as ClubMember[], media: [] as MediaItem[], projects: [] as StudentProject[] };
  const x = await rawMediaClubExtras(club.id);
  return { club, members: localizeAll(x.members, locale), media: localizeAll(x.media, locale, "title"), projects: localizeAll(x.projects, locale, "title") };
}

/* ================================================== projects & awards */

async function rawProjects(): Promise<StudentProject[]> {
  "use cache";
  cacheTag(TAGS.projects);
  cacheLife("minutes");
  return list("projects", () => live(seed.projects).sort(byDateDesc), (sb) => sb.from("projects").select("*").order("published_at", { ascending: false }));
}
export const getProjects = async (locale: Locale = "sq") => localizeAll(await rawProjects(), locale, "title");

async function rawAchievements(): Promise<Achievement[]> {
  "use cache";
  cacheTag(TAGS.achievements);
  cacheLife("hours");
  return list("achievements", () => live(seed.achievements), (sb) => sb.from("achievements").select("*").order("year", { ascending: false }));
}
export const getAchievements = async (locale: Locale = "sq") => localizeAll(await rawAchievements(), locale, "title");

/* ================================================== media & documents */

async function rawMedia(): Promise<MediaItem[]> {
  "use cache";
  cacheTag(TAGS.media);
  cacheLife("minutes");
  return list("media", () => live(seed.media).sort(byDateDesc), (sb) => sb.from("media_items").select("*").order("published_at", { ascending: false }));
}
export const getMedia = async (locale: Locale = "sq") => localizeAll(await rawMedia(), locale, "title");

async function rawDocuments(): Promise<SchoolDocument[]> {
  "use cache";
  cacheTag(TAGS.documents);
  cacheLife("hours");
  return list("documents", () => live(seed.documents).sort(byDateDesc), (sb) => sb.from("documents").select("*").order("published_at", { ascending: false }));
}
export const getDocuments = async (locale: Locale = "sq") => localizeAll(await rawDocuments(), locale, "title");
