import { Suspense } from "react";
import { connection } from "next/server";
import { AdminSidebar, type NavItem } from "@/components/admin/AdminSidebar";
import { requireRole } from "@/lib/admin/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { roleAtLeast } from "@/lib/admin/roles";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function PanelSkeleton() {
  return (
    <div className="lg:flex" aria-busy="true">
      <div className="hidden h-svh w-64 bg-ink lg:block" />
      <div className="flex-1 p-10">
        <span className="sr-only">Duke ngarkuar…</span>
        <div className="skeleton h-10 w-72" />
        <div className="skeleton mt-4 h-5 w-96 max-w-full" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-[-0.03em]">Paneli ende nuk është lidhur me databazën</h1>
      <p className="mt-4 text-lg text-muted">
        Faqja publike funksionon me përmbajtjen lokale. Për të aktivizuar panelin, krijoni një projekt në Supabase, ekzekutoni migrimin
        dhe shtoni çelësat në <code>.env.local</code>. Hapat e plotë janë në README.
      </p>
      <ol className="mt-8 list-decimal space-y-2 pl-5 text-ink/80">
        <li>Ekzekutoni <code>supabase/migrations</code> dhe <code>supabase/seed.sql</code>.</li>
        <li>
          Vendosni <code>NEXT_PUBLIC_SUPABASE_URL</code> dhe <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>.
        </li>
        <li>Krijoni përdoruesin e parë dhe jepini rolin admin me SQL.</li>
      </ol>
    </main>
  );
}

async function Frame({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const profile = await requireRole("contributor");
  const items: NavItem[] = RESOURCES.filter((r) => roleAtLeast(profile.role, r.minRole)).map((r) => ({
    href: `/admin/${r.key}`,
    label: r.label,
    group: r.group,
  }));
  const isEditor = roleAtLeast(profile.role, "editor");
  return (
    <div className="lg:flex">
      <AdminSidebar profile={profile} items={items} canSite={isEditor} canMessages={isEditor} canUsers={profile.role === "admin"} />
      <main id="permbajtja" className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-10">
        {children}
      </main>
    </div>
  );
}

/** Marks the panel as intentionally request-time (its metadata depends on params). */
async function RequestTime() {
  await connection();
  return null;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<PanelSkeleton />}>
        <Frame>{children}</Frame>
      </Suspense>
      <Suspense>
        <RequestTime />
      </Suspense>
    </>
  );
}
