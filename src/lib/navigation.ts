export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; links: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: "Shkolla",
    links: [
      { label: "Rreth shkollës", href: "/rreth-shkolles", description: "Kush jemi dhe si punojmë" },
      { label: "Historia dhe misioni", href: "/historia-dhe-misioni", description: "Nga Shkolla Normale deri sot" },
      { label: "Udhëheqja dhe stafi", href: "/udheheqja-dhe-stafi", description: "Drejtoria dhe mësimdhënësit" },
      { label: "Arritjet", href: "/arritjet", description: "Çmime dhe suksese të nxënësve" },
    ],
  },
  {
    label: "Mësimi",
    links: [
      { label: "Programet", href: "/programet", description: "Profili dhe lëndët mësimore" },
      { label: "Për nxënësit", href: "/per-nxenesit", description: "Orari, kalendari, Matura" },
      { label: "Dokumentet", href: "/dokumentet", description: "Plane, rregullore, formularë" },
    ],
  },
  {
    label: "Jeta shkollore",
    links: [
      { label: "Klubet", href: "/klubet", description: "Ku nxënësit takohen jashtë orës" },
      { label: "Klubi i Medias", href: "/klubi-i-medias", description: "Video, podkaste, gazetari" },
      { label: "Projektet e nxënësve", href: "/projektet", description: "Puna që nxënësit krijojnë" },
      { label: "Galeria", href: "/galeria", description: "Foto dhe video" },
    ],
  },
  {
    label: "Lajme",
    links: [
      { label: "Lajmet", href: "/lajme", description: "Çfarë po ndodh në shkollë" },
      { label: "Njoftimet", href: "/njoftimet", description: "Informata që duhen ditur sot" },
      { label: "Kalendari", href: "/kalendari", description: "Aktivitetet që vijnë" },
    ],
  },
];

export const ALL_PUBLIC_ROUTES = [
  "/",
  ...NAV.flatMap((g) => g.links.map((l) => l.href)),
  "/kontakti",
];
