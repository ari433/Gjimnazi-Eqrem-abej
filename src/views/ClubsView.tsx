import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { MediaFrame } from "@/components/ui/Media";
import { PendingBadge } from "@/components/ui/Pending";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getClubs } from "@/lib/content/queries";
import { lp, t, type Locale } from "@/lib/i18n";

export async function ClubsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const C = T.clubs_;
  const clubs = await getClubs(locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.clubs[0]} crumbs={[{ label: T.pages.clubs[0] }]} lede={T.pages.clubs[1]} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          {clubs.length === 0 ? (
            <EmptyState icon={Users} title={C.empty} />
          ) : (
            <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((c) => (
                <RevealItem key={c.id}>
                  <article id={c.slug} className="group relative flex h-full scroll-mt-28 flex-col rounded-card bg-white p-3">
                    <MediaFrame src={c.cover_url} tone={c.is_media_club ? "ink" : "paper"} className="aspect-[16/10] rounded-[0.9rem]" sizes="(min-width: 1024px) 33vw, 100vw" />
                    <div className="flex flex-1 flex-col p-4">
                      {c.verification === "pending" && <PendingBadge className="self-start" locale={locale} />}
                      <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{c.name}</h2>
                      <p className="mt-1.5 text-muted">{c.summary}</p>
                      {c.meeting_info && <p className="mt-3 text-sm font-semibold">{c.meeting_info}</p>}
                      {c.is_media_club && (
                        <Link href={lp(locale, "/klubi-i-medias")} className="mt-auto inline-flex items-center gap-2 pt-5 font-semibold after:absolute after:inset-0">
                          {C.open}
                          <ArrowUpRight aria-hidden className="size-4" />
                        </Link>
                      )}
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
          <p className="mt-10 max-w-2xl text-muted">
            {C.missing}{" "}
            <Link href={lp(locale, "/kontakti")} className="link-underline font-semibold text-ink">
              {T.contact}
            </Link>
            {C.missingEnd.startsWith(".") ? C.missingEnd : ` ${C.missingEnd}`}
          </p>
        </div>
      </section>
    </>
  );
}
