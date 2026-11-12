"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Inbox, LayoutDashboard, LogOut, Menu, PanelsTopLeft, Shield, X } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { cn, asset } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/admin/roles";
import type { Profile } from "@/lib/types";

export type NavItem = { href: string; label: string; group: string };

export function AdminSidebar({ profile, items, canSite, canMessages, canUsers }: { profile: Profile; items: NavItem[]; canSite: boolean; canMessages: boolean; canUsers: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const groups = Array.from(new Set(items.map((i) => i.group)));
  const link = (href: string, label: string, Icon?: React.ComponentType<{ className?: string }>) => {
    const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-[0.93rem] transition-colors",
          active ? "bg-white/12 font-semibold text-white" : "text-white/70 hover:bg-white/6 hover:text-white",
        )}
      >
        {Icon && <Icon aria-hidden className="size-4" />}
        {label}
      </Link>
    );
  };

  const nav = (
    <nav aria-label="Paneli" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      <div className="space-y-0.5">
        {link("/admin", "Përmbledhja", LayoutDashboard)}
        {canSite && link("/admin/faqja", "Ballina dhe faqja", PanelsTopLeft)}
        {canMessages && link("/admin/mesazhet", "Mesazhet", Inbox)}
        {canUsers && link("/admin/perdoruesit", "Përdoruesit", Shield)}
      </div>
      {groups.map((g) => (
        <div key={g}>
          <p className="px-3 pb-1.5 text-xs font-semibold text-white/40">{g}</p>
          <div className="space-y-0.5">{items.filter((i) => i.group === g).map((i) => link(i.href, i.label))}</div>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 p-4">
      <p className="truncate text-sm font-semibold text-white">{profile.full_name || profile.email}</p>
      <p className="text-xs text-white/50">{ROLE_LABEL[profile.role]}</p>
      <div className="mt-3 flex gap-2">
        <Link href="/" target="_blank" className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/8 text-xs font-semibold text-white hover:bg-white/15">
          <ExternalLink aria-hidden className="size-3.5" /> Faqja
        </Link>
        <form action={signOut} className="flex-1">
          <button type="submit" className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-white/8 text-xs font-semibold text-white hover:bg-white/15">
            <LogOut aria-hidden className="size-3.5" /> Dil
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
      <Image src={asset("/logo.png")} alt="" width={32} height={32} className="rounded-full" />
      <span className="text-sm font-bold leading-tight text-white">
        Paneli
        <span className="block font-normal text-white/50">Gjimnazi &ldquo;Eqrem Çabej&rdquo;</span>
      </span>
    </Link>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col bg-ink lg:flex">
        {brand}
        {nav}
        {footer}
      </aside>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <span className="text-sm font-bold text-white">Paneli</span>
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white">
          <Menu aria-hidden className="size-4" /> Menyja
        </button>
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menyja e panelit" className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden">
          <div className="flex items-center justify-between pr-4">
            {brand}
            <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white" autoFocus>
              <X aria-hidden className="size-4" /> Mbyll
            </button>
          </div>
          {nav}
          {footer}
        </div>
      )}
    </>
  );
}
