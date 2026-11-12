import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ChevronRight, FilePen, Inbox, Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requestTime, requireRole } from "@/lib/admin/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { roleAtLeast } from "@/lib/admin/roles";
import { getServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Përmbledhja" };

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const profile = await requireRole("contributor");
  const sp = await searchParams;
  const sb = await getServerClient();
  const isEditor = roleAtLeast(profile.role, "editor");
  const visible = RESOURCES.filter((r) => roleAtLeast(profile.role, r.minRole));
  const nowIso = new Date(await requestTime()).toISOString();

  const [counts, drafts, scheduled, unread] = await Promise.all([
    Promise.all(
      visible.map(async (r) => {
        const { count } = await sb.from(r.table).select("id", { count: "exact", head: true });
        return { r, count: count ?? 0 };
      }),
    ),
    sb.from("news").select("id, title, updated_at, status").eq("status", "draft").order("updated_at", { ascending: false }).limit(6),
    sb.from("news").select("id, title, published_at, status").eq("status", "published").gt("published_at", nowIso).order("published_at").limit(6),
    isEditor ? sb.from("contact_messages").select("id", { count: "exact", head: true }).eq("handled", false) : Promise.resolve({ count: 0 }),
  ]);

  const firstName = (profile.full_name ?? profile.email ?? "").split(/[ @]/)[0];

  return (
    <>
      {sp.gabim === "leje" && (
        <p role="alert" className="mb-6 rounded-xl bg-pending-bg px-4 py-3 text-sm font-medium text-pending">
          Ajo faqe kërkon një rol më të lartë se i juaji.
        </p>
      )}
      <AdminHeader
        title={firstName ? `Mirë se erdhe, ${firstName}` : "Përmbledhja"}
        description="Çfarë është në draft, çfarë del së shpejti dhe çfarë pret përgjigje."
        actions={
          <Link href="/admin/lajme/new" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 font-semibold text-white hover:bg-blue">
            <Plus aria-hidden className="size-4" /> Lajm i ri
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-2xl bg-white p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <FilePen aria-hidden className="size-4 text-blue" /> Drafte
          </h2>
          {drafts.data?.length ? (
            <ul className="mt-3 divide-y divide-line">
              {drafts.data.map((d) => (
                <li key={d.id}>
                  <Link href={`/admin/lajme/${d.id}`} className="block py-2.5 hover:text-blue-deep">
                    <span className="block truncate font-medium">{d.title}</span>
                    <span className="text-xs text-muted">Ndryshuar më {formatDate(d.updated_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Asnjë lajm në draft.</p>
          )}
        </section>
        <section className="rounded-2xl bg-white p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <CalendarClock aria-hidden className="size-4 text-blue" /> Të planifikuara
          </h2>
          {scheduled.data?.length ? (
            <ul className="mt-3 divide-y divide-line">
              {scheduled.data.map((d) => (
                <li key={d.id}>
                  <Link href={`/admin/lajme/${d.id}`} className="block py-2.5 hover:text-blue-deep">
                    <span className="block truncate font-medium">{d.title}</span>
                    <span className="text-xs text-muted">Publikohet më {formatDate(d.published_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Asgjë e planifikuar.</p>
          )}
        </section>
        {isEditor && (
          <Link href="/admin/mesazhet" className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-white hover:bg-ink-2">
            <h2 className="flex items-center gap-2 font-semibold">
              <Inbox aria-hidden className="size-4" /> Mesazhe pa përgjigje
            </h2>
            <p className="mt-6 text-6xl font-bold tracking-[-0.05em]">{unread.count ?? 0}</p>
          </Link>
        )}
      </div>

      <h2 className="mb-4 mt-12 text-xl font-bold tracking-[-0.02em]">Përmbajtja</h2>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {counts.map(({ r, count }) => (
          <li key={r.key}>
            <Link href={`/admin/${r.key}`} className="flex h-full items-center justify-between rounded-2xl bg-white p-5 transition-colors hover:bg-blue-soft">
              <span>
                <span className="block font-semibold">{r.label}</span>
                <span className="text-sm text-muted">{count === 1 ? "1 element" : `${count} elemente`}</span>
              </span>
              <ChevronRight aria-hidden className="size-4 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
