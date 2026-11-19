import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MessageItem } from "@/components/admin/MessageItem";
import { requireRole } from "@/lib/admin/auth";
import { getServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mesazhet" };

export default async function MessagesPage({ searchParams }: PageProps<"/admin/mesazhet">) {
  await requireRole("editor");
  const sp = await searchParams;
  const all = sp.te === "gjitha";
  const sb = await getServerClient();
  let q = sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100);
  if (!all) q = q.eq("handled", false);
  const { data } = await q;
  return (
    <>
      <AdminHeader title="Mesazhet" description="Mesazhet nga formulari i kontaktit." crumbs={[{ label: "Paneli", href: "/admin" }, { label: "Mesazhet" }]} />
      <div className="mb-6 flex gap-1.5">
        <Link href="/admin/mesazhet" className={cn("rounded-lg px-3 py-2 text-sm font-semibold", !all ? "bg-ink text-white" : "bg-white")}>
          Pa trajtuar
        </Link>
        <Link href="/admin/mesazhet?te=gjitha" className={cn("rounded-lg px-3 py-2 text-sm font-semibold", all ? "bg-ink text-white" : "bg-white")}>
          Të gjitha
        </Link>
      </div>
      {data?.length ? (
        <ul className="space-y-3">
          {data.map((m) => (
            <MessageItem key={m.id} msg={m} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center">
          <Inbox aria-hidden className="size-8 text-muted" />
          <p className="text-lg font-semibold">{all ? "Ende nuk ka mesazhe." : "Të gjitha mesazhet janë trajtuar."}</p>
        </div>
      )}
    </>
  );
}
