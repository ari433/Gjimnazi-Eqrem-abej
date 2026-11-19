import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { PendingBadge } from "@/components/ui/Pending";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getSiteContent } from "@/lib/content/queries";
import { t, type Locale } from "@/lib/i18n";

export async function ContactView({ locale }: { locale: Locale }) {
  const T = t(locale);
  const C = T.contact_;
  const site = await getSiteContent(locale);
  const c = site.contact;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map_query)}`;
  const rows = [
    { icon: MapPin, label: C.address, value: `${c.address}, ${c.city}`, href: mapsHref },
    { icon: Phone, label: C.phone, value: c.phone, href: c.phone ? `tel:${c.phone.replace(/\s/g, "")}` : null },
    { icon: Mail, label: C.email, value: c.email, href: c.email ? `mailto:${c.email}` : null },
    { icon: Clock, label: C.hours, value: c.hours, href: null },
  ];
  const preview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

  return (
    <>
      <PageHero locale={locale} title={T.pages.contact[0]} crumbs={[{ label: T.pages.contact[0] }]} lede={C.lede} />
      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <dl className="divide-y divide-line rounded-card bg-white px-6 md:px-8">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-4 py-5">
                  <r.icon aria-hidden className="mt-1 size-5 shrink-0 text-blue" />
                  <div className="min-w-0">
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
                        <PendingBadge label={C.pendingConfirm} />
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            {site.socials.some((s) => s.verified) && (
              <ul className="mt-5 flex flex-wrap gap-2">
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
            <div className="mt-5 overflow-hidden rounded-card bg-line">
              <iframe
                title={C.mapTitle}
                src={`https://www.google.com/maps?q=${encodeURIComponent(c.map_query)}&output=embed&hl=${locale}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[4/3] w-full border-0"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="mb-5 text-title font-bold">{C.send}</h2>
            {preview ? (
              <div className="rounded-card bg-white p-7 md:p-10">
                <p className="text-xl font-semibold tracking-[-0.02em]">{C.previewNote}</p>
                <p className="mt-2 text-muted">{C.previewBody}</p>
              </div>
            ) : (
              <ContactForm locale={locale} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
