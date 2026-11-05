import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { MediaFrame } from "@/components/ui/Media";
import { ExampleBadge } from "@/components/ui/Pending";
import { cn, formatDate } from "@/lib/utils";

/** Editorial news card. `lead` is the large variant used for the top story. */
export function NewsCard({ item, lead = false, className }: { item: NewsArticle; lead?: boolean; className?: string }) {
  return (
    <article className={cn("group relative", className)}>
      <MediaFrame
        src={item.cover_url}
        alt={item.cover_alt}
        label={item.title}
        tone={lead ? "ink" : "paper"}
        className={cn("rounded-card", lead ? "aspect-[16/10]" : "aspect-[4/3]")}
        sizes={lead ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
      />
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
        <span className="font-semibold text-ink">{item.category}</span>
        <time dateTime={item.published_at ?? undefined}>{formatDate(item.published_at)}</time>
        {item.is_example && <ExampleBadge className="text-muted" />}
      </div>
      <h3
        className={cn(
          "mt-2 font-bold tracking-[-0.03em] text-ink",
          lead ? "text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.02]" : "text-[1.45rem] leading-[1.12]",
        )}
      >
        <Link href={`/lajme/${item.slug}`} className="after:absolute after:inset-0 after:content-['']">
          <span className="link-underline">{item.title}</span>
        </Link>
      </h3>
      {item.excerpt && (
        <p className={cn("mt-3 text-muted", lead ? "max-w-2xl text-lg" : "line-clamp-3")}>{item.excerpt}</p>
      )}
    </article>
  );
}
