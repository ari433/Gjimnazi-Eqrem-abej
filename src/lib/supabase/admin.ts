import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * Service-role client. Server-only, used solely for inviting staff by email.
 * The key is read from SUPABASE_SERVICE_ROLE_KEY (never NEXT_PUBLIC_*), so it
 * cannot reach the browser bundle.
 */
export async function inviteByEmail(email: string, redirectTo: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) {
    return { ok: false, error: "Ftesat kërkojnë SUPABASE_SERVICE_ROLE_KEY në server. Ose krijoni përdoruesin nga paneli i Supabase." };
  }
  const admin = createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (error) return { ok: false, error: "Ftesa nuk u dërgua. Kontrolloni emailin ose provoni më vonë." };
  return { ok: true };
}
