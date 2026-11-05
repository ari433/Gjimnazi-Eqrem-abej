import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requestTime, requireRole } from "@/lib/admin/auth";
import { loadRelationOptions } from "@/lib/admin/relations";
import { getResource } from "@/lib/admin/resources";
import { getServerClient } from "@/lib/supabase/server";

// Static title: admin metadata must not block on runtime params.
export const metadata: Metadata = { title: "Element i ri" };

export default async function NewRecord({ params }: PageProps<"/admin/[resource]/new">) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();
  const profile = await requireRole(resource.minRole);
  const now = await requestTime();
  const sb = await getServerClient();
  const relationOptions = await loadRelationOptions(sb, resource);
  return (
    <>
      <AdminHeader
        title={`Shto ${resource.singular.toLowerCase()}`}
        crumbs={[{ label: "Paneli", href: "/admin" }, { label: resource.label, href: `/admin/${resource.key}` }, { label: "I ri" }]}
      />
      <ResourceForm resource={resource} row={null} relationOptions={relationOptions} role={profile.role} now={now} />
    </>
  );
}
