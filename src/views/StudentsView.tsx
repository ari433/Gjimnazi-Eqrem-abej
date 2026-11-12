import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PendingBadge } from "@/components/ui/Pending";
import { getSiteContent } from "@/lib/content/queries";
import { lp, t, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export async function StudentsView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const info = (await getSiteContent(locale)).student_info;
  const quick: [string, string][] = [
    ["/njoftimet", T.pages.announcements[0]],
    ["/kalendari", T.pages.calendar[0]],
    ["/dokumentet", T.pages.documents[0]],
    ["/kontakti", T.students_.ask],
  ];
  return (
    <>
      <PageHero locale={locale} title={T.pages.students[0]} crumbs={[{ label: T.pages.students[0] }]} lede={info.heading} />
      <section className="bg-paper pb-16">
        <div className="shell">
          <RevealGroup className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {info.items.map((it) => (
              <RevealItem key={it.title}>
                <article className={cn("flex h-full flex-col rounded-card p-6 md:p-8", it.verification === "pending" ? "hatch border border-dashed border-pending/35 bg-white/60" : "bg-white")}>
                  {it.verification === "pending" && <PendingBadge className="mb-3 self-start" locale={locale} />}
                  <h2 className="text-2xl font-bold tracking-[-0.03em]">{it.title}</h2>
                  <p className="mt-1.5 text-muted">{it.body}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <section aria-label={T.students_.quick} className="bg-white py-16 md:py-20">
        <div className="shell grid gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          {quick.map(([href, label]) => (
            <Link key={href} href={lp(locale, href)} className="group flex min-h-16 items-center justify-between rounded-card border border-line p-5 text-xl font-semibold tracking-[-0.02em] transition-colors hover:border-ink hover:bg-ink hover:text-white md:p-6">
              {label}
              <ArrowUpRight aria-hidden className="size-5 transition-transform group-hover:rotate-45" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
