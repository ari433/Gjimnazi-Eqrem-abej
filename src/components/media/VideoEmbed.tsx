"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeId } from "@/lib/utils";

/**
 * Lite YouTube embed: shows the thumbnail and loads the privacy-enhanced
 * player only after a click. Other video URLs open in a native player.
 */
export function VideoEmbed({ url, title, poster }: { url: string; title: string; poster?: string | null }) {
  const [play, setPlay] = useState(false);
  const id = youtubeId(url);
  const thumb = poster ?? (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null);

  if (!id) {
    return (
      <video controls preload="none" poster={poster ?? undefined} className="aspect-video w-full rounded-card bg-black">
        <source src={url} />
      </video>
    );
  }

  if (play)
    return (
      <iframe
        className="aspect-video w-full rounded-card bg-black"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-card bg-ink"
      aria-label={`Luaj videon: ${title}`}
    >
      {thumb && <Image src={thumb} alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover opacity-80 transition-transform duration-[1.2s] group-hover:scale-105" />}
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-20 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:scale-110 md:size-24">
          <Play aria-hidden className="ml-1 size-8 fill-current" />
        </span>
      </span>
    </button>
  );
}
