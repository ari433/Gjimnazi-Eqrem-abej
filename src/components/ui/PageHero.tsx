import type { ReactNode } from "react";
import { MaskText } from "@/components/motion/MaskText";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

/** Opening block for inner pages: crumbs, an oversized title, a lede. */
export function PageHero({
  title,
  lede,
  crumbs = [],
  aside,
  tone = "paper",
  className,
  locale = "sq",
}: {
  title: string;
  lede?: ReactNode;
  crumbs?: Crumb[];
  aside?: ReactNode;
  tone?: "paper" | "ink";
  className?: string;
  locale?: Locale;
}) {
  return (
    <header
      className={cn(
        "relative pb-12 pt-28 md:pb-20 md:pt-44",
        tone === "ink" ? "grain overflow-hidden bg-ink text-white" : "bg-paper",
        className,
      )}
    >
      <div className="shell relative">
        <Breadcrumbs items={crumbs} tone={tone} locale={locale} />
        <div className="mt-6 grid gap-6 md:mt-8 lg:grid-cols-12 lg:items-end lg:gap-10">
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
