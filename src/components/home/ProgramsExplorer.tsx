"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/lib/types";
import { PendingBadge } from "@/components/ui/Pending";
import { cn } from "@/lib/utils";

type Item = Program & { subjectNames: string[] };

/** Programme list that previews the hovered/focused programme beside it. */
export function ProgramsExplorer({ programs }: { programs: Item[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = programs[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <ul className="lg:col-span-7" role="list">
        {programs.map((p, i) => (
          <li key={p.id} className="border-t border-line last:border-b">
            <Link
              href={`/programet/${p.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex items-start justify-between gap-6 py-7 md:py-9"
            >
              <span>
                <span
                  className={cn(
                    "block text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-[0.98] tracking-[-0.035em] transition-colors duration-300",
                    i === active ? "text-ink" : "text-ink/35 group-hover:text-ink",
                  )}
                >
                  {p.short_name || p.name}
                </span>
                <span className="mt-3 flex flex-wrap items-center gap-3 text-muted">
                  <span>{p.tagline}</span>
                  {p.verification === "pending" && <PendingBadge />}
                </span>
              </span>
              <span
                className={cn(
                  "mt-2 grid size-12 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)]",
                  i === active ? "border-blue bg-blue text-white" : "border-line text-ink group-hover:border-ink",
                )}
              >
                <ArrowUpRight aria-hidden className="size-5 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 overflow-hidden rounded-card bg-white p-10 shadow-[0_1px_0_var(--color-line),0_30px_60px_-30px_rgba(10,24,56,0.25)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sm text-muted">{current.grades}</p>
              <h3 className="mt-2 text-3xl font-bold leading-tight tracking-[-0.03em]">{current.name}</h3>
              <p className="mt-4 text-ink/80">{current.summary}</p>
              {current.subjectNames.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2" aria-label="Lëndët">
                  {current.subjectNames.slice(0, 12).map((s) => (
                    <li key={s} className="rounded-pill bg-paper px-3 py-1.5 text-sm font-medium">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/programet/${current.slug}`}
                className="link-underline mt-8 inline-block font-semibold text-blue-deep"
              >
                Hap programin
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
