/** Skeleton shown while a page's content streams in. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="bg-paper pb-24 pt-36 md:pt-44">
      <span className="sr-only">Wird geladen…</span>
      <div className="shell">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton mt-10 h-[clamp(3rem,7vw,6rem)] w-3/4" />
        <div className="skeleton mt-4 h-[clamp(3rem,7vw,6rem)] w-1/2" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/3] w-full rounded-card" />
              <div className="skeleton mt-4 h-5 w-2/3" />
              <div className="skeleton mt-2 h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
