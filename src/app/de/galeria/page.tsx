import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { GalleryView } from "@/views/GalleryView";

const T = t("de");
export const metadata: Metadata = pageMeta("de", "/galeria", T.pages.gallery[0], `${T.pages.gallery[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <GalleryView locale="de" />;
}
