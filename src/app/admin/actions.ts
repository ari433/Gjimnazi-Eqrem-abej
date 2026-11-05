"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { z } from "zod";
import { getServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { authorize } from "@/lib/admin/auth";
import { getResource } from "@/lib/admin/resources";
import { parseResourceForm, publishSchema } from "@/lib/admin/form";
import { roleAtLeast } from "@/lib/admin/roles";
import { SITE_SCHEMAS, type SiteKey } from "@/lib/admin/site-schemas";
import { SITE_URL } from "@/lib/utils";
import type { Role } from "@/lib/types";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

/* ------------------------------------------------------------------ auth */

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Shkruani një email të vlefshëm."),
  password: z.string().min(8, "Fjalëkalimi ka të paktën 8 shenja."),
});

export async function signIn(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase nuk është konfiguruar ende." };
  const parsed = credentials.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message };
  const sb = await getServerClient();
  const { error } = await sb.auth.signInWithPassword(parsed.data);
  if (error) return { status: "error", message: "Emaili ose fjalëkalimi nuk është i saktë." };
  redirect("/admin");
}

export async function signOut() {
  const sb = await getServerClient();
  await sb.auth.signOut();
  redirect("/admin/hyrja");
}

export async function requestPasswordReset(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase nuk është konfiguruar ende." };
  const email = z.string().trim().email().safeParse(fd.get("email"));
  if (!email.success) return { status: "error", message: "Shkruani një email të vlefshëm." };
  const sb = await getServerClient();
  await sb.auth.resetPasswordForEmail(email.data, { redirectTo: `${SITE_URL}/auth/callback?next=/admin/fjalekalimi` });
  // Same answer whether or not the account exists.
  return { status: "success", message: "Nëse ky email ka llogari, do të merrni një lidhje për fjalëkalim të ri." };
}

export async function updatePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const schema = z
    .object({ password: z.string().min(10, "Përdorni të paktën 10 shenja."), confirm: z.string() })
    .refine((v) => v.password === v.confirm, { message: "Fjalëkalimet nuk përputhen.", path: ["confirm"] });
  const parsed = schema.safeParse({ password: fd.get("password"), confirm: fd.get("confirm") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message };
  const sb = await getServerClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) return { status: "error", message: "Lidhja ka skaduar. Kërkoni një lidhje të re." };
  const { error } = await sb.auth.updateUser({ password: parsed.data.password });
  if (error) return { status: "error", message: "Fjalëkalimi nuk u ndryshua. Provoni një fjalëkalim tjetër." };
  return { status: "success", message: "Fjalëkalimi u ndryshua." };
}

/* ------------------------------------------------------------- content */

function dbErrorMessage(error: { code?: string; message?: string }) {
  if (error.code === "23505") return "Kjo adresë (slug) ekziston tashmë. Zgjidhni një tjetër.";
  if (error.code === "42501") return "Nuk keni leje për këtë veprim.";
  if (error.code === "23503") return "Elementi i lidhur nuk ekziston.";
  if (error.code === "23514") return "Disa vlera nuk plotësojnë kushtet e kërkuara.";
  return "Ruajtja dështoi. Provoni përsëri.";
}

export async function saveRecord(resourceKey: string, id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const resource = getResource(resourceKey);
  if (!resource) return { status: "error", message: "Lloj i panjohur përmbajtjeje." };
  const auth = await authorize(resource.minRole);
  if (!auth.ok) return { status: "error", message: auth.error };
  if (id && !z.string().uuid().safeParse(id).success) return { status: "error", message: "ID e pavlefshme." };

  const parsed = parseResourceForm(resource, fd);
  if (!parsed.ok) return { status: "error", message: "Kontrolloni fushat e shënuara.", errors: parsed.errors };
  const row: Record<string, unknown> = { ...parsed.data };

  if (resource.verification) {
    // Contributors can never mark content as verified.
    if (!roleAtLeast(auth.profile.role, "editor")) row.verification = "pending";
  }

  if (resource.publishable) {
    const isEditor = roleAtLeast(auth.profile.role, "editor");
    const pub = publishSchema.safeParse({
      publish_mode: isEditor ? fd.get("publish_mode") : "draft",
      publish_at: fd.get("publish_at") ?? undefined,
    });
    if (!pub.success) return { status: "error", message: pub.error.issues[0].message, errors: { publish_at: pub.error.issues[0].message } };
    const existingPublishedAt = String(fd.get("existing_published_at") ?? "") || null;
    switch (pub.data.publish_mode) {
      case "draft":
        row.status = "draft";
        break;
      case "archive":
        row.status = "archived";
        break;
      case "now":
        row.status = "published";
        // Keep the original date when re-saving something already live.
        row.published_at =
          existingPublishedAt && Date.parse(existingPublishedAt) <= Date.now() ? existingPublishedAt : new Date().toISOString();
        break;
      case "schedule":
        row.status = "published";
        row.published_at = new Date(pub.data.publish_at).toISOString();
        break;
    }
  }

  const sb = await getServerClient();
  const query = id
    ? sb.from(resource.table).update(row).eq("id", id).select("id").maybeSingle()
    : sb.from(resource.table).insert(row).select("id").single();
  const { data, error } = await query;
  if (error) {
    console.error(`[admin:save:${resource.table}]`, error);
    return { status: "error", message: dbErrorMessage(error) };
  }
  if (!data) return { status: "error", message: "Ky element nuk mund të ndryshohet me rolin tuaj." };

  for (const t of resource.tags) updateTag(t);
  if (!id) redirect(`/admin/${resource.key}/${data.id}?ruajtur=1`);
  return { status: "success", message: "Ndryshimet u ruajtën." };
}

export async function deleteRecord(resourceKey: string, id: string): Promise<ActionState> {
  const resource = getResource(resourceKey);
  if (!resource) return { status: "error", message: "Lloj i panjohur përmbajtjeje." };
  const auth = await authorize("editor");
  if (!auth.ok) return { status: "error", message: auth.error };
  if (!z.string().uuid().safeParse(id).success) return { status: "error", message: "ID e pavlefshme." };
  const sb = await getServerClient();
  const { error, count } = await sb.from(resource.table).delete({ count: "exact" }).eq("id", id);
  if (error || !count) return { status: "error", message: error ? dbErrorMessage(error) : "Elementi nuk u gjet." };
  for (const t of resource.tags) updateTag(t);
  redirect(`/admin/${resource.key}?fshire=1`);
}

/* ---------------------------------------------------------- site content */

export async function saveSiteSection(key: SiteKey, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const auth = await authorize("editor");
  if (!auth.ok) return { status: "error", message: auth.error };
  const schema = SITE_SCHEMAS[key];
  if (!schema) return { status: "error", message: "Seksion i panjohur." };
  let payload: unknown;
  try {
    payload = JSON.parse(String(fd.get("payload") ?? ""));
  } catch {
    return { status: "error", message: "Të dhënat e formularit janë të pavlefshme." };
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { status: "error", message: `${i.path.join(" › ") || "Fusha"}: ${i.message}` };
  }
  const sb = await getServerClient();
  const { error } = await sb.from("site_content").upsert({ key, value: parsed.data, updated_by: auth.profile.id });
  if (error) {
    console.error("[admin:site]", error);
    return { status: "error", message: dbErrorMessage(error) };
  }
  updateTag("site");
  return { status: "success", message: "Ruajtur. Ndryshimi shfaqet menjëherë në faqe." };
}

/* --------------------------------------------------------------- users */

const roles = ["admin", "editor", "contributor", "viewer"] as const;

export async function setUserRole(userId: string, role: Role): Promise<ActionState> {
  const auth = await authorize("admin");
  if (!auth.ok) return { status: "error", message: auth.error };
  if (!z.string().uuid().safeParse(userId).success || !roles.includes(role)) return { status: "error", message: "Të dhëna të pavlefshme." };
  if (userId === auth.profile.id) return { status: "error", message: "Nuk mund ta ndryshoni rolin tuaj." };
  const sb = await getServerClient();
  const { error } = await sb.from("profiles").update({ role }).eq("id", userId);
  if (error) return { status: "error", message: dbErrorMessage(error) };
  return { status: "success", message: "Roli u ndryshua." };
}

export async function inviteUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const auth = await authorize("admin");
  if (!auth.ok) return { status: "error", message: auth.error };
  const email = z.string().trim().toLowerCase().email().safeParse(fd.get("email"));
  if (!email.success) return { status: "error", message: "Shkruani një email të vlefshëm." };
  const { inviteByEmail } = await import("@/lib/supabase/admin");
  const res = await inviteByEmail(email.data, `${SITE_URL}/auth/callback?next=/admin/fjalekalimi`);
  return res.ok
    ? { status: "success", message: `Ftesa u dërgua te ${email.data}. Pasi të hyjë, jepini rolin këtu.` }
    : { status: "error", message: res.error };
}

/* ------------------------------------------------------------ messages */

export async function setMessageHandled(id: string, handled: boolean): Promise<ActionState> {
  const auth = await authorize("editor");
  if (!auth.ok) return { status: "error", message: auth.error };
  if (!z.string().uuid().safeParse(id).success) return { status: "error", message: "ID e pavlefshme." };
  const sb = await getServerClient();
  const { error } = await sb.from("contact_messages").update({ handled }).eq("id", id);
  return error ? { status: "error", message: dbErrorMessage(error) } : { status: "success" };
}

export async function deleteMessage(id: string): Promise<ActionState> {
  const auth = await authorize("editor");
  if (!auth.ok) return { status: "error", message: auth.error };
  if (!z.string().uuid().safeParse(id).success) return { status: "error", message: "ID e pavlefshme." };
  const sb = await getServerClient();
  const { error } = await sb.from("contact_messages").delete().eq("id", id);
  return error ? { status: "error", message: dbErrorMessage(error) } : { status: "success" };
}
