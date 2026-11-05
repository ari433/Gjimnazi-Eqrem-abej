import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { NewsView } from "@/views/NewsView";

const T = t("de");
export const metadata: Metadata = pageMeta("de", "/lajme", T.pages.news[0], `${T.pages.news[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <NewsView locale="de" />;
}
