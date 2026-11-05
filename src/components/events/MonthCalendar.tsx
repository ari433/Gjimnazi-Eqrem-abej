"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SchoolEvent } from "@/lib/types";
import { cn, monthLabel as fmtMonth } from "@/lib/utils";

const TZ = "Europe/Belgrade";
const WEEKDAYS = ["Hë", "Ma", "Më", "En", "Pr", "Sh", "Di"];

function ymd(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Month grid with event markers. Days with events link to the list below. */
export function MonthCalendar({ events, initial }: { events: SchoolEvent[]; initial: string }) {
  const [cursor, setCursor] = useState(() => {
    const [y, m] = initial.split("-").map(Number);
    return { y, m: m - 1 };
  });
  const [today, setToday] = useState<string | null>(null);

  // Jump to the current month once mounted (the server render uses `initial`).
  useEffect(() => {
    const now = new Date();
    setToday(ymd(now));
    const [y, m] = ymd(now).split("-").map(Number);
    setCursor({ y, m: m - 1 });
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<string, SchoolEvent[]>();
    for (const e of events) {
      const k = ymd(new Date(e.starts_at));
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return map;
  }, [events]);

  const first = new Date(Date.UTC(cursor.y, cursor.m, 1));
  const daysInMonth = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7; // Monday first
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const monthLabel = fmtMonth(cursor.y, cursor.m);
  const move = (d: number) =>
    setCursor((c) => {
      const m = c.m + d;
      return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });

  return (
    <div className="rounded-card bg-white p-5 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold capitalize tracking-[-0.03em]" aria-live="polite">
          {monthLabel}
        </h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="Muaji i kaluar" className="grid size-11 place-items-center rounded-full border border-line hover:border-ink">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Muaji tjetër" className="grid size-11 place-items-center rounded-full border border-line hover:border-ink">
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>
      <table className="mt-6 w-full table-fixed border-collapse text-center">
        <thead>
          <tr>
            {WEEKDAYS.map((w) => (
              <th key={w} scope="col" className="pb-3 text-xs font-semibold text-muted">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, r) => (
            <tr key={r}>
              {cells.slice(r * 7, r * 7 + 7).map((day, c) => {
                if (!day) return <td key={c} />;
                const key = `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const evs = byDay.get(key);
                const isToday = key === today;
                return (
                  <td key={c} className="p-0.5">
                    {evs ? (
                      <a
                        href={`#${evs[0].slug}`}
                        title={evs.map((e) => e.title).join(", ")}
                        className="relative mx-auto grid aspect-square w-full max-w-14 place-items-center rounded-xl bg-blue font-semibold text-white transition-colors hover:bg-ink"
                      >
                        {day}
                        <span className="sr-only">: {evs.map((e) => e.title).join(", ")}</span>
                      </a>
                    ) : (
                      <span
                        className={cn(
                          "mx-auto grid aspect-square w-full max-w-14 place-items-center rounded-xl text-ink/70",
                          isToday && "ring-2 ring-ink ring-inset font-semibold text-ink",
                        )}
                      >
                        {day}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
