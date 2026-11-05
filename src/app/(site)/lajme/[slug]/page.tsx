import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskText } from "@/components/motion/MaskText";
import { Markdown, plainText } from "@/components/ui/Markdown";
import { ExampleBadge } from "@/components/ui/Pending";
import { NewsCard } from "@/components/news/NewsCard";
import { getNews, getNewsArticle } from "@/lib/content/queries";
import { SITE_URL, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const news = await getNews(50);
  return news.length ? news.map((n) => ({ slug: n.slug })) : [{ slug: "faqja-e-re-e-shkolles" }];
}

export async function generateMetadata({ params }: PageProps<"/lajme/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await getNewsArticle(slug);
  if (!a) return { title: "Lajmi nuk u gjet" };
  const description = a.excerpt || plainText(a.body);
  return {
    title: a.title,
    description,
    alternates: { canonical: `/lajme/${slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description,
      publishedTime: a.published_at ?? undefined,
      ...(a.cover_url ? { images: [{ url: a.cover_url, alt: a.cover_alt ?? a.title }] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/lajme/[slug]">) {
  const { slug } = await params;
  const [article, all] = await Promise.all([getNewsArticle(slug), getNews(12)]);
  if (!article) notFound();
  const more = all.filter((n) => n.id !== article.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.published_at,
    dateModified: article.updated_at ?? article.published_at,
    ...(article.cover_url ? { image: [article.cover_url] } : {}),
    publisher: { "@type": "EducationalOrganization", name: "Gjimnazi \"Eqrem Çabej\"", logo: `${SITE_URL}/logo.png` },
    mainEntityOfPage: `${SITE_URL}/lajme/${article.slug}`,
  };

  return (
    <article>
      <header className="bg-paper pb-12 pt-36 md:pt-44">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Lajmet", href: "/lajme" }, { label: article.title }]} />
          <div className="mt-10 flex flex-wrap items-center gap-3 text-muted">
            <span className="font-semibold text-blue-deep">{article.category}</span>
            <time dateTime={article.published_at ?? undefined}>{formatDate(article.published_at)}</time>
            {article.author_name && <span>{article.author_name}</span>}
            {article.is_example && <ExampleBadge />}
          </div>
          <MaskText as="h1" immediate text={article.title} className="mt-4 max-w-5xl text-mega font-bold" />
          {article.excerpt && <p className="mt-8 max-w-3xl text-lede text-muted">{article.excerpt}</p>}
        </div>
      </header>

      {article.cover_url && (
        <div className="shell">
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-line">
              <Image src={article.cover_url} alt={article.cover_alt ?? ""} fill priority sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover" />
            </div>
            {article.cover_alt && <figcaption className="mt-3 text-sm text-muted">{article.cover_alt}</figcaption>}
          </figure>
        </div>
      )}

      <div className="bg-paper py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <Link href="/lajme" className="link-underline text-sm font-semibold">
              Kthehu te lajmet
            </Link>
          </aside>
          <Markdown source={article.body} className="prose-school lg:col-span-7" />
        </div>
      </div>

      {more.length > 0 && (
        <section aria-labelledby="more-news" className="border-t border-line bg-white py-20 md:py-28">
          <div className="shell">
            <h2 id="more-news" className="text-title font-bold">
              Lexo edhe
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </article>
  );
}
