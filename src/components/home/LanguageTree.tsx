"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { asset } from "@/lib/utils";

/** Where the "SHQIPJA" label sits on the mural photo (percent of width/height). */
const TARGET = { x: 40.1, y: 43.6 };
/** Kept moderate so the 2000px photo stays sharp at full zoom. */
const ZOOM = 2.8;

type Copy = { kicker: string; title: string; body: string; caption: string; label: string };

/**
 * The language-family mural in the school's corridor. On scroll the camera
 * travels into the tree until the Albanian branch fills the centre of the
 * screen, then the message appears. Without motion it is a still image.
 */
export function LanguageTree({ src, copy }: { src: string; copy: Copy }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // k: 0 → 1 while zooming into the label.
  const k = useTransform(scrollYProgress, [0.08, 0.62], [0, 1], { clamp: true });
  const scale = useTransform(k, (v) => 1 + v * (ZOOM - 1));
  // Translate (in % of the photo box) so the label travels to the centre.
  const x = useTransform(k, (v) => `${(50 - TARGET.x) * v * (1 + v * (ZOOM - 1))}%`);
  const y = useTransform(k, (v) => `${(50 - TARGET.y) * v * (1 + v * (ZOOM - 1))}%`);
  const dim = useTransform(scrollYProgress, [0.1, 0.55], [0.15, 0.62]);
  const ring = useTransform(scrollYProgress, [0.5, 0.64], [0, 1]);
  // The label chip hands over to the message card.
  const chip = useTransform(scrollYProgress, [0.5, 0.64, 0.68, 0.76], [0, 1, 1, 0]);
  const intro = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const message = useTransform(scrollYProgress, [0.64, 0.78], [0, 1]);
  const messageY = useTransform(scrollYProgress, [0.64, 0.78], [40, 0]);

  if (reduce) return <StaticTree src={src} copy={copy} />;

  return (
    <section ref={ref} aria-labelledby="tree-title" className="relative h-[280svh] bg-ink text-white">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Photo box: always covers the viewport while keeping the 3:2 ratio,
            so percentages map to fixed points on the mural. */}
        <motion.div
          className="absolute aspect-[3/2] w-[max(100vw,150svh)] will-change-transform"
          // Centred with margins, because motion owns the transform property.
          style={{
            left: "50%",
            top: "50%",
            marginLeft: "calc(max(100vw, 150svh) / -2)",
            marginTop: "calc(max(66.667vw, 100svh) / -2)",
            scale,
            x,
            y,
          }}
        >
          <Image src={asset(src)} alt={copy.caption} fill sizes="(min-width: 768px) 150vh, 300vw" className="object-cover" priority={false} />
          <motion.span
            aria-hidden
            className="absolute aspect-square w-[5.5%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-soft"
            style={{ left: `${TARGET.x}%`, top: `${TARGET.y}%`, opacity: ring }}
          />
        </motion.div>

        {/* Spotlight: darkens everything except the centre once zoomed. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: dim,
            background: "radial-gradient(circle at 50% 50%, rgba(10,24,56,0) 0, rgba(10,24,56,0) calc(max(100vw, 150svh) * 0.085), rgba(10,24,56,0.92) calc(max(100vw, 150svh) * 0.26))",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />

        {/* Opening caption */}
        <motion.div style={{ opacity: intro }} className="shell absolute inset-x-0 top-24 md:top-28">
          <p className="inline-flex rounded-pill bg-white/10 px-3 py-1.5 text-sm font-semibold backdrop-blur">{copy.kicker}</p>
        </motion.div>

        {/* Label + message */}
        <motion.p
          aria-hidden
          style={{ opacity: chip }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[calc(max(100vw,150svh)*0.08+0.75rem)] rounded-pill bg-blue px-3 py-1 text-sm font-bold"
        >
          {copy.label}
        </motion.p>
        <motion.div style={{ opacity: message, y: messageY }} className="shell absolute inset-x-0 bottom-10 md:bottom-16">
          <div className="max-w-2xl rounded-card bg-ink/80 p-6 backdrop-blur-md md:p-8">
            <h2 id="tree-title" className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.04em]">
              {copy.title}
            </h2>
            <p className="mt-4 text-white/75 md:text-lg">{copy.body}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StaticTree({ src, copy }: { src: string; copy: Copy }) {
  return (
    <section aria-labelledby="tree-title" className="bg-ink py-20 text-white md:py-28">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:items-center">
        <figure className="relative overflow-hidden rounded-card lg:col-span-7">
          <div className="relative aspect-[3/2]">
            <Image src={asset(src)} alt={copy.caption} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            <span
              aria-hidden
              className="absolute aspect-square w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-soft"
              style={{ left: `${TARGET.x}%`, top: `${TARGET.y}%` }}
            />
          </div>
          <figcaption className="mt-3 text-sm text-white/60">{copy.caption}</figcaption>
        </figure>
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold text-blue-soft">{copy.kicker}</p>
          <h2 id="tree-title" className="mt-3 text-title font-bold">
            {copy.title}
          </h2>
          <p className="mt-4 text-white/75 md:text-lg">{copy.body}</p>
        </div>
      </div>
    </section>
  );
}

