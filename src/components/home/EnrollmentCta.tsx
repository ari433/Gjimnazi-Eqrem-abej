import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { MaskText } from "@/components/motion/MaskText";
import { PendingBadge } from "@/components/ui/Pending";
import type { SiteContent } from "@/lib/types";
import { lp, t, type Locale } from "@/lib/i18n";

export function EnrollmentCta({ enrollment, locale = "sq" }: { enrollment: SiteContent["enrollment"]; locale?: Locale }) {
  const T = t(locale);
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-blue text-white">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[0.22em] right-[-0.05em] select-none text-[clamp(16rem,42vw,40rem)] font-bold leading-[0.8] tracking-[-0.08em] text-white/[0.09]"
      >
        X
      </span>
      <div className="shell relative py-20 md:py-36">
        {enrollment.verification === "pending" && <PendingBadge className="bg-white/15 text-white" label={T.enrollment_.pending} />}
        <MaskText id="cta-title" text={enrollment.heading} className="mt-6 max-w-4xl text-mega font-bold" />
        <p className="mt-8 max-w-2xl text-lede text-white/80">{enrollment.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <ButtonLink href={lp(locale, enrollment.cta_href)} variant="light">
              {enrollment.cta_label}
            </ButtonLink>
          </Magnetic>
          <ButtonLink href={lp(locale, "/per-nxenesit")} variant="ghost" icon={false} className="border-white/30 text-white hover:border-white hover:bg-white hover:text-ink">
            {T.home_.studentInfo}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
