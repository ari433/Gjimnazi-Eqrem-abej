import { CircleDashed } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marks content that the school has not confirmed yet.
 * Deliberately visible: unverified information must never pass as fact.
 */
export function PendingBadge({ className, label = "Në pritje të verifikimit" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill bg-pending-bg px-2.5 py-1 text-xs font-semibold text-pending",
        className,
      )}
    >
      <CircleDashed aria-hidden className="size-3.5" />
      {label}
    </span>
  );
}

export function PendingBlock({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hatch rounded-card border border-dashed border-pending/40 bg-pending-bg/40 p-6 text-ink",
        className,
      )}
    >
      <PendingBadge />
      <p className="mt-3 text-lg font-semibold tracking-[-0.01em]">{title}</p>
      {children && <div className="mt-1.5 max-w-prose text-[0.97rem] text-muted">{children}</div>}
    </div>
  );
}

/** Marks local demo entries that describe the website itself. */
export function ExampleBadge({ className }: { className?: string }) {
  return (
    <span
      title="Përmbajtje shembull. Zëvendësohet nga paneli i administrimit."
      className={cn(
        "inline-flex items-center rounded-pill border border-current/25 px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
    >
      Shembull
    </span>
  );
}

export function SourceNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted", className)}>Burimi: {children}</p>;
}
