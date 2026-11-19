import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ResourceDef } from "./resources";

/** Loads <select> options for every relation field of a resource. */
export async function loadRelationOptions(sb: SupabaseClient, resource: ResourceDef) {
  const out: Record<string, { value: string; label: string }[]> = {};
  for (const f of resource.fields) {
    if (f.type !== "relation" || !f.relation) continue;
    const { data } = await sb.from(f.relation.table).select(`id, ${f.relation.labelField}`).order(f.relation.labelField).limit(500);
    out[f.name] = ((data ?? []) as unknown as Record<string, string>[]).map((r) => ({ value: r.id, label: r[f.relation!.labelField] }));
  }
  return out;
}
