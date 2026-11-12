import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { HomeView } from "@/views/HomeView";

export const metadata: Metadata = {
  ...pageMeta("sq", "/", "Gjimnazi \"Eqrem Çabej\" · Prishtinë", "Gjimnazi i shkencave shoqërore-gjuhësore në Prishtinë. Lajme, programet, Diploma Gjermane, kalendari dhe dokumentet e shkollës."),
  title: { absolute: "Gjimnazi \"Eqrem Çabej\" · Prishtinë" },
};

export default function Page() {
  return <HomeView locale="sq" />;
}
