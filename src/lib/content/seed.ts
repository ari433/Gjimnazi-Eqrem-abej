/**
 * Local fallback content.
 *
 * Used when Supabase is not configured, and mirrored by supabase/seed.sql.
 * Rules followed here:
 *  - "verified" content comes from a public source named in `source_note`
 *    (mainly the school's own Development Plan 2021–2024, published by the
 *    Municipality of Prishtina) or from the school's previous website.
 *  - Anything not confirmed is marked "pending" and shown as such in the UI.
 *  - `is_example: true` items are demo entries that describe the website itself.
 *    They are never presented as school news; the UI labels them "Shembull".
 */
import type {
  Achievement,
  Announcement,
  Club,
  ClubMember,
  MediaItem,
  NewsArticle,
  Program,
  SchoolDocument,
  SchoolEvent,
  SiteContent,
  StaffMember,
  Stat,
  StudentProject,
  Subject,
} from "@/lib/types";

export const PZHSH_SOURCE = "Plani Zhvillimor i Shkollës 2021–2024";
export const PZHSH_URL = "https://prishtinaonline.com/uploads/pzhsh_eqrem_cabej_2021-2024.pdf";

const P = "published" as const;

export const siteContent: SiteContent = {
  hero: {
    title: "Ku gjuha hap botën.",
    lede:
      "Gjimnazi i shkencave shoqërore-gjuhësore në Prishtinë, që mban emrin e gjuhëtarit Eqrem Çabej. Gjuhët, mendimi kritik dhe shoqëria janë në qendër të çdo dite mësimi.",
    image_url: null,
    image_alt: null,
    primary_cta: { label: "Njihu me programin", href: "/programet" },
    secondary_cta: { label: "Na kontakto", href: "/kontakti" },
  },
  intro: {
    heading: "Një shkollë e ndërtuar rreth gjuhës.",
    body:
      "Që nga viti 1990, Gjimnazi \"Eqrem Çabej\" është profilizuar në gjuhë. Nga viti shkollor 2021–2022, me vendim të Ministrisë së Arsimit, shkolla funksionon si gjimnaz i shkencave shoqërore-gjuhësore. Ndërtesa e sotme në rrugën \"Remzi Salihu\" është shtëpia e shkollës që nga viti shkollor 2012–2013.",
    vision:
      "Shkolla synon që brenda dhjetë vjetësh të bëhet shkollë elitare dhe gjithëpërfshirëse.",
    mission: "Të kontribuojë në zhvillimin maksimal të secilit nxënës.",
    source: PZHSH_SOURCE,
  },
  history: [
    {
      period: "Fillimet",
      title: "Në objektin e Shkollës Normale",
      text: "Shkolla e nisi punën në ambientet e ish-Shkollës Normale në Prishtinë.",
    },
    {
      period: "Më pas",
      title: "Gjimnaz matematikor, pastaj kulturologjik",
      text: "Përgjatë viteve, shkolla ndryshoi profil: fillimisht si gjimnaz matematikor dhe më pas si gjimnaz kulturologjik.",
    },
    {
      period: "1990",
      title: "Gjimnaz filologjik",
      text: "Shkolla profilizohet në gjuhë dhe bëhet gjimnaz filologjik.",
    },
    {
      period: "2012–2013",
      title: "Ndërtesa e re",
      text: "Mësimi zhvendoset në ndërtesën e tanishme, në rrugën \"Remzi Salihu\" nr. 61.",
    },
    {
      period: "2021–2022",
      title: "Shkencat shoqërore-gjuhësore",
      text: "Me vendim të MASHTI-t (nr. 2-854), shkolla profilizohet si gjimnaz i shkencave shoqërore-gjuhësore.",
    },
  ],
  enrollment: {
    heading: "Regjistrimi në klasën e dhjetë",
    body:
      "Kushtet, afatet dhe konkursi i regjistrimit publikohen nga shkolla dhe Drejtoria Komunale e Arsimit. Sapo të konfirmohen për vitin e ri shkollor, do t'i gjeni këtu.",
    cta_label: "Pyet për regjistrimin",
    cta_href: "/kontakti",
    verification: "pending",
  },
  contact: {
    address: "Rr. \"Remzi Salihu\" nr. 61",
    city: "Prishtinë, Kosovë",
    phone: null,
    email: null,
    hours: null,
    map_query: "Gjimnazi Eqrem Çabej, Rruga Remzi Salihu 61, Prishtinë",
  },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/gjimnazi.eqremcabej/", verified: true },
  ],
  student_info: {
    heading: "Gjithçka që të duhet si nxënës",
    items: [
      {
        title: "Këshilli i Nxënësve",
        body: "Nxënësit përfaqësohen përmes Këshillit të Nxënësve, pjesë e strukturës organizative të shkollës.",
        verification: "verified",
      },
      {
        title: "Biblioteka",
        body: "Shkolla ka bibliotekë me bibliotekist/e. Orari i hapjes do të publikohet këtu.",
        verification: "verified",
      },
      {
        title: "Kabinetet",
        body: "Shkolla ka kabinet të gjuhëve, kabinete të biologjisë dhe fizikës, kabinet të artit muzikor dhe kabinet të TIK-ut.",
        verification: "verified",
      },
      {
        title: "Orari i mësimit",
        body: "Orari i ndërrimeve dhe i orëve mësimore do të publikohet nga administrata e shkollës.",
        verification: "pending",
      },
      {
        title: "Kalendari akademik",
        body: "Afatet e semestrave, pushimeve dhe provimeve do të shtohen sapo të konfirmohen.",
        verification: "pending",
      },
      {
        title: "Matura shtetërore",
        body: "Informatat për përgatitjen dhe afatet e Maturës do të publikohen në seksionin e njoftimeve.",
        verification: "pending",
      },
    ],
  },
};

export const stats: Stat[] = [
  {
    id: "stat-students",
    label: "nxënës",
    value: 696,
    suffix: null,
    source: PZHSH_SOURCE,
    year: "2021",
    sort_order: 1,
    verification: "verified",
  },
  {
    id: "stat-teachers",
    label: "mësimdhënës të rregullt",
    value: 36,
    suffix: null,
    source: PZHSH_SOURCE,
    year: "2021",
    sort_order: 2,
    verification: "verified",
  },
  {
    id: "stat-matura",
    label: "e nxënësve kaluan Maturën shtetërore",
    value: 92,
    suffix: "%",
    source: PZHSH_SOURCE,
    year: "2021",
    sort_order: 3,
    verification: "verified",
  },
];

export const programs: Program[] = [
  {
    id: "prog-shoqeror-gjuhesor",
    slug: "shkencat-shoqerore-gjuhesore",
    name: "Gjimnazi i shkencave shoqërore-gjuhësore",
    short_name: "Shoqëror-gjuhësor",
    tagline: "Gjuhët, shoqëria dhe mendimi kritik.",
    summary:
      "Profili i shkollës që nga viti shkollor 2021–2022, me gjuhët dhe shkencat shoqërore në qendër të planit mësimor.",
    overview:
      "Me vendim të MASHTI-t (nr. 2-854), Gjimnazi \"Eqrem Çabej\" funksionon si gjimnaz i shkencave shoqërore-gjuhësore. Programi ndërtohet mbi traditën e shkollës si gjimnaz filologjik që nga viti 1990. Mësimdhënia përfshin gjuhë shqipe, gjuhë të huaja dhe latinisht, krahas shkencave shoqërore, historisë, psikologjisë, matematikës, shkencave natyrore, arteve, edukatës fizike dhe TIK-ut.",
    outcomes: [],
    pathways: [],
    grades: "Klasat X–XII",
    cover_url: null,
    sort_order: 1,
    verification: "verified",
    source_note: PZHSH_SOURCE,
    status: P,
    published_at: "2025-09-01T08:00:00Z",
  },
  {
    id: "prog-gjermanisht",
    slug: "gjuha-gjermane",
    name: "Programi i gjuhës gjermane",
    short_name: "Gjuha gjermane",
    tagline: "Gjermanishtja si gjuhë e dytë e huaj.",
    summary:
      "Gjermanishtja mësohet nga mësimdhënës të specializuar në shkollë. Detajet e programit, certifikimet dhe bashkëpunimet do të publikohen pasi të konfirmohen.",
    overview:
      "Faqja e mëparshme e shkollës e paraqiste gjuhën gjermane si program të veçantë, të zhvilluar në bashkëpunim me partnerë nga Gjermania. Këto informata, përfshirë certifikimet dhe shkëmbimet, janë në pritje të konfirmimit nga administrata e shkollës para se të publikohen si fakte.",
    outcomes: [],
    pathways: [],
    grades: "Klasat X–XII",
    cover_url: null,
    sort_order: 2,
    verification: "pending",
    source_note: "Faqja e mëparshme e shkollës; e pakonfirmuar",
    status: P,
    published_at: "2025-09-01T08:00:00Z",
  },
];

const subjectNames = [
  "Gjuhë shqipe",
  "Gjuhë angleze",
  "Gjuhë gjermane",
  "Gjuhë latine",
  "Matematikë",
  "Histori",
  "Psikologji",
  "Shkenca shoqërore",
  "Shkenca natyrore",
  "Arte",
  "Edukatë fizike",
  "TIK",
];

export const subjects: Subject[] = [
  ...subjectNames.map((name, i) => ({
    id: `subj-${i + 1}`,
    program_id: "prog-shoqeror-gjuhesor",
    name,
    grade: null,
    hours_per_week: null,
    description: null,
    sort_order: i + 1,
    verification: "verified" as const,
  })),
  {
    id: "subj-de-1",
    program_id: "prog-gjermanisht",
    name: "Gjuhë gjermane",
    grade: null,
    hours_per_week: null,
    description: null,
    sort_order: 1,
    verification: "verified",
  },
];

export const staff: StaffMember[] = [
  {
    id: "staff-director",
    full_name: "Shemsedin Beqiri",
    role_title: "Drejtor",
    department: "Udhëheqja",
    bio: null,
    photo_url: null,
    email: null,
    is_leadership: true,
    sort_order: 1,
    verification: "verified",
    source_note: `${PZHSH_SOURCE}; faqja e mëparshme e shkollës`,
    status: P,
    published_at: "2025-09-01T08:00:00Z",
  },
];

export const clubs: Club[] = [
  {
    id: "club-media",
    slug: "klubi-i-medias",
    name: "Klubi i Medias",
    summary: "Video, podkaste dhe gazetari nga nxënësit, për nxënësit.",
    description:
      "Klubi i Medias është hapësira ku nxënësit mësojnë të tregojnë histori: filmojnë, montojnë, intervistojnë dhe publikojnë. Përbërja e ekipit, takimet dhe produksionet do të publikohen nga mentorët e klubit.",
    meeting_info: null,
    cover_url: null,
    is_media_club: true,
    sort_order: 1,
    verification: "pending",
    status: P,
    published_at: "2025-09-01T08:00:00Z",
  },
];

export const clubMembers: ClubMember[] = [];

export const news: NewsArticle[] = [
  {
    id: "news-ex-1",
    slug: "faqja-e-re-e-shkolles",
    title: "Faqja e re e shkollës po merr formë",
    excerpt:
      "Kjo faqe do të jetë vendi zyrtar për lajmet, njoftimet, kalendarin dhe dokumentet e Gjimnazit \"Eqrem Çabej\".",
    body:
      "Kjo faqe është ndërtuar që informacioni i shkollës të jetë i saktë dhe i lehtë për t'u gjetur.\n\n## Çfarë do të gjeni këtu\n\n- Lajme dhe njoftime nga administrata\n- Kalendarin e aktiviteteve\n- Programet mësimore\n- Dokumente për nxënës dhe prindër\n\n## Pse disa informata shënohen \"në pritje\"\n\nNë faqe publikohet vetëm ajo që është konfirmuar. Çdo e dhënë që ende nuk është verifikuar nga shkolla shënohet qartë si e tillë.",
    category: "Faqja",
    cover_url: null,
    cover_alt: null,
    featured: true,
    author_name: null,
    status: P,
    published_at: "2026-11-01T09:00:00Z",
    is_example: true,
  },
  {
    id: "news-ex-2",
    slug: "si-publikohen-lajmet",
    title: "Si publikohen lajmet nga stafi",
    excerpt:
      "Stafi i autorizuar shkruan, ruan si draft dhe planifikon publikimin e lajmeve nga paneli i administrimit.",
    body:
      "Lajmet krijohen nga paneli i administrimit. Kontribuesit mund të shkruajnë drafte, ndërsa redaktorët i rishikojnë dhe i publikojnë.\n\nÇdo lajm mund të ruhet si draft ose të planifikohet për një datë dhe orë të caktuar.",
    category: "Faqja",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    status: P,
    published_at: "2026-10-28T09:00:00Z",
    is_example: true,
  },
  {
    id: "news-ex-3",
    slug: "kalendari-dhe-njoftimet",
    title: "Kalendari dhe njoftimet në një vend",
    excerpt: "Aktivitetet e shkollës dhe njoftimet e rëndësishme do të përditësohen rregullisht.",
    body:
      "Kalendari i aktiviteteve dhe njoftimet janë ndarë qëllimisht: kalendari tregon çfarë po vjen, njoftimet tregojnë çfarë duhet ditur menjëherë.",
    category: "Faqja",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    status: P,
    published_at: "2026-10-20T09:00:00Z",
    is_example: true,
  },
];

export const announcements: Announcement[] = [
  {
    id: "ann-ex-1",
    title: "Kontaktet zyrtare po përditësohen",
    body: "Numri i telefonit dhe adresa elektronike e shkollës do të publikohen sapo të konfirmohen. Deri atëherë, na shkruani përmes formularit të kontaktit.",
    audience: "Të gjithë",
    priority: "normal",
    expires_at: null,
    status: P,
    published_at: "2026-11-01T09:00:00Z",
    is_example: true,
  },
];

export const events: SchoolEvent[] = [
  {
    id: "evt-ex-1",
    slug: "dita-e-dyerve-te-hapura",
    title: "Dita e dyerve të hapura",
    description:
      "Aktivitet i përmendur në planin zhvillimor të shkollës. Data dhe programi do të konfirmohen nga administrata.",
    location: "Gjimnazi \"Eqrem Çabej\"",
    starts_at: "2027-03-12T10:00:00Z",
    ends_at: null,
    all_day: true,
    category: "Shkolla",
    cover_url: null,
    verification: "pending",
    status: P,
    published_at: "2026-11-01T09:00:00Z",
    is_example: true,
  },
  {
    id: "evt-ex-2",
    slug: "panairi-i-karrieres",
    title: "Panairi i karrierës",
    description:
      "Aktivitet i përmendur në planin zhvillimor të shkollës. Data dhe pjesëmarrësit do të konfirmohen.",
    location: "Gjimnazi \"Eqrem Çabej\"",
    starts_at: "2027-04-16T10:00:00Z",
    ends_at: null,
    all_day: true,
    category: "Karriera",
    cover_url: null,
    verification: "pending",
    status: P,
    published_at: "2026-11-01T09:00:00Z",
    is_example: true,
  },
  {
    id: "evt-ex-3",
    slug: "dita-e-projekteve",
    title: "Dita e projekteve",
    description:
      "Nxënësit prezantojnë projektet e tyre. Aktivitet i përmendur në planin zhvillimor; data në pritje të konfirmimit.",
    location: "Gjimnazi \"Eqrem Çabej\"",
    starts_at: "2027-05-21T09:00:00Z",
    ends_at: null,
    all_day: true,
    category: "Projekte",
    cover_url: null,
    verification: "pending",
    status: P,
    published_at: "2026-11-01T09:00:00Z",
    is_example: true,
  },
];

export const projects: StudentProject[] = [];
export const achievements: Achievement[] = [];

export const media: MediaItem[] = [
  {
    id: "media-archive-1",
    kind: "image",
    title: "Nga arkivi",
    caption: "Foto nga faqja e mëparshme e shkollës.",
    url: "/arkiv-aktivitet-1.jpg",
    thumbnail_url: null,
    album: "Arkivi",
    club_id: null,
    width: 206,
    height: 206,
    taken_at: null,
    status: P,
    published_at: "2025-10-06T00:00:00Z",
  },
  {
    id: "media-archive-2",
    kind: "image",
    title: "Nga arkivi",
    caption: "Foto nga faqja e mëparshme e shkollës.",
    url: "/arkiv-aktivitet-2.jpg",
    thumbnail_url: null,
    album: "Arkivi",
    club_id: null,
    width: 206,
    height: 206,
    taken_at: null,
    status: P,
    published_at: "2025-10-06T00:00:00Z",
  },
];

export const documents: SchoolDocument[] = [
  {
    id: "doc-pzhsh",
    title: PZHSH_SOURCE,
    description:
      "Plani zhvillimor i Gjimnazit \"Eqrem Çabej\", i publikuar nga Komuna e Prishtinës.",
    category: "Planifikimi",
    file_url: PZHSH_URL,
    file_size: null,
    file_type: "PDF",
    status: P,
    published_at: "2021-09-01T00:00:00Z",
  },
];
