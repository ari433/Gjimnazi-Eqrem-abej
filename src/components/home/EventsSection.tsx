import type { SchoolEvent } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventRow } from "@/components/events/EventRow";
import { lp, t, type Locale } from "@/lib/i18n";

/** Hidden when nothing is coming up: an empty calendar block adds nothing to the homepage. */
export function EventsSection({ events, locale = "sq" }: { events: SchoolEvent[]; locale?: Locale }) {
  if (events.length === 0) return null;
  const T = t(locale);
  return (
    <section aria-labelledby="events-title" className="bg-white py-20 md:py-32">
      <div className="shell">
        <SectionHeading id="events-title" title={T.home_.eventsTitle} lede={T.pages.calendar[1]} link={{ href: lp(locale, "/kalendari"), label: T.home_.fullCalendar }} />
        <ul className="mt-10 md:mt-14">
          {events.map((e) => (
            <EventRow key={e.id} event={e} locale={locale} />
          ))}
        </ul>
      </div>
    </section>
  );
}
