"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { MaskText } from "@/components/motion/MaskText";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import type { SiteContent } from "@/lib/types";
import { lp, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening moment: one full-screen school photo with the headline set on
 * it. The hero stays pinned while the navy introduction slides up over it
 * like a sheet of paper, so the first scroll feels deliberate on a phone as
 * much as on a desktop. Nothing scales: the photo only drifts and dims.
 */
export function Hero({ hero, locale = "sq" }: { hero: SiteContent["hero"]; locale?: Locale }) {
  const reduce = useReducedMotionSafe();
  const { scrollY } = useScroll();
  // 0 at the top of the page, 1 once the introduction has covered the hero.
  const p = useTransform(scrollY, (y) => (typeof window === "undefined" ? 0 : Math.min(1, Math.max(0, y / window.innerHeight))));
  const photoY = useTransform(p, (v) => `${v * 7}%`);
  const dim = useTransform(p, [0, 1], [0, 0.6]);
  const copyY = useTransform(p, (v) => v * -72);
  const copyOpacity = useTransform(p, [0, 0.7], [1, 0]);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex h-svh min-h-[34rem] flex-col overflow-hidden bg-ink text-white motion-safe:sticky motion-safe:top-0"
    >
      {/* Photo */}
      <motion.div
        aria-hidden={hero.image_url ? undefined : true}
        className="absolute inset-x-0 -top-[4%] h-[112%] will-change-transform"
        style={reduce ? undefined : { y: photoY }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        {hero.image_url ? (
          <Image
            src={asset(hero.image_url)}
            alt={hero.image_alt ?? ""}
            fill
            preload
            sizes="100vw"
            className="object-cover object-[50%_32%]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_15%,#6f86ff_0%,rgba(111,134,255,0)_55%),linear-gradient(150deg,#2b4bff_0%,#1a33d6_38%,#0a1838_100%)]" />
        )}
      </motion.div>

      {/* Legibility: a soft top band for the header, a deep base for the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,56,0.62)_0%,rgba(10,24,56,0.12)_26%,rgba(10,24,56,0.42)_54%,rgba(10,24,56,0.93)_100%)]"
      />
      {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: dim }} />}

      {/* Copy */}
      <motion.div
        className="shell relative z-10 mt-auto pb-10 pt-28 md:pb-16"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <MaskText
          as="h1"
          id="hero-title"
          immediate
          delay={0.3}
          text={hero.title}
          className="max-w-[11ch] text-display font-bold text-white"
        />
        <div className="mt-6 grid gap-7 md:mt-10 md:grid-cols-12 md:items-end md:gap-8">
          <motion.p
            className="text-lede max-w-xl text-white/85 md:col-span-6"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.85 }}
          >
            {hero.lede}
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 md:col-span-6 md:justify-end"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1 }}
          >
            <Magnetic>
              <ButtonLink href={lp(locale, hero.primary_cta.href)} variant="light">
                {hero.primary_cta.label}
              </ButtonLink>
            </Magnetic>
            <ButtonLink
              href={lp(locale, hero.secondary_cta.href)}
              variant="ghost"
              icon={false}
              className="border-white/40 text-white hover:border-white hover:bg-white hover:text-ink"
            >
              {hero.secondary_cta.label}
            </ButtonLink>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
