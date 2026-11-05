import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { HistoryScroller } from "@/components/about/HistoryScroller";
import { SourceNote } from "@/components/ui/Pending";
import { getSiteContent } from "@/lib/content/queries";
import { PZHSH_SOURCE, PZHSH_SOURCE_DE, PZHSH_URL } from "@/lib/content/seed";
import { t, type Locale } from "@/lib/i18n";

export async function HistoryView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const H = T.history_;
  const site = await getSiteContent(locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.history[0]} crumbs={[{ label: T.pages.about[0], href: "/rreth-shkolles" }, { label: T.pages.history[0] }]} lede={H.lede} />
      <HistoryScroller entries={site.history} label={H.timeline} />
      <section className="bg-paper pb-16">
        <div className="shell">
          <SourceNote locale={locale}>
            <a href={PZHSH_URL} target="_blank" rel="noopener noreferrer" className="link-underline">
              {locale === "de" ? PZHSH_SOURCE_DE : PZHSH_SOURCE}
            </a>
            . {H.note}
          </SourceNote>
        </div>
      </section>

      <section aria-labelledby="mission" className="grain relative overflow-hidden bg-ink py-20 text-white md:py-28">
        <div className="shell relative grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <h2 id="mission" className="text-base font-semibold text-blue-soft">
              {T.home_.vision}
            </h2>
            <p className="mt-3 text-title font-bold">{site.intro.vision}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-base font-semibold text-blue-soft">{T.home_.mission}</h2>
            <p className="mt-3 text-title font-bold">{site.intro.mission}</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="cabej" className="bg-white py-20 md:py-28">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-12">
          <p aria-hidden className="text-[clamp(7rem,20vw,16rem)] font-bold leading-[0.8] tracking-[-0.06em] text-blue lg:col-span-5">
            Ç
          </p>
          <Reveal className="lg:col-span-7">
            <h2 id="cabej" className="text-title font-bold">
              {H.nameTitle}
            </h2>
            <div className="prose-school mt-6">
              {H.nameBody.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
