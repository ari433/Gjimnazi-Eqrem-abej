import { z } from "zod";

/** Validation for the editable homepage / site-wide blocks (site_content). */
const href = z.string().trim().regex(/^(\/|https?:\/\/|mailto:|tel:|#)/, "Lidhja duhet të fillojë me / ose https://");
const verification = z.enum(["verified", "pending"]);

export const SITE_SCHEMAS = {
  hero: z.object({
    title: z.string().trim().min(3).max(80),
    lede: z.string().trim().max(400),
    image_url: z.string().trim().url().nullable().or(z.literal("").transform(() => null)),
    image_alt: z.string().trim().max(200).nullable(),
    primary_cta: z.object({ label: z.string().trim().min(2).max(40), href }),
    secondary_cta: z.object({ label: z.string().trim().min(2).max(40), href }),
  }),
  intro: z.object({
    heading: z.string().trim().min(3).max(120),
    body: z.string().trim().max(1500),
    vision: z.string().trim().max(400),
    mission: z.string().trim().max(400),
    source: z.string().trim().max(200).nullable(),
  }),
  history: z
    .array(z.object({ period: z.string().trim().min(1).max(40), title: z.string().trim().min(1).max(120), text: z.string().trim().max(600) }))
    .max(30),
  enrollment: z.object({
    heading: z.string().trim().min(3).max(120),
    body: z.string().trim().max(800),
    cta_label: z.string().trim().min(2).max(40),
    cta_href: href,
    verification,
  }),
  contact: z.object({
    address: z.string().trim().min(3).max(200),
    city: z.string().trim().max(100),
    phone: z.string().trim().max(40).nullable(),
    email: z.string().trim().email().nullable().or(z.literal("").transform(() => null)),
    hours: z.string().trim().max(120).nullable(),
    map_query: z.string().trim().max(200),
  }),
  socials: z.array(z.object({ label: z.string().trim().min(2).max(40), href: z.string().trim().url(), verified: z.boolean() })).max(10),
  student_info: z.object({
    heading: z.string().trim().max(160),
    items: z.array(z.object({ title: z.string().trim().min(2).max(120), body: z.string().trim().max(600), verification })).max(30),
  }),
} as const;

export type SiteKey = keyof typeof SITE_SCHEMAS;
export const SITE_KEYS = Object.keys(SITE_SCHEMAS) as SiteKey[];

export const SITE_LABELS: Record<SiteKey, { title: string; help: string }> = {
  hero: { title: "Hapja e ballinës", help: "Titulli i madh, teksti hyrës, butonat dhe fotoja brenda shkronjës Ç." },
  intro: { title: "Prezantimi", help: "Teksti hyrës, vizioni dhe misioni." },
  history: { title: "Historia", help: "Etapat e kronologjisë në faqen e historisë." },
  enrollment: { title: "Regjistrimi", help: "Seksioni i regjistrimit në fund të ballinës." },
  contact: { title: "Kontakti", help: "Adresa, telefoni, emaili dhe orari. Lini bosh atë që nuk është konfirmuar." },
  socials: { title: "Rrjetet sociale", help: "Shfaqen vetëm llogaritë e shënuara si të verifikuara." },
  student_info: { title: "Për nxënësit", help: "Kartat në faqen \"Për nxënësit\"." },
};
