import { PageHero } from "@/components/ui/PageHero";
import { NewsBrowser } from "@/components/news/NewsBrowser";
import { getNews } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";

export async function NewsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const news = await getNews(100, locale);
  return (
    <>
      <PageHero locale={locale} title={T.pages.news[0]} crumbs={[{ label: T.pages.news[0] }]} lede={T.pages.news[1]} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          <NewsBrowser items={news} locale={locale} />
        </div>
      </section>
    </>
  );
}
