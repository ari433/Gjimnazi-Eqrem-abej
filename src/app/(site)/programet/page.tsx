import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PendingBadge } from "@/components/ui/Pending";
import { getProgram, getPrograms } from "@/lib/content/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programet mësimore",
  description: "Profili shoqëror-gjuhësor i Gjimnazit \"Eqrem Çabej\" dhe programet që e përbëjnë.",
  alternates: { canonical: "/programet" },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const withSubjects = await Promise.all(
    programs.map(async (p) => ({ ...p, subjects: (await getProgram(p.slug))?.subjects ?? [] })),
  );

  return (
    <>
      <PageHero
        title="Programet mësimore"
        crumbs={[{ label: "Programet" }]}
        lede="Çfarë mësohet, në cilat klasa dhe ku të çon. Çdo informatë e pakonfirmuar shënohet qartë."
      />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          {withSubjects.length === 0 ? (
            <EmptyState icon={BookOpen} title="Programet po përgatiten për publikim" />
          ) : (
            <RevealGroup className="grid gap-4 lg:grid-cols-2">
              {withSubjects.map((p, i) => (
                <RevealItem key={p.id}>
                  <Link
                    href={`/programet/${p.slug}`}
                    className={cn(
                      "group relative flex min-h-[30rem] flex-col justify-between overflow-hidden rounded-card p-8 md:p-12",
                      i === 0 ? "grain bg-ink text-white" : "bg-white text-ink",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -right-6 -top-10 select-none text-[16rem] font-bold leading-none tracking-[-0.08em] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:-translate-x-4",
                        i === 0 ? "text-white/[0.06]" : "text-ink/[0.05]",
                      )}
                    >
                      {p.short_name.charAt(0)}
                    </span>
                    <div className="relative flex flex-wrap items-center gap-3">
                      <span className={cn("text-sm", i === 0 ? "text-white/60" : "text-muted")}>{p.grades}</span>
                      {p.verification === "pending" && <PendingBadge />}
                    </div>
                    <div className="relative">
                      <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.035em]">{p.name}</h2>
                      <p className={cn("mt-4 max-w-lg text-lg", i === 0 ? "text-white/75" : "text-muted")}>{p.summary}</p>
                      {p.subjects.length > 0 && (
                        <p className={cn("mt-6 text-sm", i === 0 ? "text-white/60" : "text-muted")}>
                          {p.subjects.length === 1 ? "1 lëndë e listuar" : `${p.subjects.length} lëndë të listuara`}
                        </p>
                      )}
                      <span className="mt-8 inline-flex items-center gap-2 font-semibold">
                        Hap programin
                        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>
    </>
  );
}
