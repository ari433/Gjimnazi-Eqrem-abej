import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { DocumentsView } from "@/views/DocumentsView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/dokumentet", T.pages.documents[0], `${T.pages.documents[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <DocumentsView locale="sq" />;
}
