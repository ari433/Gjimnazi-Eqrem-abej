import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { HistoryView } from "@/views/HistoryView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/historia-dhe-misioni", T.pages.history[0], `${T.pages.history[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <HistoryView locale="sq" />;
}
