"use client";

import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { NewsCard } from "./NewsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

/** News archive with category filters (client-side, no reload). */
export function NewsBrowser({ items }: { items: NewsArticle[] }) {
  const categories = useMemo(() => Array.from(new Set(items.map((n) => n.category))), [items]);
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? items.filter((n) => n.category === cat) : items;
  const [lead, ...rest] = shown;

  if (items.length === 0)
    return (
      <EmptyState icon={Newspaper} title="Ende nuk ka lajme të publikuara">
        Lajmet e shkollës do të shfaqen këtu sapo të publikohen nga stafi.
      </EmptyState>
    );

  return (
    <div>
      {categories.length > 1 && (
        <div role="group" aria-label="Filtro sipas kategorisë" className="mb-12 flex flex-wrap gap-2">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-10 rounded-pill border px-4 text-sm font-semibold transition-colors",
                cat === c ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
              )}
            >
              {c ?? "Të gjitha"}
            </button>
          ))}
        </div>
      )}
      {lead && <NewsCard item={lead} lead className="lg:max-w-5xl" />}
      {rest.length > 0 && (
        <div className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      )}
    </div>
  );
}
