import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function AdminHeader({ title, description, crumbs = [], actions }: { title: string; description?: string; crumbs?: { label: string; href?: string }[]; actions?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {crumbs.length > 0 && (
          <nav aria-label="Navigimi" className="mb-2 flex items-center gap-1 text-sm text-muted">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-bold tracking-[-0.03em] md:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}

export function StatusBadge({ value, publishedAt, now }: { value: string; publishedAt?: string | null; now?: number }) {
  const scheduled = value === "published" && publishedAt && now !== undefined && Date.parse(publishedAt) > now;
  const map: Record<string, { l: string; c: string }> = {
    published: { l: "Publikuar", c: "bg-success/12 text-success" },
    draft: { l: "Draft", c: "bg-line text-ink/70" },
    archived: { l: "Arkivuar", c: "bg-ink/8 text-muted" },
    verified: { l: "E verifikuar", c: "bg-success/12 text-success" },
    pending: { l: "Në pritje", c: "bg-pending-bg text-pending" },
  };
  const m = scheduled ? { l: "Planifikuar", c: "bg-blue-soft text-blue-deep" } : map[value] ?? { l: value, c: "bg-line" };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.c}`}>{m.l}</span>;
}
