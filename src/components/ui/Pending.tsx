import { CircleDashed } from "lucide-react";
import type { ReactNode } from "react";
import { t, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Marks content the school has not confirmed yet.
 * Deliberately visible: unverified information must never pass as fact.
 */
export function PendingBadge({ className, label, locale = "sq" }: { className?: string; label?: string; locale?: Locale }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-pill bg-pending-bg px-2.5 py-1 text-xs font-semibold text-pending", className)}>
      <CircleDashed aria-hidden className="size-3.5" />
      {label ?? t(locale).pending}
    </span>
  );
}

export function PendingBlock({ title, children, className, locale = "sq" }: { title: string; children?: ReactNode; className?: string; locale?: Locale }) {
  return (
    <div className={cn("hatch rounded-card border border-dashed border-pending/40 bg-pending-bg/40 p-6 text-ink", className)}>
      <PendingBadge locale={locale} />
      <p className="mt-3 text-lg font-semibold tracking-[-0.01em]">{title}</p>
      {children && <div className="mt-1.5 max-w-prose text-[0.97rem] text-muted">{children}</div>}
    </div>
  );
}

/** Marks local demo entries that describe the website itself. */
export function ExampleBadge({ className, locale = "sq" }: { className?: string; locale?: Locale }) {
  return (
    <span className={cn("inline-flex items-center rounded-pill border border-current/25 px-2.5 py-0.5 text-xs font-semibold", className)}>
      {t(locale).example}
    </span>
  );
}

export function SourceNote({ children, className, locale = "sq" }: { children: ReactNode; className?: string; locale?: Locale }) {
  return (
    <p className={cn("text-sm text-muted", className)}>
      {t(locale).source}: {children}
    </p>
  );
}

/** Shown on /de pages whose content exists only in Albanian. */
export function UntranslatedNote({ show, locale }: { show?: boolean; locale: Locale }) {
  if (!show || locale !== "de") return null;
  return (
    <p lang="de" className="inline-flex rounded-pill bg-blue-soft px-3 py-1 text-xs font-semibold text-blue-deep">
      {t("de").onlyAlbanian}
    </p>
  );
}
