"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskText } from "@/components/motion/MaskText";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import type { SiteContent } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening moment. A single giant "Ç" — the first letter of Çabej, the
 * linguist the school is named after — works as a window. With a school photo
 * uploaded from the CMS it frames that photo; without one it carries the
 * brand gradient. On scroll the letter grows until its stroke fills the
 * screen and hands over to the navy introduction below.
 */
export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const wrap = useRef<HTMLElement>(null);
  const glyph = useRef<HTMLSpanElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
      tl.to(copy.current, { yPercent: -18, opacity: 0, duration: 0.35 }, 0)
        .to(glyph.current, { scale: 16, duration: 1, ease: "power2.in" }, 0.05)
        .to(cover.current, { opacity: 1, duration: 0.25 }, 0.8);
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  const fill = hero.image_url
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10,24,56,0.05), rgba(10,24,56,0.25)), url("${hero.image_url}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundImage:
          "radial-gradient(120% 90% at 85% 15%, #6f86ff 0%, rgba(111,134,255,0) 55%), linear-gradient(150deg, #2b4bff 0%, #1a33d6 38%, #0a1838 100%)",
      };

  return (
    <section
      ref={wrap}
      aria-labelledby="hero-title"
      className="relative bg-paper motion-safe:h-[210svh]"
    >
      <div className="relative flex min-h-svh flex-col overflow-hidden motion-safe:sticky motion-safe:top-0 motion-safe:h-svh">
        {/* The letter */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-[-8vw] flex items-start pt-16 md:right-[3vw] md:items-start md:pt-[11svh]"
          initial={reduce ? false : { clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.15 }}
        >
          <span
            ref={glyph}
            className="block select-none bg-clip-text px-[0.04em] font-bold leading-[1.02] text-transparent will-change-transform [transform-origin:24%_42%] [-webkit-background-clip:text]"
            style={{ ...fill, fontSize: "min(70svh, 86vw)" }}
          >
            Ç
          </span>
        </motion.div>
        {hero.image_url && hero.image_alt ? <span className="sr-only">{hero.image_alt}</span> : null}

        {/* Copy */}
        <div ref={copy} className="shell relative z-10 mt-auto pb-10 pt-32 md:pb-16">
          <MaskText
            as="h1"
            id="hero-title"
            immediate
            delay={0.35}
            text={hero.title}
            className="max-w-[11ch] text-display font-bold text-ink"
          />
          <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
            <motion.p
              className="text-lede max-w-xl text-ink/75 md:col-span-6"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            >
              <span className="rounded-md bg-paper/70 box-decoration-clone px-1 backdrop-blur-[2px] md:bg-transparent md:px-0 md:backdrop-blur-none">
                {hero.lede}
              </span>
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-3 md:col-span-6 md:justify-end"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.05 }}
            >
              <Magnetic>
                <ButtonLink href={hero.primary_cta.href} variant="ink">
                  {hero.primary_cta.label}
                </ButtonLink>
              </Magnetic>
              <ButtonLink href={hero.secondary_cta.href} variant="light" icon={false} className="border border-ink/10">
                {hero.secondary_cta.label}
              </ButtonLink>
            </motion.div>
          </div>
        </div>

        {/* Hand-over to the navy introduction */}
        <div ref={cover} aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
      </div>
    </section>
  );
}
