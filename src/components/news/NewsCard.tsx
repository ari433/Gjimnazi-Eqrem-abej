import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { MediaFrame } from "@/components/ui/Media";
import { ExampleBadge } from "@/components/ui/Pending";
import { lp, type Locale } from "@/lib/i18n";
import { cn, formatDate } from "@/lib/utils";

/** Editorial news card. `lead` is the large variant used for the top story. */
export function NewsCard({ item, lead = false, className, locale = "sq" }: { item: NewsArticle; lead?: boolean; className?: string; locale?: Locale }) {
  return (
    <article className={cn("group relative", className)}>
      <MediaFrame
        src={item.cover_url}
        alt={item.cover_alt}
        tone={lead ? "ink" : "paper"}
        className={cn("rounded-card", lead ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[16/10]")}
        sizes={lead ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
      />
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
        <span className="font-semibold text-blue-deep">{item.category}</span>
        {item.show_date !== false && <time dateTime={item.published_at ?? undefined}>{formatDate(item.published_at, { locale })}</time>}
        {item.is_example && <ExampleBadge className="text-muted" locale={locale} />}
      </div>
      <h3
        lang={item.untranslated && locale === "de" ? "sq" : undefined}
        className={cn("mt-1.5 font-bold tracking-[-0.03em] text-ink", lead ? "text-[clamp(1.6rem,3.2vw,3rem)] leading-[1.04]" : "text-[1.35rem] leading-[1.15]")}
      >
        <Link href={lp(locale, `/lajme/${item.slug}`)} className="after:absolute after:inset-0 after:content-['']">
          <span className="link-underline">{item.title}</span>
        </Link>
      </h3>
      {item.excerpt && <p className={cn("mt-2 text-muted", lead ? "max-w-2xl text-lg" : "line-clamp-2")}>{item.excerpt}</p>}
    </article>
  );
}
