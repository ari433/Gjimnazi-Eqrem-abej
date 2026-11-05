import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { InviteForm, UserRoleSelect } from "@/components/admin/UserRoleSelect";
import { requireRole } from "@/lib/admin/auth";
import { ROLE_HELP, ROLE_LABEL } from "@/lib/admin/roles";
import { getServerClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

export const metadata: Metadata = { title: "Përdoruesit" };

export default async function UsersPage() {
  const me = await requireRole("admin");
  const sb = await getServerClient();
  const { data } = await sb.from("profiles").select("id, full_name, email, role").order("created_at");
  const users = (data ?? []) as Profile[];
  return (
    <>
      <AdminHeader
        title="Përdoruesit dhe rolet"
        description="Kush ka qasje në panel dhe çfarë mund të bëjë. Lejet zbatohen edhe në databazë, jo vetëm këtu."
        crumbs={[{ label: "Paneli", href: "/admin" }, { label: "Përdoruesit" }]}
      />
      <section className="mb-8 rounded-2xl bg-white p-6">
        <h2 className="font-semibold">Fto një anëtar të stafit</h2>
        <p className="mb-4 mt-1 text-sm text-muted">Ftesa dërgon një email për të vendosur fjalëkalimin. Llogaria e re nis pa qasje derisa t&apos;i jepni rol këtu.</p>
        <InviteForm />
      </section>
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">
                Përdoruesi
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Roli
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3.5">
                  <p className="font-semibold">{u.full_name || u.email}</p>
                  {u.full_name && <p className="text-muted">{u.email}</p>}
                </td>
                <td className="px-5 py-3.5">
                  <UserRoleSelect userId={u.id} role={u.role} disabled={u.id === me.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="mt-8 grid gap-3 md:grid-cols-2">
        {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
          <div key={r} className="rounded-2xl bg-white p-5">
            <dt className="font-semibold">{ROLE_LABEL[r]}</dt>
            <dd className="mt-1 text-sm text-muted">{ROLE_HELP[r]}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
