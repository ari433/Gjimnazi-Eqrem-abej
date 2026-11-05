import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/utils";

/** Static header used while the interactive one (which reads the URL) streams in. */
export function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl">
      <div className="shell flex h-[4.5rem] items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Gjimnazi Eqrem Çabej, ballina">
          <Image src={asset("/logo.png")} alt="" width={44} height={44} className="size-10 rounded-full md:size-11" />
          <span className="leading-[1.05]">
            <span className="block text-[0.98rem] font-bold tracking-[-0.02em]">Gjimnazi &ldquo;Eqrem Çabej&rdquo;</span>
            <span className="block text-[0.8rem] text-muted">Prishtinë</span>
          </span>
        </Link>
        <Link href="/kontakti" className="inline-flex min-h-11 items-center rounded-pill bg-ink px-5 text-[0.95rem] font-semibold text-white">
          Kontakti
        </Link>
      </div>
    </header>
  );
}
