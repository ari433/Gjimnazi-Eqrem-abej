"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type LifeTab = {
  key: string;
  label: string;
  heading: string;
  items: { title: string; text?: string; href?: string }[];
};

/** Accessible tablist (arrow keys, Home/End) for the school-life section. */
export function SchoolLife({ tabs, source, sourceLabel = "Burimi", label = "Jeta shkollore" }: { tabs: LifeTab[]; source: string; sourceLabel?: string; label?: string }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotionSafe();
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[index];

  const onKey = (e: KeyboardEvent) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setIndex(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div role="tablist" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${id}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={cn(
              "relative shrink-0 rounded-pill px-5 py-3 text-left text-base font-semibold transition-colors lg:rounded-2xl lg:px-6 lg:py-5 lg:text-2xl lg:tracking-[-0.02em]",
              i === index ? "text-white" : "text-ink/60 hover:text-ink",
            )}
          >
            {i === index && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-[inherit] bg-ink"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${index}`}
        className="rounded-card bg-white p-6 md:min-h-[22rem] md:p-12 lg:col-span-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab.key}
            initial={reduce ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-title font-bold">{tab.heading}</h3>
            <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 md:mt-8 md:gap-y-6">
              {tab.items.map((it) => (
                <li key={it.title} className="border-t border-line pt-4">
                  {it.href ? (
                    <Link href={it.href} className="link-underline text-xl font-semibold tracking-[-0.02em]">
                      {it.title}
                    </Link>
                  ) : (
                    <p className="text-lg font-semibold tracking-[-0.02em] md:text-xl">{it.title}</p>
                  )}
                  {it.text && <p className="mt-1 text-muted">{it.text}</p>}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted">
              {sourceLabel}: {source}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
