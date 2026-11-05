import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { lp, t, type Locale } from "@/lib/i18n";
import { cn, SITE_URL } from "@/lib/utils";

/** Crumb hrefs are locale-neutral ("/lajme"); they are prefixed here. */
export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = "paper", locale = "sq" }: { items: Crumb[]; tone?: "paper" | "ink"; locale?: Locale }) {
  const all: Crumb[] = [{ label: t(locale).home, href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${lp(locale, c.href)}` } : {}),
    })),
  };
  return (
    <nav aria-label={t(locale).breadcrumbs}>
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", tone === "ink" ? "text-white/60" : "text-muted")}>
        {all.map((c, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className="size-3.5 shrink-0 opacity-60" />}
            {c.href && i < all.length - 1 ? (
              <Link href={lp(locale, c.href)} className="link-underline shrink-0 hover:text-current">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined} className={cn("truncate", tone === "ink" ? "text-white" : "text-ink")}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </nav>
  );
}
