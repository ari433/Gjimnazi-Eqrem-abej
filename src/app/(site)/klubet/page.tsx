import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { MediaFrame } from "@/components/ui/Media";
import { PendingBadge } from "@/components/ui/Pending";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getClubs } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Klubet e shkollës",
  description: "Klubet ku nxënësit e Gjimnazit \"Eqrem Çabej\" takohen, krijojnë dhe mësojnë jashtë orës.",
  alternates: { canonical: "/klubet" },
};

export default async function ClubsPage() {
  const clubs = await getClubs();
  return (
    <>
      <PageHero title="Klubet" crumbs={[{ label: "Klubet" }]} lede="Ku nxënësit takohen jashtë orës së mësimit." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          {clubs.length === 0 ? (
            <EmptyState icon={Users} title="Klubet do të publikohen së shpejti">
              Lista e klubeve, mentorët dhe oraret e takimeve shtohen nga stafi.
            </EmptyState>
          ) : (
            <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((c) => (
                <RevealItem key={c.id}>
                  <article id={c.slug} className="group relative flex h-full scroll-mt-28 flex-col rounded-card bg-white p-3">
                    <MediaFrame src={c.cover_url} label={c.name} tone={c.is_media_club ? "ink" : "paper"} className="aspect-[4/3] rounded-[0.9rem]" sizes="(min-width: 1024px) 33vw, 100vw" />
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap gap-2">{c.verification === "pending" && <PendingBadge />}</div>
                      <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{c.name}</h2>
                      <p className="mt-2 text-muted">{c.summary}</p>
                      {c.meeting_info && <p className="mt-3 text-sm font-semibold">{c.meeting_info}</p>}
                      {c.is_media_club && (
                        <Link href="/klubi-i-medias" className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold after:absolute after:inset-0">
                          Hap faqen e klubit
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
            Je mentor apo nxënës në një klub që nuk është në listë? Na shkruaj te{" "}
            <Link href="/kontakti" className="link-underline font-semibold text-ink">
              kontakti
            </Link>{" "}
            që të shtohet.
          </p>
        </div>
      </section>
    </>
  );
}
