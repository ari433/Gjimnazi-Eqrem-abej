import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** An empty list explains what will appear and where to go meanwhile. */
export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
  className,
  tone = "light",
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-card border p-8 md:p-10",
        tone === "light" ? "border-line bg-white" : "border-white/15 bg-white/[0.04] text-white",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-12 place-items-center rounded-full",
          tone === "light" ? "bg-blue-soft text-blue" : "bg-white/10 text-white",
        )}
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <div>
        <p className="text-xl font-semibold tracking-[-0.02em]">{title}</p>
        {children && (
          <div className={cn("mt-1.5 max-w-prose", tone === "light" ? "text-muted" : "text-white/70")}>{children}</div>
        )}
      </div>
      {action}
    </div>
  );
}
