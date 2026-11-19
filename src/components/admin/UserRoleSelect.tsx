"use client";

import { submitWithoutReset } from "@/lib/use-form-submit";
import { useActionState, useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { inviteUser, setUserRole, type ActionState } from "@/app/admin/actions";
import { ROLE_HELP, ROLE_LABEL } from "@/lib/admin/roles";
import type { Role } from "@/lib/types";
import { inputCls } from "./fields";

const ROLES: Role[] = ["admin", "editor", "contributor", "viewer"];

export function UserRoleSelect({ userId, role, disabled }: { userId: string; role: Role; disabled?: boolean }) {
  const [value, setValue] = useState<Role>(role);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<ActionState | null>(null);
  return (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor={`role-${userId}`}>
        Roli
      </label>
      <select
        id={`role-${userId}`}
        value={value}
        disabled={disabled || pending}
        onChange={(e) => {
          const next = e.target.value as Role;
          const prev = value;
          setValue(next);
          start(async () => {
            const res = await setUserRole(userId, next);
            setMsg(res);
            if (res.status === "error") setValue(prev);
          });
        }}
        className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm disabled:opacity-60"
      >
        {ROLES.map((r) => (
          <option key={r} value={r} title={ROLE_HELP[r]}>
            {ROLE_LABEL[r]}
          </option>
        ))}
      </select>
      {pending && <Loader2 aria-hidden className="size-4 animate-spin text-muted" />}
      {msg && !pending && (
        <span role="status" className={`text-xs ${msg.status === "error" ? "text-danger" : "text-success"}`}>
          {msg.message}
        </span>
      )}
    </div>
  );
}

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteUser, { status: "idle" } as ActionState);
  return (
    <form onSubmit={submitWithoutReset(action)} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <label htmlFor="invite-email" className="sr-only">
          Emaili
        </label>
        <input id="invite-email" name="email" type="email" required placeholder="emri@shembull.com" className={inputCls} />
        {state.status !== "idle" && (
          <p role="status" className={`mt-2 text-sm ${state.status === "error" ? "text-danger" : "text-success"}`}>
            {state.message}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink px-5 font-semibold text-white hover:bg-blue disabled:opacity-60">
        {pending ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4" />}
        Dërgo ftesën
      </button>
    </form>
  );
}
