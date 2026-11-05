"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Images, Play, X } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { VideoEmbed } from "./VideoEmbed";
import { EmptyState } from "@/components/ui/EmptyState";
import { asset, cn, youtubeId } from "@/lib/utils";

/** Filterable gallery with an accessible lightbox (Esc, arrows, focus return). */
export function GalleryGrid({ items }: { items: MediaItem[] }) {
  const reduce = useReducedMotion();
  const albums = useMemo(() => Array.from(new Set(items.map((m) => m.album).filter(Boolean))) as string[], [items]);
  const [album, setAlbum] = useState<string | null>(null);
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const shown = items.filter((m) => m.kind !== "podcast" && (!album || m.album === album) && (kind === "all" || m.kind === kind));

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + shown.length) % shown.length));
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, shown.length, close]);

  if (items.length === 0)
    return (
      <EmptyState icon={Images} title="Galeria është ende bosh">
        Fotot dhe videot shtohen nga stafi, me lejen e nxënësve që shfaqen në to.
      </EmptyState>
    );

  const current = open !== null ? shown[open] : null;
  const chip = (active: boolean) =>
    cn("min-h-10 rounded-pill border px-4 text-sm font-semibold transition-colors", active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink");

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtro galerinë">
        {(["all", "image", "video"] as const).map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} className={chip(kind === k)} onClick={() => setKind(k)}>
            {k === "all" ? "Të gjitha" : k === "image" ? "Foto" : "Video"}
          </button>
        ))}
        {albums.length > 1 && <span className="mx-2 w-px self-stretch bg-line" aria-hidden />}
        {albums.length > 1 &&
          albums.map((a) => (
            <button key={a} type="button" aria-pressed={album === a} className={chip(album === a)} onClick={() => setAlbum(album === a ? null : a)}>
              {a}
            </button>
          ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-muted">Asnjë element për këtë filtër.</p>
      ) : (
        <ul className="columns-2 gap-3 md:columns-3 lg:columns-4">
          {shown.map((m, i) => {
            const yt = m.kind === "video" ? youtubeId(m.url) : null;
            const thumb = m.kind === "image" ? asset(m.url) : m.thumbnail_url ?? (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : null);
            const lowRes = (m.width ?? 2000) < 600;
            const ratio = m.width && m.height ? `${m.width} / ${m.height}` : m.kind === "video" ? "16 / 9" : "4 / 3";
            return (
              <li key={m.id} className="mb-3 break-inside-avoid">
                <button
                  type="button"
                  onClick={(e) => {
                    lastTrigger.current = e.currentTarget;
                    setOpen(i);
                  }}
                  className="group relative block w-full overflow-hidden rounded-card bg-white text-left"
                  style={{ aspectRatio: ratio }}
                  aria-label={`Hap: ${m.caption ?? m.title}`}
                >
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      sizes={lowRes ? "206px" : "(min-width: 1024px) 25vw, 50vw"}
                      className={lowRes ? "object-contain p-4" : "object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"}
                    />
                  ) : (
                    <span className="absolute inset-0 bg-ink" />
                  )}
                  {m.kind === "video" && (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full bg-white/90 text-ink">
                        <Play aria-hidden className="ml-0.5 size-5 fill-current" />
                      </span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 text-white backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="text-sm text-white/60">
                {(open ?? 0) + 1} / {shown.length}
              </p>
              <button ref={closeBtn} type="button" onClick={close} className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-white/25 px-4 font-semibold">
                <X aria-hidden className="size-4" /> Mbyll
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 md:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full max-h-[78vh] w-full max-w-6xl"
              >
                {current.kind === "image" ? (
                  <Image src={asset(current.url)} alt={current.caption ?? current.title} fill sizes="100vw" className="object-contain" />
                ) : (
                  <div className="flex h-full items-center">
                    <VideoEmbed url={current.url} title={current.title} poster={current.thumbnail_url} />
                  </div>
                )}
              </motion.div>
              {shown.length > 1 && (
                <>
                  <button type="button" aria-label="E mëparshmja" onClick={() => setOpen((o) => ((o ?? 0) - 1 + shown.length) % shown.length)} className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:left-6">
                    <ChevronLeft aria-hidden className="size-6" />
                  </button>
                  <button type="button" aria-label="Tjetra" onClick={() => setOpen((o) => ((o ?? 0) + 1) % shown.length)} className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:right-6">
                    <ChevronRight aria-hidden className="size-6" />
                  </button>
                </>
              )}
            </div>
            <div className="p-4 text-center md:p-6">
              <p className="font-semibold">{current.title}</p>
              {current.caption && <p className="text-sm text-white/60">{current.caption}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
