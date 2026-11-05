import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SourceNote } from "@/components/ui/Pending";
import { getSiteContent, getStaff } from "@/lib/content/queries";
import { PZHSH_SOURCE, PZHSH_URL } from "@/lib/content/seed";

export const metadata: Metadata = {
  title: "Rreth shkollës",
  description: "Gjimnazi \"Eqrem Çabej\" në Prishtinë: gjimnaz i shkencave shoqërore-gjuhësore, me traditë në gjuhë që nga viti 1990.",
  alternates: { canonical: "/rreth-shkolles" },
};

const facilities = [
  "Kabineti i gjuhëve",
  "Kabineti i biologjisë",
  "Kabineti i fizikës",
  "Kabineti i artit muzikor",
  "Kabineti i TIK-ut",
  "Biblioteka",
  "Salla e sportit",
];

export default async function AboutPage() {
  const [site, staff] = await Promise.all([getSiteContent(), getStaff()]);
  const director = staff.find((s) => s.is_leadership && /drejtor/i.test(s.role_title));

  const facts = [
    { label: "Profili", value: "Gjimnaz i shkencave shoqërore-gjuhësore" },
    { label: "Adresa", value: `${site.contact.address}, ${site.contact.city}` },
    { label: "Ndërtesa", value: "Në përdorim që nga viti shkollor 2012–2013" },
    ...(director ? [{ label: director.role_title, value: director.full_name }] : []),
  ];

  return (
    <>
      <PageHero
        title="Rreth shkollës"
        crumbs={[{ label: "Rreth shkollës" }]}
        lede="Një gjimnaz në Prishtinë që e ka gjuhën në qendër që nga viti 1990."
      />

      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="font-serif text-[clamp(1.35rem,2vw,1.7rem)] leading-[1.55] text-ink">{site.intro.body}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-base font-semibold text-blue-deep">Vizioni</h2>
                <p className="mt-2 text-lg">{site.intro.vision}</p>
              </div>
              <div>
                <h2 className="text-base font-semibold text-blue-deep">Misioni</h2>
                <p className="mt-2 text-lg">{site.intro.mission}</p>
              </div>
            </div>
            <SourceNote className="mt-8">
              <a href={PZHSH_URL} target="_blank" rel="noopener noreferrer" className="link-underline">
                {PZHSH_SOURCE}
              </a>
            </SourceNote>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <dl className="rounded-card bg-white p-8">
              {facts.map((f) => (
                <div key={f.label} className="border-b border-line py-4 first:pt-0 last:border-0 last:pb-0">
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-[-0.01em]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="facilities" className="bg-white py-24 md:py-32">
        <div className="shell">
          <h2 id="facilities" className="text-title font-bold">
            Hapësirat e mësimit
          </h2>
          <RevealGroup className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((f) => (
              <RevealItem key={f}>
                <div className="flex h-32 items-end rounded-card bg-paper p-6 text-xl font-semibold tracking-[-0.02em]">{f}</div>
              </RevealItem>
            ))}
          </RevealGroup>
          <SourceNote className="mt-6">{PZHSH_SOURCE}</SourceNote>
        </div>
      </section>

      <section aria-label="Më shumë për shkollën" className="bg-paper py-24 md:py-32">
        <div className="shell grid gap-4 md:grid-cols-3">
          {[
            { href: "/historia-dhe-misioni", title: "Historia dhe misioni", text: "Nga Shkolla Normale te profili shoqëror-gjuhësor." },
            { href: "/udheheqja-dhe-stafi", title: "Udhëheqja dhe stafi", text: "Drejtoria dhe mësimdhënësit." },
            { href: "/programet", title: "Programet", text: "Lëndët dhe drejtimi mësimor." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group flex min-h-56 flex-col justify-between rounded-card bg-ink p-8 text-white transition-colors hover:bg-blue">
              <ArrowUpRight aria-hidden className="size-6 self-end transition-transform duration-500 group-hover:rotate-45" />
              <div>
                <h2 className="text-2xl font-bold tracking-[-0.03em]">{c.title}</h2>
                <p className="mt-2 text-white/70">{c.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
