import type { ReactNode } from "react";
import Link from "next/link";
import { MaskText } from "@/components/motion/MaskText";
import { cn } from "@/lib/utils";

/** Section title with an optional "see all" link aligned to the baseline. */
export function SectionHeading({
  title,
  lede,
  link,
  tone = "paper",
  className,
  id,
}: {
  title: string;
  lede?: ReactNode;
  link?: { href: string; label: string };
  tone?: "paper" | "ink";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <MaskText id={id} text={title} className="text-title font-bold" />
        {lede && <p className={cn("mt-4 text-lede", tone === "ink" ? "text-white/70" : "text-muted")}>{lede}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className={cn(
            "link-underline shrink-0 self-start pb-0.5 text-base font-semibold md:self-auto",
            tone === "ink" ? "text-white" : "text-ink",
          )}
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
