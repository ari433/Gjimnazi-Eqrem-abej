"use client";

import Image from "next/image";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { Eye, FileUp, ImageUp, Link2, Loader2, Pencil, Trash2 } from "lucide-react";
import type { FieldDef } from "@/lib/admin/resources";
import { Markdown } from "@/components/ui/Markdown";
import { getBrowserClient } from "@/lib/supabase/browser";
import { cn, formatBytes, slugify } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.97rem] outline-none transition-colors placeholder:text-muted/60 focus:border-ink aria-[invalid=true]:border-danger";

export function FieldShell({
  id,
  label,
  help,
  error,
  required,
  children,
  wide,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide && "md:col-span-2")}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {help && !error && (
        <p id={`${id}-help`} className="mt-1.5 text-sm text-muted">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------- date helpers */
function toLocalInput(iso: string | null | undefined, dateOnly = false) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return dateOnly ? date : `${date}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DateTimeInput({ name, id, defaultValue, required, invalid }: { name: string; id: string; defaultValue?: string | null; required?: boolean; invalid?: boolean }) {
  // The local time zone is only known in the browser: render empty on the
  // server, fill from the default once hydrated, then follow user edits.
  const isClient = useIsClient();
  const [edited, setEdited] = useState<string | null>(null);
  const local = edited ?? (isClient ? toLocalInput(defaultValue) : "");
  const setLocal = setEdited;
  const iso = local ? new Date(local).toISOString() : "";
  return (
    <>
      <input id={id} type="datetime-local" value={local} onChange={(e) => setLocal(e.target.value)} required={required} aria-invalid={invalid} className={inputCls} />
      <input type="hidden" name={name} value={iso} />
    </>
  );
}

/* ----------------------------------------------------------------- upload */
function useUpload(bucket: "media" | "documents") {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const sb = getBrowserClient();
      const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin";
      const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "skedar";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID().slice(0, 8)}-${base}.${ext}`;
      const { error: upErr } = await sb.storage.from(bucket).upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    } catch (e) {
      console.error(e);
      setError("Ngarkimi dështoi. Kontrolloni madhësinë dhe llojin e skedarit, ose lejet e rolit tuaj.");
      return null;
    } finally {
      setBusy(false);
    }
  }
  return { upload, busy, error };
}

export function ImageInput({
  field,
  id,
  defaultValue,
  invalid,
  onValueChange,
}: {
  field: FieldDef;
  id: string;
  defaultValue?: string | null;
  invalid?: boolean;
  onValueChange?: (url: string | null) => void;
}) {
  const [url, setUrlState] = useState(defaultValue ?? "");
  const setUrl = (v: string) => {
    setUrlState(v);
    onValueChange?.(v || null);
  };
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const { upload, busy, error } = useUpload(field.bucket ?? "media");
  const fileRef = useRef<HTMLInputElement>(null);
  const isImage =
    /\.(png|jpe?g|webp|avif|gif)(\?|$)/i.test(url) ||
    (url.includes("/storage/v1/object/public/media/") && !/\.(mp4|webm|mp3|m4a)(\?|$)/i.test(url));

  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <input type="hidden" name={field.name} value={url} />
      {url ? (
        <div className="flex items-center gap-3">
          {isImage ? (
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-paper">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-paper text-xs font-semibold text-muted">Lidhje</div>
          )}
          <p className="min-w-0 flex-1 truncate text-sm text-muted">{url}</p>
          <button type="button" onClick={() => setUrl("")} className="grid size-10 place-items-center rounded-lg border border-line hover:border-danger hover:text-danger" aria-label="Hiq">
            <Trash2 aria-hidden className="size-4" />
          </button>
        </div>
      ) : mode === "upload" ? (
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            id={id}
            type="file"
            accept={field.bucket === "documents" ? undefined : "image/*,video/mp4,video/webm,audio/mpeg,audio/mp4"}
            className="sr-only"
            aria-invalid={invalid}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 50 * 1024 * 1024) return alert("Skedari është më i madh se 50 MB.");
              const u = await upload(f);
              if (u) setUrl(u);
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <ImageUp aria-hidden className="size-4" />}
            {busy ? "Duke ngarkuar…" : "Ngarko skedar"}
          </button>
          <button type="button" onClick={() => setMode("link")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold hover:border-ink">
            <Link2 aria-hidden className="size-4" /> Ngjit lidhje
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            id={id}
            type="url"
            placeholder="https://"
            className={inputCls}
            aria-invalid={invalid}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setUrl((e.target as HTMLInputElement).value.trim());
              }
            }}
            onBlur={(e) => e.target.value.trim() && setUrl(e.target.value.trim())}
          />
          <button type="button" onClick={() => setMode("upload")} className="shrink-0 rounded-xl border border-line px-4 text-sm font-semibold">
            Anulo
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function FileInput({ field, id, defaultValue, defaults, invalid }: { field: FieldDef; id: string; defaultValue?: string | null; defaults: Record<string, unknown>; invalid?: boolean }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [size, setSize] = useState<number | null>((defaults[field.fileMeta?.size ?? ""] as number) ?? null);
  const [type, setType] = useState<string>((defaults[field.fileMeta?.type ?? ""] as string) ?? "");
  const { upload, busy, error } = useUpload(field.bucket ?? "documents");
  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <input type="hidden" name={field.name} value={url} />
      {field.fileMeta?.size && <input type="hidden" name={field.fileMeta.size} value={size ?? ""} />}
      {field.fileMeta?.type && <input type="hidden" name={field.fileMeta.type} value={type} />}
      {url ? (
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-lg bg-blue-soft text-xs font-bold text-blue">{type || "DOC"}</span>
          <div className="min-w-0 flex-1">
            <a href={url} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-semibold underline">
              {url.split("/").pop()}
            </a>
            <p className="text-xs text-muted">{formatBytes(size)}</p>
          </div>
          <button type="button" onClick={() => setUrl("")} className="grid size-10 place-items-center rounded-lg border border-line hover:border-danger hover:text-danger" aria-label="Hiq skedarin">
            <Trash2 aria-hidden className="size-4" />
          </button>
        </div>
      ) : (
        <label htmlFor={id} className={cn("flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong text-sm text-muted hover:border-ink", busy && "opacity-60")}>
          {busy ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <FileUp aria-hidden className="size-5" />}
          {busy ? "Duke ngarkuar…" : "Zgjidhni një PDF, Word ose Excel (deri 25 MB)"}
          <input
            id={id}
            type="file"
            className="sr-only"
            aria-invalid={invalid}
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/jpeg,image/png"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 25 * 1024 * 1024) return alert("Skedari është më i madh se 25 MB.");
              const u = await upload(f);
              if (u) {
                setUrl(u);
                setSize(f.size);
                setType((f.name.split(".").pop() ?? "").toUpperCase().slice(0, 6));
              }
            }}
          />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function MarkdownInput({ name, id, defaultValue, invalid }: { name: string; id: string; defaultValue?: string; invalid?: boolean }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line bg-paper px-3 py-2 text-xs text-muted">
        <span>## Nëntitull · **i trashë** · *i pjerrët* · - listë · [lidhje](https://…)</span>
        <button type="button" onClick={() => setPreview((p) => !p)} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-semibold text-ink hover:bg-white">
          {preview ? <Pencil aria-hidden className="size-3.5" /> : <Eye aria-hidden className="size-3.5" />}
          {preview ? "Shkruaj" : "Parashiko"}
        </button>
      </div>
      <input type="hidden" name={name} value={value} />
      {preview ? (
        <Markdown source={value || "_Asgjë për të parashikuar._"} className="prose-school min-h-72 max-w-none p-5 text-base" />
      ) : (
        <textarea id={id} value={value} onChange={(e) => setValue(e.target.value)} rows={16} aria-invalid={invalid} className="block min-h-72 w-full resize-y px-4 py-3 font-mono text-sm leading-relaxed outline-none" />
      )}
    </div>
  );
}

export function SlugInput({ name, id, defaultValue, sourceValue, invalid }: { name: string; id: string; defaultValue?: string; sourceValue: string; invalid?: boolean }) {
  // Follows the source field until someone edits the slug by hand.
  const [manual, setManual] = useState<string | null>(defaultValue ? defaultValue : null);
  const value = manual ?? slugify(sourceValue);
  return (
    <input
      id={id}
      name={name}
      value={value}
      onChange={(e) => setManual(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
      aria-invalid={invalid}
      className={cn(inputCls, "font-mono text-sm")}
      required
    />
  );
}

export function Toggle({ name, id, defaultChecked, label }: { name: string; id: string; defaultChecked?: boolean; label: string }) {
  const [on, setOn] = useState(Boolean(defaultChecked));
  return (
    <label htmlFor={id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4">
      <input id={id} name={name} type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} className="peer sr-only" />
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blue", on ? "bg-blue" : "bg-line-strong")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform", on ? "translate-x-5.5" : "translate-x-0.5")} />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

const noopSubscribe = () => () => {};
/** true in the browser after hydration, false during SSR. */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useFieldId(name: string) {
  const id = useId();
  return `${id}-${name}`;
}
