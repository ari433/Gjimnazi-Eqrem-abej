"use client";

import { submitWithoutReset } from "@/lib/use-form-submit";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { requestPasswordReset, signIn, updatePassword, type ActionState } from "@/app/admin/actions";
import { inputCls } from "./fields";

const initial: ActionState = { status: "idle" };

function Notice({ state }: { state: ActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p role={state.status === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm font-medium ${state.status === "error" ? "bg-danger/10 text-danger" : "bg-success/10 text-success"}`}>
      {state.message}
    </p>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink font-semibold text-white transition-colors hover:bg-blue disabled:opacity-60">
      {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

const QUERY_ERRORS: Record<string, string> = {
  "pa-qasje": "Llogaria juaj ende nuk ka qasje në panel. Kërkojini administratorit t'ju japë rol.",
  lidhja: "Lidhja ka skaduar ose është e pavlefshme. Kërkoni një lidhje të re.",
};

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signIn, initial);
  const params = useSearchParams();
  const qErr = QUERY_ERRORS[params.get("gabim") ?? ""];
  return (
    <form onSubmit={submitWithoutReset(action)} className="space-y-5">
      {!configured && (
        <p className="rounded-xl bg-pending-bg px-4 py-3 text-sm text-pending">
          Supabase nuk është lidhur ende. Shtoni çelësat në <code>.env.local</code> sipas README-së.
        </p>
      )}
      {qErr && <p className="rounded-xl bg-pending-bg px-4 py-3 text-sm text-pending">{qErr}</p>}
      <Notice state={state} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
          Emaili
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} />
      </div>
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="password" className="text-sm font-semibold">
            Fjalëkalimi
          </label>
          <Link href="/admin/rivendos" className="text-sm text-blue-deep hover:underline">
            Keni harruar fjalëkalimin?
          </Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} className={inputCls} />
      </div>
      <Submit pending={pending}>{pending ? "Duke hyrë…" : "Hyr në panel"}</Submit>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);
  if (state.status === "success")
    return (
      <div className="flex flex-col items-start gap-3">
        <CheckCircle2 aria-hidden className="size-8 text-success" />
        <p className="text-lg font-semibold">{state.message}</p>
        <Link href="/admin/hyrja" className="text-blue-deep hover:underline">
          Kthehu te hyrja
        </Link>
      </div>
    );
  return (
    <form onSubmit={submitWithoutReset(action)} className="space-y-5">
      <Notice state={state} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
          Emaili i llogarisë
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} />
      </div>
      <Submit pending={pending}>Dërgo lidhjen</Submit>
      <Link href="/admin/hyrja" className="block text-center text-sm text-muted hover:text-ink">
        Kthehu te hyrja
      </Link>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initial);
  if (state.status === "success")
    return (
      <div className="flex flex-col items-start gap-3">
        <CheckCircle2 aria-hidden className="size-8 text-success" />
        <p className="text-lg font-semibold">{state.message}</p>
        <Link href="/admin" className="text-blue-deep hover:underline">
          Vazhdo te paneli
        </Link>
      </div>
    );
  return (
    <form onSubmit={submitWithoutReset(action)} className="space-y-5">
      <Notice state={state} />
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
          Fjalëkalimi i ri
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} className={inputCls} />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold">
          Përsërite
        </label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={10} className={inputCls} />
      </div>
      <Submit pending={pending}>Ruaj fjalëkalimin</Submit>
    </form>
  );
}
