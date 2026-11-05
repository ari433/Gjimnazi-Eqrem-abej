import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/media/GalleryGrid";
import { getMedia } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";

export async function GalleryView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const media = await getMedia(locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.gallery[0]} crumbs={[{ label: T.pages.gallery[0] }]} lede={T.pages.gallery[1]} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          <GalleryGrid items={media} locale={locale} />
        </div>
      </section>
    </>
  );
}
