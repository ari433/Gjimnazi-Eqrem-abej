/**
 * Local fallback content, mirrored by supabase/seed.sql (npm run db:seed).
 *
 * Sources:
 *  - PZHSH: the school's Development Plan 2021–2024 (Municipality of Prishtina).
 *  - SCHOOL: the school's own public announcements, supplied by the school's
 *    web team. Articles below are condensed from them; names are as published
 *    by the school.
 * Unknown publication dates are not shown (`show_date: false`); the
 * `published_at` value then only orders the articles.
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
export const PZHSH_SOURCE_DE = "Schulentwicklungsplan 2021–2024";
export const PZHSH_URL = "https://prishtinaonline.com/uploads/pzhsh_eqrem_cabej_2021-2024.pdf";
export const ZFA_URL =
  "https://www.auslandsschulwesen.de/zfa-de/die-zfa/aktuelle-meldungen/medienkompetenz-hautnah-schuelerinnen-und-schueler-vom-2783932";
export const DIRECTOR_INTERVIEW_URL = "https://youtu.be/ce6JNTZt5es";

const P = "published" as const;
const M = (name: string) => `/media/${name}.webp`;

/* ===================================================================== site */

export const siteContent: SiteContent = {
  hero: {
    title: "Ku gjuha hap botën.",
    lede: "Gjimnaz i shkencave shoqërore-gjuhësore në Prishtinë, me emrin e gjuhëtarit Eqrem Çabej.",
    image_url: M("diplomimi-germia"),
    image_alt: "Maturantët hedhin kapelet në ceremoninë e diplomimit.",
    primary_cta: { label: "Njihu me programet", href: "/programet" },
    secondary_cta: { label: "Lajmet", href: "/lajme" },
  },
  intro: {
    heading: "Një shkollë e ndërtuar rreth gjuhës.",
    body: "Që nga viti 1990 shkolla është profilizuar në gjuhë. Sot është gjimnaz i shkencave shoqërore-gjuhësore dhe pjesë e Programit të Diplomës Gjermane që nga viti 2002–2003.",
    vision: "Të bëhet shkollë elitare dhe gjithëpërfshirëse.",
    mission: "Të kontribuojë në zhvillimin maksimal të secilit nxënës.",
    source: PZHSH_SOURCE,
  },
  history: [
    { period: "Fillimet", title: "Në objektin e Shkollës Normale", text: "Shkolla e nisi punën në ambientet e ish-Shkollës Normale në Prishtinë." },
    { period: "Më pas", title: "Matematikor, pastaj kulturologjik", text: "Shkolla ndryshoi profil: fillimisht gjimnaz matematikor, më pas kulturologjik." },
    { period: "1990", title: "Gjimnaz filologjik", text: "Shkolla profilizohet në gjuhë." },
    { period: "2002–2003", title: "Diploma Gjermane", text: "Fillon puna në Programin e Diplomës Gjermane (DSD)." },
    { period: "2012–2013", title: "Ndërtesa e re", text: "Mësimi zhvendoset në rrugën \"Remzi Salihu\" nr. 61." },
    { period: "2021–2022", title: "Shoqëror-gjuhësor", text: "Me vendim të MASHTI-t (nr. 2-854), gjimnaz i shkencave shoqërore-gjuhësore." },
  ],
  enrollment: {
    heading: "Regjistrimi në klasën e dhjetë",
    body: "Kushtet dhe afatet publikohen nga shkolla dhe Drejtoria Komunale e Arsimit. Do t'i gjeni këtu sapo të konfirmohen.",
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
  socials: [{ label: "Instagram", href: "https://www.instagram.com/gjimnazi.eqremcabej/", verified: true }],
  student_info: {
    heading: "Gjithçka që të duhet si nxënës.",
    items: [
      { title: "Këshilli i Nxënësve", body: "Kryetare për vitin 2026–2027 është Ana Arifi (XII/1).", verification: "verified" },
      { title: "Diploma Gjermane", body: "Programi DSD përfshin nxënësit e çdo gjenerate.", verification: "verified" },
      { title: "Biblioteka", body: "Orari i hapjes publikohet këtu.", verification: "verified" },
      { title: "Orari i mësimit", body: "Publikohet nga administrata.", verification: "pending" },
      { title: "Kalendari akademik", body: "Semestrat dhe pushimet shtohen pasi të konfirmohen.", verification: "pending" },
      { title: "Matura shtetërore", body: "Afatet publikohen te njoftimet.", verification: "pending" },
    ],
  },
};

/** German site content. Same shape; links are made locale-aware by the UI. */
export const siteContentDe: SiteContent = {
  ...siteContent,
  hero: {
    ...siteContent.hero,
    title: "Wo Sprache Welten öffnet.",
    lede: "Gymnasium für Sozial- und Sprachwissenschaften in Prishtina, benannt nach dem Sprachwissenschaftler Eqrem Çabej.",
    image_alt: "Abiturientinnen und Abiturienten werfen bei der Abschlussfeier ihre Hüte.",
    primary_cta: { label: "Bildungsgänge", href: "/programet" },
    secondary_cta: { label: "Aktuelles", href: "/lajme" },
  },
  intro: {
    heading: "Eine Schule, die auf Sprache baut.",
    body: "Seit 1990 hat die Schule einen sprachlichen Schwerpunkt. Heute ist sie ein Gymnasium für Sozial- und Sprachwissenschaften und seit dem Schuljahr 2002–2003 Teil des Programms Deutsches Sprachdiplom (DSD).",
    vision: "Eine leistungsstarke und inklusive Schule zu werden.",
    mission: "Zur bestmöglichen Entwicklung jeder Schülerin und jedes Schülers beizutragen.",
    source: PZHSH_SOURCE_DE,
  },
  history: [
    { period: "Anfänge", title: "Im Gebäude der Normalschule", text: "Die Schule begann in den Räumen der ehemaligen Normalschule in Prishtina." },
    { period: "Danach", title: "Mathematisch, dann kulturwissenschaftlich", text: "Die Schule wechselte ihr Profil: zuerst mathematisch, dann kulturwissenschaftlich." },
    { period: "1990", title: "Philologisches Gymnasium", text: "Die Schule erhält einen sprachlichen Schwerpunkt." },
    { period: "2002–2003", title: "Deutsches Sprachdiplom", text: "Die Arbeit im Programm Deutsches Sprachdiplom (DSD) beginnt." },
    { period: "2012–2013", title: "Neues Gebäude", text: "Der Unterricht zieht in die Straße \"Remzi Salihu\" Nr. 61." },
    { period: "2021–2022", title: "Sozial- und Sprachwissenschaften", text: "Per Beschluss des Bildungsministeriums (Nr. 2-854) Gymnasium für Sozial- und Sprachwissenschaften." },
  ],
  enrollment: {
    ...siteContent.enrollment,
    heading: "Anmeldung für die 10. Klasse",
    body: "Bedingungen und Fristen veröffentlichen die Schule und die städtische Bildungsdirektion. Sie finden sie hier, sobald sie bestätigt sind.",
    cta_label: "Zur Anmeldung anfragen",
  },
  contact: { ...siteContent.contact, city: "Prishtina, Kosovo" },
  student_info: {
    heading: "Alles, was Schüler wissen müssen.",
    items: [
      { title: "Schülerrat", body: "Vorsitzende im Schuljahr 2026–2027 ist Ana Arifi (XII/1).", verification: "verified" },
      { title: "Deutsches Sprachdiplom", body: "Das DSD-Programm umfasst jetzt alle Jahrgänge.", verification: "verified" },
      { title: "Bibliothek", body: "Die Öffnungszeiten werden hier veröffentlicht.", verification: "verified" },
      { title: "Stundenplan", body: "Wird von der Schulverwaltung veröffentlicht.", verification: "pending" },
      { title: "Schuljahreskalender", body: "Halbjahre und Ferien folgen nach Bestätigung.", verification: "pending" },
      { title: "Staatliche Matura", body: "Termine erscheinen unter Mitteilungen.", verification: "pending" },
    ],
  },
};

/* ==================================================================== stats */

export const stats: Stat[] = [
  { id: "stat-students", label: "nxënës", label_de: "Schülerinnen und Schüler", value: 696, suffix: null, source: PZHSH_SOURCE, source_de: PZHSH_SOURCE_DE, year: "2021", sort_order: 1, verification: "verified" },
  { id: "stat-teachers", label: "mësimdhënës të rregullt", label_de: "fest angestellte Lehrkräfte", value: 36, suffix: null, source: PZHSH_SOURCE, source_de: PZHSH_SOURCE_DE, year: "2021", sort_order: 2, verification: "verified" },
  { id: "stat-matura", label: "kaluan Maturën shtetërore", label_de: "bestanden die staatliche Matura", value: 92, suffix: "%", source: PZHSH_SOURCE, source_de: PZHSH_SOURCE_DE, year: "2021", sort_order: 3, verification: "verified" },
];

/* ================================================================= programs */

export const DSD_CATEGORY = "Diploma Gjermane";

export const programs: Program[] = [
  {
    id: "prog-shoqeror-gjuhesor",
    slug: "shkencat-shoqerore-gjuhesore",
    name: "Gjimnazi i shkencave shoqërore-gjuhësore",
    name_de: "Gymnasium für Sozial- und Sprachwissenschaften",
    short_name: "Shoqëror-gjuhësor",
    short_name_de: "Sozial- und Sprachwissenschaften",
    tagline: "Gjuhët, shoqëria dhe mendimi kritik.",
    tagline_de: "Sprachen, Gesellschaft und kritisches Denken.",
    summary: "Profili i shkollës që nga 2021–2022: gjuhët dhe shkencat shoqërore në qendër.",
    summary_de: "Das Profil der Schule seit 2021–2022: Sprachen und Sozialwissenschaften im Mittelpunkt.",
    overview:
      "Me vendim të MASHTI-t (nr. 2-854), shkolla funksionon si gjimnaz i shkencave shoqërore-gjuhësore, mbi traditën e saj filologjike që nga viti 1990. Mësohen shqipja dhe gjuhët e huaja, krahas shkencave shoqërore, historisë, psikologjisë, matematikës, shkencave natyrore, arteve, edukatës fizike dhe TIK-ut.",
    overview_de:
      "Per Beschluss des Bildungsministeriums (Nr. 2-854) ist die Schule ein Gymnasium für Sozial- und Sprachwissenschaften und baut auf ihrer philologischen Tradition seit 1990 auf. Unterrichtet werden Albanisch und Fremdsprachen sowie Sozialwissenschaften, Geschichte, Psychologie, Mathematik, Naturwissenschaften, Kunst, Sport und Informatik.",
    outcomes: [],
    pathways: [],
    grades: "Klasat X–XII",
    grades_de: "Klassen 10–12",
    cover_url: M("vizite-ore-mesimi"),
    sort_order: 1,
    verification: "verified",
    source_note: PZHSH_SOURCE,
    source_note_de: PZHSH_SOURCE_DE,
    status: P,
    published_at: "2025-09-01T08:00:00Z",
  },
  {
    id: "prog-dsd",
    slug: "diploma-gjermane",
    name: "Programi i Diplomës Gjermane (DSD)",
    name_de: "Deutsches Sprachdiplom (DSD)",
    short_name: "Diploma Gjermane",
    short_name_de: "Deutsches Sprachdiplom",
    tagline: "Gjermanishtja, me partnerë në Gjermani.",
    tagline_de: "Deutsch, mit Partnern in Deutschland.",
    summary: "Në shkollë që nga 2002–2003. Tani përfshin nxënësit e çdo gjenerate.",
    summary_de: "An der Schule seit 2002–2003. Jetzt für alle Jahrgänge.",
    overview:
      "Shkolla punon në Programin e Diplomës Gjermane që nga viti shkollor 2002–2003. Tani, për herë të parë, përfshihen nxënësit e çdo gjenerate. Programi mbështetet nga ZfA dhe Ambasada Gjermane në Kosovë, me koordinatoren e DSD për Kosovë, znj. Cornelia Menner.",
    overview_de:
      "Die Schule arbeitet seit dem Schuljahr 2002–2003 im Programm Deutsches Sprachdiplom. Erstmals sind jetzt alle Jahrgänge einbezogen. Unterstützt wird das Programm von der ZfA und der Deutschen Botschaft im Kosovo, mit der DSD-Koordinatorin für Kosovo, Frau Cornelia Menner.",
    outcomes: [
      "Tekste të gjermanishtes dhe mjete didaktike për të gjithë nxënësit, nga 2025–2026",
      "Seminare dhe vizita në Gjermani",
      "Trajnime dhe certifikata për mësimdhënëset e gjermanishtes",
    ],
    outcomes_de: [
      "Deutschlehrbücher und Lehrmaterial für alle Schüler ab 2025–2026",
      "Seminare und Besuche in Deutschland",
      "Fortbildungen und Zertifikate für die Deutschlehrerinnen",
    ],
    pathways: [
      "Certifikatë e vlefshme që lehtëson punësimin, për nxënësit që kualifikohen",
      "Mundësi studimi dhe orientimi në karrierë",
    ],
    pathways_de: [
      "Ein anerkanntes Zertifikat, das den Berufseinstieg erleichtert, für alle, die sich qualifizieren",
      "Perspektiven für Studium und Berufsorientierung",
    ],
    grades: "Klasat X–XII",
    grades_de: "Klassen 10–12",
    cover_url: M("gjermani-educamp-grupi"),
    sort_order: 2,
    verification: "verified",
    source_note: "Njoftimet zyrtare të shkollës",
    source_note_de: "Offizielle Mitteilungen der Schule",
    status: P,
    published_at: "2025-09-01T08:00:00Z",
  },
];

const SUBJECTS: [string, string][] = [
  ["Gjuhë shqipe", "Albanisch"],
  ["Gjuhë angleze", "Englisch"],
  ["Gjuhë gjermane", "Deutsch"],
  ["Matematikë", "Mathematik"],
  ["Histori", "Geschichte"],
  ["Psikologji", "Psychologie"],
  ["Shkenca shoqërore", "Sozialwissenschaften"],
  ["Shkenca natyrore", "Naturwissenschaften"],
  ["Arte", "Kunst"],
  ["Edukatë fizike", "Sport"],
  ["TIK", "Informatik"],
];

export const subjects: Subject[] = [
  ...SUBJECTS.map(([name, name_de], i) => ({
    id: `subj-${i + 1}`,
    program_id: "prog-shoqeror-gjuhesor",
    name,
    name_de,
    grade: null,
    hours_per_week: null,
    description: null,
    sort_order: i + 1,
    verification: "verified" as const,
  })),
  { id: "subj-dsd-1", program_id: "prog-dsd", name: "Gjuhë gjermane", name_de: "Deutsch", grade: null, hours_per_week: null, description: null, sort_order: 1, verification: "verified" },
];

/* ==================================================================== staff */

export const staff: StaffMember[] = [
  {
    id: "staff-director",
    full_name: "Shemsedin Beqiri",
    role_title: "Drejtor",
    role_title_de: "Direktor",
    department: "Udhëheqja",
    department_de: "Schulleitung",
    bio: null,
    photo_url: M("drejtori-shemsedin-beqiri"),
    email: null,
    is_leadership: true,
    sort_order: 1,
    verification: "verified",
    source_note: null,
    video_url: DIRECTOR_INTERVIEW_URL,
    status: P,
    published_at: "2025-09-01T08:00:00Z",
  },
];

/* ==================================================================== clubs */

export const clubs: Club[] = [
  {
    id: "club-media",
    slug: "klubi-i-medias",
    name: "Klubi i Medias",
    name_de: "Medienclub",
    summary: "Video, podkaste dhe gazetari nga nxënësit.",
    summary_de: "Video, Podcasts und Journalismus von Schülern.",
    description: "Nxënësit filmojnë, montojnë, intervistojnë dhe publikojnë. Ekipi, takimet dhe produksionet publikohen nga mentorët e klubit.",
    description_de: "Schüler filmen, schneiden, interviewen und veröffentlichen. Team, Treffen und Produktionen veröffentlichen die Betreuer des Clubs.",
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

/* ===================================================================== news */

export const news: NewsArticle[] = [
  {
    id: "news-knsh-2026",
    slug: "keshilli-i-nxenesve-2026-2027",
    title: "Ana Arifi, kryetare e Këshillit të Nxënësve",
    title_de: "Ana Arifi leitet den Schülerrat",
    excerpt: "Me 100% të votave, u zgjodh kryesia e Këshillit të Nxënësve për vitin 2026–2027.",
    excerpt_de: "Mit 100 % der Stimmen wurde der Vorstand des Schülerrats für 2026–2027 gewählt.",
    body: "Kryesia e Rinisë Shkollore organizoi takimin për zgjedhjen e Këshillit të Nxënësve të Shkollës (KNSH) për vitin shkollor 2026–2027.\n\nMe 100% të votave të të pranishmëve, **Ana Arifi (XII/1)** u zgjodh kryetare.\n\n## Këshilli i ngushtë\n\n- Ana Arifi, XII/1, kryetare\n- Sara Zeqiri, XII/5, sekretare\n- Zyhra Fejzullahu, XII/6, arkatare\n\nProcesin e mbikëqyrën prof. Kushtrim Bekteshi dhe prof. Ilir Bekteshi.",
    body_de: "Der Vorstand der Schülerschaft lud zur Wahl des Schülerrats (KNSH) für das Schuljahr 2026–2027 ein.\n\nMit 100 % der Stimmen der Anwesenden wurde **Ana Arifi (XII/1)** zur Vorsitzenden gewählt.\n\n## Der Vorstand\n\n- Ana Arifi, XII/1, Vorsitzende\n- Sara Zeqiri, XII/5, Schriftführerin\n- Zyhra Fejzullahu, XII/6, Kassenwartin\n\nDie Wahl wurde von Prof. Kushtrim Bekteshi und Prof. Ilir Bekteshi begleitet.",
    category: "Rinia shkollore",
    category_de: "Schülerschaft",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    show_date: false,
    gallery: [],
    source_url: null,
    status: P,
    published_at: "2026-10-20T09:00:00Z",
  },
  {
    id: "news-vrapimi",
    slug: "vrapimi-kunder-kancerit-te-gjirit",
    title: "Vrapojmë kundër kancerit të gjirit",
    title_de: "Wir laufen gegen Brustkrebs",
    excerpt: "Nxënëset tona iu bashkuan vrapimit humanitar të Kryeqytetit.",
    excerpt_de: "Unsere Schülerinnen liefen beim Benefizlauf der Hauptstadt mit.",
    body: "Nxënëset e gjimnazit iu bashkuan iniciativës \"Vrapim në luftë kundër kancerit të gjirit\" të Drejtorisë së Shëndetësisë së Kryeqytetit, në muajin e ndërgjegjësimit.\n\nI përkrahën drejtori Shemsedin Beqiri, prof. Valbona Sopi dhe prof. Valbona Avdiu.\n\nPrej disa vitesh, gjimnazi del në përkrahje publike të grave të prekura nga kanceri i gjirit.",
    body_de: "Unsere Schülerinnen nahmen am Lauf \"Gemeinsam gegen Brustkrebs\" der Gesundheitsdirektion der Hauptstadt teil, im Monat der Brustkrebs-Aufklärung.\n\nUnterstützt wurden sie von Direktor Shemsedin Beqiri sowie Prof. Valbona Sopi und Prof. Valbona Avdiu.\n\nSeit mehreren Jahren setzt sich das Gymnasium öffentlich für an Brustkrebs erkrankte Frauen ein.",
    category: "Komuniteti",
    category_de: "Gemeinschaft",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    show_date: false,
    gallery: [],
    source_url: null,
    status: P,
    published_at: "2026-10-10T09:00:00Z",
  },
  {
    id: "news-gjermani-educamp",
    slug: "vizita-ne-gjermani-educamp",
    title: "Një javë në Gjermani",
    title_de: "Eine Woche in Deutschland",
    excerpt: "Nxënësit tanë me të rinj nga vende të ndryshme, në EduCamp Summer.",
    excerpt_de: "Unsere Schüler mit Jugendlichen aus vielen Ländern beim EduCamp Summer.",
    body: "Nxënësit tanë morën pjesë në një aktivitet ndërkombëtar në Gjermani, ku të rinj nga vende të ndryshme shkëmbyen ide dhe përvoja. Vizituan qytetin, ndoqën diskutime e prezantime dhe në fund morën certifikata.\n\nMomenti më i veçantë: flamuri kuqezi, i shfaqur me krenari nga nxënësit tanë.\n\n## Falënderime\n\n- Organizatorëve: Afrim Hasani, Ibadete Hasani, Egzona Ukshini-Mustafa, Halit Berisha (EduCamp, sponsor) dhe Shqipe Gara-Berisha, mësuese e gjermanishtes në shkollën shqipe në Gjermani\n- Mbështetësve të programeve DSD dhe ZfA, Ambasadës Gjermane në Kosovë dhe znj. Catalina Heine\n- Znj. Kerstin Zielosko nga Ministria gjermane e Arsimit\n- Koordinatores së DSD për Kosovë, znj. Cornelia Menner\n\nProf. Shkëndije Muslijaj i përgatiti dhe i shoqëroi nxënësit gjatë gjithë javës.",
    body_de: "Unsere Schülerinnen und Schüler nahmen in Deutschland an einer internationalen Veranstaltung teil, bei der Jugendliche aus verschiedenen Ländern Ideen und Erfahrungen austauschten. Sie besichtigten die Stadt, verfolgten Diskussionen und Präsentationen und erhielten zum Abschluss Zertifikate.\n\nEin besonderer Moment: die rot-schwarze Flagge, die unsere Schüler mit großem Stolz zeigten.\n\n## Wir danken\n\n- den Organisatoren: Afrim Hasani, Ibadete Hasani, Egzona Ukshini-Mustafa, Halit Berisha (EduCamp, Sponsor) und Shqipe Gara-Berisha, Deutschlehrerin an der albanischen Schule in Deutschland\n- den Unterstützern des DSD- und des ZfA-Programms, der Deutschen Botschaft im Kosovo und Frau Catalina Heine\n- Frau Kerstin Zielosko vom deutschen Bildungsministerium\n- der DSD-Koordinatorin für Kosovo, Frau Cornelia Menner\n\nProf. Shkëndije Muslijaj hat die Schüler vorbereitet und die ganze Woche begleitet.",
    category: DSD_CATEGORY,
    category_de: "Deutsches Sprachdiplom",
    cover_url: M("gjermani-educamp-grupi"),
    cover_alt: "Nxënësit tanë me pjesëmarrës të tjerë në Gjermani.",
    cover_alt_de: "Unsere Schüler mit weiteren Teilnehmenden in Deutschland.",
    featured: true,
    author_name: null,
    show_date: false,
    gallery: [M("gjermani-educamp-skena")],
    source_url: null,
    status: P,
    published_at: "2026-09-25T09:00:00Z",
  },
  {
    id: "news-play-international",
    slug: "trajnim-me-play-international",
    title: "5.000 € për një projekt kundër diskriminimit",
    title_de: "5.000 € für ein Projekt gegen Diskriminierung",
    excerpt: "Pesë nxënës në trajnimin e Play International. Avdyl Zeqiri, lider grupi.",
    excerpt_de: "Fünf Schüler bei der Schulung von Play International. Avdyl Zeqiri leitet eine Gruppe.",
    body: "Avdyl Zeqiri, Blerta Kameri, Ana Arifi, Armela Saraçi dhe Ari Thaçi morën pjesë në një trajnim njëditor të Play International, në Hotel Sirius.\n\nGrupi u përkrah me një buxhet prej **5.000 €** për projekte me temën e diskriminimit. Avdyl Zeqiri u përzgjodh lider i njërit prej grupeve.\n\nProjekti zbatohet gradualisht, me synim ndikim afatgjatë në komunitet.",
    body_de: "Avdyl Zeqiri, Blerta Kameri, Ana Arifi, Armela Saraçi und Ari Thaçi nahmen an einer eintägigen Schulung von Play International im Hotel Sirius teil.\n\nDie Gruppe erhielt ein Budget von **5.000 €** für Projekte zum Thema Diskriminierung. Avdyl Zeqiri wurde zum Leiter einer der Gruppen gewählt.\n\nDas Projekt wird schrittweise umgesetzt und soll langfristig in die Gemeinschaft wirken.",
    category: "Projekte",
    category_de: "Projekte",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    show_date: false,
    gallery: [],
    source_url: null,
    status: P,
    published_at: "2026-05-15T09:00:00Z",
  },
  {
    id: "news-etwinning",
    slug: "regjistrimi-ne-etwinning",
    title: "Gjimnazi hyn në eTwinning",
    title_de: "Das Gymnasium ist jetzt bei eTwinning",
    excerpt: "Platforma evropiane e edukimit hap rrugën për projekte të përbashkëta dhe Erasmus+.",
    excerpt_de: "Die europäische Bildungsplattform öffnet den Weg zu gemeinsamen Projekten und Erasmus+.",
    body: "Në prani të koordinatores së Programit të Diplomës Gjermane, znj. Cornelia Menner, dhe koordinatorit të eTwinning për Kosovë, z. Genc Pilinxhurka, gjimnazi u regjistrua në eTwinning.\n\n- Platforma u themelua në 2005; Kosova u anëtarësua në 2024\n- Rreth 1.000 institucione nga 15 komuna janë pjesë e saj\n- Partneritete me shkolla nga 45 shtete dhe mbi 1 milion mësimdhënës\n\nQëllimi: projekte të përbashkëta që hapin rrugën drejt Erasmus+.",
    body_de: "Im Beisein der DSD-Koordinatorin Frau Cornelia Menner und des eTwinning-Koordinators für Kosovo, Herrn Genc Pilinxhurka, hat sich das Gymnasium bei eTwinning registriert.\n\n- Die Plattform wurde 2005 gegründet; Kosovo ist seit 2024 dabei\n- Rund 1.000 Einrichtungen aus 15 Gemeinden sind beteiligt\n- Partnerschaften mit Schulen aus 45 Ländern und über einer Million Lehrkräften\n\nDas Ziel: gemeinsame Projekte als Weg zu Erasmus+.",
    category: "Ndërkombëtare",
    category_de: "International",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    show_date: false,
    gallery: [],
    source_url: null,
    status: P,
    published_at: "2025-11-10T09:00:00Z",
  },
  {
    id: "news-zfa-bonn",
    slug: "seminari-i-zfa-ne-bon",
    title: "Kosova përfaqësohet nga ne në Bon",
    title_de: "Wir vertreten Kosovo in Bonn",
    excerpt: "27–31 janar 2025: seminari i ZfA në Bon, me nxënësit tanë.",
    excerpt_de: "27.–31. Januar 2025: ZfA-Seminar in Bonn, mit unseren Schülern.",
    body: "Nga 27 deri më 31 janar 2025, gjimnazi ynë përfaqësoi Kosovën në seminarin e ZfA (Zentralstelle für das Auslandsschulwesen) në Bon të Gjermanisë.\n\nPërzgjedhja ndër shkollat më të mira të rajonit është mirënjohje për punën e nxënësve dhe mësimdhënësve.\n\n## Përfaqësuesit\n\n- Jeta Sopi\n- Ilir Berisha\n- Melika Morina\n- Enkelea Berisha\n\nTë shoqëruar nga prof. Shkëndije Muslijaj.",
    body_de: "Vom 27. bis 31. Januar 2025 vertrat unser Gymnasium Kosovo beim Seminar der ZfA (Zentralstelle für das Auslandsschulwesen) in Bonn.\n\nDie Auswahl unter den besten Schulen der Region ist eine Anerkennung für die Arbeit von Schülern und Lehrkräften.\n\n## Unsere Teilnehmenden\n\n- Jeta Sopi\n- Ilir Berisha\n- Melika Morina\n- Enkelea Berisha\n\nBegleitet von Prof. Shkëndije Muslijaj.",
    category: DSD_CATEGORY,
    category_de: "Deutsches Sprachdiplom",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    show_date: false,
    gallery: [],
    source_url: ZFA_URL,
    status: P,
    published_at: "2025-01-31T09:00:00Z",
  },
  {
    id: "news-dsd-visit",
    slug: "programi-i-diplomes-gjermane-pasurohet",
    title: "Diploma Gjermane, për çdo gjeneratë",
    title_de: "Das Sprachdiplom für alle Jahrgänge",
    excerpt: "Koordinatori rajonal i DSD, Richard Purschwitz, prezantoi çfarë vjen për nxënësit tanë.",
    excerpt_de: "DSD-Regionalkoordinator Richard Purschwitz stellte vor, was auf unsere Schüler zukommt.",
    body: "Koordinatori rajonal i Programit të Diplomës Gjermane, z. Richard Purschwitz, vizitoi gjimnazin dhe prezantoi zhvillimet e programit në rajon dhe në Kosovë.\n\n## Çfarë vjen\n\n- Nga 2025–2026: tekste të gjermanishtes dhe mjete didaktike për të gjithë nxënësit\n- Trajnime dhe certifikata për mësimdhënëset e gjermanishtes\n- Për gjeneratën e parë që testohet: certifikatë e vlefshme që lehtëson punësimin\n\nProgrami zhvillohet në shkollë që nga 2002–2003. Tani, për herë të parë, përfshin nxënësit e çdo gjenerate.",
    body_de: "Der Regionalkoordinator des Deutschen Sprachdiploms, Herr Richard Purschwitz, besuchte das Gymnasium und stellte die Entwicklung des Programms in der Region und im Kosovo vor.\n\n## Was kommt\n\n- Ab 2025–2026: Deutschlehrbücher und Lehrmaterial für alle Schüler\n- Fortbildungen und Zertifikate für die Deutschlehrerinnen\n- Für den ersten geprüften Jahrgang: ein anerkanntes Zertifikat, das den Berufseinstieg erleichtert\n\nDas Programm läuft an der Schule seit 2002–2003. Jetzt umfasst es erstmals alle Jahrgänge.",
    category: DSD_CATEGORY,
    category_de: "Deutsches Sprachdiplom",
    cover_url: null,
    cover_alt: null,
    featured: false,
    author_name: null,
    show_date: false,
    gallery: [],
    source_url: null,
    status: P,
    published_at: "2024-12-10T09:00:00Z",
  },
];

export const announcements: Announcement[] = [];

/* =================================================================== events */

export const events: SchoolEvent[] = [
  {
    id: "evt-zfa-bonn",
    slug: "seminari-zfa-bon-2025",
    title: "Seminari i ZfA në Bon",
    title_de: "ZfA-Seminar in Bonn",
    description: "Gjimnazi përfaqëson Kosovën në seminarin e Programit ZfA.",
    description_de: "Das Gymnasium vertritt Kosovo beim Seminar der ZfA.",
    location: "Bon, Gjermani",
    location_de: "Bonn, Deutschland",
    starts_at: "2025-01-27T08:00:00Z",
    ends_at: "2025-01-31T16:00:00Z",
    all_day: true,
    category: DSD_CATEGORY,
    category_de: "Deutsches Sprachdiplom",
    cover_url: null,
    verification: "verified",
    status: P,
    published_at: "2025-01-20T09:00:00Z",
  },
];

/* =================================================================== others */

export const projects: StudentProject[] = [
  {
    id: "proj-play-international",
    slug: "projekt-kunder-diskriminimit",
    title: "Projekt kundër diskriminimit",
    title_de: "Projekt gegen Diskriminierung",
    summary: "Me mbështetjen e Play International dhe një buxhet prej 5.000 €. Zbatohet gradualisht.",
    summary_de: "Mit Unterstützung von Play International und einem Budget von 5.000 €. Wird schrittweise umgesetzt.",
    body: "",
    team: "Avdyl Zeqiri (lider grupi), Blerta Kameri, Ana Arifi, Armela Saraçi, Ari Thaçi",
    school_year: null,
    cover_url: null,
    club_id: null,
    link_url: null,
    status: P,
    published_at: "2026-05-15T09:00:00Z",
  },
];

export const achievements: Achievement[] = [
  {
    id: "ach-zfa-2025",
    title: "Përfaqësimi i Kosovës në seminarin e ZfA në Bon",
    title_de: "Vertretung Kosovos beim ZfA-Seminar in Bonn",
    description: "27–31 janar 2025. Shkolla u përzgjodh ndër më të mirat e rajonit.",
    description_de: "27.–31. Januar 2025. Die Schule wurde unter den besten der Region ausgewählt.",
    year: "2025",
    category: DSD_CATEGORY,
    category_de: "Deutsches Sprachdiplom",
    verification: "verified",
    link_url: ZFA_URL,
    status: P,
    published_at: "2025-01-31T09:00:00Z",
  },
];

type MediaSeed = [name: string, album: string, albumDe: string, caption: string, captionDe: string, w: number, h: number];
const MEDIA: MediaSeed[] = [
  ["diplomimi-germia", "Diplomimi", "Abschlussfeier", "Ceremonia e diplomimit në amfiteatrin e Gërmisë.", "Abschlussfeier im Amphitheater Gërmia.", 1279, 853],
  ["pema-e-gjuheve", "Shkolla", "Schule", "Muralja e pemës së gjuhëve në gjimnaz.", "Das Wandbild des Sprachenbaums im Gymnasium.", 2000, 1333],
  ["gjermani-educamp-grupi", "Vizita në Gjermani", "Besuch in Deutschland", "Nxënësit tanë në Gjermani.", "Unsere Schüler in Deutschland.", 1600, 1200],
  ["gjermani-educamp-skena", "Vizita në Gjermani", "Besuch in Deutschland", "Hapja e EduCamp Summer.", "Eröffnung des EduCamp Summer.", 1200, 1600],
  ["aktivitet-festiv-kori", "Jeta në shkollë", "Schulleben", "Kori i nxënëseve në një aktivitet festiv.", "Der Schülerinnenchor bei einer Feier.", 827, 544],
  ["vizite-ore-mesimi", "Mysafirë", "Besuch", "Orë mësimi me mysafir.", "Unterricht mit Gast.", 1600, 1066],
  ["vizite-korridor", "Mysafirë", "Besuch", "Mysafirë në gjimnaz.", "Gäste im Gymnasium.", 1600, 1066],
  ["vizite-klase-welcome", "Mysafirë", "Besuch", "Mirëseardhje në klasë.", "Willkommen im Klassenzimmer.", 1600, 1066],
  ["punetoria-degjo-zerin-tim", "Projekte", "Projekte", "Punëtoria \"Dëgjo zërin tim\".", "Workshop \"Dëgjo zërin tim\" (Hör meine Stimme).", 1600, 1280],
];

export const media: MediaItem[] = MEDIA.map(([name, album, albumDe, caption, captionDe, w, h], i) => ({
  id: `media-${name}`,
  kind: "image" as const,
  title: caption.replace(/\.$/, ""),
  title_de: captionDe.replace(/\.$/, ""),
  caption,
  caption_de: captionDe,
  url: M(name),
  thumbnail_url: null,
  album,
  album_de: albumDe,
  club_id: null,
  width: w,
  height: h,
  taken_at: null,
  status: P,
  published_at: new Date(Date.UTC(2026, 9, 30 - i)).toISOString(),
}));

export const documents: SchoolDocument[] = [
  {
    id: "doc-pzhsh",
    title: PZHSH_SOURCE,
    title_de: PZHSH_SOURCE_DE,
    description: "Plani zhvillimor i gjimnazit, i publikuar nga Komuna e Prishtinës.",
    description_de: "Der Entwicklungsplan des Gymnasiums, veröffentlicht von der Gemeinde Prishtina (auf Albanisch).",
    category: "Planifikimi",
    category_de: "Planung",
    file_url: PZHSH_URL,
    file_size: null,
    file_type: "PDF",
    status: P,
    published_at: "2021-09-01T00:00:00Z",
  },
];
