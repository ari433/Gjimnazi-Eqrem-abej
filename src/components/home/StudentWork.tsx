import Link from "next/link";
import { ArrowUpRight, Clapperboard, Lightbulb, Play, Trophy } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PendingBadge } from "@/components/ui/Pending";
import { lp, t, type Locale } from "@/lib/i18n";
import type { Achievement, Club, StudentProject } from "@/lib/types";

/** Bento of student work: what actually exists today, each linking to its page. */
export function StudentWork({
  mediaClub,
  projects,
  achievements,
  locale = "sq",
}: {
  mediaClub: Club | null;
  projects: StudentProject[];
  achievements: Achievement[];
  locale?: Locale;
}) {
  const T = t(locale);
  const project = projects[0];
  const award = achievements[0];

  return (
    <RevealGroup className="grid gap-3 md:auto-rows-[minmax(14rem,auto)] md:grid-cols-6 md:gap-4">
      <RevealItem className="md:col-span-3 md:row-span-2">
        <Link href={lp(locale, "/arritjet")} className="group grain relative flex h-full min-h-[20rem] flex-col justify-between overflow-hidden rounded-card bg-ink p-7 text-white md:p-10">
          <Trophy aria-hidden className="relative size-6 text-blue-soft" />
          <div className="relative">
            {award ? (
              <>
                <p className="text-sm text-white/60">
                  {award.year}, {award.category}
                </p>
                <h3 className="mt-2 text-[clamp(1.7rem,3.2vw,2.8rem)] font-bold leading-[1.02] tracking-[-0.035em]">{award.title}</h3>
                <p className="mt-3 max-w-md text-white/70">{award.description}</p>
              </>
            ) : (
              <h3 className="text-3xl font-bold">{T.pages.achievements[0]}</h3>
            )}
            <span className="mt-6 inline-flex items-center gap-2 font-semibold">
              {T.pages.achievements[0]}
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </RevealItem>

      <RevealItem className="md:col-span-3">
        <Link href={lp(locale, "/projektet")} className="group flex h-full min-h-[13rem] flex-col justify-between rounded-card bg-blue p-7 text-white transition-colors hover:bg-blue-deep">
          <Lightbulb aria-hidden className="size-6" />
          <div>
            <p className="text-sm text-white/70">{T.pages.projects[0]}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em]">{project ? project.title : T.projects_.empty}</h3>
            {project && <p className="mt-1.5 text-white/80">{project.summary}</p>}
          </div>
        </Link>
      </RevealItem>

      <RevealItem className="md:col-span-3">
        <Link href={lp(locale, "/klubi-i-medias")} className="group relative flex h-full min-h-[13rem] flex-col justify-between overflow-hidden rounded-card border border-line bg-white p-7 transition-colors hover:border-ink">
          <Play aria-hidden strokeWidth={1} className="pointer-events-none absolute -right-8 -top-6 size-48 fill-blue-soft text-blue-soft transition-transform duration-700 group-hover:scale-110" />
          <Clapperboard aria-hidden className="relative size-6 text-blue" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-bold tracking-[-0.03em]">{mediaClub?.name ?? T.pages.media[0]}</h3>
              {mediaClub?.verification === "pending" && <PendingBadge locale={locale} />}
            </div>
            <p className="mt-1.5 text-muted">{mediaClub?.summary ?? T.pages.media[1]}</p>
          </div>
        </Link>
      </RevealItem>
    </RevealGroup>
  );
}
