import { Newspaper } from "lucide-react";
import Link from "next/link";
import type { Announcement, NewsArticle } from "@/lib/types";
import { NewsCard } from "@/components/news/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { lp, t, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

export function NewsSection({ news, announcements, locale = "sq" }: { news: NewsArticle[]; announcements: Announcement[]; locale?: Locale }) {
  const T = t(locale);
  const lead = news.find((n) => n.featured) ?? news[0];
  const rest = news.filter((n) => n.id !== lead?.id).slice(0, 3);

  return (
    <section aria-labelledby="news-title" className="bg-paper py-20 md:py-32">
      <div className="shell">
        <SectionHeading id="news-title" title={T.home_.newsTitle} lede={T.home_.newsLede} link={{ href: lp(locale, "/lajme"), label: T.allNews }} />

        {news.length === 0 ? (
          <EmptyState icon={Newspaper} title={T.news_.empty} className="mt-12" />
        ) : (
          <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-10">
            {lead && (
              <Reveal className="lg:col-span-7">
                <NewsCard item={lead} lead locale={locale} />
              </Reveal>
            )}
            <ul className="divide-y divide-line border-y border-line lg:col-span-5">
              {rest.map((n) => (
                <li key={n.id} className="group relative py-5">
                  <p className="text-sm font-semibold text-blue-deep">{n.category}</p>
                  <h3 className="mt-1 text-xl font-bold leading-[1.15] tracking-[-0.025em]">
                    <Link href={lp(locale, `/lajme/${n.slug}`)} className="after:absolute after:inset-0">
                      <span className="link-underline">{n.title}</span>
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-muted">{n.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {announcements.length > 0 && (
          <Reveal className="mt-14">
            <div className="rounded-card bg-white p-2">
              <div className="flex items-center justify-between px-5 pb-2 pt-4">
                <h3 className="text-lg font-bold tracking-[-0.02em]">{T.home_.latestAnnouncements}</h3>
                <Link href={lp(locale, "/njoftimet")} className="link-underline text-sm font-semibold">
                  {T.home_.allAnnouncements}
                </Link>
              </div>
              <ul>
                {announcements.slice(0, 3).map((a) => (
                  <li key={a.id} className="grid gap-1 rounded-2xl px-5 py-4 md:grid-cols-12 md:items-baseline md:gap-2">
                    <time dateTime={a.published_at ?? undefined} className="text-sm text-muted md:col-span-2">
                      {formatDate(a.published_at, { month: "short", locale })}
                    </time>
                    <p className="font-semibold md:col-span-4">{a.title}</p>
                    <p className="text-muted md:col-span-6">{a.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
