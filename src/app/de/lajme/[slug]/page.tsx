import type { Metadata } from "next";
import { getNews, getNewsArticle } from "@/lib/content/queries";
import { plainText } from "@/components/ui/Markdown";
import { pageMeta } from "@/lib/meta";
import { ArticleView } from "@/views/ArticleView";

export async function generateStaticParams() {
  const news = await getNews(200);
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/de/lajme/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await getNewsArticle(slug, "de");
  if (!a) return { title: "404" };
  const description = a.excerpt || plainText(a.body);
  return pageMeta("de", `/lajme/${slug}`, a.title, description, {
    openGraph: {
      type: "article",
      title: a.title,
      description,
      ...(a.cover_url ? { images: [{ url: a.cover_url, alt: a.cover_alt ?? a.title }] } : {}),
    },
  });
}

export default async function Page({ params }: PageProps<"/de/lajme/[slug]">) {
  const { slug } = await params;
  return <ArticleView locale="de" slug={slug} />;
}
