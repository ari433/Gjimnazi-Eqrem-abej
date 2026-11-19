"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { sendContactMessage } from "@/lib/actions/contact";
import { t, type Locale } from "@/lib/i18n";
import type { ContactState } from "@/lib/validation";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

function Field({
  id,
  label,
  error,
  defaultValue,
  textarea,
  type = "text",
  autoComplete,
}: {
  id: "name" | "email" | "subject" | "message";
  label: string;
  error?: string;
  defaultValue?: string;
  textarea?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  const cls = cn(
    "w-full rounded-2xl border bg-white px-5 py-4 text-base outline-none transition-colors placeholder:text-muted/60 focus:border-ink",
    error ? "border-danger" : "border-line",
  );
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={id} rows={6} required defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cls} />
      ) : (
        <input id={id} name={id} type={type} required autoComplete={autoComplete} defaultValue={defaultValue} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cls} />
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ locale = "sq" }: { locale?: Locale }) {
  const F = t(locale).contact_.form;
  const [state, action, pending] = useActionState(sendContactMessage, initial);
  // When the form became interactive; bots that submit instantly are ignored.
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  if (state.status === "success")
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-card bg-white p-10">
        <CheckCircle2 aria-hidden className="size-10 text-success" />
        <p className="text-2xl font-bold tracking-[-0.03em]">{state.message}</p>
        <p className="text-muted">{F.okBody}</p>
      </div>
    );

  const v = state.values ?? {};
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("started_at", String(mountedAt.current));
        fd.set("locale", locale);
        startTransition(() => action(fd));
      }}
      noValidate className="grid gap-5 rounded-card bg-white p-6 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="name" label={F.name} autoComplete="name" error={state.fieldErrors?.name} defaultValue={v.name} />
        <Field id="email" label={F.email} type="email" autoComplete="email" error={state.fieldErrors?.email} defaultValue={v.email} />
      </div>
      <Field id="subject" label={F.subject} error={state.fieldErrors?.subject} defaultValue={v.subject} />
      <Field id="message" label={F.message} textarea error={state.fieldErrors?.message} defaultValue={v.message} />

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">{F.honeypot}</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-5 py-3 text-sm font-semibold text-danger">
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-sm text-sm text-muted">{F.privacy}</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center gap-2.5 rounded-pill bg-ink px-6 font-semibold text-white transition-colors hover:bg-blue disabled:opacity-60"
        >
          {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4" />}
          {pending ? F.sending : F.submit}
        </button>
      </div>
    </form>
  );
}
