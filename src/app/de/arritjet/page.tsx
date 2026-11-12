import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { AchievementsView } from "@/views/AchievementsView";

const T = t("de");
export const metadata: Metadata = pageMeta("de", "/arritjet", T.pages.achievements[0], `${T.pages.achievements[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <AchievementsView locale="de" />;
}
