import type { Locale } from "@/lib/i18n";

/**
 * Swaps `<field>_de` values in for German pages. Empty translations fall back
 * to Albanian, and the record is flagged `untranslated` when its primary
 * field (title / name / label) has no German version.
 */
export function localize<T extends object>(row: T, locale: Locale, primary?: keyof T & string): T {
  if (locale === "sq") return row;
  const out: Record<string, unknown> = { ...(row as Record<string, unknown>) };
  for (const [k, v] of Object.entries(row)) {
    if (!k.endsWith("_de")) continue;
    const base = k.slice(0, -3);
    const filled = Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim() !== "" : v != null;
    if (filled) out[base] = v;
  }
  if (primary) {
    const de = (row as Record<string, unknown>)[`${primary}_de`];
    out.untranslated = !(typeof de === "string" && de.trim() !== "");
  }
  return out as T;
}

export const localizeAll = <T extends object>(rows: T[], locale: Locale, primary?: keyof T & string) =>
  rows.map((r) => localize(r, locale, primary));
