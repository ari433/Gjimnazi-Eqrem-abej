import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { ContactView } from "@/views/ContactView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/kontakti", T.pages.contact[0], `${T.pages.contact[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <ContactView locale="sq" />;
}
