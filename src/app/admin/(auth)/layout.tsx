import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/utils";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="grain relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="relative flex items-center gap-3">
          <Image src={asset("/logo.png")} alt="" width={44} height={44} className="rounded-full" />
          <span className="font-bold">Gjimnazi &ldquo;Eqrem Çabej&rdquo;</span>
        </Link>
        <p aria-hidden className="relative select-none text-[clamp(14rem,30vw,30rem)] font-bold leading-[0.8] tracking-[-0.06em] text-blue">
          Ç
        </p>
        <p className="relative max-w-sm text-white/60">Paneli i stafit për lajme, njoftime, kalendarin dhe përmbajtjen e faqes.</p>
      </div>
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
