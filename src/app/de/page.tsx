import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { HomeView } from "@/views/HomeView";

export const metadata: Metadata = {
  ...pageMeta("de", "/", "Gymnasium \"Eqrem Çabej\" · Prishtina", "Gymnasium für Sozial- und Sprachwissenschaften in Prishtina. Aktuelles, Bildungsgänge, Deutsches Sprachdiplom, Termine und Dokumente."),
  title: { absolute: "Gymnasium \"Eqrem Çabej\" · Prishtina" },
};

export default function Page() {
  return <HomeView locale="de" />;
}
