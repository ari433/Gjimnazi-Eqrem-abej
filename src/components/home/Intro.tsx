import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { lp, t, type Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/types";

/** Navy introduction that the hero letter dissolves into. */
export function Intro({ intro, locale = "sq" }: { intro: SiteContent["intro"]; locale?: Locale }) {
  const H = t(locale).home_;
  return (
    <section aria-labelledby="intro-title" className="grain relative -mt-px overflow-hidden bg-ink text-white">
      <div className="shell relative py-20 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <MaskText id="intro-title" text={intro.heading} className="text-mega font-bold" />
          </div>
          <Reveal className="lg:col-span-5 lg:pt-4">
            <p className="font-serif text-[1.2rem] leading-[1.6] text-white/85 md:text-[1.35rem]">{intro.body}</p>
            <ButtonLink href={lp(locale, "/historia-dhe-misioni")} variant="light" className="mt-8">
              {H.historyLink}
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-card bg-white/10 md:mt-24 md:grid-cols-2">
          {[
            { label: H.vision, text: intro.vision },
            { label: H.mission, text: intro.mission },
          ].map((b, i) => (
            <Reveal key={b.label} delay={i * 0.1} className="bg-ink p-7 md:p-12">
              <h3 className="text-base font-semibold text-blue-soft">{b.label}</h3>
              <p className="mt-3 text-[clamp(1.4rem,2.4vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.025em]">{b.text}</p>
            </Reveal>
          ))}
        </div>
        {intro.source && (
          <p className="mt-5 text-sm text-white/50">
            {t(locale).source}: {intro.source}
          </p>
        )}
      </div>
    </section>
  );
}
