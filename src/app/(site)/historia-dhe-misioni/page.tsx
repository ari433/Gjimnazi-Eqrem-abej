import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { HistoryScroller } from "@/components/about/HistoryScroller";
import { SourceNote } from "@/components/ui/Pending";
import { getSiteContent } from "@/lib/content/queries";
import { PZHSH_SOURCE, PZHSH_URL } from "@/lib/content/seed";

export const metadata: Metadata = {
  title: "Historia dhe misioni",
  description: "Rrugëtimi i Gjimnazit \"Eqrem Çabej\": nga Shkolla Normale te gjimnazi i shkencave shoqërore-gjuhësore.",
  alternates: { canonical: "/historia-dhe-misioni" },
};

export default async function HistoryPage() {
  const site = await getSiteContent();
  return (
    <>
      <PageHero
        title="Historia dhe misioni"
        crumbs={[{ label: "Rreth shkollës", href: "/rreth-shkolles" }, { label: "Historia dhe misioni" }]}
        lede="Shkolla ka ndryshuar profil disa herë. Gjuha ka mbetur e pandryshuar."
      />

      <HistoryScroller entries={site.history} />

      <section className="bg-paper py-24 md:py-32">
        <div className="shell">
          <SourceNote>
            <a href={PZHSH_URL} target="_blank" rel="noopener noreferrer" className="link-underline">
              {PZHSH_SOURCE}
            </a>
            . Vitet e themelimit dhe të ndryshimeve të para të profilit nuk janë të shënuara në burim dhe do të shtohen pasi të konfirmohen nga arkivi i shkollës.
          </SourceNote>
        </div>
      </section>

      <section aria-labelledby="mission" className="grain relative overflow-hidden bg-ink py-24 text-white md:py-32">
        <div className="shell relative grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 id="mission" className="text-base font-semibold text-blue-soft">
              Vizioni
            </h2>
            <p className="mt-4 text-title font-bold">{site.intro.vision}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-base font-semibold text-blue-soft">Misioni</h2>
            <p className="mt-4 text-title font-bold">{site.intro.mission}</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="cabej" className="bg-white py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p aria-hidden className="text-[clamp(8rem,20vw,16rem)] font-bold leading-[0.8] tracking-[-0.06em] text-blue">
              Ç
            </p>
          </div>
          <Reveal className="lg:col-span-7">
            <h2 id="cabej" className="text-title font-bold">
              Emri: Eqrem Çabej
            </h2>
            <div className="prose-school mt-8">
              <p>
                Eqrem Çabej (1908–1980) ishte gjuhëtar, etimolog dhe albanolog, ndër studiuesit më të rëndësishëm të gjuhës
                shqipe. U lind në Gjirokastër dhe studioi gjuhësi në Graz dhe Vjenë.
              </p>
              <p>
                Vepra e tij më e njohur, studimet etimologjike në fushë të shqipes, shpjegon prejardhjen e fjalëve shqipe
                dhe lidhjet e tyre me gjuhët e tjera. Ky emër i përshtatet një shkolle që e ka gjuhën në qendër.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
