import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { PendingBadge } from "@/components/ui/Pending";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSiteContent } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Kontakti",
  description: "Adresa dhe kontaktet e Gjimnazit \"Eqrem Çabej\" në Prishtinë. Na dërgoni një mesazh.",
  alternates: { canonical: "/kontakti" },
};

export default async function ContactPage() {
  const site = await getSiteContent();
  const c = site.contact;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map_query)}`;
  const rows = [
    { icon: MapPin, label: "Adresa", value: `${c.address}, ${c.city}`, href: mapsHref },
    { icon: Phone, label: "Telefoni", value: c.phone, href: c.phone ? `tel:${c.phone.replace(/\s/g, "")}` : null },
    { icon: Mail, label: "Emaili", value: c.email, href: c.email ? `mailto:${c.email}` : null },
    { icon: Clock, label: "Orari i administratës", value: c.hours, href: null },
  ];

  return (
    <>
      <PageHero title="Kontakti" crumbs={[{ label: "Kontakti" }]} lede="Pyetje për regjistrimin, dokumentet apo aktivitetet? Shkruani administratës." />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <dl className="divide-y divide-line rounded-card bg-white px-8">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-4 py-6">
                  <r.icon aria-hidden className="mt-1 size-5 shrink-0 text-blue" />
                  <div>
                    <dt className="text-sm text-muted">{r.label}</dt>
                    <dd className="mt-0.5 text-lg font-semibold">
                      {r.value ? (
                        r.href ? (
                          <a href={r.href} className="link-underline" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                            {r.value}
                          </a>
                        ) : (
                          r.value
                        )
                      ) : (
                        <PendingBadge label="Në pritje të konfirmimit" />
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            {site.socials.some((s) => s.verified) && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {site.socials
                  .filter((s) => s.verified)
                  .map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line bg-white px-4 font-semibold transition-colors hover:border-ink">
                        <SocialIcon label={s.label} />
                        {s.label}
                      </a>
                    </li>
                  ))}
              </ul>
            )}
            <div className="mt-6 overflow-hidden rounded-card bg-line">
              <iframe
                title="Harta: Gjimnazi Eqrem Çabej"
                src={`https://www.google.com/maps?q=${encodeURIComponent(c.map_query)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] w-full border-0 grayscale-[0.4]"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="mb-6 text-title font-bold">Dërgo një mesazh</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
