import { MapPin } from "lucide-react";
import type { SchoolEvent } from "@/lib/types";
import { ExampleBadge, PendingBadge } from "@/components/ui/Pending";
import { dateParts, formatTime } from "@/lib/utils";

/** Calendar row with an oversized date block. */
export function EventRow({ event }: { event: SchoolEvent }) {
  const d = dateParts(event.starts_at);
  return (
    <li id={event.slug} className="group grid scroll-mt-28 grid-cols-[5.5rem_1fr] gap-5 border-t border-line py-8 last:border-b md:grid-cols-[9rem_1fr_16rem] md:gap-10 md:py-10">
      <div className="leading-none">
        <span className="block text-[clamp(2.75rem,5vw,4.5rem)] font-bold tracking-[-0.05em] text-ink transition-colors group-hover:text-blue">
          {d.day}
        </span>
        <span className="mt-1 block text-sm font-semibold capitalize text-muted">
          {d.month} {d.year}
        </span>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-blue-deep">{event.category}</span>
          {event.verification === "pending" && <PendingBadge label="Data në pritje" />}
          {event.is_example && <ExampleBadge className="text-muted" />}
        </div>
        <h3 className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] font-bold leading-[1.1] tracking-[-0.03em]">{event.title}</h3>
        {event.description && <p className="mt-2 max-w-2xl text-muted">{event.description}</p>}
      </div>
      <div className="col-span-2 flex flex-col gap-1 text-sm text-muted md:col-span-1 md:pt-8">
        <span className="first-letter:uppercase">{event.all_day ? `${d.weekday}, gjithë ditën` : `${d.weekday}, ora ${formatTime(event.starts_at)}`}</span>
        {event.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5" />
            {event.location}
          </span>
        )}
      </div>
    </li>
  );
}
