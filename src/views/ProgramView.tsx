import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PendingBadge, PendingBlock, SourceNote } from "@/components/ui/Pending";
import { ButtonLink } from "@/components/ui/Button";
import { NewsCard } from "@/components/news/NewsCard";
import { getNews, getProgram, getPrograms } from "@/lib/content/queries";
import { lp, t, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/utils";

export async function ProgramView({ locale, slug }: { locale: Locale; slug: string }) {
  const T = t(locale);
  const PR = T.programs_;
  const [data, all, sqData, newsSq, newsLocal] = await Promise.all([
    getProgram(slug, locale),
    getPrograms(locale),
    getProgram(slug, "sq"),
    getNews(100, "sq"),
    getNews(100, locale),
  ]);
  if (!data || !sqData) notFound();
  const { program: p, subjects } = data;
  const others = all.filter((o) => o.id !== p.id);
  // Related news: articles filed under the programme's (Albanian) short name.
  const relatedIds = new Set(newsSq.filter((n) => n.category === sqData.program.short_name).map((n) => n.id));
  const related = newsLocal.filter((n) => relatedIds.has(n.id)).slice(0, 3);

  return (
    <>
      <PageHero
        locale={locale}
        tone="ink"
        title={p.name}
        crumbs={[{ label: T.pages.programs[0], href: "/programet" }, { label: p.short_name || p.name }]}
        lede={p.tagline}
        aside={
          <div className="flex flex-wrap items-center gap-3 text-white/70">
            <span>{p.grades}</span>
            {p.verification === "pending" && <PendingBadge locale={locale} />}
          </div>
        }
      />

      {p.cover_url && (
        <div className="bg-ink pb-10">
          <div className="shell">
            <div className="relative aspect-[16/9] overflow-hidden rounded-card md:aspect-[21/9]">
              <Image src={asset(p.cover_url)} alt="" fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
        </div>
      )}

      <section aria-labelledby="overview" className="bg-paper py-16 md:py-24">
        <div className="shell grid gap-6 lg:grid-cols-12 lg:gap-12">
          <h2 id="overview" className="text-title font-bold lg:col-span-4">
            {PR.overview}
          </h2>
          <Reveal className="lg:col-span-8">
            <p className="prose-school">{p.overview}</p>
            {p.source_note && (
              <SourceNote className="mt-6" locale={locale}>
                {p.source_note}
              </SourceNote>
            )}
          </Reveal>
        </div>
      </section>

      {(p.outcomes.length > 0 || p.pathways.length > 0) && (
        <section aria-label={PR.highlights} className="bg-white py-16 md:py-24">
          <div className="shell grid gap-10 lg:grid-cols-2">
            {[
              [PR.outcomes, p.outcomes, PR.outcomesPending],
              [PR.after, p.pathways, PR.afterPending],
            ].map(([title, list, pending]) => (
              <div key={title as string}>
                <h2 className="text-title font-bold">{title as string}</h2>
                {(list as string[]).length ? (
                  <ul className="mt-6 space-y-3">
                    {(list as string[]).map((o) => (
                      <li key={o} className="flex gap-3 rounded-2xl bg-paper p-4 text-lg">
                        <Check aria-hidden className="mt-1 size-5 shrink-0 text-blue" />
                        {o}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <PendingBlock title={pending as string} className="mt-6" locale={locale} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {subjects.length > 0 && (
        <section aria-labelledby="subjects" className="bg-paper py-16 md:py-24">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="subjects" className="text-title font-bold">
                {T.home_.subjects}
              </h2>
              <p className="max-w-md text-sm text-muted">{PR.subjectsNote}</p>
            </div>
            <RevealGroup className="mt-8 flex flex-wrap gap-2" stagger={0.03}>
              {subjects.map((s) => (
                <RevealItem key={s.id}>
                  <span className="inline-flex rounded-pill bg-white px-5 py-3 text-lg font-semibold tracking-[-0.01em]">{s.name}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-white py-16 md:py-24">
          <div className="shell">
            <h2 id="related" className="text-title font-bold">
              {PR.related}
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <NewsCard key={n.id} item={n} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-paper py-16">
        <div className="shell flex flex-col justify-between gap-6 md:flex-row md:items-center">
          {others.length > 0 && (
            <div>
              <p className="text-muted">{PR.others}</p>
              <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={lp(locale, `/programet/${o.slug}`)} className="link-underline text-2xl font-bold tracking-[-0.03em]">
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ButtonLink href={lp(locale, "/kontakti")} variant="ink">
            {PR.ask}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
