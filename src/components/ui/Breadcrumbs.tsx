import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn, SITE_URL } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = "paper" }: { items: Crumb[]; tone?: "paper" | "ink" }) {
  const all: Crumb[] = [{ label: "Ballina", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Navigimi i faqes">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", tone === "ink" ? "text-white/60" : "text-muted")}>
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className="size-3.5 opacity-60" />}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="link-underline hover:text-current">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined} className={tone === "ink" ? "text-white" : "text-ink"}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
