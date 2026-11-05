import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import type { Stat } from "@/lib/types";

/**
 * Only verified figures with a named source reach this section.
 * With none available, the section is not rendered at all.
 */
export function Stats({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  const sources = Array.from(new Set(stats.map((s) => `${s.source} (${s.year})`)));
  return (
    <section aria-label="Shkolla në shifra" className="border-y border-line bg-white">
      <div className="shell grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.08} className="px-0 py-12 md:px-10 md:py-16 first:md:pl-0">
            <p className="text-[clamp(3.5rem,7vw,6.5rem)] font-bold leading-none tracking-[-0.05em] text-ink">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-3 max-w-[16rem] text-lg text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
      <p className="shell pb-6 text-sm text-muted">Burimi: {sources.join("; ")}. Shifrat përditësohen nga administrata.</p>
    </section>
  );
}
