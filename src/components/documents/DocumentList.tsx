"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import type { SchoolDocument } from "@/lib/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatBytes, formatDate } from "@/lib/utils";

/** Searchable, category-grouped document list. */
export function DocumentList({ docs }: { docs: SchoolDocument[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? docs.filter((d) => `${d.title} ${d.description ?? ""} ${d.category}`.toLowerCase().includes(n)) : docs;
  }, [docs, q]);
  const cats = Array.from(new Set(filtered.map((d) => d.category)));

  if (docs.length === 0)
    return (
      <EmptyState icon={FileText} title="Ende nuk ka dokumente të publikuara">
        Rregulloret, formularët dhe planet e shkollës publikohen këtu nga administrata.
      </EmptyState>
    );

  return (
    <div>
      <label className="relative block max-w-xl">
        <span className="sr-only">Kërko dokumente</span>
        <Search aria-hidden className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kërko sipas titullit ose kategorisë"
          className="min-h-14 w-full rounded-pill border border-line bg-white pl-13 pr-6 text-base outline-none transition-colors focus:border-ink"
        />
      </label>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {filtered.length === 1 ? "1 dokument" : `${filtered.length} dokumente`}
      </p>

      {cats.map((c) => (
        <section key={c} className="mt-12" aria-labelledby={`cat-${c}`}>
          <h2 id={`cat-${c}`} className="text-xl font-semibold text-muted">
            {c}
          </h2>
          <ul className="mt-4">
            {filtered
              .filter((d) => d.category === c)
              .map((d) => (
                <li key={d.id}>
                  <a
                    href={d.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-line py-6 transition-colors hover:bg-white md:px-4"
                  >
                    <span className="grid size-12 place-items-center rounded-xl bg-blue-soft text-xs font-bold text-blue">{d.file_type ?? "DOC"}</span>
                    <span>
                      <span className="block text-lg font-semibold tracking-[-0.01em]">{d.title}</span>
                      {d.description && <span className="block text-muted">{d.description}</span>}
                      <span className="mt-1 block text-sm text-muted">
                        {[formatDate(d.published_at), formatBytes(d.file_size)].filter(Boolean).join(", ")}
                      </span>
                    </span>
                    <span className="grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                      <Download aria-hidden className="size-4" />
                      <span className="sr-only">Shkarko</span>
                    </span>
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
