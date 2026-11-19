"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/** Browser client, used only for direct-to-storage uploads by signed-in staff. */
export function getBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
