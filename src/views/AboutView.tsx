import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SourceNote } from "@/components/ui/Pending";
import { getPrograms, getSiteContent, getStaff } from "@/lib/content/queries";
import { PZHSH_SOURCE, PZHSH_SOURCE_DE, PZHSH_URL } from "@/lib/content/seed";
import { lp, t, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/utils";

const SPACES: Record<Locale, string[]> = {
  sq: ["Kabineti i gjuhëve", "Kabineti i biologjisë", "Kabineti i fizikës", "Kabineti i artit muzikor", "Kabineti i TIK-ut", "Biblioteka", "Salla e sportit"],
  de: ["Sprachlabor", "Biologieraum", "Physikraum", "Musikraum", "Informatikraum", "Bibliothek", "Sporthalle"],
};

export async function AboutView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const A = T.about_;
  const [site, staff, programs] = await Promise.all([getSiteContent(locale), getStaff(locale), getPrograms(locale)]);
  const director = staff.find((s) => s.is_leadership);
  const facts = [
    { label: A.facts.profile, value: programs[0]?.name ?? "" },
    { label: A.facts.address, value: `${site.contact.address}, ${site.contact.city}` },
    { label: A.facts.building, value: A.facts.buildingValue },
    ...(director ? [{ label: director.role_title, value: director.full_name }] : []),
  ];

  return (
    <>
      <PageHero locale={locale} title={T.pages.about[0]} crumbs={[{ label: T.pages.about[0] }]} lede={site.intro.heading} />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-card">
              <Image src={asset("/media/vizite-ore-mesimi.webp")} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" priority />
            </div>
            <p className="mt-8 font-serif text-[clamp(1.2rem,2vw,1.55rem)] leading-[1.55]">{site.intro.body}</p>
            <SourceNote className="mt-6" locale={locale}>
              <a href={PZHSH_URL} target="_blank" rel="noopener noreferrer" className="link-underline">
                {locale === "de" ? PZHSH_SOURCE_DE : PZHSH_SOURCE}
              </a>
            </SourceNote>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <dl className="rounded-card bg-white p-7">
              {facts.map((f) => (
                <div key={f.label} className="border-b border-line py-4 first:pt-0 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold tracking-[-0.01em]">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-line">
              {[
                [T.home_.vision, site.intro.vision],
                [T.home_.mission, site.intro.mission],
              ].map(([l, v]) => (
                <div key={l} className="bg-white p-5">
                  <p className="text-sm font-semibold text-blue-deep">{l}</p>
                  <p className="mt-1 font-semibold leading-snug">{v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="spaces" className="bg-white py-20 md:py-28">
        <div className="shell">
          <h2 id="spaces" className="text-title font-bold">
            {A.spaces}
          </h2>
          <RevealGroup className="mt-10 flex flex-wrap gap-2">
            {SPACES[locale].map((f) => (
              <RevealItem key={f}>
                <span className="inline-flex rounded-pill bg-paper px-5 py-3 text-lg font-semibold tracking-[-0.01em]">{f}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section aria-label={A.more} className="bg-paper py-20 md:py-28">
        <div className="shell grid gap-3 md:grid-cols-3 md:gap-4">
          {(["history", "staff", "programs"] as const).map((k) => {
            const href = { history: "/historia-dhe-misioni", staff: "/udheheqja-dhe-stafi", programs: "/programet" }[k];
            return (
              <Link key={k} href={lp(locale, href)} className="group flex min-h-44 flex-col justify-between rounded-card bg-ink p-7 text-white transition-colors hover:bg-blue md:min-h-56">
                <ArrowUpRight aria-hidden className="size-6 self-end transition-transform duration-500 group-hover:rotate-45" />
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.03em]">{T.pages[k][0]}</h2>
                  <p className="mt-1 text-white/70">{T.pages[k][1]}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
