import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { StaffView } from "@/views/StaffView";

const T = t("de");
export const metadata: Metadata = pageMeta("de", "/udheheqja-dhe-stafi", T.pages.staff[0], `${T.pages.staff[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <StaffView locale="de" />;
}
