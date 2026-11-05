import { Newspaper } from "lucide-react";
import Link from "next/link";
import type { Announcement, NewsArticle } from "@/lib/types";
import { NewsCard } from "@/components/news/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExampleBadge } from "@/components/ui/Pending";
import { Reveal } from "@/components/motion/Reveal";
import { formatDate } from "@/lib/utils";

export function NewsSection({ news, announcements }: { news: NewsArticle[]; announcements: Announcement[] }) {
  const lead = news.find((n) => n.featured) ?? news[0];
  const rest = news.filter((n) => n.id !== lead?.id).slice(0, 2);

  return (
    <section aria-labelledby="news-title" className="bg-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          id="news-title"
          title="Lajme dhe njoftime"
          lede="Çfarë po ndodh në shkollë, drejtpërdrejt nga administrata."
          link={{ href: "/lajme", label: "Të gjitha lajmet" }}
        />

        {news.length === 0 ? (
          <EmptyState icon={Newspaper} title="Ende nuk ka lajme të publikuara" className="mt-14">
            Lajmet e para do të shfaqen këtu sapo stafi t&apos;i publikojë.
          </EmptyState>
        ) : (
          <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
            {lead && (
              <Reveal className="lg:col-span-7">
                <NewsCard item={lead} lead />
              </Reveal>
            )}
            <div className="grid gap-12 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {rest.map((n, i) => (
                <Reveal key={n.id} delay={0.08 * (i + 1)}>
                  <NewsCard item={n} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {announcements.length > 0 && (
          <Reveal className="mt-20">
            <div className="rounded-card bg-white p-2">
              <div className="flex items-center justify-between px-6 pb-2 pt-5">
                <h3 className="text-lg font-bold tracking-[-0.02em]">Njoftimet e fundit</h3>
                <Link href="/njoftimet" className="link-underline text-sm font-semibold">
                  Të gjitha njoftimet
                </Link>
              </div>
              <ul>
                {announcements.slice(0, 3).map((a) => (
                  <li key={a.id} className="grid gap-2 rounded-2xl px-6 py-5 md:grid-cols-12 md:items-baseline">
                    <time dateTime={a.published_at ?? undefined} className="text-sm text-muted md:col-span-2">
                      {formatDate(a.published_at, { month: "short" })}
                    </time>
                    <p className="font-semibold md:col-span-4">
                      {a.priority !== "normal" && (
                        <span className="mr-2 inline-block size-2 rounded-full bg-blue align-middle" aria-label="I rëndësishëm" />
                      )}
                      {a.title}
                    </p>
                    <p className="text-muted md:col-span-5">{a.body}</p>
                    <div className="md:col-span-1 md:text-right">{a.is_example && <ExampleBadge className="text-muted" />}</div>
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
