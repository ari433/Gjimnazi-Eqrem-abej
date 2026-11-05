import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { AnnouncementsView } from "@/views/AnnouncementsView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/njoftimet", T.pages.announcements[0], `${T.pages.announcements[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <AnnouncementsView locale="sq" />;
}
