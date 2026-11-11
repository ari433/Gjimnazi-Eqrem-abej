import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { ProgramsExplorer } from "@/components/home/ProgramsExplorer";
import { StudentWork } from "@/components/home/StudentWork";
import { NewsSection } from "@/components/home/NewsSection";
import { DirectorSection } from "@/components/home/DirectorSection";
import { SchoolLife, type LifeTab } from "@/components/home/SchoolLife";
import { Stats } from "@/components/home/Stats";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { EventsSection } from "@/components/home/EventsSection";
import { EnrollmentCta } from "@/components/home/EnrollmentCta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getAchievements,
  getAnnouncements,
  getClubs,
  getMedia,
  getNews,
  getPrograms,
  getProjects,
  getSiteContent,
  getStaff,
  getStats,
  getUpcomingEvents,
} from "@/lib/content/queries";
import { PZHSH_SOURCE, PZHSH_SOURCE_DE } from "@/lib/content/seed";
import { lp, t, type Locale } from "@/lib/i18n";

const LIFE: Record<Locale, (clubs: { name: string; summary: string; slug: string; is_media_club: boolean }[]) => LifeTab[]> = {
  sq: (clubs) => [
    {
      key: "aktivitetet",
      label: "Aktivitetet",
      heading: "Ditë që e bëjnë vitin",
      items: [
        { title: "Dita e solidaritetit" },
        { title: "Dita e projekteve" },
        { title: "Panairi i karrierës" },
        { title: "Dita e dyerve të hapura" },
      ],
    },
    { key: "sporti", label: "Sporti", heading: "Gara sportive", items: [{ title: "Volejboll" }, { title: "Basketboll" }, { title: "Futboll" }] },
    {
      key: "zeri",
      label: "Zëri i nxënësve",
      heading: "Përfaqësimi",
      items: [
        { title: "Këshilli i Nxënësve", text: "Kryetare 2026–2027: Ana Arifi", href: "/lajme/keshilli-i-nxenesve-2026-2027" },
        { title: "Këshilli i Prindërve" },
      ],
    },
    { key: "klubet", label: "Klubet", heading: "Klubet e shkollës", items: clubs.map((c) => ({ title: c.name, text: c.summary, href: c.is_media_club ? "/klubi-i-medias" : `/klubet#${c.slug}` })) },
  ],
  de: (clubs) => [
    {
      key: "aktivitetet",
      label: "Aktionstage",
      heading: "Tage, die das Schuljahr prägen",
      items: [{ title: "Tag der Solidarität" }, { title: "Projekttag" }, { title: "Berufsmesse" }, { title: "Tag der offenen Tür" }],
    },
    { key: "sporti", label: "Sport", heading: "Sportturniere", items: [{ title: "Volleyball" }, { title: "Basketball" }, { title: "Fußball" }] },
    {
      key: "zeri",
      label: "Schülerstimme",
      heading: "Mitbestimmung",
      items: [
        { title: "Schülerrat", text: "Vorsitzende 2026–2027: Ana Arifi", href: "/lajme/keshilli-i-nxenesve-2026-2027" },
        { title: "Elternrat" },
      ],
    },
    { key: "klubet", label: "Clubs", heading: "Clubs der Schule", items: clubs.map((c) => ({ title: c.name, text: c.summary, href: c.is_media_club ? "/klubi-i-medias" : `/klubet#${c.slug}` })) },
  ],
};

export async function HomeView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const [site, programs, news, announcements, events, stats, media, clubs, projects, achievements, staff] = await Promise.all([
    getSiteContent(locale),
    getPrograms(locale),
    getNews(6, locale),
    getAnnouncements(3, locale),
    getUpcomingEvents(4, locale),
    getStats(locale),
    getMedia(locale),
    getClubs(locale),
    getProjects(locale),
    getAchievements(locale),
    getStaff(locale),
  ]);
  const lifeTabs = LIFE[locale](clubs).map((tab) => ({ ...tab, items: tab.items.map((i) => ({ ...i, href: "href" in i && i.href ? lp(locale, i.href) : undefined })) }));

  return (
    <>
      {/* The hero pins inside this wrapper while the introduction slides over it. */}
      <div className="relative">
        <Hero hero={site.hero} locale={locale} />
        <Intro intro={site.intro} locale={locale} />
      </div>

      <section aria-labelledby="programs-title" className="bg-paper py-20 md:py-32">
        <div className="shell">
          <SectionHeading id="programs-title" title={T.home_.programsTitle} lede={T.home_.programsLede} link={{ href: lp(locale, "/programet"), label: T.home_.allPrograms }} />
          <div className="mt-10 md:mt-14">
            <ProgramsExplorer programs={programs} locale={locale} />
          </div>
        </div>
      </section>

      <NewsSection news={news} announcements={announcements} locale={locale} />

      <section aria-labelledby="work-title" className="bg-paper pb-20 md:pb-32">
        <div className="shell">
          <SectionHeading id="work-title" title={T.home_.workTitle} />
          <div className="mt-10 md:mt-14">
            <StudentWork mediaClub={clubs.find((c) => c.is_media_club) ?? null} projects={projects} achievements={achievements} locale={locale} />
          </div>
        </div>
      </section>

      <DirectorSection director={staff.find((s) => s.is_leadership)} locale={locale} />
      <Stats stats={stats} locale={locale} />
      <GalleryStrip media={media.filter((m) => !m.url.includes("pema-e-gjuheve"))} locale={locale} />

      <section aria-labelledby="life-title" className="bg-blue-soft py-20 md:py-32">
        <div className="shell">
          <SectionHeading id="life-title" title={T.home_.lifeTitle} lede={T.home_.lifeLede} />
          <div className="mt-10 md:mt-14">
            <SchoolLife tabs={lifeTabs} source={locale === "de" ? PZHSH_SOURCE_DE : PZHSH_SOURCE} sourceLabel={T.source} label={T.home_.lifeTitle} />
          </div>
        </div>
      </section>

      <EventsSection events={events} locale={locale} />
      <EnrollmentCta enrollment={site.enrollment} locale={locale} />
    </>
  );
}
