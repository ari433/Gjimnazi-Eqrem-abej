import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { MediaClubView } from "@/views/MediaClubView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/klubi-i-medias", T.pages.media[0], `${T.pages.media[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <MediaClubView locale="sq" />;
}
