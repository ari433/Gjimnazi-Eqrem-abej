"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="grid min-h-[80svh] place-items-center bg-paper px-6 pt-24">
      <div className="max-w-xl">
        <h1 className="text-title font-bold">Faqja nuk u ngarkua.</h1>
        <p className="mt-4 text-lede text-muted">Ndodhi një gabim gjatë ngarkimit të përmbajtjes. Provoni përsëri; nëse vazhdon, kthehuni më vonë.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center rounded-pill bg-ink px-6 font-semibold text-white hover:bg-blue">
            Provo përsëri
          </button>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-pill border border-ink/20 px-6 font-semibold hover:border-ink">
            Ballina
          </Link>
        </div>
        {error.digest && <p className="mt-6 text-sm text-muted">Kodi i gabimit: {error.digest}</p>}
      </div>
    </section>
  );
}
