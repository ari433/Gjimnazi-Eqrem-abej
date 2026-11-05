import { z } from "zod";
import type { FieldDef, ResourceDef } from "./resources";

/**
 * Builds a Zod schema from a resource's field config and parses FormData
 * into a typed row. Unknown fields are dropped, so a crafted request cannot
 * write columns the form does not expose (e.g. created_by).
 */
const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

function fieldSchema(f: FieldDef): z.ZodType {
  const req = (s: z.ZodString) => (f.required ? s.min(1, `${f.label} është i detyrueshëm.`) : s);
  switch (f.type) {
    case "boolean":
      return z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
    case "number":
      return z.preprocess(
        (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
        f.required ? z.number({ message: `${f.label} duhet të jetë numër.` }) : z.number().nullable(),
      );
    case "list":
      return z.preprocess(
        (v) =>
          String(v ?? "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        z.array(z.string().max(300)).max(40),
      );
    case "slug":
      return z.string().trim().toLowerCase().regex(slugRe, "Adresa lejon vetëm shkronja pa shenja, numra dhe viza.").max(100);
    case "email":
      return z.preprocess(emptyToNull, z.string().trim().email("Email i pavlefshëm.").nullable());
    case "url":
    case "image":
    case "file":
      return z.preprocess(
        emptyToNull,
        f.required
          ? z.string().trim().refine((s) => /^(https?:\/\/|\/)/.test(s), `${f.label}: lidhje e pavlefshme.`)
          : z
              .string()
              .trim()
              .refine((s) => /^(https?:\/\/|\/)/.test(s), `${f.label}: lidhje e pavlefshme.`)
              .nullable(),
      );
    case "datetime":
    case "date":
      return z.preprocess(
        emptyToNull,
        f.required
          ? z.string().refine((s) => !Number.isNaN(Date.parse(s)), `${f.label}: datë e pavlefshme.`)
          : z.string().refine((s) => !Number.isNaN(Date.parse(s)), `${f.label}: datë e pavlefshme.`).nullable(),
      );
    case "relation":
      return z.preprocess(emptyToNull, f.required ? z.string().uuid(`Zgjidhni ${f.label.toLowerCase()}.`) : z.string().uuid().nullable());
    case "select":
      return z.enum((f.options ?? []).map((o) => o.value) as [string, ...string[]]);
    default: {
      const base = req(z.string().trim().max(f.max ?? 20000, `${f.label} është shumë i gjatë.`));
      return f.required ? base : z.preprocess((v) => (v ?? ""), base);
    }
  }
}

export type ParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; errors: Record<string, string> };

export function parseResourceForm(resource: ResourceDef, fd: FormData): ParseResult {
  const shape: Record<string, z.ZodType> = {};
  const raw: Record<string, unknown> = {};
  for (const f of resource.fields) {
    shape[f.name] = fieldSchema(f);
    raw[f.name] = fd.get(f.name) ?? (f.type === "boolean" ? false : "");
    if (f.fileMeta?.size) {
      shape[f.fileMeta.size] = z.preprocess((v) => (v ? Number(v) : null), z.number().nullable());
      raw[f.fileMeta.size] = fd.get(f.fileMeta.size);
    }
    if (f.fileMeta?.type) {
      shape[f.fileMeta.type] = z.preprocess(emptyToNull, z.string().max(20).nullable());
      raw[f.fileMeta.type] = fd.get(f.fileMeta.type);
    }
  }
  const parsed = z.object(shape).safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0]);
      if (!errors[k]) errors[k] = i.message;
    }
    return { ok: false, errors };
  }
  return { ok: true, data: parsed.data as Record<string, unknown> };
}

/** Publishing controls shared by publishable resources. */
export const publishSchema = z.discriminatedUnion("publish_mode", [
  z.object({ publish_mode: z.literal("draft") }),
  z.object({ publish_mode: z.literal("now") }),
  z.object({
    publish_mode: z.literal("schedule"),
    publish_at: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Zgjidhni datën e publikimit."),
  }),
  z.object({ publish_mode: z.literal("archive") }),
]);
