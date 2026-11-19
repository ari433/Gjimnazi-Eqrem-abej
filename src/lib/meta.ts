import type { Metadata } from "next";
import { lp, type Locale } from "./i18n";

/** Page metadata with canonical URL and hreflang alternates for both languages. */
export function pageMeta(locale: Locale, path: string, title: string, description: string, extra: Metadata = {}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: lp(locale, path), languages: { sq: path, de: lp("de", path), "x-default": path } },
    openGraph: { title, description, locale: locale === "de" ? "de_DE" : "sq_AL", url: lp(locale, path), ...(extra.openGraph ?? {}) },
    ...extra,
  };
}
