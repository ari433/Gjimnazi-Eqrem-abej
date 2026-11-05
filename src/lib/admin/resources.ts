/**
 * Declarative CMS configuration. One entry per content type drives the list
 * view, the form, server-side validation and cache invalidation.
 * Pure data (no functions) so it can be passed to client components.
 */
import type { Role } from "@/lib/types";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "slug"
  | "select"
  | "boolean"
  | "number"
  | "datetime"
  | "date"
  | "list"
  | "image"
  | "file"
  | "url"
  | "email"
  | "relation";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  max?: number;
  options?: { value: string; label: string }[];
  /** slug: field the slug is generated from */
  from?: string;
  /** relation: table + label column */
  relation?: { table: string; labelField: string };
  /** image/file: storage bucket */
  bucket?: "media" | "documents";
  /** file: hidden fields filled from the uploaded file */
  fileMeta?: { size?: string; type?: string };
  /** full-width in the form grid */
  wide?: boolean;
  /** Translation field: rendered in the collapsible German section. */
  lang?: "de";
  defaultValue?: string | number | boolean;
}

export interface ResourceDef {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  tags: string[];
  minRole: Role;
  publishable: boolean;
  verification: boolean;
  titleField: string;
  listColumns: { name: string; label: string; kind?: "date" | "badge" | "bool" }[];
  orderBy: { column: string; ascending: boolean };
  searchFields: string[];
  fields: FieldDef[];
  publicPath?: string;
  group: "Përmbajtja" | "Mësimi" | "Jeta shkollore" | "Media" | "Shkolla";
}

/** German twin of a text field, grouped in the form's "Gjermanisht" section. */
const de = (name: string, label: string, type: FieldType = "text", extra: Partial<FieldDef> = {}): FieldDef => ({
  name: `${name}_de`,
  label,
  type,
  lang: "de",
  wide: type !== "text",
  ...extra,
});

const verificationField: FieldDef = {
  name: "verification",
  label: "Verifikimi",
  type: "select",
  options: [
    { value: "verified", label: "E verifikuar" },
    { value: "pending", label: "Në pritje të verifikimit" },
  ],
  defaultValue: "pending",
  help: "Përmbajtja \"në pritje\" shfaqet me shenjë të dukshme në faqe.",
};

export const RESOURCES: ResourceDef[] = [
  {
    key: "lajme",
    table: "news",
    label: "Lajmet",
    singular: "Lajm",
    description: "Lajme dhe artikuj për faqen. Kontribuesit shkruajnë drafte; redaktorët publikojnë.",
    tags: ["news"],
    minRole: "contributor",
    publishable: true,
    verification: false,
    titleField: "title",
    listColumns: [
      { name: "title", label: "Titulli" },
      { name: "category", label: "Kategoria" },
      { name: "status", label: "Statusi", kind: "badge" },
      { name: "published_at", label: "Publikimi", kind: "date" },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchFields: ["title", "excerpt"],
    publicPath: "/lajme/",
    group: "Përmbajtja",
    fields: [
      { name: "title", label: "Titulli", type: "text", required: true, max: 200, wide: true },
      { name: "slug", label: "Adresa (slug)", type: "slug", from: "title", required: true, help: "Krijohet nga titulli. Shfaqet në adresën e lajmit." },
      { name: "category", label: "Kategoria", type: "text", required: true, defaultValue: "Lajme" },
      { name: "excerpt", label: "Përmbledhja", type: "textarea", max: 400, wide: true, help: "Një deri në dy fjali. Shfaqet në karta dhe në Google." },
      { name: "body", label: "Teksti", type: "markdown", wide: true },
      { name: "cover_url", label: "Foto kryesore", type: "image", bucket: "media" },
      { name: "cover_alt", label: "Përshkrimi i fotos", type: "text", help: "Për lexuesit e ekranit. Përshkruani çfarë shihet." },
      { name: "author_name", label: "Autori", type: "text" },
      { name: "featured", label: "Lajm kryesor në ballinë", type: "boolean" },
      { name: "show_date", label: "Shfaq datën e publikimit", type: "boolean", defaultValue: true, help: "Çaktivizojeni kur data e saktë nuk dihet." },
      { name: "gallery", label: "Foto shtesë (lidhje)", type: "list", wide: true, help: "Një lidhje fotoje për rresht, p.sh. nga Galeria." },
      { name: "source_url", label: "Lidhja e burimit", type: "url", help: "P.sh. artikulli origjinal i partnerit." },
      de("title", "Titulli"),
      de("category", "Kategoria"),
      de("excerpt", "Përmbledhja", "textarea"),
      de("body", "Teksti", "markdown"),
      de("cover_alt", "Përshkrimi i fotos"),
    ],
  },
  {
    key: "njoftime",
    table: "announcements",
    label: "Njoftimet",
    singular: "Njoftim",
    description: "Informata të shkurtra që duhen ditur menjëherë.",
    tags: ["announcements"],
    minRole: "editor",
    publishable: true,
    verification: false,
    titleField: "title",
    listColumns: [
      { name: "title", label: "Titulli" },
      { name: "priority", label: "Prioriteti" },
      { name: "status", label: "Statusi", kind: "badge" },
      { name: "published_at", label: "Publikimi", kind: "date" },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchFields: ["title", "body"],
    publicPath: "/njoftimet",
    group: "Përmbajtja",
    fields: [
      { name: "title", label: "Titulli", type: "text", required: true, max: 200, wide: true },
      { name: "body", label: "Teksti", type: "textarea", wide: true },
      { name: "audience", label: "Për kë", type: "text", defaultValue: "Të gjithë" },
      {
        name: "priority",
        label: "Prioriteti",
        type: "select",
        defaultValue: "normal",
        options: [
          { value: "normal", label: "Normal" },
          { value: "important", label: "I rëndësishëm" },
          { value: "urgent", label: "Urgjent" },
        ],
      },
      { name: "expires_at", label: "Skadon më", type: "datetime", help: "Pas kësaj date njoftimi fshihet automatikisht nga faqja." },
      de("title", "Titulli"),
      de("audience", "Për kë"),
      de("body", "Teksti", "textarea"),
    ],
  },
  {
    key: "ngjarje",
    table: "events",
    label: "Kalendari",
    singular: "Aktivitet",
    description: "Aktivitetet që shfaqen në kalendar dhe në ballinë.",
    tags: ["events"],
    minRole: "editor",
    publishable: true,
    verification: true,
    titleField: "title",
    listColumns: [
      { name: "title", label: "Titulli" },
      { name: "starts_at", label: "Data", kind: "date" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "starts_at", ascending: false },
    searchFields: ["title", "description"],
    publicPath: "/kalendari",
    group: "Përmbajtja",
    fields: [
      { name: "title", label: "Titulli", type: "text", required: true, max: 200, wide: true },
      { name: "slug", label: "Adresa (slug)", type: "slug", from: "title", required: true },
      { name: "category", label: "Kategoria", type: "text", defaultValue: "Shkolla" },
      { name: "starts_at", label: "Fillon më", type: "datetime", required: true },
      { name: "ends_at", label: "Përfundon më", type: "datetime" },
      { name: "all_day", label: "Gjithë ditën", type: "boolean" },
      { name: "location", label: "Vendi", type: "text" },
      { name: "description", label: "Përshkrimi", type: "textarea", wide: true },
      { name: "cover_url", label: "Foto", type: "image", bucket: "media" },
      verificationField,
      de("title", "Titulli"),
      de("category", "Kategoria"),
      de("location", "Vendi"),
      de("description", "Përshkrimi", "textarea"),
    ],
  },
  {
    key: "programe",
    table: "programs",
    label: "Programet",
    singular: "Program",
    description: "Programet mësimore dhe faqet e tyre.",
    tags: ["programs"],
    minRole: "editor",
    publishable: true,
    verification: true,
    titleField: "name",
    listColumns: [
      { name: "name", label: "Emri" },
      { name: "verification", label: "Verifikimi", kind: "badge" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    searchFields: ["name"],
    publicPath: "/programet/",
    group: "Mësimi",
    fields: [
      { name: "name", label: "Emri i plotë", type: "text", required: true, wide: true },
      { name: "short_name", label: "Emri i shkurtër", type: "text", required: true },
      { name: "slug", label: "Adresa (slug)", type: "slug", from: "name", required: true },
      { name: "tagline", label: "Fjalia hyrëse", type: "text", wide: true },
      { name: "summary", label: "Përmbledhja", type: "textarea", wide: true },
      { name: "overview", label: "Përshkrimi", type: "textarea", wide: true },
      { name: "grades", label: "Klasat", type: "text", defaultValue: "Klasat X–XII" },
      { name: "outcomes", label: "Rezultatet e të nxënit", type: "list", wide: true, help: "Një rezultat për rresht." },
      { name: "pathways", label: "Mundësitë pas gjimnazit", type: "list", wide: true, help: "Një mundësi për rresht." },
      { name: "cover_url", label: "Foto", type: "image", bucket: "media" },
      { name: "sort_order", label: "Renditja", type: "number", defaultValue: 0 },
      { name: "source_note", label: "Burimi", type: "text", wide: true },
      verificationField,
      de("name", "Emri i plotë"),
      de("short_name", "Emri i shkurtër"),
      de("tagline", "Fjalia hyrëse"),
      de("grades", "Klasat"),
      de("summary", "Përmbledhja", "textarea"),
      de("overview", "Përshkrimi", "textarea"),
      de("outcomes", "Çfarë ofron programi", "list"),
      de("pathways", "Pas gjimnazit", "list"),
      de("source_note", "Burimi"),
    ],
  },
  {
    key: "lende",
    table: "subjects",
    label: "Lëndët",
    singular: "Lëndë",
    description: "Lëndët e secilit program.",
    tags: ["programs"],
    minRole: "editor",
    publishable: false,
    verification: true,
    titleField: "name",
    listColumns: [
      { name: "name", label: "Lënda" },
      { name: "program_id", label: "Programi" },
      { name: "grade", label: "Klasa" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    searchFields: ["name"],
    group: "Mësimi",
    fields: [
      { name: "program_id", label: "Programi", type: "relation", relation: { table: "programs", labelField: "name" }, required: true },
      { name: "name", label: "Lënda", type: "text", required: true },
      { name: "grade", label: "Klasa", type: "text", help: "P.sh. X, XI, XII ose X–XII" },
      { name: "hours_per_week", label: "Orë në javë", type: "number" },
      { name: "description", label: "Përshkrimi", type: "textarea", wide: true },
      { name: "sort_order", label: "Renditja", type: "number", defaultValue: 0 },
      verificationField,
      de("name", "Lënda"),
      de("description", "Përshkrimi", "textarea"),
    ],
  },
  {
    key: "stafi",
    table: "staff",
    label: "Stafi",
    singular: "Anëtar i stafit",
    description: "Udhëheqja dhe mësimdhënësit. Publikoni vetëm me pëlqimin e personit.",
    tags: ["staff"],
    minRole: "editor",
    publishable: true,
    verification: true,
    titleField: "full_name",
    listColumns: [
      { name: "full_name", label: "Emri" },
      { name: "role_title", label: "Pozita" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    searchFields: ["full_name", "role_title"],
    publicPath: "/udheheqja-dhe-stafi",
    group: "Shkolla",
    fields: [
      { name: "full_name", label: "Emri dhe mbiemri", type: "text", required: true },
      { name: "role_title", label: "Pozita", type: "text", required: true, help: "P.sh. Drejtor, Mësimdhënëse e gjuhës shqipe" },
      { name: "department", label: "Departamenti", type: "text" },
      { name: "is_leadership", label: "Pjesë e udhëheqjes", type: "boolean" },
      { name: "email", label: "Emaili zyrtar", type: "email" },
      { name: "photo_url", label: "Foto", type: "image", bucket: "media" },
      { name: "bio", label: "Biografia e shkurtër", type: "textarea", wide: true },
      { name: "sort_order", label: "Renditja", type: "number", defaultValue: 0 },
      { name: "source_note", label: "Burimi", type: "text" },
      verificationField,
      { name: "video_url", label: "Video (YouTube)", type: "url", help: "P.sh. një intervistë." },
      de("role_title", "Pozita"),
      de("department", "Departamenti"),
      de("bio", "Biografia", "textarea"),
    ],
  },
  {
    key: "klube",
    table: "clubs",
    label: "Klubet",
    singular: "Klub",
    description: "Klubet e shkollës. Klubi i Medias ka faqen e vet.",
    tags: ["clubs"],
    minRole: "editor",
    publishable: true,
    verification: true,
    titleField: "name",
    listColumns: [
      { name: "name", label: "Emri" },
      { name: "is_media_club", label: "Klubi i Medias", kind: "bool" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    searchFields: ["name"],
    publicPath: "/klubet",
    group: "Jeta shkollore",
    fields: [
      { name: "name", label: "Emri", type: "text", required: true },
      { name: "slug", label: "Adresa (slug)", type: "slug", from: "name", required: true },
      { name: "summary", label: "Përshkrimi i shkurtër", type: "text", wide: true },
      { name: "description", label: "Përshkrimi", type: "textarea", wide: true },
      { name: "meeting_info", label: "Takimet", type: "text", help: "P.sh. Çdo të mërkurë pas orës së 6-të" },
      { name: "is_media_club", label: "Ky është Klubi i Medias", type: "boolean", help: "Vetëm një klub mund ta ketë këtë." },
      { name: "cover_url", label: "Foto", type: "image", bucket: "media" },
      { name: "sort_order", label: "Renditja", type: "number", defaultValue: 0 },
      verificationField,
      de("name", "Emri"),
      de("meeting_info", "Takimet"),
      de("summary", "Përshkrimi i shkurtër", "textarea"),
      de("description", "Përshkrimi", "textarea"),
    ],
  },
  {
    key: "anetaret",
    table: "club_members",
    label: "Anëtarët e klubeve",
    singular: "Anëtar",
    description: "Ekipet e klubeve. Për nxënësit publikoni vetëm me pëlqimin e prindërve.",
    tags: ["clubs"],
    minRole: "editor",
    publishable: false,
    verification: false,
    titleField: "display_name",
    listColumns: [
      { name: "display_name", label: "Emri" },
      { name: "role", label: "Roli" },
      { name: "club_id", label: "Klubi" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    searchFields: ["display_name"],
    group: "Jeta shkollore",
    fields: [
      { name: "club_id", label: "Klubi", type: "relation", relation: { table: "clubs", labelField: "name" }, required: true },
      { name: "display_name", label: "Emri që shfaqet", type: "text", required: true, help: "Mund të jetë vetëm emri, pa mbiemër." },
      { name: "role", label: "Roli", type: "text", help: "P.sh. Montazhier, Prezantuese, Mentor" },
      { name: "photo_url", label: "Foto", type: "image", bucket: "media" },
      { name: "sort_order", label: "Renditja", type: "number", defaultValue: 0 },
      de("role", "Roli"),
    ],
  },
  {
    key: "projekte",
    table: "projects",
    label: "Projektet",
    singular: "Projekt",
    description: "Projektet e nxënësve.",
    tags: ["projects"],
    minRole: "editor",
    publishable: true,
    verification: false,
    titleField: "title",
    listColumns: [
      { name: "title", label: "Titulli" },
      { name: "school_year", label: "Viti shkollor" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchFields: ["title", "summary"],
    publicPath: "/projektet",
    group: "Jeta shkollore",
    fields: [
      { name: "title", label: "Titulli", type: "text", required: true, wide: true },
      { name: "slug", label: "Adresa (slug)", type: "slug", from: "title", required: true },
      { name: "school_year", label: "Viti shkollor", type: "text", help: "P.sh. 2026–2027" },
      { name: "summary", label: "Përmbledhja", type: "textarea", wide: true },
      { name: "body", label: "Përshkrimi", type: "markdown", wide: true },
      { name: "team", label: "Ekipi", type: "text", help: "Vetëm me pëlqimin e nxënësve." },
      { name: "club_id", label: "Klubi", type: "relation", relation: { table: "clubs", labelField: "name" } },
      { name: "link_url", label: "Lidhja", type: "url" },
      { name: "cover_url", label: "Foto", type: "image", bucket: "media" },
      de("title", "Titulli"),
      de("summary", "Përmbledhja", "textarea"),
      de("body", "Përshkrimi", "markdown"),
    ],
  },
  {
    key: "arritje",
    table: "achievements",
    label: "Arritjet",
    singular: "Arritje",
    description: "Çmime dhe suksese, të dokumentuara.",
    tags: ["achievements"],
    minRole: "editor",
    publishable: true,
    verification: true,
    titleField: "title",
    listColumns: [
      { name: "title", label: "Titulli" },
      { name: "year", label: "Viti" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "year", ascending: false },
    searchFields: ["title"],
    publicPath: "/arritjet",
    group: "Shkolla",
    fields: [
      { name: "title", label: "Titulli", type: "text", required: true, wide: true },
      { name: "year", label: "Viti", type: "text", required: true },
      { name: "category", label: "Kategoria", type: "text", defaultValue: "Gara" },
      { name: "description", label: "Përshkrimi", type: "textarea", wide: true },
      verificationField,
      { name: "link_url", label: "Lidhja e burimit", type: "url" },
      de("title", "Titulli"),
      de("category", "Kategoria"),
      de("description", "Përshkrimi", "textarea"),
    ],
  },
  {
    key: "media",
    table: "media_items",
    label: "Galeria",
    singular: "Element mediash",
    description: "Foto, video dhe podkaste. Publikoni foto të nxënësve vetëm me leje.",
    tags: ["media"],
    minRole: "editor",
    publishable: true,
    verification: false,
    titleField: "title",
    listColumns: [
      { name: "title", label: "Titulli" },
      { name: "kind", label: "Lloji" },
      { name: "album", label: "Albumi" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchFields: ["title", "album"],
    publicPath: "/galeria",
    group: "Media",
    fields: [
      { name: "title", label: "Titulli", type: "text", required: true },
      {
        name: "kind",
        label: "Lloji",
        type: "select",
        defaultValue: "image",
        options: [
          { value: "image", label: "Foto" },
          { value: "video", label: "Video" },
          { value: "podcast", label: "Podkast" },
        ],
      },
      { name: "url", label: "Skedari ose lidhja", type: "image", bucket: "media", required: true, help: "Ngarkoni një foto ose ngjitni lidhjen e YouTube/podkastit." },
      { name: "thumbnail_url", label: "Foto e kopertinës (opsionale)", type: "image", bucket: "media" },
      { name: "caption", label: "Përshkrimi", type: "textarea", wide: true },
      { name: "album", label: "Albumi", type: "text" },
      { name: "club_id", label: "Klubi", type: "relation", relation: { table: "clubs", labelField: "name" } },
      { name: "taken_at", label: "Data", type: "date" },
      { name: "width", label: "Gjerësia (px)", type: "number" },
      { name: "height", label: "Lartësia (px)", type: "number" },
      de("title", "Titulli"),
      de("album", "Albumi"),
      de("caption", "Përshkrimi", "textarea"),
    ],
  },
  {
    key: "dokumente",
    table: "documents",
    label: "Dokumentet",
    singular: "Dokument",
    description: "Rregullore, plane dhe formularë për shkarkim.",
    tags: ["documents"],
    minRole: "editor",
    publishable: true,
    verification: false,
    titleField: "title",
    listColumns: [
      { name: "title", label: "Titulli" },
      { name: "category", label: "Kategoria" },
      { name: "status", label: "Statusi", kind: "badge" },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchFields: ["title", "category"],
    publicPath: "/dokumentet",
    group: "Media",
    fields: [
      { name: "title", label: "Titulli", type: "text", required: true, wide: true },
      { name: "category", label: "Kategoria", type: "text", defaultValue: "Të përgjithshme" },
      { name: "description", label: "Përshkrimi", type: "textarea", wide: true },
      { name: "file_url", label: "Skedari", type: "file", bucket: "documents", required: true, fileMeta: { size: "file_size", type: "file_type" } },
      de("title", "Titulli"),
      de("category", "Kategoria"),
      de("description", "Përshkrimi", "textarea"),
    ],
  },
  {
    key: "shifra",
    table: "stats",
    label: "Shifrat",
    singular: "Shifër",
    description: "Statistikat në ballinë. Shfaqen vetëm ato të verifikuara, me burim.",
    tags: ["stats"],
    minRole: "editor",
    publishable: false,
    verification: true,
    titleField: "label",
    listColumns: [
      { name: "label", label: "Etiketa" },
      { name: "value", label: "Vlera" },
      { name: "year", label: "Viti" },
      { name: "verification", label: "Verifikimi", kind: "badge" },
    ],
    orderBy: { column: "sort_order", ascending: true },
    searchFields: ["label"],
    group: "Shkolla",
    fields: [
      { name: "value", label: "Vlera", type: "number", required: true },
      { name: "suffix", label: "Prapashtesa", type: "text", help: "P.sh. %" },
      { name: "label", label: "Etiketa", type: "text", required: true, help: "P.sh. nxënës" },
      { name: "source", label: "Burimi", type: "text", required: true, wide: true },
      { name: "year", label: "Viti i të dhënës", type: "text", required: true },
      { name: "sort_order", label: "Renditja", type: "number", defaultValue: 0 },
      verificationField,
      de("label", "Etiketa"),
      de("source", "Burimi"),
    ],
  },
];

export function getResource(key: string) {
  return RESOURCES.find((r) => r.key === key) ?? null;
}
