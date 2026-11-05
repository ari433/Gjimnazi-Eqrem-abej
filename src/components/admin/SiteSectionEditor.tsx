"use client";

import { submitWithoutReset } from "@/lib/use-form-submit";
import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, CircleAlert, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { saveSiteSection, type ActionState } from "@/app/admin/actions";
import { baseKey, type BaseSiteKey, type SiteKey } from "@/lib/admin/site-schemas";
import { FieldShell, ImageInput, inputCls } from "./fields";
import { cn } from "@/lib/utils";

type Kind = "text" | "textarea" | "image" | "verification" | "bool";
type Leaf = { path: string; label: string; kind: Kind; nullable?: boolean; help?: string; wide?: boolean };
type Repeater = { path: string; label: string; kind: "repeater"; item: { name: string; label: string; kind: Kind; wide?: boolean }[]; blank: Record<string, unknown> };
type Desc = Leaf | Repeater;

const D: Record<BaseSiteKey, Desc[]> = {
  hero: [
    { path: "title", label: "Titulli i madh", kind: "text", wide: true, help: "Mbajeni të shkurtër: 2 deri në 5 fjalë." },
    { path: "lede", label: "Teksti hyrës", kind: "textarea", wide: true },
    { path: "image_url", label: "Foto brenda shkronjës Ç", kind: "image", nullable: true, help: "Foto horizontale e shkollës, të paktën 2000px. Pa foto, shfaqet gradienti i markës." },
    { path: "image_alt", label: "Përshkrimi i fotos", kind: "text", nullable: true },
    { path: "primary_cta.label", label: "Butoni kryesor: teksti", kind: "text" },
    { path: "primary_cta.href", label: "Butoni kryesor: lidhja", kind: "text" },
    { path: "secondary_cta.label", label: "Butoni i dytë: teksti", kind: "text" },
    { path: "secondary_cta.href", label: "Butoni i dytë: lidhja", kind: "text" },
  ],
  intro: [
    { path: "heading", label: "Titulli", kind: "text", wide: true },
    { path: "body", label: "Teksti", kind: "textarea", wide: true },
    { path: "vision", label: "Vizioni", kind: "textarea" },
    { path: "mission", label: "Misioni", kind: "textarea" },
    { path: "source", label: "Burimi", kind: "text", nullable: true, wide: true },
  ],
  history: [
    {
      path: "",
      label: "Etapat",
      kind: "repeater",
      blank: { period: "", title: "", text: "" },
      item: [
        { name: "period", label: "Periudha", kind: "text" },
        { name: "title", label: "Titulli", kind: "text" },
        { name: "text", label: "Teksti", kind: "textarea", wide: true },
      ],
    },
  ],
  enrollment: [
    { path: "heading", label: "Titulli", kind: "text", wide: true },
    { path: "body", label: "Teksti", kind: "textarea", wide: true },
    { path: "cta_label", label: "Butoni: teksti", kind: "text" },
    { path: "cta_href", label: "Butoni: lidhja", kind: "text" },
    { path: "verification", label: "Afatet", kind: "verification" },
  ],
  contact: [
    { path: "address", label: "Adresa", kind: "text" },
    { path: "city", label: "Qyteti", kind: "text" },
    { path: "phone", label: "Telefoni", kind: "text", nullable: true, help: "Lëreni bosh derisa të konfirmohet." },
    { path: "email", label: "Emaili", kind: "text", nullable: true, help: "Lëreni bosh derisa të konfirmohet." },
    { path: "hours", label: "Orari i administratës", kind: "text", nullable: true },
    { path: "map_query", label: "Kërkimi në hartë", kind: "text", help: "Teksti që përdoret për Google Maps." },
  ],
  socials: [
    {
      path: "",
      label: "Llogaritë",
      kind: "repeater",
      blank: { label: "", href: "https://", verified: false },
      item: [
        { name: "label", label: "Emri (p.sh. Instagram)", kind: "text" },
        { name: "href", label: "Lidhja", kind: "text" },
        { name: "verified", label: "Llogari zyrtare e verifikuar", kind: "bool" },
      ],
    },
  ],
  student_info: [
    { path: "heading", label: "Titulli", kind: "text", wide: true },
    {
      path: "items",
      label: "Kartat",
      kind: "repeater",
      blank: { title: "", body: "", verification: "pending" },
      item: [
        { name: "title", label: "Titulli", kind: "text" },
        { name: "verification", label: "Verifikimi", kind: "verification" },
        { name: "body", label: "Teksti", kind: "textarea", wide: true },
      ],
    },
  ],
};

function get(obj: unknown, path: string): unknown {
  if (!path) return obj;
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}
function set<T>(obj: T, path: string, value: unknown): T {
  if (!path) return value as T;
  const keys = path.split(".");
  const clone: Record<string, unknown> = Array.isArray(obj) ? ([...obj] as unknown as Record<string, unknown>) : { ...(obj as Record<string, unknown>) };
  let cur = clone;
  keys.slice(0, -1).forEach((k) => {
    cur[k] = { ...(cur[k] as Record<string, unknown>) };
    cur = cur[k] as Record<string, unknown>;
  });
  cur[keys[keys.length - 1]] = value;
  return clone as T;
}

function LeafInput({ kind, value, onChange, id, label }: { kind: Kind; value: unknown; onChange: (v: unknown) => void; id: string; label: string }) {
  if (kind === "textarea") return <textarea id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={4} className={inputCls} />;
  if (kind === "verification")
    return (
      <select id={id} value={String(value ?? "pending")} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="verified">E verifikuar</option>
        <option value="pending">Në pritje të verifikimit</option>
      </select>
    );
  if (kind === "bool")
    return (
      <label htmlFor={id} className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-white px-4 text-sm font-medium">
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--color-blue)]" />
        {label}
      </label>
    );
  return <input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
}

export function SiteSectionEditor({ sectionKey, initialValue }: { sectionKey: SiteKey; initialValue: unknown }) {
  const [value, setValue] = useState<unknown>(initialValue);
  const [state, action, pending] = useActionState(saveSiteSection.bind(null, sectionKey), { status: "idle" } as ActionState);

  // Empty optional strings are stored as null.
  const normalized = (() => {
    let v = value;
    for (const d of D[baseKey(sectionKey)]) if (d.kind !== "repeater" && d.nullable && get(v, d.path) === "") v = set(v, d.path, null);
    return v;
  })();

  return (
    <form onSubmit={submitWithoutReset(action)} className="rounded-2xl bg-white p-6 md:p-8">
      <input type="hidden" name="payload" value={JSON.stringify(normalized)} />
      <div className="grid gap-5 md:grid-cols-2">
        {D[baseKey(sectionKey)].map((d) => {
          const id = `site-${sectionKey}-${(d.path || "root").replace(/\./g, "-")}`;
          if (d.kind === "image")
            return (
              <FieldShell key={d.path} id={id} label={d.label} help={d.help} wide={d.wide}>
                <ImageInput
                  field={{ name: `__img_${id}`, label: d.label, type: "image", bucket: "media" }}
                  id={id}
                  defaultValue={(get(value, d.path) as string) || null}
                  onValueChange={(v) => setValue((s: unknown) => set(s, d.path, v))}
                />
              </FieldShell>
            );
          if (d.kind === "repeater") {
            const list = (get(value, d.path) as Record<string, unknown>[]) ?? [];
            const update = (next: Record<string, unknown>[]) => setValue((s: unknown) => set(s, d.path, next));
            return (
              <fieldset key={id} className="md:col-span-2">
                <legend className="mb-3 text-sm font-semibold">{d.label}</legend>
                <ol className="space-y-3">
                  {list.map((item, i) => (
                    <li key={i} className="rounded-xl border border-line bg-paper p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-muted">#{i + 1}</span>
                        <div className="flex gap-1">
                          <button type="button" aria-label="Lart" disabled={i === 0} onClick={() => update(list.map((x, j) => (j === i - 1 ? list[i] : j === i ? list[i - 1] : x)))} className="grid size-9 place-items-center rounded-lg border border-line bg-white disabled:opacity-40">
                            <ArrowUp aria-hidden className="size-4" />
                          </button>
                          <button type="button" aria-label="Poshtë" disabled={i === list.length - 1} onClick={() => update(list.map((x, j) => (j === i + 1 ? list[i] : j === i ? list[i + 1] : x)))} className="grid size-9 place-items-center rounded-lg border border-line bg-white disabled:opacity-40">
                            <ArrowDown aria-hidden className="size-4" />
                          </button>
                          <button type="button" aria-label="Hiq" onClick={() => update(list.filter((_, j) => j !== i))} className="grid size-9 place-items-center rounded-lg border border-line bg-white hover:border-danger hover:text-danger">
                            <Trash2 aria-hidden className="size-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {d.item.map((f) => {
                          const fid = `${id}-${i}-${f.name}`;
                          const input = (
                            <LeafInput kind={f.kind} id={fid} label={f.label} value={item[f.name]} onChange={(v) => update(list.map((x, j) => (j === i ? { ...x, [f.name]: v } : x)))} />
                          );
                          return f.kind === "bool" ? (
                            <div key={f.name} className={cn(f.wide && "md:col-span-2", "self-end")}>
                              {input}
                            </div>
                          ) : (
                            <FieldShell key={f.name} id={fid} label={f.label} wide={f.wide}>
                              {input}
                            </FieldShell>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ol>
                <button type="button" onClick={() => update([...list, { ...d.blank }])} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-dashed border-line-strong px-4 text-sm font-semibold hover:border-ink">
                  <Plus aria-hidden className="size-4" /> Shto
                </button>
              </fieldset>
            );
          }
          return (
            <FieldShell key={d.path} id={id} label={d.label} help={d.help} wide={d.wide}>
              <LeafInput kind={d.kind} id={id} label={d.label} value={get(value, d.path)} onChange={(v) => setValue((s: unknown) => set(s, d.path, v))} />
            </FieldShell>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-5 font-semibold text-white hover:bg-blue disabled:opacity-60">
          {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Save aria-hidden className="size-4" />}
          Ruaj seksionin
        </button>
        {state.status !== "idle" && (
          <p role={state.status === "error" ? "alert" : "status"} className={cn("flex items-center gap-1.5 text-sm font-medium", state.status === "error" ? "text-danger" : "text-success")}>
            {state.status === "error" ? <CircleAlert aria-hidden className="size-4" /> : <CheckCircle2 aria-hidden className="size-4" />}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
