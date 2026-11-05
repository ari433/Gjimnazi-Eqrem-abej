import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { ClubsView } from "@/views/ClubsView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/klubet", T.pages.clubs[0], `${T.pages.clubs[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <ClubsView locale="sq" />;
}
