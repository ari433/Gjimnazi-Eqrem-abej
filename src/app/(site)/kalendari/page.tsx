import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventRow } from "@/components/events/EventRow";
import { MonthCalendar } from "@/components/events/MonthCalendar";
import { getEvents, getEventsSplit } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Kalendari i aktiviteteve",
  description: "Aktivitetet, ngjarjet dhe datat e rëndësishme në Gjimnazin \"Eqrem Çabej\".",
  alternates: { canonical: "/kalendari" },
};

export default async function CalendarPage() {
  const [all, { upcoming, past }] = await Promise.all([getEvents(), getEventsSplit()]);
  const initial = (upcoming[0] ?? all[0])?.starts_at.slice(0, 7) ?? "2026-09";

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
      <PageHero title="Kalendari" crumbs={[{ label: "Kalendari" }]} lede="Aktivitetet e shkollës, muaj pas muaji." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <MonthCalendar events={all} initial={initial} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-title font-bold">Në vijim</h2>
            {upcoming.length === 0 ? (
              <EmptyState icon={CalendarDays} title="Asnjë aktivitet i planifikuar" className="mt-8">
                Aktivitetet e reja publikohen këtu nga stafi.
              </EmptyState>
            ) : (
              <ul className="mt-8">
                {upcoming.map((e) => (
                  <EventRow key={e.id} event={e} />
                ))}
              </ul>
            )}
            {past.length > 0 && (
              <>
                <h2 className="mt-20 text-title font-bold text-ink/50">Të kaluara</h2>
                <ul className="mt-8 opacity-70">
                  {past.slice(0, 12).map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
      {jsonLd.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
    </>
  );
}
