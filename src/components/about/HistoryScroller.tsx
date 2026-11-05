"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import type { TimelineEntry } from "@/lib/types";

/**
 * Sticky storytelling timeline. The period on the left swaps as each entry
 * crosses the centre of the viewport. The content is a real ordered list,
 * so it reads correctly without motion or JavaScript.
 */
export function HistoryScroller({ entries }: { entries: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(entries.length - 1, Math.max(0, Math.floor(v * entries.length)));
    setActive(i);
  });

  return (
    <section aria-label="Kronologjia" className="bg-paper pb-10">
      <div ref={ref} className="shell grid gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[22vh] h-[56vh] overflow-hidden">
            <div className="h-1 w-full rounded-pill bg-line">
              <motion.div className="h-full origin-left rounded-pill bg-blue" style={{ scaleX: scrollYProgress }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                aria-hidden
                initial={reduce ? false : { y: "40%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: "-40%", opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 text-[clamp(4rem,8vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-ink"
              >
                {entries[active]?.period}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {entries.map((e, i) => (
            <li
              key={i}
              className="flex min-h-[38vh] flex-col justify-center border-t border-line py-12 transition-opacity duration-500 lg:min-h-[56vh]"
              style={{ opacity: reduce === false && i !== active ? 0.35 : 1 }}
            >
              <p className="text-lg font-semibold text-blue-deep">{e.period}</p>
              <h2 className="mt-2 text-title font-bold">{e.title}</h2>
              <p className="mt-4 max-w-xl font-serif text-xl leading-relaxed text-ink/80">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
