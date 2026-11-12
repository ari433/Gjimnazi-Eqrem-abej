import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ink" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep",
  ink: "bg-ink text-white hover:bg-ink-2",
  ghost: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white",
  light: "bg-white text-ink hover:bg-blue-soft",
};

const base =
  "group inline-flex min-h-12 items-center gap-3 rounded-pill px-6 text-[0.98rem] font-semibold tracking-[-0.01em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

type LinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  className?: string;
  icon?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", className, icon = true, children, ...props }: LinkProps) {
  const external = typeof props.href === "string" && /^https?:/.test(props.href);
  return (
    <Link
      {...props}
      className={cn(base, styles[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </Link>
  );
}

type BtnProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, ...props }: BtnProps) {
  return <button {...props} className={cn(base, styles[variant], className)} />;
}
