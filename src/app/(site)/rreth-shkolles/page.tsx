import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { AboutView } from "@/views/AboutView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/rreth-shkolles", T.pages.about[0], `${T.pages.about[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <AboutView locale="sq" />;
}
