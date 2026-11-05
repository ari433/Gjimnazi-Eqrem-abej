import type { MetadataRoute } from "next";
import { ALL_PUBLIC_ROUTES } from "@/lib/navigation";
import { getNews, getPrograms } from "@/lib/content/queries";
import { SITE_URL } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, programs] = await Promise.all([getNews(500), getPrograms()]);
  const statics = ALL_PUBLIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: (path === "/" || path === "/lajme" || path === "/njoftimet" ? "daily" : "monthly") as "daily" | "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
  return [
    ...statics,
    ...programs.map((p) => ({ url: `${SITE_URL}/programet/${p.slug}`, lastModified: p.updated_at ?? p.published_at ?? undefined, priority: 0.6 })),
    ...news
      .filter((n) => !n.is_example)
      .map((n) => ({ url: `${SITE_URL}/lajme/${n.slug}`, lastModified: n.updated_at ?? n.published_at ?? undefined, priority: 0.5 })),
  ];
}
