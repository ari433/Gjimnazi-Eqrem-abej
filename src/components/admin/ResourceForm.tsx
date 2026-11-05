"use client";

import { submitWithoutReset } from "@/lib/use-form-submit";
import Link from "next/link";
import { useActionState, useState } from "react";
import { CheckCircle2, CircleAlert, ExternalLink, Loader2, Save } from "lucide-react";
import type { FieldDef, ResourceDef } from "@/lib/admin/resources";
import type { Role } from "@/lib/types";
import { saveRecord, type ActionState } from "@/app/admin/actions";
import { roleAtLeast } from "@/lib/admin/roles";
import { DateTimeInput, FieldShell, FileInput, ImageInput, MarkdownInput, SlugInput, Toggle, inputCls } from "./fields";
import { DeleteButton } from "./DeleteButton";
import { cn, formatDate } from "@/lib/utils";

type Row = Record<string, unknown>;
type Options = Record<string, { value: string; label: string }[]>;

const initial: ActionState = { status: "idle" };

function str(v: unknown) {
  return v === null || v === undefined ? "" : String(v);
}

export function ResourceForm({
  resource,
  row,
  relationOptions,
  role,
  justSaved,
  now,
}: {
  resource: ResourceDef;
  row: Row | null;
  relationOptions: Options;
  role: Role;
  justSaved?: boolean;
  /** Server time, so render output does not depend on the clock. */
  now: number;
}) {
  const id = (row?.id as string) ?? null;
  const [state, action, pending] = useActionState(saveRecord.bind(null, resource.key, id), initial);
  const [sources, setSources] = useState<Record<string, string>>(() => {
    const s: Record<string, string> = {};
    for (const f of resource.fields) if (f.type === "slug" && f.from) s[f.from] = str(row?.[f.from]);
    return s;
  });
  const isEditor = roleAtLeast(role, "editor");
  const errors = state.errors ?? {};
  // "Saved" banner after create-redirect, until the next submission.
  const showSaved = Boolean(justSaved) && state.status === "idle";

  const status = str(row?.status) || "draft";
  const publishedAt = str(row?.published_at);
  const isScheduled = status === "published" && publishedAt && Date.parse(publishedAt) > now;
  const defaultMode = status === "archived" ? "archive" : status === "draft" ? "draft" : isScheduled ? "schedule" : "now";
  const [mode, setMode] = useState(defaultMode);

  const renderField = (f: FieldDef) => {
    const fid = `f-${f.name}`;
    const err = errors[f.name];
    const value = row?.[f.name] ?? f.defaultValue ?? null;
    const common = { id: fid, "aria-invalid": Boolean(err), "aria-describedby": err ? `${fid}-err` : f.help ? `${fid}-help` : undefined };
    const watch = Object.prototype.hasOwnProperty.call(sources, f.name)
      ? { onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSources((s) => ({ ...s, [f.name]: e.target.value })) }
      : {};

    let control: React.ReactNode;
    switch (f.type) {
      case "textarea":
        control = <textarea {...common} {...watch} name={f.name} defaultValue={str(value)} rows={4} maxLength={f.max} required={f.required} className={inputCls} />;
        break;
      case "markdown":
        control = <MarkdownInput name={f.name} id={fid} defaultValue={str(value)} invalid={Boolean(err)} />;
        break;
      case "slug":
        control = <SlugInput name={f.name} id={fid} defaultValue={str(value)} sourceValue={sources[f.from ?? ""] ?? ""} invalid={Boolean(err)} />;
        break;
      case "select":
        control = (
          <select {...common} name={f.name} defaultValue={str(value)} className={inputCls}>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
        break;
      case "relation":
        control = (
          <select {...common} name={f.name} defaultValue={str(value)} required={f.required} className={inputCls}>
            <option value="">{f.required ? "Zgjidhni…" : "Asnjë"}</option>
            {(relationOptions[f.name] ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
        break;
      case "boolean":
        return (
          <div key={f.name} className={cn(f.wide && "md:col-span-2", "self-end")}>
            <Toggle name={f.name} id={fid} defaultChecked={Boolean(value)} label={f.label} />
            {f.help && <p className="mt-1.5 text-sm text-muted">{f.help}</p>}
          </div>
        );
      case "number":
        control = <input {...common} type="number" step="any" name={f.name} defaultValue={str(value)} required={f.required} className={inputCls} />;
        break;
      case "datetime":
        control = <DateTimeInput name={f.name} id={fid} defaultValue={str(value) || null} required={f.required} invalid={Boolean(err)} />;
        break;
      case "date":
        control = <input {...common} type="date" name={f.name} defaultValue={str(value).slice(0, 10)} className={inputCls} />;
        break;
      case "list":
        control = (
          <textarea {...common} name={f.name} defaultValue={Array.isArray(value) ? value.join("\n") : str(value)} rows={5} className={inputCls} />
        );
        break;
      case "image":
        control = <ImageInput field={f} id={fid} defaultValue={str(value) || null} invalid={Boolean(err)} />;
        break;
      case "file":
        control = <FileInput field={f} id={fid} defaultValue={str(value) || null} defaults={row ?? {}} invalid={Boolean(err)} />;
        break;
      default:
        control = (
          <input
            {...common}
            {...watch}
            type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"}
            name={f.name}
            defaultValue={str(value)}
            maxLength={f.max}
            required={f.required}
            className={inputCls}
          />
        );
    }
    return (
      <FieldShell key={f.name} id={fid} label={f.label} help={f.help} error={err} required={f.required} wide={f.wide}>
        {control}
      </FieldShell>
    );
  };

  const publicHref =
    resource.publicPath && status === "published"
      ? resource.publicPath.endsWith("/")
        ? `${resource.publicPath}${str(row?.slug)}`
        : resource.publicPath
      : null;

  return (
    <form onSubmit={submitWithoutReset(action)} noValidate className="grid gap-8 xl:grid-cols-[1fr_20rem]">
      <div className="grid content-start gap-6">
        <div className="grid content-start gap-6 rounded-2xl bg-white p-6 md:grid-cols-2 md:p-8">
          {resource.fields.filter((f) => f.lang !== "de").map(renderField)}
        </div>
        {resource.fields.some((f) => f.lang === "de") && (
          <details className="group rounded-2xl bg-white p-6 md:p-8" open={resource.fields.some((f) => f.lang === "de" && str(row?.[f.name]))}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              <span>
                Përkthimi në gjermanisht
                <span className="mt-1 block text-sm font-normal text-muted">
                  Shfaqet në faqen /de. Fushat bosh shfaqen në shqip, me shënimin “nur auf Albanisch”.
                </span>
              </span>
              <span aria-hidden className="text-xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="mt-6 grid gap-6 md:grid-cols-2">{resource.fields.filter((f) => f.lang === "de").map(renderField)}</div>
          </details>
        )}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        {resource.publishable && (
          <fieldset className="rounded-2xl bg-white p-6">
            <legend className="sr-only">Publikimi</legend>
            <p className="text-sm font-semibold">Publikimi</p>
            {!isEditor ? (
              <p className="mt-2 text-sm text-muted">Si kontribues, ruani si draft. Një redaktor e rishikon dhe e publikon.</p>
            ) : (
              <div className="mt-3 grid gap-2">
                {[
                  { v: "draft", l: "Draft", d: "Nuk shfaqet në faqe" },
                  { v: "now", l: "Publiko tani", d: publishedAt && !isScheduled && status === "published" ? `Publikuar më ${formatDate(publishedAt)}` : "Shfaqet menjëherë" },
                  { v: "schedule", l: "Planifiko", d: "Publikohet automatikisht" },
                  { v: "archive", l: "Arkivo", d: "Fshihet nga faqja, ruhet këtu" },
                ].map((o) => (
                  <label key={o.v} className={cn("flex cursor-pointer gap-3 rounded-xl border p-3", mode === o.v ? "border-ink bg-paper" : "border-line")}>
                    <input type="radio" name="publish_mode" value={o.v} checked={mode === o.v} onChange={() => setMode(o.v)} className="mt-1 accent-[var(--color-blue)]" />
                    <span>
                      <span className="block text-sm font-semibold">{o.l}</span>
                      <span className="block text-xs text-muted">{o.d}</span>
                    </span>
                  </label>
                ))}
                {mode === "schedule" && (
                  <FieldShell id="publish_at" label="Data dhe ora" error={errors.publish_at}>
                    <DateTimeInput name="publish_at" id="publish_at" defaultValue={isScheduled ? publishedAt : null} invalid={Boolean(errors.publish_at)} />
                  </FieldShell>
                )}
              </div>
            )}
            <input type="hidden" name="existing_published_at" value={publishedAt} />
          </fieldset>
        )}

        <div className="rounded-2xl bg-white p-6">
          {(state.status !== "idle" || showSaved) && (
            <p
              role={state.status === "error" ? "alert" : "status"}
              className={cn(
                "mb-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm font-medium",
                state.status === "error" ? "bg-danger/10 text-danger" : "bg-success/10 text-success",
              )}
            >
              {state.status === "error" ? <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0" />}
              {state.message ?? "Ndryshimet u ruajtën."}
            </p>
          )}
          <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-white transition-colors hover:bg-blue disabled:opacity-60">
            {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Save aria-hidden className="size-4" />}
            {pending ? "Duke ruajtur…" : id ? "Ruaj ndryshimet" : `Krijo ${resource.singular.toLowerCase()}`}
          </button>
          {publicHref && (
            <Link href={publicHref} target="_blank" className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-blue-deep hover:underline">
              Shiko në faqe <ExternalLink aria-hidden className="size-3.5" />
            </Link>
          )}
          {id && isEditor && <DeleteButton resourceKey={resource.key} id={id} label={resource.singular} />}
        </div>
      </aside>
    </form>
  );
}
