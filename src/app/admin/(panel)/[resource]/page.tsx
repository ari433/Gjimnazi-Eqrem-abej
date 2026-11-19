import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { AdminHeader, StatusBadge } from "@/components/admin/AdminHeader";
import { requestTime, requireRole } from "@/lib/admin/auth";
import { getResource } from "@/lib/admin/resources";
import { getServerClient } from "@/lib/supabase/server";
import { cn, formatDate } from "@/lib/utils";

const PAGE_SIZE = 25;

// Static title: admin metadata must not block on runtime params.
export const metadata: Metadata = { title: "Përmbajtja" };

/** PostgREST `or` filters are comma/paren-delimited; strip those from input. */
function safeTerm(q: string) {
  return q.replace(/[,()%*\\]/g, " ").trim().slice(0, 80);
}

export default async function ResourceList({ params, searchParams }: PageProps<"/admin/[resource]">) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  await requireRole(resource.minRole);

  const sp = await searchParams;
  const now = await requestTime();
  const q = safeTerm(String(sp.q ?? ""));
  const status = String(sp.statusi ?? "");
  const page = Math.max(1, Number(sp.faqe ?? 1) || 1);

  const sb = await getServerClient();
  let query = sb
    .from(resource.table)
    .select("*", { count: "exact" })
    .order(resource.orderBy.column, { ascending: resource.orderBy.ascending })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (q) query = query.or(resource.searchFields.map((f) => `${f}.ilike.%${q}%`).join(","));
  if (resource.publishable && ["draft", "published", "archived"].includes(status)) query = query.eq("status", status);
  const { data, count, error } = await query;
  const rows = (data ?? []) as Record<string, unknown>[];

  // Resolve relation ids to names for display.
  const relLabels: Record<string, Record<string, string>> = {};
  for (const f of resource.fields.filter((x) => x.type === "relation" && resource.listColumns.some((c) => c.name === x.name))) {
    const ids = Array.from(new Set(rows.map((r) => r[f.name]).filter(Boolean))) as string[];
    if (!ids.length || !f.relation) continue;
    const { data: rel } = await sb.from(f.relation.table).select(`id, ${f.relation.labelField}`).in("id", ids);
    relLabels[f.name] = Object.fromEntries(((rel ?? []) as unknown as Record<string, string>[]).map((x) => [x.id, x[f.relation!.labelField]]));
  }

  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (over: Record<string, string | number | null>) => {
    const u = new URLSearchParams();
    const merged = { q: q || null, statusi: status || null, faqe: page > 1 ? page : null, ...over };
    for (const [k, v] of Object.entries(merged)) if (v !== null && v !== "") u.set(k, String(v));
    const s = u.toString();
    return s ? `?${s}` : "";
  };

  return (
    <>
      {sp.fshire && (
        <p role="status" className="mb-6 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          Elementi u fshi.
        </p>
      )}
      <AdminHeader
        title={resource.label}
        description={resource.description}
        crumbs={[{ label: "Paneli", href: "/admin" }, { label: resource.label }]}
        actions={
          <Link href={`/admin/${resource.key}/new`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 font-semibold text-white hover:bg-blue">
            <Plus aria-hidden className="size-4" /> Shto {resource.singular.toLowerCase()}
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form role="search" className="relative w-full max-w-sm">
          <label htmlFor="q" className="sr-only">
            Kërko
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input id="q" name="q" defaultValue={q} placeholder="Kërko…" className="min-h-11 w-full rounded-xl border border-line bg-white pl-10 pr-4 outline-none focus:border-ink" />
          {status && <input type="hidden" name="statusi" value={status} />}
        </form>
        {resource.publishable && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtro sipas statusit">
            {[
              { v: "", l: "Të gjitha" },
              { v: "published", l: "Publikuar" },
              { v: "draft", l: "Draft" },
              { v: "archived", l: "Arkivuar" },
            ].map((o) => (
              <Link
                key={o.v}
                href={`/admin/${resource.key}${qs({ statusi: o.v || null, faqe: null })}`}
                aria-current={status === o.v ? "true" : undefined}
                className={cn("rounded-lg px-3 py-2 text-sm font-semibold", status === o.v ? "bg-ink text-white" : "bg-white hover:bg-blue-soft")}
              >
                {o.l}
              </Link>
            ))}
          </div>
        )}
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-danger">
          Të dhënat nuk u ngarkuan. Kontrolloni lidhjen me databazën.
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center">
          <p className="text-lg font-semibold">{q || status ? "Asnjë rezultat për këtë kërkim." : `Ende nuk ka ${resource.label.toLowerCase()}.`}</p>
          {!q && !status && (
            <Link href={`/admin/${resource.key}/new`} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 font-semibold text-white hover:bg-blue">
              <Plus aria-hidden className="size-4" /> Shto të parin
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line text-xs text-muted">
              <tr>
                {resource.listColumns.map((c) => (
                  <th key={c.name} scope="col" className="px-5 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={String(r.id)} className="group hover:bg-paper">
                  {resource.listColumns.map((c, ci) => {
                    const v = r[c.name];
                    let content: React.ReactNode = v === null || v === undefined || v === "" ? <span className="text-muted">–</span> : String(v);
                    if (c.kind === "date") content = v ? formatDate(String(v)) : <span className="text-muted">–</span>;
                    if (c.kind === "badge") content = <StatusBadge value={String(v)} publishedAt={r.published_at as string | null} now={now} />;
                    if (c.kind === "bool") content = v ? "Po" : "Jo";
                    if (relLabels[c.name]) content = relLabels[c.name][String(v)] ?? content;
                    return (
                      <td key={c.name} className="px-5 py-3.5">
                        {ci === 0 ? (
                          <Link href={`/admin/${resource.key}/${r.id}`} className="font-semibold text-ink group-hover:text-blue-deep">
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Faqet" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">
            Faqja {page} nga {pages} ({total} gjithsej)
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/${resource.key}${qs({ faqe: page - 1 })}`} className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-white px-3 font-semibold">
                <ChevronLeft aria-hidden className="size-4" /> Para
              </Link>
            )}
            {page < pages && (
              <Link href={`/admin/${resource.key}${qs({ faqe: page + 1 })}`} className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-white px-3 font-semibold">
                Pas <ChevronRight aria-hidden className="size-4" />
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
