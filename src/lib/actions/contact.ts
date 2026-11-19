"use server";

import { getPublicClient } from "@/lib/supabase/public";
import { contactMessages, contactSchema, type ContactState } from "@/lib/validation";

/**
 * Contact form handler (both languages). Validated on the server with Zod,
 * inserted through the anon role (RLS allows insert only), with a honeypot
 * and a minimum fill time to keep simple bots out.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const locale = formData.get("locale") === "de" ? "de" : "sq";
  const msg = contactMessages(locale);
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Bots fill every field and submit instantly. Pretend success, store nothing.
  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("started_at") ?? 0);
  if (honeypot || (startedAt && Date.now() - startedAt < 2500)) return { status: "success", message: msg.sent };

  const parsed = contactSchema(locale).safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof typeof raw;
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { status: "error", message: msg.check, fieldErrors, values: raw };
  }

  const sb = getPublicClient();
  if (!sb) return { status: "error", message: msg.inactive, values: raw };

  const { error } = await sb.from("contact_messages").insert(parsed.data);
  if (error) {
    console.error("[contact]", error);
    return { status: "error", message: msg.failed, values: raw };
  }
  return { status: "success", message: msg.sent };
}
