import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requestTime, requireRole } from "@/lib/admin/auth";
import { loadRelationOptions } from "@/lib/admin/relations";
import { getResource } from "@/lib/admin/resources";
import { getServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

// Static title: admin metadata must not block on runtime params.
export const metadata: Metadata = { title: "Ndrysho" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditRecord({ params, searchParams }: PageProps<"/admin/[resource]/[id]">) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource || !UUID.test(id)) notFound();
  const profile = await requireRole(resource.minRole);
  const sp = await searchParams;
  const now = await requestTime();
  const sb = await getServerClient();
  const [{ data: row }, relationOptions] = await Promise.all([
    sb.from(resource.table).select("*").eq("id", id).maybeSingle(),
    loadRelationOptions(sb, resource),
  ]);
  if (!row) notFound();
  const title = String(row[resource.titleField] ?? resource.singular);
  return (
    <>
      <AdminHeader
        title={title}
        description={row.updated_at ? `Ndryshuar së fundi më ${formatDate(row.updated_at)}` : undefined}
        crumbs={[{ label: "Paneli", href: "/admin" }, { label: resource.label, href: `/admin/${resource.key}` }, { label: "Ndrysho" }]}
      />
      <ResourceForm resource={resource} row={row} relationOptions={relationOptions} role={profile.role} justSaved={sp.ruajtur === "1"} now={now} />
    </>
  );
}
