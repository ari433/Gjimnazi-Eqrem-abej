/**
 * Builds a static preview of the PUBLIC site for GitHub Pages (or any static
 * host) by rendering the production build and saving every page.
 *
 * Usage: node scripts/build-static-preview.mjs [basePath] [siteUrl]
 *   default basePath: /Gjimnazi-Eqrem-abej
 * Output: ./preview-out (push its contents to the gh-pages branch)
 *
 * What does not work in a static preview: /admin, the contact form, and
 * anything that needs Supabase. The preview always uses the local seed.
 */
import { spawn, execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { NAV } from "./preview-routes.mjs";

const base = process.argv[2] ?? "/Gjimnazi-Eqrem-abej";
const site = process.argv[3] ?? `https://ari433.github.io${base}`;
const OUT = "preview-out";
const PORT = 3217;

const env = {
  ...process.env,
  PREVIEW_BASE_PATH: base,
  NEXT_PUBLIC_BASE_PATH: base,
  NEXT_PUBLIC_SITE_URL: site,
  NEXT_PUBLIC_STATIC_PREVIEW: "1",
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
};

// .env.local could point at a database; the preview must use the seed only.
const hadEnv = existsSync(".env.local");
if (hadEnv) renameSync(".env.local", ".env.local.preview-bak");
try {
  execSync("npx next build", { stdio: "inherit", env });
} finally {
  if (hadEnv) renameSync(".env.local.preview-bak", ".env.local");
}

// Detached so the whole process group (npx + next-server) can be stopped.
const server = spawn("npx", ["next", "start", "-p", String(PORT)], { env, stdio: "ignore", detached: true });
const origin = `http://localhost:${PORT}`;
for (let i = 0; i < 60; i++) {
  try {
    await fetch(`${origin}${base}`);
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const pages = new Set(NAV);
const saved = new Set();
const extra = new Set();

async function savePage(route) {
  const res = await fetch(`${origin}${base}${route === "/" ? "" : route}`);
  if (!res.ok) throw new Error(`${route}: HTTP ${res.status}`);
  const html = await res.text();
  const file = route === "/" ? join(OUT, "index.html") : join(OUT, route, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  saved.add(route);
  // Discover internal pages and non-HTML files referenced by this page.
  const re = new RegExp(`(?:href|src|content)="${base.replace(/[/-]/g, "\\$&")}(/[^"#?]*)?`, "g");
  for (const m of html.matchAll(re)) {
    const p = m[1] || "/";
    if (p.startsWith("/_next/") || p.startsWith("/admin")) continue;
    if (/\.[a-z0-9]+$/i.test(p) || p.includes("opengraph-image")) extra.add(p);
    else pages.add(p.replace(/\/$/, "") || "/");
  }
  console.log("page", route);
}

while ([...pages].some((p) => !saved.has(p))) {
  for (const p of [...pages]) if (!saved.has(p)) await savePage(p);
}

for (const p of [...extra, "/sitemap.xml", "/robots.txt"]) {
  const res = await fetch(`${origin}${base}${p}`);
  if (!res.ok) continue;
  const file = join(OUT, p);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log("file", p);
}

const nf = await fetch(`${origin}${base}/kjo-faqe-nuk-ekziston`);
writeFileSync(join(OUT, "404.html"), await nf.text());

process.kill(-server.pid, "SIGTERM");
cpSync(".next/static", join(OUT, "_next/static"), { recursive: true });
cpSync("public", OUT, { recursive: true });
writeFileSync(join(OUT, ".nojekyll"), ""); // keep the _next folder on GitHub Pages
console.log(`\nStatic preview ready in ${OUT}/ (${saved.size} pages)`);
