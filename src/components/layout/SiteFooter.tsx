import Link from "next/link";
import { MapPin } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { NAV } from "@/lib/navigation";
import { getSiteContent } from "@/lib/content/queries";
import { PendingBadge } from "@/components/ui/Pending";

export async function SiteFooter() {
  const site = await getSiteContent();
  const socials = site.socials.filter((s) => s.verified);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.map_query)}`;

  return (
    <footer className="grain relative overflow-hidden bg-ink text-white">
      <div className="shell relative pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-2xl font-semibold leading-tight tracking-[-0.02em]">
              Gjimnazi i shkencave shoqërore-gjuhësore në Prishtinë.
            </p>
            <address className="mt-6 not-italic text-white/70">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-start gap-2 hover:text-white"
              >
                <MapPin aria-hidden className="mt-1 size-4 shrink-0" />
                <span>
                  {site.contact.address}
                  <br />
                  {site.contact.city}
                </span>
              </a>
              <div className="mt-4 space-y-1">
                {site.contact.phone ? (
                  <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="link-underline block hover:text-white">
                    {site.contact.phone}
                  </a>
                ) : null}
                {site.contact.email ? (
                  <a href={`mailto:${site.contact.email}`} className="link-underline block hover:text-white">
                    {site.contact.email}
                  </a>
                ) : null}
                {!site.contact.phone && !site.contact.email && (
                  <PendingBadge label="Telefoni dhe emaili në pritje" className="bg-white/10 text-white/80" />
                )}
              </div>
            </address>
            {socials.length > 0 && (
              <ul className="mt-8 flex gap-2" aria-label="Rrjetet sociale">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-white/20 px-4 text-sm font-semibold transition-colors hover:border-white hover:bg-white hover:text-ink"
                    >
                      <SocialIcon label={s.label} />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Navigimi në fund të faqes" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            {NAV.map((group) => (
              <div key={group.label}>
                <p className="text-sm text-white/50">{group.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-underline text-white/85 hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-20 select-none whitespace-nowrap text-[clamp(3.5rem,15.6vw,15rem)] font-bold leading-[0.78] tracking-[-0.06em] text-white/[0.08]"
        >
          Eqrem Çabej
        </p>

        <div className="flex flex-col gap-3 border-t border-white/10 py-7 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© Gjimnazi &ldquo;Eqrem Çabej&rdquo;, Prishtinë</p>
          <div className="flex gap-5">
            <Link href="/dokumentet" className="link-underline hover:text-white">
              Dokumentet
            </Link>
            <Link href="/admin" className="link-underline hover:text-white">
              Hyrja për stafin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
