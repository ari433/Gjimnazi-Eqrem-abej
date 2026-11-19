import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { roleAtLeast } from "./roles";
import type { Profile, Role } from "@/lib/types";

/**
 * Data Access Layer for the admin panel. Every admin page and server action
 * calls these helpers; the proxy is only an optimistic first check.
 * The database enforces the same rules again through RLS.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  const sb = await getServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("profiles").select("id, full_name, email, role").eq("id", user.id).maybeSingle();
  if (!data) return { id: user.id, full_name: null, email: user.email ?? null, role: "viewer" };
  return data as Profile;
});

/** For pages: redirect when signed out or under-privileged. */
export async function requireRole(min: Role = "contributor"): Promise<Profile> {
  // Admin pages always render per request (session, clock, fresh data).
  await connection();
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/hyrja");
  if (!roleAtLeast(profile.role, min)) redirect(profile.role === "viewer" ? "/admin/hyrja?gabim=pa-qasje" : "/admin?gabim=leje");
  return profile;
}

/** Current time for a request-time render (after `connection()`). */
export async function requestTime(): Promise<number> {
  await connection();
  return Date.now();
}

/** For server actions: return the profile or a reason, never redirect mid-mutation. */
export async function authorize(min: Role): Promise<{ ok: true; profile: Profile } | { ok: false; error: string }> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, error: "Sesioni ka skaduar. Hyni përsëri." };
  if (!roleAtLeast(profile.role, min)) return { ok: false, error: "Nuk keni leje për këtë veprim." };
  return { ok: true, profile };
}
