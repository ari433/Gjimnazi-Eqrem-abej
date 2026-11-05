import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { PendingBadge } from "@/components/ui/Pending";
import { Reveal } from "@/components/motion/Reveal";
import { getAchievements } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Arritjet",
  description: "Çmimet dhe sukseset e nxënësve dhe të shkollës.",
  alternates: { canonical: "/arritjet" },
};

export default async function AchievementsPage() {
  const items = await getAchievements();
  const years = Array.from(new Set(items.map((a) => a.year))).sort((a, b) => b.localeCompare(a));
  return (
    <>
      <PageHero title="Arritjet" crumbs={[{ label: "Rreth shkollës", href: "/rreth-shkolles" }, { label: "Arritjet" }]} lede="Vetëm suksese të dokumentuara, me vitin dhe garën përkatëse." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          {items.length === 0 ? (
            <EmptyState icon={Trophy} title="Arritjet po mblidhen">
              Çdo çmim publikohet pasi shkolla ta verifikojë me dokumentacion.
            </EmptyState>
          ) : (
            years.map((y) => (
              <Reveal key={y} className="grid gap-6 border-t border-line py-12 md:grid-cols-12">
                <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.05em] text-blue md:col-span-3">{y}</h2>
                <ul className="space-y-8 md:col-span-9">
                  {items
                    .filter((a) => a.year === y)
                    .map((a) => (
                      <li key={a.id}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-blue-deep">{a.category}</span>
                          {a.verification === "pending" && <PendingBadge />}
                        </div>
                        <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em]">{a.title}</h3>
                        <p className="mt-1 max-w-3xl text-muted">{a.description}</p>
                      </li>
                    ))}
                </ul>
              </Reveal>
            ))
          )}
        </div>
      </section>
    </>
  );
}
