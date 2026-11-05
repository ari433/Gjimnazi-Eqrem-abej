"use server";

import { getPublicClient } from "@/lib/supabase/public";
import { contactSchema, type ContactState } from "@/lib/validation";

/**
 * Contact form handler. Validated on the server with Zod, inserted through
 * the anon role (RLS allows insert only), with a honeypot and a minimum
 * fill time to keep simple bots out.
 */
export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Bots fill every field and submit instantly. Pretend success, store nothing.
  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("started_at") ?? 0);
  if (honeypot || (startedAt && Date.now() - startedAt < 2500)) {
    return { status: "success", message: "Faleminderit. Mesazhi u dërgua." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof typeof raw;
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { status: "error", message: "Kontrolloni fushat e shënuara.", fieldErrors, values: raw };
  }

  const sb = getPublicClient();
  if (!sb) {
    return {
      status: "error",
      message: "Formulari ende nuk është aktivizuar. Na shkruani përmes Instagramit të shkollës.",
      values: raw,
    };
  }

  const { error } = await sb.from("contact_messages").insert(parsed.data);
  if (error) {
    console.error("[contact]", error);
    return { status: "error", message: "Mesazhi nuk u dërgua. Provoni përsëri pas pak.", values: raw };
  }
  return { status: "success", message: "Faleminderit. Mesazhi u dërgua te administrata e shkollës." };
}
