import type { Metadata } from "next";
import Image from "next/image";
import { Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PendingBadge, PendingBlock, SourceNote } from "@/components/ui/Pending";
import { getStaff } from "@/lib/content/queries";
import type { StaffMember } from "@/lib/types";

export const metadata: Metadata = {
  title: "Udhëheqja dhe stafi",
  description: "Drejtoria dhe stafi mësimor i Gjimnazit \"Eqrem Çabej\" në Prishtinë.",
  alternates: { canonical: "/udheheqja-dhe-stafi" },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function Person({ p, large = false }: { p: StaffMember; large?: boolean }) {
  return (
    <article className="flex h-full flex-col rounded-card bg-white p-3">
      <div className={`relative overflow-hidden rounded-[0.9rem] bg-blue-soft ${large ? "aspect-[4/5]" : "aspect-square"}`}>
        {p.photo_url ? (
          <Image src={p.photo_url} alt={`Foto e ${p.full_name}`} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
        ) : (
          <span aria-hidden className="absolute inset-0 grid place-items-center text-[clamp(3rem,7vw,6rem)] font-bold tracking-[-0.05em] text-blue">
            {initials(p.full_name)}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-blue-deep">{p.role_title}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em]">{p.full_name}</h3>
        {p.department && !p.is_leadership && <p className="text-muted">{p.department}</p>}
        {p.bio && <p className="mt-3 text-muted">{p.bio}</p>}
        {p.email && (
          <a href={`mailto:${p.email}`} className="link-underline mt-3 inline-block text-sm font-semibold">
            {p.email}
          </a>
        )}
        {p.verification === "pending" && <PendingBadge className="mt-3" />}
        {p.source_note && <SourceNote className="mt-3">{p.source_note}</SourceNote>}
      </div>
    </article>
  );
}

export default async function StaffPage() {
  const staff = await getStaff();
  const leaders = staff.filter((s) => s.is_leadership);
  const teachers = staff.filter((s) => !s.is_leadership);
  const departments = Array.from(new Set(teachers.map((t) => t.department ?? "Të tjerë")));

  return (
    <>
      <PageHero
        title="Udhëheqja dhe stafi"
        crumbs={[{ label: "Rreth shkollës", href: "/rreth-shkolles" }, { label: "Udhëheqja dhe stafi" }]}
        lede="Njerëzit që e drejtojnë dhe e mbajnë gjallë shkollën çdo ditë."
      />

      <section aria-labelledby="leadership" className="bg-paper pb-24">
        <div className="shell">
          <h2 id="leadership" className="text-title font-bold">
            Udhëheqja
          </h2>
          {leaders.length === 0 ? (
            <EmptyState icon={Users} title="Udhëheqja do të publikohet së shpejti" className="mt-10" />
          ) : (
            <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((p) => (
                <RevealItem key={p.id}>
                  <Person p={p} large />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      <section aria-labelledby="teachers" className="bg-white py-24">
        <div className="shell">
          <h2 id="teachers" className="text-title font-bold">
            Stafi mësimor
          </h2>
          {teachers.length === 0 ? (
            <PendingBlock title="Lista e stafit mësimor është në përgatitje" className="mt-10">
              Emrat dhe lëndët e mësimdhënësve publikohen vetëm pasi të konfirmohen nga drejtoria dhe me pëlqimin e tyre.
            </PendingBlock>
          ) : (
            departments.map((d) => (
              <div key={d} className="mt-12">
                <h3 className="text-xl font-semibold text-muted">{d}</h3>
                <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {teachers
                    .filter((t) => (t.department ?? "Të tjerë") === d)
                    .map((p) => (
                      <RevealItem key={p.id}>
                        <Person p={p} />
                      </RevealItem>
                    ))}
                </RevealGroup>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
