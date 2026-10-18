/* ============================================================
   build.mjs — data/site.json + projects/ + las páginas → dist/, la web
   tal cual se publica.        node build/build.mjs

   Cada animación tiene su dirección, /animacion/<slug>/, con su title,
   description, canonical y og:image (antes todas eran animacion.html?v=…,
   una sola página para Google, que sigue funcionando). La home lleva,
   escondidos a la vista, los enlaces a todas: lo que leen Google y los
   lectores de pantalla.

   Si algo está mal (una coma, un campo mal escrito, un vídeo que no está)
   para y dice qué, y no se publica nada: la web se queda como estaba.
   ============================================================ */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugsOf, toOld } from '../js/house.js';
import { leerJSON, validar } from '../js/validar.js';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const OUT = join(ROOT, 'dist');
const at = (...p) => join(ROOT, ...p);
const fail = (msg) => { console.error(`\n✗ ${msg}\n\nNo se ha publicado nada: la web sigue como estaba.\n`); process.exit(1); };

/* ---------- leer y revisar ---------- */

const read = (rel) => {
  if (!existsSync(at(rel))) fail(`no encuentro ${rel}`);
  try { return leerJSON(readFileSync(at(rel), 'utf8'), rel); } catch (e) { fail(e.message); }
};
const schema = (t) => JSON.parse(readFileSync(at('schema', `${t}.json`), 'utf8'));
const site = read('data/site.json');
const errors = validar(site, schema('site'), 'data/site.json');
const slugs = errors.length ? [] : slugsOf(site);
const projects = {};
for (const slug of slugs) {
  const rel = `projects/${slug}/project.json`;
  if (projects[slug]) { errors.push(`data/site.json: "${slug}" está dos veces en "lists"`); continue; }
  if (!existsSync(at(rel))) { errors.push(`data/site.json: "lists" dice "${slug}", y no hay ningún ${rel}`); continue; }
  projects[slug] = read(rel);
  errors.push(...validar(projects[slug], schema('project'), rel));
  for (const f of ['video.webm', 'thumbnail.webm']) if (!existsSync(at('projects', slug, f))) errors.push(`${rel}: falta projects/${slug}/${f}`);
}
if (errors.length) fail(errors.join('\n✗ '));
const data = toOld(site, projects);

/* Dónde se publica (las dos copias en GitHub Pages: hay vídeos de más de
   25 MB, que Cloudflare no publica). En nuestra copia (meowrhino),
   meowrhino.github.io/<repo>/ y sin indexar; en la de Irene, o en local, la
   raíz con el dominio de site.json → "url", y se indexa si lo hay. */
const ours = process.env.GITHUB_REPOSITORY_OWNER === 'meowrhino';
const repo = (process.env.GITHUB_REPOSITORY || '/').split('/')[1];
const BASE = ours ? `/${repo}` : '';
const SITE = ours ? `https://meowrhino.github.io${BASE}` : String(site.url || '').replace(/\/+$/, '');
const INDEX = !ours && !!site.url;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LOGO = 'data/_LOGO/930blurberrie_logo.png';

/* ---------- la imagen al compartir, con sharp: el póster de cada animación ---------- */

let sharp = null;
try { sharp = (await import('sharp')).default; } catch (e) {
  console.warn(`⚠ sin sharp (${e.code || e.message}): al compartir sale el logo. Se arregla con: npm ci`);
}
const ogs = new Map();
for (const slug of slugs) {
  const src = `projects/${slug}/poster.png`;
  if (!sharp || !existsSync(at(src))) continue;
  const cached = at('.cache', 'og', `${slug}.jpg`);
  try {
    if (!(existsSync(cached) && statSync(cached).mtimeMs >= statSync(at(src)).mtimeMs)) {
      mkdirSync(dirname(cached), { recursive: true });
      const bg = projects[slug].colors?.bg && /^#[0-9a-f]{6}$/i.test(projects[slug].colors.bg) ? projects[slug].colors.bg : '#000000';
      await sharp(at(src)).resize(1104, 534, { fit: 'contain', background: bg })
        .extend({ top: 48, bottom: 48, left: 48, right: 48, background: bg })
        .flatten({ background: bg }).jpeg({ quality: 85, mozjpeg: true }).toFile(cached);
    }
    ogs.set(slug, cached);
  } catch (e) {
    console.warn(`⚠ ${src}: sharp no la puede leer (${e.message})`);
  }
}
const ogUrl = (slug) => (ogs.has(slug) ? `${SITE}/og/${slug}.jpg` : `${SITE}/${LOGO}`);

/* ---------- las páginas ---------- */

function swap(html, find, replace, file) {
  if (!find.test(html)) fail(`no encuentro ${find} en ${file}: el build lo necesita para escribir las páginas.`);
  return html.replace(find, replace);
}
const metaSet = (html, re, value, file) => swap(html, re, (_, a, b) => `${a}${esc(value)}${b}`, file);
const built = (html, file) => {
  html = swap(html, /<html lang="es">/, '<html lang="es" data-built>', file);
  // en github.io, o sin dominio, no se indexa
  return INDEX ? html : html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex">');
};
const sr = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';

function animationPage(slug) {
  const file = 'animacion.html';
  const p = projects[slug];
  const url = `${SITE}/animacion/${encodeURIComponent(slug)}/`;
  const title = `${p.name} — ${site.siteTitle}`;
  let html = built(readFileSync(at(file), 'utf8'), file);
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`, file);
  html = metaSet(html, /(<link rel="canonical" href=")[^"]*(")/, url, file);
  html = metaSet(html, /(<meta property="og:title" content=")[^"]*(")/, title, file);
  html = metaSet(html, /(<meta property="og:url" content=")[^"]*(")/, url, file);
  html = metaSet(html, /(<meta property="og:image" content=")[^"]*(")/, ogUrl(slug), file);
  html = swap(html, /(<meta charset="UTF-8">)/, `$1\n    <base href="../../">\n    <script>window.__SLUG__ = ${JSON.stringify(slug)};</script>`, file);
  return swap(html, /(<body[^>]*>)/, `$1\n    <h1 style="${sr}">${esc(title)}</h1>`, file);
}

function homePage() {
  const file = 'index.html';
  let html = built(readFileSync(at(file), 'utf8'), file);
  const links = data.animaciones.proyectos.map((a) => `<a href="animacion/${encodeURIComponent(a.slug)}/">${esc(a.name)}</a>`).join(' ');
  return swap(html, /(<body[^>]*>)/, `$1\n    <nav style="${sr}">${links} <a href="about.html">about</a> <a href="dressme.html">dress me</a></nav>`, file);
}

/* ---------- escribir dist/ ---------- */

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const f of ['css', 'js', 'data', 'projects']) cpSync(at(f), join(OUT, f), { recursive: true, filter: (x) => !x.endsWith('.DS_Store') });
for (const f of ['about.html', 'dressme.html', 'animacion.html', '404.html']) writeFileSync(join(OUT, f), built(readFileSync(at(f), 'utf8'), f));
writeFileSync(join(OUT, 'index.html'), homePage());
mkdirSync(join(OUT, 'og'), { recursive: true });
for (const [slug, cached] of ogs) cpSync(cached, join(OUT, 'og', `${slug}.jpg`));
for (const slug of slugs) {
  mkdirSync(join(OUT, 'animacion', slug), { recursive: true });
  writeFileSync(join(OUT, 'animacion', slug, 'index.html'), animationPage(slug));
}
const urls = ['', 'about.html', 'dressme.html', ...slugs.map((s) => `animacion/${encodeURIComponent(s)}/`)].map((p) => `${SITE}/${p}`);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), INDEX ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
writeFileSync(join(OUT, '.nojekyll'), '');

console.log(`✓ dist/: home, about, dressme y ${slugs.length} animaciones${INDEX ? ` · se indexa (${SITE})` : ' · sin indexar'}`);
