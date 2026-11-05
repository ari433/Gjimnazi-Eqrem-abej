import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PendingBadge } from "@/components/ui/Pending";
import { getSiteContent } from "@/lib/content/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Për nxënësit",
  description: "Informata praktike për nxënësit e Gjimnazit \"Eqrem Çabej\": orari, kalendari akademik, Matura, këshilli i nxënësve.",
  alternates: { canonical: "/per-nxenesit" },
};

export default async function StudentInfoPage() {
  const site = await getSiteContent();
  const info = site.student_info;
  return (
    <>
      <PageHero title="Për nxënësit" crumbs={[{ label: "Për nxënësit" }]} lede={info.heading} />
      <section className="bg-paper pb-20">
        <div className="shell">
          <RevealGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {info.items.map((it) => (
              <RevealItem key={it.title}>
                <article className={cn("flex h-full flex-col rounded-card p-8", it.verification === "pending" ? "hatch border border-dashed border-pending/35 bg-white/60" : "bg-white")}>
                  {it.verification === "pending" && <PendingBadge className="self-start" />}
                  <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{it.title}</h2>
                  <p className="mt-2 text-muted">{it.body}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <section aria-label="Lidhje të shpejta" className="bg-white py-20">
        <div className="shell grid gap-4 md:grid-cols-4">
          {[
            { href: "/njoftimet", label: "Njoftimet" },
            { href: "/kalendari", label: "Kalendari" },
            { href: "/dokumentet", label: "Dokumentet" },
            { href: "/kontakti", label: "Pyet administratën" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="group flex items-center justify-between rounded-card border border-line p-6 text-xl font-semibold tracking-[-0.02em] transition-colors hover:border-ink hover:bg-ink hover:text-white">
              {l.label}
              <ArrowUpRight aria-hidden className="size-5 transition-transform group-hover:rotate-45" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
