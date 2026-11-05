import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/media/GalleryGrid";
import { getMedia } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Galeria e fotove dhe videove",
  description: "Foto dhe video nga jeta në Gjimnazin \"Eqrem Çabej\".",
  alternates: { canonical: "/galeria" },
};

export default async function GalleryPage() {
  const media = await getMedia();
  return (
    <>
      <PageHero title="Galeria" crumbs={[{ label: "Galeria" }]} lede="Foto dhe video nga aktivitetet, klasat dhe klubet." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          <GalleryGrid items={media} />
        </div>
      </section>
    </>
  );
}
