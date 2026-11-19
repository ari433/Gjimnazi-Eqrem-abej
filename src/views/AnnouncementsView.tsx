import { Megaphone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getAnnouncements } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";
import { cn, formatDate } from "@/lib/utils";

export async function AnnouncementsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const A = T.announcements_;
  const items = await getAnnouncements(100, locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.announcements[0]} crumbs={[{ label: T.pages.announcements[0] }]} lede={T.pages.announcements[1]} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          {items.length === 0 ? (
            <EmptyState icon={Megaphone} title={A.empty}>
              {A.emptyBody}
            </EmptyState>
          ) : (
            <RevealGroup className="grid gap-3 md:gap-4">
              {items.map((a) => {
                const urgent = a.priority === "urgent";
                const label = a.priority === "urgent" ? A.urgent : a.priority === "important" ? A.important : null;
                return (
                  <RevealItem key={a.id}>
                    <article className={cn("grid gap-3 rounded-card p-6 md:grid-cols-12 md:gap-8 md:p-10", urgent ? "bg-ink text-white" : "bg-white")}>
                      <div className="md:col-span-3">
                        <time dateTime={a.published_at ?? undefined} className={cn("text-sm", urgent ? "text-white/60" : "text-muted")}>
                          {formatDate(a.published_at, { locale })}
                        </time>
                        <p className={cn("mt-1 text-sm font-semibold", urgent ? "text-blue-soft" : "text-blue-deep")}>
                          {A.for}: {a.audience}
                        </p>
                      </div>
                      <div className="md:col-span-9">
                        {label && <span className="rounded-pill bg-blue px-2.5 py-0.5 text-xs font-semibold text-white">{label}</span>}
                        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">{a.title}</h2>
                        <p className={cn("mt-2 max-w-3xl whitespace-pre-line", urgent ? "text-white/80" : "text-muted")}>{a.body}</p>
                        {a.expires_at && (
                          <p className={cn("mt-4 text-sm", urgent ? "text-white/60" : "text-muted")}>
                            {A.validUntil} {formatDate(a.expires_at, { locale })}
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
