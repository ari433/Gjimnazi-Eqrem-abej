import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/admin/AuthForms";

export const metadata: Metadata = { title: "Vendos fjalëkalimin" };

export default function SetPasswordPage() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-[-0.03em]">Vendos fjalëkalimin</h1>
      <p className="mb-8 mt-2 text-muted">Zgjidhni një fjalëkalim me të paktën 10 shenja.</p>
      <NewPasswordForm />
    </>
  );
}
