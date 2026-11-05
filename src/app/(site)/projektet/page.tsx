import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { ProjectsView } from "@/views/ProjectsView";

const T = t("sq");
export const metadata: Metadata = pageMeta("sq", "/projektet", T.pages.projects[0], `${T.pages.projects[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <ProjectsView locale="sq" />;
}
