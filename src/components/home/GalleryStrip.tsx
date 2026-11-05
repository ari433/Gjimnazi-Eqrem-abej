import Image from "next/image";
import Link from "next/link";
import { Images } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { asset } from "@/lib/utils";

/** Bento of the latest photos. Low-resolution archive images stay small. */
export function GalleryStrip({ media }: { media: MediaItem[] }) {
  const photos = media.filter((m) => m.kind === "image").slice(0, 5);
  const shapes = ["md:col-span-3 md:row-span-2", "md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2"];

  return (
    <section aria-labelledby="gallery-title" className="bg-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeading id="gallery-title" title="Galeria" lede="Momente nga jeta e shkollës." link={{ href: "/galeria", label: "Hap galerinë" }} />
        {photos.length === 0 ? (
          <EmptyState icon={Images} title="Fotot e para po vijnë" className="mt-14">
            Galeria plotësohet nga stafi përmes panelit të administrimit.
          </EmptyState>
        ) : (
          <RevealGroup className="mt-14 grid auto-rows-[12rem] grid-cols-2 gap-3 md:auto-rows-[14rem] md:grid-cols-6">
            {photos.map((m, i) => {
              const lowRes = (m.width ?? 2000) < 600;
              return (
                <RevealItem key={m.id} className={lowRes ? "col-span-1 row-span-1" : shapes[i] ?? "md:col-span-2"}>
                  <Link href="/galeria" className="group relative block h-full overflow-hidden rounded-card bg-line">
                    <Image
                      src={asset(m.url)}
                      alt={m.caption ?? m.title}
                      fill
                      sizes={lowRes ? "206px" : "(min-width: 768px) 50vw, 50vw"}
                      className={lowRes ? "object-contain p-6" : "object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"}
                    />
                  </Link>
                </RevealItem>
              );
            })}
            {photos.length < 4 && (
              <RevealItem className="col-span-2 md:col-span-4">
                <div className="hatch flex h-full flex-col justify-end rounded-card border border-dashed border-line-strong p-6">
                  <p className="text-lg font-semibold">Foto të reja nga shkolla</p>
                  <p className="text-muted">Do të shtohen nga stafi me lejen e nxënësve dhe prindërve.</p>
                </div>
              </RevealItem>
            )}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
