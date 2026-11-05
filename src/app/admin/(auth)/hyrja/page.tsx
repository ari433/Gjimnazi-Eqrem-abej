import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/AuthForms";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Hyrja" };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-[-0.03em]">Hyrja për stafin</h1>
      <p className="mb-8 mt-2 text-muted">Përdorni llogarinë që ju ka krijuar administratori i faqes.</p>
      <Suspense>
        <LoginForm configured={isSupabaseConfigured()} />
      </Suspense>
    </>
  );
}
