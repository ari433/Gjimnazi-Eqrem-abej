import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { t, type Locale } from "@/lib/i18n";
import type { StaffMember } from "@/lib/types";
import { asset } from "@/lib/utils";

/** The director's portrait next to his video interview. No invented quotes. */
export function DirectorSection({ director, locale = "sq" }: { director: StaffMember | undefined; locale?: Locale }) {
  if (!director) return null;
  const T = t(locale);
  return (
    <section aria-labelledby="director-title" className="bg-white py-20 md:py-32">
      <div className="shell grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
        <Reveal className="md:col-span-4">
          {director.photo_url && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-paper">
              <Image src={asset(director.photo_url)} alt={`${T.staff_.photoOf} ${director.full_name}`} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover object-top" />
            </div>
          )}
          <p className="mt-4 text-sm font-semibold text-blue-deep">{director.role_title}</p>
          <h2 id="director-title" className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.035em]">
            {director.full_name}
          </h2>
        </Reveal>
        {director.video_url && (
          <Reveal delay={0.1} className="md:col-span-8">
            <p className="mb-3 text-sm font-semibold text-muted">{T.staff_.interview}</p>
            <VideoEmbed url={director.video_url} title={`${T.staff_.interview}: ${director.full_name}`} playLabel={T.gallery_.play} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
