import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { t } from "@/lib/i18n";
import { CalendarView } from "@/views/CalendarView";

const T = t("de");
export const metadata: Metadata = pageMeta("de", "/kalendari", T.pages.calendar[0], `${T.pages.calendar[1]}. Gjimnazi "Eqrem Çabej", ${T.city}.`);

export default function Page() {
  return <CalendarView locale="de" />;
}
