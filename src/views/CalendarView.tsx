import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventRow } from "@/components/events/EventRow";
import { MonthCalendar } from "@/components/events/MonthCalendar";
import { getEventsSplit } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";

export async function CalendarView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const E = T.events_;
  const { all, upcoming, past, today } = await getEventsSplit(locale);

  const jsonLd = upcoming
    .filter((e) => e.verification === "verified" && !e.is_example)
    .slice(0, 10)
    .map((e) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: e.title,
      startDate: e.starts_at,
      ...(e.ends_at ? { endDate: e.ends_at } : {}),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: e.location ?? "Gjimnazi \"Eqrem Çabej\"", address: "Rr. \"Remzi Salihu\" nr. 61, Prishtinë" },
      description: e.description,
    }));

  return (
    <>
      <PageHero locale={locale} title={T.pages.calendar[0]} crumbs={[{ label: T.pages.calendar[0] }]} lede={T.pages.calendar[1]} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <MonthCalendar events={all} today={today} locale={locale} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-title font-bold">{E.upcoming}</h2>
            {upcoming.length === 0 ? (
              <EmptyState icon={CalendarDays} title={E.empty} className="mt-6">
                {E.emptyBody}
              </EmptyState>
            ) : (
              <ul className="mt-6">
                {upcoming.map((e) => (
                  <EventRow key={e.id} event={e} locale={locale} />
                ))}
              </ul>
            )}
            {past.length > 0 && (
              <>
                <h2 className="mt-16 text-title font-bold text-ink/50">{E.past}</h2>
                <ul className="mt-6 opacity-75">
                  {past.slice(0, 12).map((e) => (
                    <EventRow key={e.id} event={e} locale={locale} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
      {jsonLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
    </>
  );
}
