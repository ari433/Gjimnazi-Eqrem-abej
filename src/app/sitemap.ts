import type { MetadataRoute } from "next";
import { ALL_PUBLIC_ROUTES } from "@/lib/navigation";
import { getNews, getPrograms } from "@/lib/content/queries";
import { lp, LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";

/** Every public page in both languages, with hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, programs] = await Promise.all([getNews(500), getPrograms()]);
  const paths: { path: string; lastModified?: string; priority: number; daily?: boolean }[] = [
    ...ALL_PUBLIC_ROUTES.map((path) => ({ path, priority: path === "/" ? 1 : 0.7, daily: ["/", "/lajme", "/njoftimet"].includes(path) })),
    ...programs.map((p) => ({ path: `/programet/${p.slug}`, lastModified: p.updated_at ?? p.published_at ?? undefined, priority: 0.6 })),
    ...news.filter((n) => !n.is_example).map((n) => ({ path: `/lajme/${n.slug}`, lastModified: n.updated_at ?? (n.show_date ? n.published_at : null) ?? undefined, priority: 0.5 })),
  ];
  return paths.flatMap(({ path, lastModified, priority, daily }) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${lp(locale, path)}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: daily ? ("daily" as const) : ("monthly" as const),
      priority: locale === "sq" ? priority : priority * 0.9,
      alternates: { languages: { sq: `${SITE_URL}${path}`, de: `${SITE_URL}${lp("de", path)}` } },
    })),
  );
}
