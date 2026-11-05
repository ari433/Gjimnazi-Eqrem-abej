import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clapperboard, Headphones, Lightbulb, Mic, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PendingBadge } from "@/components/ui/Pending";
import { ButtonLink } from "@/components/ui/Button";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { EventRow } from "@/components/events/EventRow";
import { getEventsSplit, getMediaClub } from "@/lib/content/queries";
import { asset, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Klubi i Medias",
  description: "Video, podkaste dhe projekte mediatike nga nxënësit e Gjimnazit \"Eqrem Çabej\".",
  alternates: { canonical: "/klubi-i-medias" },
};

export default async function MediaClubPage() {
  const [{ club, members, media, projects }, { upcoming }] = await Promise.all([getMediaClub(), getEventsSplit()]);
  const videos = media.filter((m) => m.kind === "video");
  const podcasts = media.filter((m) => m.kind === "podcast");
  const photos = media.filter((m) => m.kind === "image");
  const [featured, ...moreVideos] = videos;
  const clubEvents = upcoming.filter((e) => /media|film|podcast|video/i.test(`${e.category} ${e.title}`));

  return (
    <div className="grain relative bg-ink text-white">
      {/* Hero */}
      <header className="relative overflow-hidden pb-16 pt-36 md:pt-44">
        <div className="shell relative">
          <Breadcrumbs tone="ink" items={[{ label: "Klubet", href: "/klubet" }, { label: "Klubi i Medias" }]} />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1.5 text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-blue" />
              </span>
              Nga nxënësit, për nxënësit
            </span>
            {club?.verification === "pending" && <PendingBadge className="bg-white/10 text-white/80" />}
          </div>
          <MaskText as="h1" immediate text={club?.name ?? "Klubi i Medias"} className="mt-6 text-display font-bold" />
          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <p className="text-lede text-white/75 md:col-span-6">{club?.description ?? "Faqja e klubit po përgatitet."}</p>
            <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end md:self-end">
              <ButtonLink href="#video" variant="light" icon={false}>
                Shiko produksionet
              </ButtonLink>
              <ButtonLink href="/kontakti" variant="ghost" className="border-white/25 text-white hover:border-white hover:bg-white hover:text-ink">
                Bashkohu me klubin
              </ButtonLink>
            </div>
          </div>
        </div>
      </header>

      {/* What the club does */}
      <section aria-label="Çfarë bën klubi" className="border-y border-white/10">
        <div className="shell grid divide-y divide-white/10 md:grid-cols-4 md:divide-x md:divide-y-0">
          {[
            { icon: Clapperboard, title: "Video", text: "Reportazhe, dokumentarë të shkurtër dhe mbulim i aktiviteteve." },
            { icon: Mic, title: "Podkaste", text: "Biseda me nxënës, mësimdhënës dhe të ftuar." },
            { icon: Lightbulb, title: "Projekte", text: "Fushata dhe produksione për shkollën dhe komunitetin." },
            { icon: Users, title: "Ekipi", text: "Kameramanë, montazhierë, gazetarë dhe prezantues." },
          ].map((f) => (
            <div key={f.title} className="py-8 md:px-8 md:py-10 first:md:pl-0">
              <f.icon aria-hidden className="size-6 text-blue-soft" />
              <h2 className="mt-4 text-xl font-bold tracking-[-0.02em]">{f.title}</h2>
              <p className="mt-1 text-white/65">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section id="video" aria-labelledby="videos-title" className="scroll-mt-24 py-24 md:py-32">
        <div className="shell">
          <h2 id="videos-title" className="text-title font-bold">
            Produksionet
          </h2>
          {featured ? (
            <div className="mt-12 grid gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-8">
                <VideoEmbed url={featured.url} title={featured.title} poster={featured.thumbnail_url} />
              </Reveal>
              <div className="lg:col-span-4">
                <p className="text-sm text-white/60">{formatDate(featured.published_at)}</p>
                <h3 className="mt-2 text-3xl font-bold tracking-[-0.03em]">{featured.title}</h3>
                {featured.caption && <p className="mt-3 text-white/70">{featured.caption}</p>}
              </div>
              {moreVideos.length > 0 && (
                <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3">
                  {moreVideos.map((v) => (
                    <RevealItem key={v.id}>
                      <VideoEmbed url={v.url} title={v.title} poster={v.thumbnail_url} />
                      <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
                    </RevealItem>
                  ))}
                </RevealGroup>
              )}
            </div>
          ) : (
            <EmptyState tone="dark" icon={Clapperboard} title="Produksioni i parë po vjen" className="mt-12">
              Videot e klubit publikohen këtu sapo mentorët t&apos;i ngarkojnë nga paneli.
            </EmptyState>
          )}
        </div>
      </section>

      {/* Podcasts */}
      <section aria-labelledby="podcasts-title" className="bg-white/[0.03] py-24 md:py-32">
        <div className="shell">
          <h2 id="podcasts-title" className="text-title font-bold">
            Podkastet
          </h2>
          {podcasts.length ? (
            <ul className="mt-12">
              {podcasts.map((p, i) => (
                <li key={p.id} className="grid gap-4 border-t border-white/10 py-6 md:grid-cols-12 md:items-center">
                  <span className="text-sm tabular-nums text-white/50 md:col-span-1">Ep. {podcasts.length - i}</span>
                  <div className="md:col-span-6">
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    {p.caption && <p className="text-white/60">{p.caption}</p>}
                  </div>
                  <div className="md:col-span-5">
                    {/\.(mp3|m4a|ogg|wav)(\?|$)/i.test(p.url) ? (
                      <audio controls preload="none" className="w-full">
                        <source src={p.url} />
                      </audio>
                    ) : (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2 font-semibold">
                        <Headphones aria-hidden className="size-4" /> Dëgjo episodin
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState tone="dark" icon={Mic} title="Episodet e para po incizohen" className="mt-12" />
          )}
        </div>
      </section>

      {/* Projects + photos */}
      {(projects.length > 0 || photos.length > 0) && (
        <section aria-labelledby="club-projects" className="py-24 md:py-32">
          <div className="shell">
            <h2 id="club-projects" className="text-title font-bold">
              Projektet e klubit
            </h2>
            <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <RevealItem key={p.id}>
                  <article className="h-full rounded-card bg-white/[0.05] p-6">
                    <p className="text-sm text-white/50">{p.school_year}</p>
                    <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
                    <p className="mt-2 text-white/70">{p.summary}</p>
                  </article>
                </RevealItem>
              ))}
              {photos.slice(0, 6).map((m) => (
                <RevealItem key={m.id}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-white/5">
                    <Image src={asset(m.url)} alt={m.caption ?? m.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* Team */}
      <section aria-labelledby="team-title" className="py-24 md:py-32">
        <div className="shell">
          <h2 id="team-title" className="text-title font-bold">
            Ekipi
          </h2>
          {members.length ? (
            <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((m) => (
                <li key={m.id} className="border-t border-white/15 pt-4">
                  <p className="text-xl font-semibold">{m.display_name}</p>
                  <p className="text-white/60">{m.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState tone="dark" icon={Users} title="Ekipi publikohet me pëlqimin e nxënësve" className="mt-12">
              Emrat e anëtarëve shfaqen vetëm pasi nxënësit dhe prindërit të japin pëlqimin.
            </EmptyState>
          )}
        </div>
      </section>

      {clubEvents.length > 0 && (
        <section aria-labelledby="club-events" className="bg-paper py-24 text-ink">
          <div className="shell">
            <h2 id="club-events" className="text-title font-bold">
              Aktivitetet e klubit
            </h2>
            <ul className="mt-10">
              {clubEvents.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="shell">
          <Link href="/klubet" className="link-underline font-semibold text-white/80 hover:text-white">
            Shiko të gjitha klubet
          </Link>
        </div>
      </section>
    </div>
  );
}
