import Link from "next/link";
import { ArrowUpRight, Clapperboard, Lightbulb, Play, Trophy } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PendingBadge } from "@/components/ui/Pending";
import type { Achievement, Club, StudentProject } from "@/lib/types";

/**
 * Bento of student work. Each tile states what actually exists today and
 * points to its page; nothing is padded with invented results.
 */
export function StudentWork({
  mediaClub,
  projects,
  achievements,
}: {
  mediaClub: Club | null;
  projects: StudentProject[];
  achievements: Achievement[];
}) {
  const latestProject = projects[0];
  const latestAchievement = achievements[0];

  return (
    <RevealGroup className="grid auto-rows-[minmax(15rem,auto)] gap-4 md:grid-cols-6">
      <RevealItem className="md:col-span-4 md:row-span-2">
        <Link
          href="/klubi-i-medias"
          className="group grain relative flex h-full min-h-[24rem] flex-col justify-between overflow-hidden rounded-card bg-ink p-8 text-white md:p-12"
        >
          <Play
            aria-hidden
            strokeWidth={1}
            className="pointer-events-none absolute -right-16 -top-10 size-[26rem] fill-blue/30 text-blue/50 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:-translate-x-6 group-hover:scale-105"
          />
          <div className="relative flex items-center gap-3">
            <Clapperboard aria-hidden className="size-5 text-blue-soft" />
            <span className="text-sm text-white/70">Jeta shkollore</span>
            {mediaClub?.verification === "pending" && <PendingBadge className="bg-white/10 text-white/80" />}
          </div>
          <div className="relative">
            <h3 className="text-mega font-bold">{mediaClub?.name ?? "Klubi i Medias"}</h3>
            <p className="mt-4 max-w-md text-lg text-white/75">
              {mediaClub?.summary ?? "Video, podkaste dhe gazetari nga nxënësit."}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold">
              Shiko klubin
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </RevealItem>

      <RevealItem className="md:col-span-2">
        <Link
          href="/projektet"
          className="group flex h-full flex-col justify-between rounded-card bg-blue p-8 text-white transition-colors hover:bg-blue-deep"
        >
          <Lightbulb aria-hidden className="size-6" />
          <div>
            <h3 className="text-2xl font-bold tracking-[-0.03em]">Projektet e nxënësve</h3>
            <p className="mt-2 text-white/80">
              {latestProject ? latestProject.title : "Projektet do të publikohen këtu sapo të shtohen nga stafi."}
            </p>
          </div>
        </Link>
      </RevealItem>

      <RevealItem className="md:col-span-2">
        <Link
          href="/arritjet"
          className="group flex h-full flex-col justify-between rounded-card border border-line bg-white p-8 transition-colors hover:border-ink"
        >
          <Trophy aria-hidden className="size-6 text-blue" />
          <div>
            <h3 className="text-2xl font-bold tracking-[-0.03em]">Arritjet</h3>
            <p className="mt-2 text-muted">
              {latestAchievement
                ? `${latestAchievement.title}, ${latestAchievement.year}`
                : "Çmimet dhe sukseset e verifikuara të nxënësve do të listohen këtu."}
            </p>
          </div>
        </Link>
      </RevealItem>
    </RevealGroup>
  );
}
