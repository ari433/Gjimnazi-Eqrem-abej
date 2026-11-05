import type { Metadata } from "next";
import { ExternalLink, Lightbulb } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { MediaFrame } from "@/components/ui/Media";
import { Markdown } from "@/components/ui/Markdown";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getProjects } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Projektet e nxënësve",
  description: "Projekte kërkimore, krijuese dhe shoqërore të nxënësve të Gjimnazit \"Eqrem Çabej\".",
  alternates: { canonical: "/projektet" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero title="Projektet e nxënësve" crumbs={[{ label: "Projektet e nxënësve" }]} lede="Kërkime, fushata dhe vepra krijuese që nxënësit i kanë çuar deri në fund." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          {projects.length === 0 ? (
            <EmptyState icon={Lightbulb} title="Projektet e para do të publikohen së shpejti">
              Stafi i shton projektet nga paneli, bashkë me emrat e ekipit vetëm me pëlqimin e nxënësve.
            </EmptyState>
          ) : (
            <RevealGroup className="grid gap-x-6 gap-y-14 md:grid-cols-2">
              {projects.map((p, i) => (
                <RevealItem key={p.id} className={i % 3 === 0 ? "md:col-span-2" : ""}>
                  <article id={p.slug} className="scroll-mt-28">
                    <MediaFrame src={p.cover_url} label={p.title} className={`rounded-card ${i % 3 === 0 ? "aspect-[21/9]" : "aspect-[4/3]"}`} />
                    <div className="mt-5 grid gap-4 md:grid-cols-12">
                      <div className="md:col-span-5">
                        <p className="text-sm text-muted">{[p.school_year, p.team].filter(Boolean).join(", ")}</p>
                        <h2 className="mt-1 text-3xl font-bold tracking-[-0.03em]">{p.title}</h2>
                      </div>
                      <div className="md:col-span-7">
                        <p className="text-lg text-muted">{p.summary}</p>
                        {p.body && <Markdown source={p.body} className="prose-school mt-4 text-base" />}
                        {p.link_url && (
                          <a href={p.link_url} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-flex items-center gap-1.5 font-semibold">
                            Shiko projektin <ExternalLink aria-hidden className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>
    </>
  );
}
