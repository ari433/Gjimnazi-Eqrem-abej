import Image from "next/image";
import { asset, cn } from "@/lib/utils";

/**
 * Image when one exists; otherwise a quiet typographic placeholder in the
 * brand palette. Never stock photography standing in for the real school.
 */
export function MediaFrame({
  src,
  alt,
  label,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  tone = "blue",
}: {
  src?: string | null;
  alt?: string | null;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "blue" | "ink" | "paper";
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-line", className)}>
        <Image
          src={asset(src)}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </div>
    );
  }
  // The brand mark stands in for missing photos; `label` only feeds alt text upstream.
  void label;
  const letter = "Ç";
  return (
    <div
      aria-hidden
      className={cn(
        "relative grid place-items-center overflow-hidden",
        tone === "blue" && "bg-blue text-white",
        tone === "ink" && "grain bg-ink text-white",
        tone === "paper" && "bg-blue-soft text-blue",
        className,
      )}
    >
      <span className="select-none text-[clamp(5rem,14vw,11rem)] font-bold leading-none tracking-[-0.06em] opacity-90 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110">
        {letter}
      </span>
    </div>
  );
}
