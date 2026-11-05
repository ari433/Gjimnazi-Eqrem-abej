import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { SchoolEvent } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventRow } from "@/components/events/EventRow";

export function EventsSection({ events }: { events: SchoolEvent[] }) {
  return (
    <section aria-labelledby="events-title" className="bg-white py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          id="events-title"
          title="Në kalendar"
          lede="Aktivitetet që vijnë në shkollë."
          link={{ href: "/kalendari", label: "Kalendari i plotë" }}
        />
        {events.length === 0 ? (
          <EmptyState icon={CalendarDays} title="Asnjë aktivitet i planifikuar" className="mt-14">
            Aktivitetet e reja shfaqen këtu sapo të publikohen. Shiko{" "}
            <Link href="/njoftimet" className="link-underline font-semibold text-ink">
              njoftimet
            </Link>{" "}
            për informata të tjera.
          </EmptyState>
        ) : (
          <ul className="mt-14">
            {events.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
