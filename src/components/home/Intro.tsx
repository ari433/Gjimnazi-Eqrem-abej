import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import type { SiteContent } from "@/lib/types";

/** Navy introduction that the hero letter dissolves into. */
export function Intro({ intro }: { intro: SiteContent["intro"] }) {
  return (
    <section aria-labelledby="intro-title" className="grain relative -mt-px overflow-hidden bg-ink text-white">
      <div className="shell relative py-24 md:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MaskText id="intro-title" text={intro.heading} className="text-mega font-bold" />
          </div>
          <Reveal className="lg:col-span-5 lg:pt-4">
            <p className="font-serif text-[1.35rem] leading-[1.6] text-white/85">
              {intro.body}
            </p>
            <ButtonLink href="/historia-dhe-misioni" variant="light" className="mt-8">
              Historia dhe misioni
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-card bg-white/10 md:mt-28 md:grid-cols-2">
          {[
            { label: "Vizioni", text: intro.vision },
            { label: "Misioni", text: intro.mission },
          ].map((b, i) => (
            <Reveal key={b.label} delay={i * 0.1} className="bg-ink p-8 md:p-12">
              <h3 className="text-base font-semibold text-blue-soft">{b.label}</h3>
              <p className="mt-4 text-[clamp(1.5rem,2.4vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
                {b.text}
              </p>
            </Reveal>
          ))}
        </div>
        {intro.source && <p className="mt-5 text-sm text-white/50">Burimi: {intro.source}</p>}
      </div>
    </section>
  );
}
