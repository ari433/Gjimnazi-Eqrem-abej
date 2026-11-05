import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExampleBadge } from "@/components/ui/Pending";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getAnnouncements } from "@/lib/content/queries";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Njoftimet",
  description: "Njoftimet zyrtare të Gjimnazit \"Eqrem Çabej\" për nxënës, prindër dhe staf.",
  alternates: { canonical: "/njoftimet" },
};

const priorityLabel = { normal: null, important: "I rëndësishëm", urgent: "Urgjent" } as const;

export default async function AnnouncementsPage() {
  const items = await getAnnouncements(100);
  return (
    <>
      <PageHero title="Njoftimet" crumbs={[{ label: "Njoftimet" }]} lede="Informata që duhen ditur tani: ndryshime orari, afate, thirrje." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          {items.length === 0 ? (
            <EmptyState icon={Megaphone} title="Asnjë njoftim aktiv">
              Kur shkolla publikon një njoftim, ai shfaqet këtu dhe në ballinë.
            </EmptyState>
          ) : (
            <RevealGroup className="grid gap-4">
              {items.map((a) => {
                const label = priorityLabel[a.priority];
                return (
                  <RevealItem key={a.id}>
                    <article
                      className={cn(
                        "grid gap-4 rounded-card p-8 md:grid-cols-12 md:gap-8 md:p-10",
                        a.priority === "urgent" ? "bg-ink text-white" : "bg-white",
                      )}
                    >
                      <div className="md:col-span-3">
                        <time dateTime={a.published_at ?? undefined} className={cn("text-sm", a.priority === "urgent" ? "text-white/60" : "text-muted")}>
                          {formatDate(a.published_at)}
                        </time>
                        <p className={cn("mt-1 text-sm font-semibold", a.priority === "urgent" ? "text-blue-soft" : "text-blue-deep")}>
                          Për: {a.audience}
                        </p>
                      </div>
                      <div className="md:col-span-9">
                        <div className="flex flex-wrap items-center gap-2">
                          {label && (
                            <span className="rounded-pill bg-blue px-2.5 py-0.5 text-xs font-semibold text-white">{label}</span>
                          )}
                          {a.is_example && <ExampleBadge className="text-muted" />}
                        </div>
                        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{a.title}</h2>
                        <p className={cn("mt-2 max-w-3xl whitespace-pre-line", a.priority === "urgent" ? "text-white/80" : "text-muted")}>{a.body}</p>
                        {a.expires_at && (
                          <p className={cn("mt-4 text-sm", a.priority === "urgent" ? "text-white/60" : "text-muted")}>
                            Vlen deri më {formatDate(a.expires_at)}
                          </p>
                        )}
                      </div>
                    </article>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          )}
        </div>
      </section>
    </>
  );
}
