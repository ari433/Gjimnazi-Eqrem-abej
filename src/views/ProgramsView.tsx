import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PendingBadge } from "@/components/ui/Pending";
import { getPrograms } from "@/lib/content/queries";
import { lp, t, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/utils";

export async function ProgramsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const programs = await getPrograms(locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.programs[0]} crumbs={[{ label: T.pages.programs[0] }]} lede={T.home_.programsLede} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          {programs.length === 0 ? (
            <EmptyState icon={BookOpen} title={T.pages.programs[0]} />
          ) : (
            <RevealGroup className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
              {programs.map((p) => (
                <RevealItem key={p.id}>
                  <Link href={lp(locale, `/programet/${p.slug}`)} className="group grain relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-card bg-ink p-7 text-white md:min-h-[32rem] md:p-10">
                    {p.cover_url && (
                      <Image src={asset(p.cover_url)} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-45 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                    )}
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                    <div className="relative">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-white/70">{p.grades}</span>
                        {p.verification === "pending" && <PendingBadge locale={locale} />}
                      </div>
                      <h2 className="mt-2 text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[0.98] tracking-[-0.035em]">{p.name}</h2>
                      <p className="mt-3 max-w-lg text-white/80">{p.summary}</p>
                      <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                        {T.home_.openProgram}
                        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>
    </>
  );
}
