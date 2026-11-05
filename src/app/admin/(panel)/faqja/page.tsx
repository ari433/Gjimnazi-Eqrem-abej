import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SiteSectionEditor } from "@/components/admin/SiteSectionEditor";
import { requireRole } from "@/lib/admin/auth";
import { baseKey, SITE_KEYS, SITE_LABELS } from "@/lib/admin/site-schemas";
import { siteContent, siteContentDe } from "@/lib/content/seed";
import { getServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ballina dhe faqja" };

export default async function SiteContentPage() {
  await requireRole("editor");
  const sb = await getServerClient();
  const { data } = await sb.from("site_content").select("key, value");
  const stored = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return (
    <>
      <AdminHeader
        title="Ballina dhe faqja"
        description="Tekstet e ballinës, kontaktet dhe informatat që shfaqen në gjithë faqen. Ruajtja e një seksioni e përditëson menjëherë."
        crumbs={[{ label: "Paneli", href: "/admin" }, { label: "Ballina dhe faqja" }]}
      />
      <nav aria-label="Seksionet" className="mb-8 flex flex-wrap gap-2">
        {SITE_KEYS.map((k) => (
          <a key={k} href={`#${k}`} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold hover:bg-blue-soft">
            {SITE_LABELS[k].title}
          </a>
        ))}
      </nav>
      <div className="space-y-12">
        {SITE_KEYS.map((k) => (
          <section key={k} id={k} aria-labelledby={`section-${k}-heading`} className="scroll-mt-6">
            <h2 id={`section-${k}-heading`} className="text-2xl font-bold tracking-[-0.02em]">
              {SITE_LABELS[k].title}
            </h2>
            <p className="mb-4 mt-1 text-muted">{SITE_LABELS[k].help}</p>
            <SiteSectionEditor
              sectionKey={k}
              initialValue={stored[k] ?? structuredClone((k.endsWith("_de") ? siteContentDe : siteContent)[baseKey(k)])}
            />
          </section>
        ))}
      </div>
    </>
  );
}
