import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { DocumentList } from "@/components/documents/DocumentList";
import { getDocuments } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Dokumentet",
  description: "Dokumente zyrtare, plane dhe formularë të Gjimnazit \"Eqrem Çabej\".",
  alternates: { canonical: "/dokumentet" },
};

export default async function DocumentsPage() {
  const docs = await getDocuments();
  return (
    <>
      <PageHero title="Dokumentet" crumbs={[{ label: "Dokumentet" }]} lede="Plane, rregullore dhe formularë për nxënës dhe prindër." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          <DocumentList docs={docs} />
        </div>
      </section>
    </>
  );
}
