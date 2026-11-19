// Runs the migration + seed in PGlite with Supabase stand-ins and checks RLS.
// Usage: npm run test:rls
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
const R = new URL("../supabase", import.meta.url).pathname;
const db = new PGlite();
// Minimal Supabase stand-ins: roles, auth.uid(), auth.users, storage tables.
await db.exec(`
create role anon nologin; create role authenticated nologin;
create schema auth; create schema storage;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid', true), '')::uuid $$;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
grant usage on schema public, auth, storage to anon, authenticated; grant select, insert, update, delete on storage.objects to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
`);
for (const f of readdirSync(`${R}/migrations`).filter((x) => x.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(`${R}/migrations/${f}`, "utf8"));
}
await db.exec(`grant select, insert, update, delete on all tables in schema public to anon, authenticated;`);
await db.exec(readFileSync(`${R}/seed.sql`, "utf8"));
console.log("migration + seed OK");

const U = { admin: "00000000-0000-0000-0000-000000000001", editor: "00000000-0000-0000-0000-000000000002", contrib: "00000000-0000-0000-0000-000000000003", viewer: "00000000-0000-0000-0000-000000000004" };
for (const [k, id] of Object.entries(U)) await db.exec(`insert into auth.users (id, email) values ('${id}', '${k}@x.test')`);
await db.exec(`update public.profiles set role='admin' where id='${U.admin}'; update public.profiles set role='editor' where id='${U.editor}'; update public.profiles set role='contributor' where id='${U.contrib}';`);
console.log("profiles:", (await db.query(`select email, role from public.profiles order by email`)).rows.map(r=>`${r.email}=${r.role}`).join(" "));

async function as(role, uid, sql) {
  await db.exec(`reset role; select set_config('request.uid', '${uid ?? ""}', false); set role ${role};`);
  try { const r = await db.query(sql); return { ok: true, rows: r.rows, n: r.affectedRows }; }
  catch (e) { return { ok: false, err: e.message }; }
  finally { await db.exec(`reset role;`); }
}
let failed = 0;
const check = (name, cond) => { if (!cond) failed++; console.log((cond ? "PASS " : "FAIL ") + name); };

await db.exec(`insert into public.news (slug,title,status,published_at) values ('pub','Publikuar','published', now() - interval '1 hour'), ('draft-x','Draft','draft',null), ('future','Ardhshem','published', now() + interval '1 day')`);
const T3 = "slug in ('pub','draft-x','future')";
let r = await as("anon", null, `select slug from public.news where ${T3} order by slug`);
check("anon sees only published & due news", r.ok && r.rows.map(x=>x.slug).join()=== "pub");
r = await as("authenticated", U.viewer, `select slug from public.news where ${T3}`);
check("viewer sees only published news", r.ok && r.rows.length === 1);
r = await as("authenticated", U.contrib, `select slug from public.news where ${T3}`);
check("contributor sees drafts", r.ok && r.rows.length === 3);
r = await as("authenticated", U.contrib, `insert into public.news (slug,title,status) values ('c-draft','Draft kontribuesi','draft')`);
check("contributor can insert own draft", r.ok);
r = await as("authenticated", U.contrib, `insert into public.news (slug,title,status) values ('c-pub','Publikim kontribuesi','published')`);
check("contributor cannot publish", !r.ok);
r = await as("authenticated", U.contrib, `update public.news set status='published' where slug='c-draft'`);
check("contributor cannot publish own draft via update", !r.ok);
r = await as("authenticated", U.contrib, `update public.news set title='Tjeter' where slug='draft-x'`);
check("contributor cannot edit others' drafts", r.ok && r.n === 0);
r = await as("authenticated", U.editor, `update public.news set status='published' where slug='c-draft'`);
check("editor publishes", r.ok && r.n === 1);
r = await as("authenticated", U.contrib, `delete from public.news where slug='pub'`);
check("contributor cannot delete", r.ok && r.n === 0);
r = await as("authenticated", U.viewer, `insert into public.events (slug,title,starts_at) values ('e','Eventi', now())`);
check("viewer cannot insert events", !r.ok);
r = await as("authenticated", U.editor, `insert into public.events (slug,title,starts_at,status) values ('e','Eventi', now(),'published')`);
check("editor inserts events", r.ok);
r = await as("anon", null, `insert into public.contact_messages (name,email,subject,message) values ('Ari','ari@x.test','Pyetje','Mesazh testues i gjate')`);
check("anon submits contact form", r.ok);
r = await as("anon", null, `select * from public.contact_messages`);
check("anon cannot read messages", r.ok && r.rows.length === 0);
r = await as("anon", null, `insert into public.contact_messages (name,email,subject,message,handled) values ('Ari','ari@x.test','Pyetje','Mesazh testues i gjate',true)`);
check("anon cannot set handled", !r.ok);
r = await as("authenticated", U.editor, `select count(*)::int c from public.contact_messages`);
check("editor reads messages", r.ok && r.rows[0].c === 1);
r = await as("authenticated", U.editor, `update public.profiles set role='admin' where id='${U.editor}'`);
check("editor cannot self-promote", !r.ok || r.n === 0);
r = await as("authenticated", U.contrib, `update public.profiles set role='admin' where id='${U.contrib}'`);
check("contributor cannot self-promote", !r.ok);
r = await as("authenticated", U.admin, `update public.profiles set role='editor' where id='${U.viewer}'`);
check("admin changes roles", r.ok && r.n === 1);
r = await as("authenticated", U.admin, `update public.profiles set role='viewer' where id='${U.admin}'`);
check("admin cannot demote self", !r.ok);
r = await as("anon", null, `select key from public.site_content`);
check("anon reads site content (sq + de blocks)", r.ok && r.rows.length === 12);
r = await as("anon", null, `update public.site_content set value='{}' where key='hero'`);
check("anon cannot edit site content", r.ok && r.n === 0);
r = await as("anon", null, `select count(*)::int c from public.subjects`);
check("anon reads subjects of published programs", r.ok && r.rows[0].c === 13);
r = await as("anon", null, `select count(*)::int c from public.stats`);
check("anon reads verified stats", r.ok && r.rows[0].c === 3);
r = await as("authenticated", U.contrib, `insert into storage.objects (bucket_id,name) values ('media','a.jpg')`);
check("contributor uploads media", r.ok);
r = await as("authenticated", U.contrib, `insert into storage.objects (bucket_id,name) values ('documents','a.pdf')`);
check("contributor cannot upload documents", !r.ok);
r = await as("anon", null, `insert into storage.objects (bucket_id,name) values ('media','b.jpg')`);
check("anon cannot upload", !r.ok);
r = await as("anon", null, `select title_de, show_date from public.news where slug = 'vizita-ne-gjermani-educamp'`);
check("seeded German translation readable", r.ok && r.rows[0]?.title_de === "Eine Woche in Deutschland" && r.rows[0]?.show_date === false);
r = await as("authenticated", U.editor, `insert into public.site_content (key, value) values ('bogus_de', '{}')`);
check("unknown site_content key rejected", !r.ok);
const pa = (await db.query(`select published_at from public.events where slug='e'`)).rows[0];
check("published_at stamped on publish", pa.published_at !== null);
if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); } else console.log("All RLS checks passed");
