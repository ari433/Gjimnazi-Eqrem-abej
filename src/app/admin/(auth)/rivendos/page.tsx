import type { Metadata } from "next";
import { ResetRequestForm } from "@/components/admin/AuthForms";

export const metadata: Metadata = { title: "Rivendos fjalëkalimin" };

export default function ResetPage() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-[-0.03em]">Fjalëkalim i ri</h1>
      <p className="mb-8 mt-2 text-muted">Shkruani emailin. Do t&apos;ju dërgojmë një lidhje për të vendosur fjalëkalim të ri.</p>
      <ResetRequestForm />
    </>
  );
}
