import type { ReactNode } from "react";
import { MaskText } from "@/components/motion/MaskText";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { cn } from "@/lib/utils";

/** Opening block for inner pages: crumbs, an oversized title, a lede. */
export function PageHero({
  title,
  lede,
  crumbs = [],
  aside,
  tone = "paper",
  className,
}: {
  title: string;
  lede?: ReactNode;
  crumbs?: Crumb[];
  aside?: ReactNode;
  tone?: "paper" | "ink";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative pb-14 pt-36 md:pb-20 md:pt-44",
        tone === "ink" ? "grain overflow-hidden bg-ink text-white" : "bg-paper",
        className,
      )}
    >
      <div className="shell relative">
        <Breadcrumbs items={crumbs} tone={tone} />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <MaskText as="h1" immediate text={title} className="text-mega font-bold" />
          </div>
          {(lede || aside) && (
            <div className="lg:col-span-4">
              {lede && (
                <div className={cn("text-lede", tone === "ink" ? "text-white/75" : "text-muted")}>{lede}</div>
              )}
              {aside && <div className="mt-6">{aside}</div>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
