import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-paper px-6">
      <div className="max-w-2xl">
        <p aria-hidden className="text-[clamp(7rem,24vw,16rem)] font-bold leading-[0.8] tracking-[-0.07em] text-blue">
          404
        </p>
        <h1 className="mt-8 text-title font-bold">Kjo faqe nuk ekziston.</h1>
        <p className="mt-4 text-lede text-muted">Mund të jetë zhvendosur ose adresa është shkruar gabim.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-pill bg-ink px-6 font-semibold text-white hover:bg-blue">
            Kthehu në ballinë
          </Link>
          <Link href="/lajme" className="inline-flex min-h-12 items-center rounded-pill border border-ink/20 px-6 font-semibold hover:border-ink">
            Shiko lajmet
          </Link>
        </div>
      </div>
    </main>
  );
}
