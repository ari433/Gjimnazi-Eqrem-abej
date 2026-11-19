# Gjimnazi "Eqrem Çabej" — official website

Public website and staff CMS for Gjimnazi "Eqrem Çabej", Prishtinë: a social-linguistic sciences gymnasium named after the linguist Eqrem Çabej.

- **Public site** (Albanian): homepage, about, history and mission, leadership and staff, programmes with detail pages, news with article pages, announcements, events calendar, clubs, Media Club, student projects, achievements, photo and video gallery, documents, student information, contact.
- **Admin panel** at `/admin`: Supabase Auth, role-based access (admin / editor / contributor), drafts, scheduled publishing, uploads, homepage editing, contact inbox, user roles.

The previous static site is preserved in `legacy/`.

## Stack

Next.js 16 (App Router, Cache Components, Partial Prefetching) · TypeScript · Tailwind CSS 4 · Motion · GSAP ScrollTrigger · Lenis · Supabase (Postgres, Auth, Storage, RLS) · Zod · Lucide.

Fonts (Schibsted Grotesk, Newsreader) are self-hosted from `src/fonts` — no runtime calls to Google Fonts.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional for a first look
npm run dev                  # http://localhost:3000
```

Without Supabase variables the public site renders from the local, verified seed in `src/lib/content/seed.ts`, and `/admin` shows setup instructions. Nothing breaks; nothing is invented.

## Connect Supabase

1. Create a Supabase project.
2. Run the migration, then the seed, in the SQL editor (or with the Supabase CLI):
   - `supabase/migrations/20261105120000_init_schema.sql` — tables, RLS policies, role helpers, storage buckets
   - `supabase/migrations/20261106090000_german_and_media_fields.sql` — German (`*_de`) columns, article galleries and source links, staff video, achievement links
   - `supabase/seed.sql` — verified starting content (generated from the local seed, see below)
3. Set environment variables (`.env.local` locally, Project → Settings → Environment Variables on Vercel):

   | Variable | Where it is used |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph, auth email links |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (or legacy anon) key. Safe in the browser: RLS limits it to published content and contact-form inserts |
   | `SUPABASE_SERVICE_ROLE_KEY` | Optional, **server only**. Only used to send staff invites. Never prefix with `NEXT_PUBLIC_` |

4. In Supabase → Authentication → URL Configuration, set the Site URL and add `https://YOUR-DOMAIN/auth/callback` to the redirect allow list (used by invites and password resets).
5. Create the first staff account (Authentication → Users → Add user), then promote it:

   ```sql
   update public.profiles set role = 'admin' where email = 'name@example.com';
   ```

   From then on, admins invite and manage everyone else at `/admin/perdoruesit`.

## Two languages: Albanian and German

- Albanian lives at `/`, German at `/de` (same slugs: `/de/lajme/...`). The header switcher keeps the current page.
- Every content type has German twins of its text fields (`title_de`, `body_de`, …). In the admin they sit in the collapsible **Përkthimi në gjermanisht** section of each form; the homepage blocks have their own "· DE" sections under *Ballina dhe faqja*.
- An item without a German translation still appears on `/de`, in Albanian, with a short "nur auf Albanisch" note. Nothing is machine-translated at runtime.
- Interface text (menus, buttons, labels) lives in `src/lib/i18n.ts`. Each page sets `hreflang` alternates for both languages.

## Roles

| Role | Can do |
| --- | --- |
| `admin` | Everything, including assigning roles. Cannot change their own role. |
| `editor` | Create, edit, publish, schedule, archive and delete all content; edit the homepage; read contact messages. |
| `contributor` | Write news drafts and upload images. Cannot publish, cannot edit published or other people's posts. |
| `viewer` | Default for new accounts. No panel access until promoted. |

Permissions are enforced three times: optimistic redirect in `src/proxy.ts`, a server-side check in every admin page and server action (`src/lib/admin/auth.ts`), and Row Level Security in Postgres. The database is the source of truth: a crafted request with the publishable key still cannot read drafts or write anything except a contact message.

## How publishing works

- Every publishable item has `status` (`draft` / `published` / `archived`) and `published_at`.
- **Scheduling** is a published item with a future `published_at`. RLS hides it until that moment; public pages are cached for about a minute, so it appears on time without a cron job.
- Saving in the panel invalidates the matching cache tag (`updateTag`), so edits show immediately.

## Content honesty

The brief forbids invented facts. The codebase enforces that:

- `verification` (`verified` / `pending`) on programmes, staff, clubs, events, achievements and stats. Pending items show a visible "Në pritje të verifikimit" badge.
- Statistics only render when verified and always show their source and year.
- Missing phone, email or opening hours render as "pending", never as placeholders that look real.
- Local demo items (`is_example`) are labelled "Shembull", describe the website itself, and are never written to the database.
- Student names appear only where the school itself published them (student council results, the Bonn delegation, the Play International team).
- Articles without a known date hide it (`show_date = false`) instead of guessing one.

### Verified sources used in the seed

- *Plani Zhvillimor i Shkollës 2021–2024* (published by the Municipality of Prishtina): address, profile history (1990 philology profile, 2012–13 building, 2021–22 social-linguistic profile by MASHTI decision 2-854), director, subjects taught, facilities, vision and mission, school activities, and the 2021 figures (696 students, 36 regular teachers, 92% Matura pass rate).
- The school's previous website: the Instagram account and the director's name.
- Announcements supplied by the school (November 2026): student council 2026–27, the breast-cancer awareness run, Play International training and project, eTwinning registration, the ZfA seminar in Bonn (27–31 January 2025), the DSD visit and the EduCamp week in Germany — published as news in Albanian and German, with the school's photos in `public/media/`.
- The German Language Diploma (DSD) programme since 2002–2003, as stated in the school's DSD announcement.
- Director Shemsedin Beqiri's interview: https://youtu.be/ce6JNTZt5es

## Real content still needed from the school

1. More photos (facilities, sports, clubs). Only with consent for identifiable students.
2. Official phone, email and office hours.
3. Exact dates for the news articles (currently hidden).
4. Learning outcomes and post-graduation pathways for each programme; subject hours per grade.
5. Teaching staff list (names, subjects, optional photos) with each person's consent.
6. Clubs, mentors and meeting times; Media Club productions, podcast episodes, team (with consent).
7. Academic calendar, class schedule, Matura dates, enrollment rules for grade X.
8. Achievements with year and documentation.
9. Updated statistics for the current school year.
10. Founding year and early history (not in the 2021 plan).
11. Facebook / YouTube / TikTok accounts, if official ones exist.

All of the above is editable in `/admin` — no code changes needed.

## Project structure

```
src/
  app/(site)/         public pages
  app/admin/(auth)/   login, password reset, set password
  app/admin/(panel)/  dashboard, CRUD for every content type, homepage, messages, users
  app/auth/callback/  email link handler
  components/         ui, layout, motion, home, admin, media, events, news
  lib/content/        typed data access (cached) + local seed
  lib/admin/          resource config, validation, auth helpers
  lib/supabase/       browser, server, public and service clients
  proxy.ts            session refresh + admin guard
supabase/             migration and generated seed
scripts/              seed generator, RLS test
```

The CMS is config-driven: `src/lib/admin/resources.ts` describes each content type (fields, list columns, permissions, cache tags). Adding a field means adding a column in a migration and one entry there.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `npm run typecheck` | ESLint, TypeScript |
| `npm run db:seed` | Regenerates `supabase/seed.sql` from `src/lib/content/seed.ts` |
| `npm run test:rls` | Runs the migration and seed in an in-memory Postgres (PGlite) and checks 27 permission rules |

## Deploying to Vercel

1. Import the repository, framework preset Next.js.
2. Add the environment variables above for Production and Preview.
3. Point the domain, set `NEXT_PUBLIC_SITE_URL` to it, and update the Supabase auth URLs.

## Accessibility and performance notes

- Semantic landmarks, skip link, visible focus, keyboard-operable menus, tabs, lightbox and calendar.
- `prefers-reduced-motion` disables smooth scrolling, the hero scroll sequence and entrance animations.
- Images through `next/image` (AVIF/WebP); YouTube embeds load only on click (privacy-enhanced domain).
- Public pages are prerendered and revalidated; admin pages render per request.
