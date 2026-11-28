/**
 * Centralized document-head manager for SEO.
 *
 * applySeo() deterministically upserts every managed tag (title, meta
 * description, canonical, robots, Open Graph, Twitter) and replaces the
 * single JSON-LD script. Because every call writes absolute values and
 * removes tags that no longer apply, stale metadata from a previous route
 * can never leak into the next one during React Router navigation.
 */
import { SEO_SITE, buildPageJsonLd } from '../config/seo';

export const JSONLD_SCRIPT_ID = 'glowalchemy-jsonld';

const upsertMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const removeMeta = (attr, key) => {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
};

const upsertCanonical = (href) => {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const upsertJsonLd = (payload) => {
  document.getElementById(JSONLD_SCRIPT_ID)?.remove();
  if (!payload) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = JSONLD_SCRIPT_ID;
  script.textContent = JSON.stringify(payload);
  document.head.appendChild(script);
};

/**
 * Apply SEO metadata to the document head.
 *
 * @param {object} config - resolved page config (from config/seo.js) or a
 *   custom object: { title, description, canonicalUrl|path, image, type,
 *   noindex, jsonLd }
 */
export const applySeo = (config = {}) => {
  if (!config || typeof document === 'undefined') return;

  const { title, description } = config;
  const canonicalUrl =
    config.canonicalUrl ||
    (config.path != null ? `${SEO_SITE.domain}${config.path === '/' ? '/' : config.path}` : null);
  const image = config.image || SEO_SITE.defaultImage;
  const ogType = config.type || 'website';
  const noindex = Boolean(config.noindex);

  if (title) document.title = title;
  if (description != null) upsertMeta('name', 'description', description);
  if (canonicalUrl) upsertCanonical(canonicalUrl);

  if (noindex) {
    upsertMeta('name', 'robots', 'noindex, nofollow');
  } else {
    // Public page — make sure a stale noindex from a private route is gone.
    removeMeta('name', 'robots');
  }

  if (title) upsertMeta('property', 'og:title', title);
  if (description != null) upsertMeta('property', 'og:description', description);
  if (canonicalUrl) upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:type', ogType);
  upsertMeta('property', 'og:site_name', SEO_SITE.name);
  upsertMeta('property', 'og:locale', SEO_SITE.ogLocale);
  if (image) upsertMeta('property', 'og:image', image);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  if (title) upsertMeta('name', 'twitter:title', title);
  if (description != null) upsertMeta('name', 'twitter:description', description);
  if (image) upsertMeta('name', 'twitter:image', image);

  upsertJsonLd(config.jsonLd !== undefined ? config.jsonLd : buildPageJsonLd(config));
};

export default applySeo;
