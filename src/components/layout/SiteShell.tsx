import { Suspense } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { HeaderFallback } from "./HeaderFallback";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getSiteContent } from "@/lib/content/queries";
import { lp, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/utils";

async function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const site = await getSiteContent(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "HighSchool",
    name: "Gjimnazi \"Eqrem Çabej\"",
    alternateName: "Gymnasium \"Eqrem Çabej\"",
    url: `${SITE_URL}${lp(locale, "/")}`,
    logo: `${SITE_URL}/logo.png`,
    address: { "@type": "PostalAddress", streetAddress: site.contact.address, addressLocality: "Prishtinë", addressCountry: "XK" },
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    sameAs: site.socials.filter((s) => s.verified).map((s) => s.href),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Header, main landmark and footer shared by the Albanian and German sites. */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <div lang={locale}>
      <SmoothScroll />
      <Suspense fallback={<HeaderFallback locale={locale} />}>
        <SiteHeader locale={locale} />
      </Suspense>
      <main id="permbajtja" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} />
      <OrganizationJsonLd locale={locale} />
    </div>
  );
}
