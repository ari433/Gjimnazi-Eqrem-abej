"use client";

import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { NewsCard } from "./NewsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { t, type Locale } from "@/lib/i18n";

/** News archive with category filters (client-side, no reload). */
export function NewsBrowser({ items, locale = "sq" }: { items: NewsArticle[]; locale?: Locale }) {
  const L = t(locale).news_;
  const categories = useMemo(() => Array.from(new Set(items.map((n) => n.category))), [items]);
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? items.filter((n) => n.category === cat) : items;
  const [lead, ...rest] = shown;

  if (items.length === 0)
    return (
      <EmptyState icon={Newspaper} title={L.empty}>
        {L.emptyBody}
      </EmptyState>
    );

  return (
    <div>
      {categories.length > 1 && (
        <div role="group" aria-label={L.filter} className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-10 shrink-0 rounded-pill border px-4 text-sm font-semibold transition-colors",
                cat === c ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
              )}
            >
              {c ?? L.all}
            </button>
          ))}
        </div>
      )}
      {lead && <NewsCard item={lead} lead className="lg:max-w-5xl" locale={locale} />}
      {rest.length > 0 && (
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-20 md:gap-y-16 lg:grid-cols-3">
          {rest.map((n) => (
            <NewsCard key={n.id} item={n} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
