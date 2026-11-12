import { ExternalLink, Lightbulb, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { MediaFrame } from "@/components/ui/Media";
import { Markdown } from "@/components/ui/Markdown";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getProjects } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export async function ProjectsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const projects = await getProjects(locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.projects[0]} crumbs={[{ label: T.pages.projects[0] }]} lede={T.pages.projects[1]} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          {projects.length === 0 ? (
            <EmptyState icon={Lightbulb} title={T.projects_.empty} />
          ) : (
            <RevealGroup className="grid gap-4 md:grid-cols-2">
              {projects.map((p, i) => (
                <RevealItem key={p.id} className={cn(i === 0 && projects.length > 1 && "md:col-span-2")}>
                  <article id={p.slug} className="h-full scroll-mt-28 rounded-card bg-white p-3">
                    <MediaFrame src={p.cover_url} tone="blue" className="aspect-[21/9] rounded-[0.9rem]" />
                    <div className="p-4 md:p-6">
                      {p.school_year && <p className="text-sm text-muted">{p.school_year}</p>}
                      <h2 className="mt-1 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.03em]">{p.title}</h2>
                      <p className="mt-2 max-w-3xl text-lg text-muted">{p.summary}</p>
                      {p.team && (
                        <p className="mt-4 flex gap-2 text-sm">
                          <Users aria-hidden className="mt-0.5 size-4 shrink-0 text-blue" />
                          {p.team}
                        </p>
                      )}
                      {p.body && <Markdown source={p.body} className="prose-school mt-4 text-base" />}
                      {p.link_url && (
                        <a href={p.link_url} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-flex items-center gap-1.5 font-semibold">
                          {T.projects_.view} <ExternalLink aria-hidden className="size-4" />
                        </a>
                      )}
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
