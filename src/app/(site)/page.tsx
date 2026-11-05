import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { ProgramsExplorer } from "@/components/home/ProgramsExplorer";
import { StudentWork } from "@/components/home/StudentWork";
import { NewsSection } from "@/components/home/NewsSection";
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
  getProgram,
  getPrograms,
  getProjects,
  getSiteContent,
  getStats,
  getUpcomingEvents,
} from "@/lib/content/queries";
import { PZHSH_SOURCE } from "@/lib/content/seed";

export default async function HomePage() {
  const [site, programs, news, announcements, events, stats, media, clubs, projects, achievements] = await Promise.all([
    getSiteContent(),
    getPrograms(),
    getNews(6),
    getAnnouncements(3),
    getUpcomingEvents(4),
    getStats(),
    getMedia(),
    getClubs(),
    getProjects(),
    getAchievements(),
  ]);

  const programsWithSubjects = await Promise.all(
    programs.map(async (p) => {
      const detail = await getProgram(p.slug);
      return { ...p, subjectNames: detail?.subjects.map((s) => s.name) ?? [] };
    }),
  );

  const lifeTabs: LifeTab[] = [
    {
      key: "aktivitetet",
      label: "Aktivitetet",
      heading: "Ditë që e bëjnë vitin",
      items: [
        { title: "Dita e solidaritetit", text: "Nxënësit dhe stafi bashkë për komunitetin." },
        { title: "Dita e projekteve", text: "Nxënësit prezantojnë punën e tyre." },
        { title: "Panairi i karrierës", text: "Njohje me studimet dhe profesionet pas gjimnazit." },
        { title: "Dita e dyerve të hapura", text: "Shkolla hap dyert për nxënësit e ardhshëm dhe prindërit." },
      ],
    },
    {
      key: "sporti",
      label: "Sporti",
      heading: "Gara sportive",
      items: [
        { title: "Volejboll", text: "Gara brenda dhe jashtë shkollës." },
        { title: "Basketboll", text: "Gara brenda dhe jashtë shkollës." },
        { title: "Futboll", text: "Gara brenda dhe jashtë shkollës." },
      ],
    },
    {
      key: "zeri",
      label: "Zëri i nxënësve",
      heading: "Përfaqësimi",
      items: [
        { title: "Këshilli i Nxënësve", text: "Përfaqëson nxënësit në vendimmarrjen e shkollës.", href: "/per-nxenesit" },
        { title: "Këshilli i Prindërve", text: "Lidhja mes familjeve dhe shkollës." },
      ],
    },
    {
      key: "klubet",
      label: "Klubet",
      heading: "Klubet e shkollës",
      items:
        clubs.length > 0
          ? clubs.map((c) => ({ title: c.name, text: c.summary, href: c.is_media_club ? "/klubi-i-medias" : `/klubet#${c.slug}` }))
          : [{ title: "Klubet do të shtohen së shpejti", text: "Lista e klubeve publikohet nga stafi.", href: "/klubet" }],
    },
  ];

  return (
    <>
      <Hero hero={site.hero} />
      <Intro intro={site.intro} />

      <section aria-labelledby="programs-title" className="bg-paper py-24 md:py-36">
        <div className="shell">
          <SectionHeading
            id="programs-title"
            title="Çfarë mësohet këtu"
            lede="Profili shoqëror-gjuhësor dhe programet që e përbëjnë."
            link={{ href: "/programet", label: "Të gjitha programet" }}
          />
          <div className="mt-14">
            <ProgramsExplorer programs={programsWithSubjects} />
          </div>
        </div>
      </section>

      <section aria-labelledby="work-title" className="bg-paper pb-24 md:pb-36">
        <div className="shell">
          <SectionHeading id="work-title" title="Puna e nxënësve" lede="Media, projekte dhe suksese, siç publikohen nga shkolla." />
          <div className="mt-14">
            <StudentWork mediaClub={clubs.find((c) => c.is_media_club) ?? null} projects={projects} achievements={achievements} />
          </div>
        </div>
      </section>

      <Stats stats={stats} />
      <NewsSection news={news} announcements={announcements} />

      <section aria-labelledby="life-title" className="bg-blue-soft py-24 md:py-36">
        <div className="shell">
          <SectionHeading id="life-title" title="Jeta shkollore" lede="Përtej orës së mësimit." />
          <div className="mt-14">
            <SchoolLife tabs={lifeTabs} source={PZHSH_SOURCE} />
          </div>
        </div>
      </section>

      <EventsSection events={events} />
      <GalleryStrip media={media} />
      <EnrollmentCta enrollment={site.enrollment} />
    </>
  );
}
