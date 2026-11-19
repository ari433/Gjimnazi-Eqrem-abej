import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskText } from "@/components/motion/MaskText";
import { Markdown } from "@/components/ui/Markdown";
import { ExampleBadge, UntranslatedNote } from "@/components/ui/Pending";
import { NewsCard } from "@/components/news/NewsCard";
import { getNews, getNewsArticle } from "@/lib/content/queries";
import { lp, t, type Locale } from "@/lib/i18n";
import { SITE_URL, asset, formatDate } from "@/lib/utils";

export async function ArticleView({ locale, slug }: { locale: Locale; slug: string }) {
  const T = t(locale);
  const [article, all] = await Promise.all([getNewsArticle(slug, locale), getNews(12, locale)]);
  if (!article) notFound();
  const more = all.filter((n) => n.id !== article.id).slice(0, 3);
  const bodyLang = article.untranslated && locale === "de" ? "sq" : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    inLanguage: bodyLang ?? locale,
    ...(article.show_date ? { datePublished: article.published_at, dateModified: article.updated_at ?? article.published_at } : {}),
    ...(article.cover_url ? { image: [`${SITE_URL}${article.cover_url}`] } : {}),
    publisher: { "@type": "EducationalOrganization", name: "Gjimnazi \"Eqrem Çabej\"", logo: `${SITE_URL}/logo.png` },
    mainEntityOfPage: `${SITE_URL}${lp(locale, `/lajme/${article.slug}`)}`,
  };

  return (
    <article>
      <header className="bg-paper pb-10 pt-28 md:pb-12 md:pt-44">
        <div className="shell">
          <Breadcrumbs locale={locale} items={[{ label: T.pages.news[0], href: "/lajme" }, { label: article.title }]} />
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted md:mt-10">
            <span className="font-semibold text-blue-deep">{article.category}</span>
            {article.show_date && <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at, { locale })}</time>}
            {article.author_name && <span>{article.author_name}</span>}
            {article.is_example && <ExampleBadge locale={locale} />}
            <UntranslatedNote show={article.untranslated} locale={locale} />
          </div>
          <MaskText as="h1" immediate text={article.title} className="mt-3 max-w-5xl text-mega font-bold" />
          {article.excerpt && <p className="mt-6 max-w-3xl text-lede text-muted">{article.excerpt}</p>}
        </div>
      </header>

      {article.cover_url && (
        <div className="shell">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-line md:aspect-[16/9]">
              <Image src={asset(article.cover_url)} alt={article.cover_alt ?? ""} fill priority sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover" />
            </div>
            {article.cover_alt && <figcaption className="mt-3 text-sm text-muted">{article.cover_alt}</figcaption>}
          </figure>
        </div>
      )}

      <div className="bg-paper py-12 md:py-20">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-10">
          <aside className="order-last lg:order-first lg:col-span-3">
            <Link href={lp(locale, "/lajme")} className="link-underline inline-flex items-center gap-2 text-sm font-semibold">
              <ArrowLeft aria-hidden className="size-4" />
              {T.news_.backToNews}
            </Link>
          </aside>
          <div className="lg:col-span-7">
            <Markdown source={article.body} className="prose-school" />
            {article.source_url && (
              <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="link-underline mt-8 inline-flex items-center gap-2 font-semibold">
                {T.source}: {new URL(article.source_url).hostname.replace(/^www\./, "")}
                <ExternalLink aria-hidden className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {article.gallery.length > 0 && (
        <section aria-label={T.news_.photos} className="bg-paper pb-16">
          <div className="shell grid gap-3 sm:grid-cols-2">
            {article.gallery.map((src) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-card bg-line sm:aspect-[4/3]">
                <Image src={asset(src)} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section aria-labelledby="more-news" className="border-t border-line bg-white py-16 md:py-24">
          <div className="shell">
            <h2 id="more-news" className="text-title font-bold">
              {T.news_.readAlso}
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((n) => (
                <NewsCard key={n.id} item={n} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
