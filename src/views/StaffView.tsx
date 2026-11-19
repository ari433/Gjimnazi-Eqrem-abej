import Image from "next/image";
import { Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PendingBadge, PendingBlock, SourceNote } from "@/components/ui/Pending";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { getStaff } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";
import type { StaffMember } from "@/lib/types";
import { asset } from "@/lib/utils";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

function Person({ p, large = false, locale }: { p: StaffMember; large?: boolean; locale: Locale }) {
  return (
    <article className="flex h-full flex-col rounded-card bg-white p-3">
      <div className={`relative overflow-hidden rounded-[0.9rem] bg-blue-soft ${large ? "aspect-[4/5]" : "aspect-square"}`}>
        {p.photo_url ? (
          <Image src={asset(p.photo_url)} alt={`${t(locale).staff_.photoOf} ${p.full_name}`} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover object-top" />
        ) : (
          <span aria-hidden className="absolute inset-0 grid place-items-center text-[clamp(3rem,7vw,6rem)] font-bold tracking-[-0.05em] text-blue">
            {initials(p.full_name)}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-blue-deep">{p.role_title}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em]">{p.full_name}</h3>
        {p.department && !p.is_leadership && <p className="text-muted">{p.department}</p>}
        {p.bio && <p className="mt-3 text-muted">{p.bio}</p>}
        {p.email && (
          <a href={`mailto:${p.email}`} className="link-underline mt-3 inline-block text-sm font-semibold">
            {p.email}
          </a>
        )}
        {p.verification === "pending" && <PendingBadge className="mt-3" locale={locale} />}
        {p.source_note && (
          <SourceNote className="mt-3" locale={locale}>
            {p.source_note}
          </SourceNote>
        )}
      </div>
    </article>
  );
}

export async function StaffView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const S = T.staff_;
  const staff = await getStaff(locale);
  const leaders = staff.filter((s) => s.is_leadership);
  const teachers = staff.filter((s) => !s.is_leadership);
  const departments = Array.from(new Set(teachers.map((x) => x.department ?? "–")));
  const withVideo = leaders.find((l) => l.video_url);

  return (
    <>
      <PageHero locale={locale} title={T.pages.staff[0]} crumbs={[{ label: T.pages.about[0], href: "/rreth-shkolles" }, { label: T.pages.staff[0] }]} lede={T.pages.staff[1]} />

      <section aria-labelledby="leadership" className="bg-paper pb-20">
        <div className="shell">
          <h2 id="leadership" className="text-title font-bold">
            {S.leadership}
          </h2>
          {leaders.length === 0 ? (
            <EmptyState icon={Users} title={S.leadership} className="mt-10" />
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-12 md:items-end">
              <RevealGroup className="grid gap-4 sm:grid-cols-2 md:col-span-4 md:grid-cols-1">
                {leaders.map((p) => (
                  <RevealItem key={p.id}>
                    <Person p={p} large locale={locale} />
                  </RevealItem>
                ))}
              </RevealGroup>
              {withVideo?.video_url && (
                <div className="md:col-span-8">
                  <p className="mb-3 text-sm font-semibold text-muted">{S.interview}</p>
                  <VideoEmbed url={withVideo.video_url} title={`${S.interview}: ${withVideo.full_name}`} playLabel={T.gallery_.play} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="teachers" className="bg-white py-20">
        <div className="shell">
          <h2 id="teachers" className="text-title font-bold">
            {S.teachers}
          </h2>
          {teachers.length === 0 ? (
            <PendingBlock title={S.teachersPending} className="mt-8" locale={locale}>
              {S.teachersPendingBody}
            </PendingBlock>
          ) : (
            departments.map((d) => (
              <div key={d} className="mt-10">
                {/* Teachers without a department sit in one plain grid; the card shows their subject. */}
                {d !== "–" && <h3 className="text-xl font-semibold text-muted">{d}</h3>}
                <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {teachers
                    .filter((x) => (x.department ?? "–") === d)
                    .map((p) => (
                      <RevealItem key={p.id}>
                        <Person p={p} locale={locale} />
                      </RevealItem>
                    ))}
                </RevealGroup>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
