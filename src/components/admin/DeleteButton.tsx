"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteRecord } from "@/app/admin/actions";

/** Delete with an explicit confirmation dialog (native <dialog>). */
export function DeleteButton({ resourceKey, id, label }: { resourceKey: string; id: string; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-danger hover:underline">
        <Trash2 aria-hidden className="size-4" /> Fshij
      </button>
      <dialog ref={dialog} className="m-auto w-[min(92vw,28rem)] rounded-2xl p-0 backdrop:bg-ink/60 backdrop:backdrop-blur-sm" aria-labelledby={`del-${id}`}>
        <div className="p-7">
          <h2 id={`del-${id}`} className="text-xl font-bold tracking-[-0.02em]">
            Të fshihet ky {label.toLowerCase()}?
          </h2>
          <p className="mt-2 text-muted">Fshirja është e përhershme. Nëse doni vetëm ta hiqni nga faqja, zgjidhni &ldquo;Arkivo&rdquo;.</p>
          {error && <p className="mt-3 text-sm font-medium text-danger">{error}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => dialog.current?.close()} className="min-h-11 rounded-xl border border-line px-4 font-semibold">
              Anulo
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await deleteRecord(resourceKey, id);
                  if (res?.status === "error") setError(res.message ?? "Fshirja dështoi.");
                })
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-danger px-4 font-semibold text-white disabled:opacity-60"
            >
              {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
              Fshij përgjithmonë
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
