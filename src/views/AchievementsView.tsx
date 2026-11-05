import { ExternalLink, Trophy } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { PendingBadge } from "@/components/ui/Pending";
import { Reveal } from "@/components/motion/Reveal";
import { getAchievements } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";

export async function AchievementsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const items = await getAchievements(locale);
  const years = Array.from(new Set(items.map((a) => a.year))).sort((a, b) => b.localeCompare(a));
  return (
    <>
      <PageHero locale={locale} title={T.pages.achievements[0]} crumbs={[{ label: T.pages.about[0], href: "/rreth-shkolles" }, { label: T.pages.achievements[0] }]} lede={T.achievements_.lede} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          {items.length === 0 ? (
            <EmptyState icon={Trophy} title={T.achievements_.empty} />
          ) : (
            years.map((y) => (
              <Reveal key={y} className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-6 md:py-12">
                <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.05em] text-blue md:col-span-3">{y}</h2>
                <ul className="space-y-8 md:col-span-9">
                  {items
                    .filter((a) => a.year === y)
                    .map((a) => (
                      <li key={a.id}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-blue-deep">{a.category}</span>
                          {a.verification === "pending" && <PendingBadge locale={locale} />}
                        </div>
                        <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em]">{a.title}</h3>
                        <p className="mt-1 max-w-3xl text-muted">{a.description}</p>
                        {a.link_url && (
                          <a href={a.link_url} target="_blank" rel="noopener noreferrer" className="link-underline mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                            {T.source} <ExternalLink aria-hidden className="size-3.5" />
                          </a>
                        )}
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
