import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PendingBadge, PendingBlock, SourceNote } from "@/components/ui/Pending";
import { ButtonLink } from "@/components/ui/Button";
import { getProgram, getPrograms } from "@/lib/content/queries";

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.length ? programs.map((p) => ({ slug: p.slug })) : [{ slug: "shkencat-shoqerore-gjuhesore" }];
}

export async function generateMetadata({ params }: PageProps<"/programet/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProgram(slug);
  if (!data) return { title: "Programi nuk u gjet" };
  return {
    title: data.program.name,
    description: data.program.summary,
    alternates: { canonical: `/programet/${slug}` },
  };
}

export default async function ProgramPage({ params }: PageProps<"/programet/[slug]">) {
  const { slug } = await params;
  const [data, all] = await Promise.all([getProgram(slug), getPrograms()]);
  if (!data) notFound();
  const { program: p, subjects } = data;
  const others = all.filter((o) => o.id !== p.id);

  return (
    <>
      <PageHero
        tone="ink"
        title={p.name}
        crumbs={[{ label: "Programet", href: "/programet" }, { label: p.short_name || p.name }]}
        lede={p.tagline}
        aside={
          <div className="flex flex-wrap items-center gap-3 text-white/70">
            <span>{p.grades}</span>
            {p.verification === "pending" && <PendingBadge />}
          </div>
        }
      />

      <section aria-labelledby="overview" className="bg-paper py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <h2 id="overview" className="text-title font-bold lg:col-span-4">
            Përmbledhje
          </h2>
          <Reveal className="lg:col-span-8">
            <p className="prose-school">{p.overview}</p>
            {p.source_note && <SourceNote className="mt-6">{p.source_note}</SourceNote>}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="subjects" className="bg-white py-20 md:py-28">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="subjects" className="text-title font-bold">
              Lëndët
            </h2>
            <p className="max-w-md text-muted">Shpërndarja sipas klasave dhe orët javore publikohen pasi të konfirmohen nga plani mësimor.</p>
          </div>
          {subjects.length === 0 ? (
            <PendingBlock title="Lista e lëndëve është në pritje" className="mt-10" />
          ) : (
            <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.04}>
              {subjects.map((s) => (
                <RevealItem key={s.id}>
                  <div className="flex h-full min-h-28 flex-col justify-between rounded-card bg-paper p-6">
                    <p className="text-xl font-semibold tracking-[-0.02em]">{s.name}</p>
                    <p className="mt-3 text-sm text-muted">
                      {[s.grade, s.hours_per_week ? `${s.hours_per_week} orë në javë` : null].filter(Boolean).join(", ") ||
                        (s.verification === "pending" ? "Në pritje" : "")}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      <section aria-label="Rezultatet dhe mundësitë" className="bg-paper py-20 md:py-28">
        <div className="shell grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-title font-bold">Çfarë mëson nxënësi</h2>
            {p.outcomes.length ? (
              <ul className="mt-8 space-y-4">
                {p.outcomes.map((o) => (
                  <li key={o} className="border-t border-line pt-4 text-lg">
                    {o}
                  </li>
                ))}
              </ul>
            ) : (
              <PendingBlock title="Rezultatet e të nxënit do të publikohen pasi të konfirmohen" className="mt-8">
                I shtojnë koordinatorët e programit nga paneli i administrimit.
              </PendingBlock>
            )}
          </div>
          <div>
            <h2 className="text-title font-bold">Pas gjimnazit</h2>
            {p.pathways.length ? (
              <ul className="mt-8 space-y-4">
                {p.pathways.map((o) => (
                  <li key={o} className="border-t border-line pt-4 text-lg">
                    {o}
                  </li>
                ))}
              </ul>
            ) : (
              <PendingBlock title="Mundësitë pas diplomimit do të publikohen pasi të konfirmohen" className="mt-8">
                Studimet dhe profesionet ku vazhdojnë nxënësit shtohen me të dhëna nga shkolla.
              </PendingBlock>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="shell flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            {others.length > 0 && (
              <>
                <p className="text-muted">Programe të tjera</p>
                <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link href={`/programet/${o.slug}`} className="link-underline text-2xl font-bold tracking-[-0.03em]">
                        {o.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <ButtonLink href="/kontakti" variant="ink">
            Pyet për programin
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
