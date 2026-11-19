"use client";

import { useOptimistic, useTransition } from "react";
import { Check, Mail, Trash2, Undo2 } from "lucide-react";
import { deleteMessage, setMessageHandled } from "@/app/admin/actions";
import { cn, formatDate, formatTime } from "@/lib/utils";

type Msg = { id: string; name: string; email: string; subject: string; message: string; handled: boolean; created_at: string };

export function MessageItem({ msg }: { msg: Msg }) {
  const [pending, start] = useTransition();
  const [state, setState] = useOptimistic<{ handled: boolean; deleted: boolean }>({ handled: msg.handled, deleted: false });
  if (state.deleted) return null;
  return (
    <li className={cn("rounded-2xl bg-white p-6", state.handled && "opacity-60")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{msg.subject}</p>
          <p className="text-sm text-muted">
            {msg.name} · <a href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}`} className="underline">{msg.email}</a> · {formatDate(msg.created_at)}, {formatTime(msg.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-ink px-3 text-sm font-semibold text-white hover:bg-blue">
            <Mail aria-hidden className="size-4" /> Përgjigju
          </a>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setState({ handled: !state.handled, deleted: false });
                await setMessageHandled(msg.id, !state.handled);
              })
            }
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-semibold hover:border-ink"
          >
            {state.handled ? <Undo2 aria-hidden className="size-4" /> : <Check aria-hidden className="size-4" />}
            {state.handled ? "Rihape" : "U trajtua"}
          </button>
          <button
            type="button"
            aria-label="Fshij mesazhin"
            disabled={pending}
            onClick={() => {
              if (!confirm("Të fshihet ky mesazh përgjithmonë?")) return;
              start(async () => {
                setState({ ...state, deleted: true });
                await deleteMessage(msg.id);
              });
            }}
            className="grid size-10 place-items-center rounded-lg border border-line hover:border-danger hover:text-danger"
          >
            <Trash2 aria-hidden className="size-4" />
          </button>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-line text-ink/85">{msg.message}</p>
    </li>
  );
}
