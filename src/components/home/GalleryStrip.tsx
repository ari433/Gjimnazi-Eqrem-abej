import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { lp, t, type Locale } from "@/lib/i18n";
import { asset, cn } from "@/lib/utils";

/**
 * Editorial photo mosaic. On phones it becomes a swipeable strip so photos
 * stay large instead of shrinking into a grid of thumbnails.
 */
export function GalleryStrip({ media, locale = "sq" }: { media: MediaItem[]; locale?: Locale }) {
  const photos = media.filter((m) => m.kind === "image" && (m.width ?? 0) >= 800).slice(0, 5);
  if (photos.length === 0) return null;
  const T = t(locale);
  const shapes = ["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-3", "md:col-span-3"];

  return (
    <section aria-labelledby="gallery-title" className="overflow-hidden bg-paper py-20 md:py-32">
      <div className="shell">
        <SectionHeading id="gallery-title" title={T.home_.galleryTitle} link={{ href: lp(locale, "/galeria"), label: T.home_.openGallery }} />
        <RevealGroup className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-14 md:grid md:auto-rows-[15rem] md:grid-cols-6 md:overflow-visible md:px-0 md:pb-0">
          {photos.map((m, i) => (
            <RevealItem key={m.id} className={cn("w-[82%] shrink-0 snap-center md:w-auto", shapes[i])}>
              <Link href={lp(locale, "/galeria")} className="group relative block aspect-[4/5] h-full overflow-hidden rounded-card bg-line md:aspect-auto">
                <Image
                  src={asset(m.url)}
                  alt={m.caption ?? m.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 82vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-12 text-sm font-medium text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                  {m.caption ?? m.title}
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
