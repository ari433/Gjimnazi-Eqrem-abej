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
- Student names (club teams, projects) are only published with consent; the seed contains none.

### Verified sources used in the seed

- *Plani Zhvillimor i Shkollës 2021–2024* (published by the Municipality of Prishtina): address, profile history (1990 philology profile, 2012–13 building, 2021–22 social-linguistic profile by MASHTI decision 2-854), director, subjects taught, facilities, vision and mission, school activities, and the 2021 figures (696 students, 36 regular teachers, 92% Matura pass rate).
- The school's previous website: the Instagram account, the director's name, and the German-language programme (kept as **pending** until the school confirms it).

## Real content still needed from the school

1. Photos: a wide hero photo (goes inside the "Ç"), facilities, events. Only with consent for identifiable students.
2. Official phone, email and office hours.
3. Confirmation and details of the German-language programme (partner, certificates, exchanges).
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
