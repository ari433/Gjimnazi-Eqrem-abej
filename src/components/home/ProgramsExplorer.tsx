"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Program } from "@/lib/types";
import { PendingBadge } from "@/components/ui/Pending";
import { lp, t, type Locale } from "@/lib/i18n";
import { asset, cn } from "@/lib/utils";

type Item = Program & { subjectNames: string[] };

/** Programme list that previews the hovered/focused programme beside it. */
export function ProgramsExplorer({ programs, locale = "sq" }: { programs: Item[]; locale?: Locale }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotionSafe();
  const current = programs[active];
  const H = t(locale).home_;
  if (!current) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <ul className="lg:col-span-6" role="list">
        {programs.map((p, i) => (
          <li key={p.id} className="border-t border-line last:border-b">
            <Link
              href={lp(locale, `/programet/${p.slug}`)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex items-start justify-between gap-4 py-6 md:gap-5 md:py-9"
            >
              {p.cover_url && (
                <span className="relative mt-1 size-16 shrink-0 overflow-hidden rounded-2xl bg-line sm:size-20 lg:hidden">
                  <Image src={asset(p.cover_url)} alt="" fill sizes="80px" className="object-cover" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-[clamp(1.7rem,4vw,3.2rem)] font-bold leading-[1] tracking-[-0.035em] transition-colors duration-300",
                    i === active ? "text-ink" : "text-ink lg:text-ink/35 lg:group-hover:text-ink",
                  )}
                >
                  {p.short_name || p.name}
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-3 text-muted">
                  <span>{p.tagline}</span>
                  {p.verification === "pending" && <PendingBadge locale={locale} />}
                </span>
              </span>
              <span
                className={cn(
                  "mt-1 grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)] md:size-12",
                  i === active ? "border-blue bg-blue text-white" : "border-line text-ink group-hover:border-ink",
                )}
              >
                <ArrowUpRight aria-hidden className="size-5 transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-28 overflow-hidden rounded-card bg-white shadow-[0_1px_0_var(--color-line),0_30px_60px_-30px_rgba(10,24,56,0.25)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {current.cover_url && (
                <div className="relative aspect-[16/9]">
                  <Image src={asset(current.cover_url)} alt="" fill sizes="45vw" className="object-cover" />
                </div>
              )}
              <div className="p-8">
                <p className="text-sm text-muted">{current.grades}</p>
                <h3 className="mt-1 text-2xl font-bold leading-tight tracking-[-0.03em]">{current.name}</h3>
                <p className="mt-3 text-ink/80">{current.summary}</p>
                {current.subjectNames.length > 1 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={H.subjects}>
                    {current.subjectNames.slice(0, 12).map((s) => (
                      <li key={s} className="rounded-pill bg-paper px-3 py-1 text-sm font-medium">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
