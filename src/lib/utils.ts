import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom type scale so `text-display` is not
// mistaken for a colour and dropped next to `text-ink`.
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["display", "mega", "title", "lede"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TZ = "Europe/Belgrade";

// Albanian names are hard-coded: ICU data for sq differs between Node and
// browsers, which would cause hydration mismatches.
const MONTHS = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];
const MONTHS_SHORT = ["jan", "shk", "mar", "pri", "maj", "qer", "kor", "gus", "sht", "tet", "nën", "dhj"];
const WEEKDAYS = ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"];

/** Calendar parts of an instant in the school's time zone (numeric, locale-free). */
export function zonedParts(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return {
    year: Number(get("year")),
    month: Number(get("month")) - 1,
    day: Number(get("day")),
    hour: get("hour"),
    minute: get("minute"),
    weekday: wd,
  };
}

export function formatDate(iso: string | null | undefined, opts: { month?: "short" | "long" } = {}) {
  if (!iso) return "";
  const p = zonedParts(iso);
  const month = opts.month === "short" ? MONTHS_SHORT[p.month] : MONTHS[p.month];
  return `${p.day} ${month} ${p.year}`;
}

export function formatTime(iso: string | null | undefined) {
  if (!iso) return "";
  const p = zonedParts(iso);
  return `${p.hour}:${p.minute}`;
}

export function monthLabel(year: number, monthIndex: number) {
  return `${MONTHS[monthIndex]} ${year}`;
}

export function dateParts(iso: string) {
  const p = zonedParts(iso);
  return {
    day: String(p.day).padStart(2, "0"),
    month: MONTHS_SHORT[p.month],
    weekday: WEEKDAYS[p.weekday],
    year: String(p.year),
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return null;
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/** Extract a YouTube video id from common URL shapes. */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SCHOOL_NAME = "Gjimnazi \"Eqrem Çabej\"";
