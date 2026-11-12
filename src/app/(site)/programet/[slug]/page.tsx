import type { Metadata } from "next";
import { getProgram, getPrograms } from "@/lib/content/queries";
import { pageMeta } from "@/lib/meta";
import { ProgramView } from "@/views/ProgramView";

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programet/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProgram(slug, "sq");
  if (!data) return { title: "404" };
  return pageMeta("sq", `/programet/${slug}`, data.program.name, data.program.summary);
}

export default async function Page({ params }: PageProps<"/programet/[slug]">) {
  const { slug } = await params;
  return <ProgramView locale="sq" slug={slug} />;
}
