import { SiteShell } from "@/components/layout/SiteShell";

export default function GermanLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="de">{children}</SiteShell>;
}
