import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { ProgramsView } from "@/views/ProgramsView";

const T = t("de");
export const metadata: Metadata = pageMeta("de", "/programet", T.pages.programs[0], `${T.pages.programs[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <ProgramsView locale="de" />;
}
