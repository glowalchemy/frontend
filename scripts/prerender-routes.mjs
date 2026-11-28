#!/usr/bin/env node
/**
 * Build-time route-specific HTML generation ("prerendered shells").
 *
 * The app is still a client-rendered SPA — this script does NOT render
 * React. It clones the built dist/index.html once per static public route
 * and swaps only the <head> metadata (title, description, canonical,
 * robots, Open Graph, Twitter, JSON-LD) using src/config/seo.js as the
 * single source of truth. Each route is emitted as
 * dist/<route>/index.html so a standard nginx setup
 * (`try_files $uri $uri/ /index.html` + `index index.html`) serves the
 * correct initial HTML on direct loads, while unknown paths (product
 * slugs, client-side navigations) still fall back to the SPA shell.
 *
 * Runs automatically after `vite build` (see package.json "build").
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PAGE_SEO,
  NOINDEX_PATHS,
  SEO_SITE,
  resolvePageSeo,
  buildPageJsonLd,
} from '../src/config/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const TEMPLATE_PATH = join(DIST, 'index.html');

/* ------------------------------ helpers ------------------------------ */

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Replace the content attribute of the first <meta ...> matching attr="key". */
const setMeta = (html, attr, key, content) => {
  const pattern = new RegExp(
    `(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`,
    'i',
  );
  if (pattern.test(html)) {
    return html.replace(pattern, `$1${escapeHtml(content)}$2`);
  }
  // Tag missing entirely — insert before </head>.
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
  return html.replace('</head>', `    ${tag}\n  </head>`);
};

const removeMeta = (html, attr, key) =>
  html.replace(new RegExp(`<meta\\s+${attr}="${key}"[^>]*/?>\\s*`, 'gi'), '');

const setCanonical = (html, href) =>
  html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/i,
    `$1${escapeHtml(href)}$2`,
  );

const setTitle = (html, title) =>
  html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);

const setJsonLd = (html, payload) => {
  // Strip any previously injected prerendered JSON-LD, then add the route's.
  let out = html.replace(
    /\s*<script type="application\/ld\+json" id="glowalchemy-jsonld">[\s\S]*?<\/script>/g,
    '',
  );
  if (!payload) return out;
  // Escape "<" so JSON can never break out of the script element.
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  const tag = `    <script type="application/ld+json" id="glowalchemy-jsonld">${json}</script>\n`;
  return out.replace('</head>', `${tag}  </head>`);
};

/* --------------------------- route collection ------------------------ */

// Derive the concrete route list from the centralized config — no second
// copy of the route table. PAGE_SEO `paths` arrays hold the public routes;
// NOINDEX_PATHS covers auth/checkout/account/admin.
const routeSet = new Set();
for (const entry of PAGE_SEO) {
  for (const p of entry.paths || []) routeSet.add(p);
}
for (const p of NOINDEX_PATHS) routeSet.add(p);
// Admin sub-pages that are real routes (the rest redirect to /admin).
routeSet.add('/admin/reviews');
routeSet.add('/admin/settings');

// Normalize: strip trailing slashes (except root) and de-duplicate.
const routes = [...routeSet]
  .map((p) => (p === '/' ? '/' : p.replace(/\/+$/, '')))
  .filter((p, i, arr) => arr.indexOf(p) === i)
  .sort();

/* ------------------------------ render ------------------------------- */

const template = readFileSync(TEMPLATE_PATH, 'utf8');
let written = 0;
const failures = [];

for (const route of routes) {
  try {
    const config = resolvePageSeo(route);
    if (!config) {
      failures.push(`${route}: resolvePageSeo returned null`);
      continue;
    }

    const canonicalUrl = `${SEO_SITE.domain}${route === '/' ? '/' : route}`;
    const title = config.title || SEO_SITE.name;
    const description = config.description || '';
    const image = SEO_SITE.defaultImage;

    let html = template;
    html = setTitle(html, title);
    html = setMeta(html, 'name', 'description', description);
    html = setCanonical(html, canonicalUrl);

    if (config.noindex) {
      // Ensure the directive exists exactly once for direct loads.
      html = removeMeta(html, 'name', 'robots');
      html = setMeta(html, 'name', 'robots', 'noindex, nofollow');
    } else {
      html = removeMeta(html, 'name', 'robots');
    }

    html = setMeta(html, 'property', 'og:title', title);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'property', 'og:url', canonicalUrl);
    html = setMeta(html, 'property', 'og:type', 'website');
    html = setMeta(html, 'property', 'og:image', image);
    html = setMeta(html, 'property', 'og:site_name', SEO_SITE.name);
    html = setMeta(html, 'property', 'og:locale', SEO_SITE.ogLocale);

    html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
    html = setMeta(html, 'name', 'twitter:title', title);
    html = setMeta(html, 'name', 'twitter:description', description);
    html = setMeta(html, 'name', 'twitter:image', image);

    html = setJsonLd(html, buildPageJsonLd(config));

    // '/' -> dist/index.html ; '/about' -> dist/about/index.html ; etc.
    const outPath =
      route === '/'
        ? join(DIST, 'index.html')
        : join(DIST, ...route.split('/').filter(Boolean), 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    written += 1;
  } catch (err) {
    failures.push(`${route}: ${err.message}`);
  }
}

console.log(`[prerender] wrote ${written} route HTML files to dist/`);
if (failures.length) {
  console.error('[prerender] failures:', failures);
  process.exit(1);
}
