import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeaderFallback } from "@/components/layout/HeaderFallback";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getSiteContent } from "@/lib/content/queries";
import { SITE_URL } from "@/lib/utils";

async function OrganizationJsonLd() {
  const site = await getSiteContent();
  const data = {
    "@context": "https://schema.org",
    "@type": "HighSchool",
    name: "Gjimnazi \"Eqrem Çabej\"",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressLocality: "Prishtinë",
      addressCountry: "XK",
    },
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    sameAs: site.socials.filter((s) => s.verified).map((s) => s.href),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <main id="permbajtja" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <OrganizationJsonLd />
    </>
  );
}
