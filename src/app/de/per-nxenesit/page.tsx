import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { StudentsView } from "@/views/StudentsView";

const T = t("de");
export const metadata: Metadata = pageMeta("de", "/per-nxenesit", T.pages.students[0], `${T.pages.students[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <StudentsView locale="de" />;
}
