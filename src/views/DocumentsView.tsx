import { PageHero } from "@/components/ui/PageHero";
import { DocumentList } from "@/components/documents/DocumentList";
import { getDocuments } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";

export async function DocumentsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const docs = await getDocuments(locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.documents[0]} crumbs={[{ label: T.pages.documents[0] }]} lede={T.pages.documents[1]} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          <DocumentList docs={docs} locale={locale} />
        </div>
      </section>
    </>
  );
}
