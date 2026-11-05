import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { NewsBrowser } from "@/components/news/NewsBrowser";
import { getNews } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Lajmet",
  description: "Lajmet e Gjimnazit \"Eqrem Çabej\" në Prishtinë.",
  alternates: { canonical: "/lajme" },
};

export default async function NewsPage() {
  const news = await getNews(100);
  return (
    <>
      <PageHero title="Lajmet" crumbs={[{ label: "Lajmet" }]} lede="Çfarë po ndodh në shkollë." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell">
          <NewsBrowser items={news} />
        </div>
      </section>
    </>
  );
}
