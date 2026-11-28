/**
 * Centralized SEO configuration — single source of truth for page metadata
 * and Schema.org structured data across the storefront.
 *
 * - Static/public pages get their title, description, canonical and social
 *   metadata from PAGE_SEO below (consumed by <SeoManager/> in App.jsx).
 * - Product pages are dynamic and keep their own SEO inside
 *   ProductDetailModern, which uses the same applySeo() head manager.
 * - Private/transactional routes are marked `noindex` so they never appear
 *   in search results (meta robots — not robots.txt blocking).
 */

import { HOME_FAQS } from '../data/homeFaqs.js';

export const SEO_SITE = {
  name: 'GlowAlchemy Care',
  domain: 'https://glowalchemycare.com',
  locale: 'en-IN',
  ogLocale: 'en_IN',
  defaultImage: 'https://glowalchemycare.com/glowalchemy-logo.png',
  // Only contact details already published on the Contact page are used.
  contact: {
    email: 'glowalchemy67@gmail.com',
    telephone: '+91 73592 30538',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
  },
};

const HOME = {
  title: 'Best Cosmetic Manufacturers in India',
  description:
    'GlowAlchemy Care offers third-party cosmetic manufacturing, private label cosmetics, skincare, haircare and custom formulation solutions in India.',
};

/**
 * Route -> metadata. `match` supports exact paths and prefix matches.
 * `schemaType` selects the WebPage subtype emitted in JSON-LD.
 * `noindex: true` emits <meta name="robots" content="noindex, nofollow">.
 */
export const PAGE_SEO = [
  {
    paths: ['/'],
    ...HOME,
    schemaType: 'WebPage',
    home: true,
  },
  {
    paths: ['/ProductListing', '/ProductListing/'],
    prefix: '/ProductListing',
    title: 'Shop Skincare & Haircare | GlowAlchemy Care',
    description: "Discover GlowAlchemy Care's range of skincare, haircare and personal-care products.",
    schemaType: 'CollectionPage',
  },
  {
    paths: ['/about'],
    title: 'About GlowAlchemy Care | Cosmetic Manufacturer',
    description:
      'Discover GlowAlchemy Care, an Indian cosmetic manufacturer and beauty brand supporting skincare, haircare and personal-care product development.',
    schemaType: 'AboutPage',
  },
  {
    paths: ['/contact'],
    title: 'Contact GlowAlchemy Care | Manufacturing Enquiries',
    description:
      'Contact GlowAlchemy Care to discuss third-party manufacturing, private label cosmetics, custom formulations and beauty product requirements.',
    schemaType: 'ContactPage',
  },
  {
    paths: ['/services'],
    title: 'Cosmetic Manufacturing Services in India | GlowAlchemy Care',
    description:
      'Explore third-party cosmetic manufacturing, private label solutions, custom formulation and contract manufacturing services from GlowAlchemy Care.',
    schemaType: 'WebPage',
  },
  {
    paths: ['/services/private-labeling'],
    title: 'Private Label Cosmetic Manufacturers in India',
    description:
      "Develop and launch your own beauty brand with GlowAlchemy Care's private label skincare, haircare and cosmetic manufacturing solutions.",
    schemaType: 'WebPage',
  },
  {
    paths: ['/services/third-party-manufacturing'],
    title: 'Third-Party Cosmetic Manufacturing in India',
    description:
      'GlowAlchemy Care supports beauty brands with third-party cosmetic manufacturing, formulation, packaging and product development in India.',
    schemaType: 'WebPage',
  },
  {
    paths: ['/services/contract-manufacturing'],
    title: 'Cosmetic Contract Manufacturing | GlowAlchemy Care',
    description:
      'Explore cosmetic contract manufacturing solutions for businesses looking to develop and manufacture beauty products under their own brand.',
    schemaType: 'WebPage',
  },
  {
    paths: ['/blog'],
    title: 'Skincare, Haircare & Cosmetic Manufacturing Blog',
    description:
      'Explore skincare, haircare, beauty product information and cosmetic manufacturing insights from GlowAlchemy Care.',
    schemaType: 'Blog',
  },
  {
    paths: ['/company-profile'],
    title: `Company Profile | ${SEO_SITE.name}`,
    description: `${SEO_SITE.name} — cosmetic manufacturer in India offering third-party, private label and contract manufacturing along with its own beauty brand.`,
    schemaType: 'AboutPage',
  },
  {
    paths: ['/manufacturing-capabilities'],
    title: `Manufacturing Capabilities | ${SEO_SITE.name}`,
    description: `Explore the cosmetic manufacturing capabilities of ${SEO_SITE.name}, an Indian manufacturer supporting beauty brands.`,
    schemaType: 'WebPage',
  },
  {
    paths: ['/policies'],
    title: `Policies | ${SEO_SITE.name}`,
    description: `Store policies and guidelines for shopping with ${SEO_SITE.name}.`,
    schemaType: 'WebPage',
  },
  {
    paths: ['/privacy-policy'],
    title: `Privacy Policy | ${SEO_SITE.name}`,
    description: `Privacy policy for the ${SEO_SITE.name} website and store.`,
    schemaType: 'WebPage',
  },
  {
    paths: ['/terms-of-service'],
    title: `Terms of Service | ${SEO_SITE.name}`,
    description: `Terms of service for using the ${SEO_SITE.name} website and placing orders.`,
    schemaType: 'WebPage',
  },
  {
    paths: ['/shipping-policy'],
    title: `Shipping Policy | ${SEO_SITE.name}`,
    description: `Shipping policy, delivery timelines and dispatch information for ${SEO_SITE.name} orders.`,
    schemaType: 'WebPage',
  },
  {
    paths: ['/help-center'],
    title: `Help Center | ${SEO_SITE.name}`,
    description: `Answers to common questions about orders, products and shopping with ${SEO_SITE.name}.`,
    schemaType: 'WebPage',
  },
  {
    paths: ['/order-tracking'],
    title: `Track Your Order | ${SEO_SITE.name}`,
    description: `Track your GlowAlchemy Care order status and delivery updates.`,
    schemaType: 'WebPage',
  },
];

/** Routes that must never be indexed (auth, cart, checkout, account, admin). */
export const NOINDEX_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/cart',
  '/wishlist',
  '/profile',
  '/orders',
  '/checkout',
  '/payment',
  '/summary',
  '/admin',
];

const NOINDEX_TITLE = SEO_SITE.name;

/**
 * Resolve the SEO config for a pathname.
 * Returns null for product-slug routes (single-segment paths that are not
 * known static routes) — those are managed by ProductDetailModern itself.
 */
export const resolvePageSeo = (pathname) => {
  const path = String(pathname || '/').replace(/\/+$/, '') || '/';

  for (const entry of PAGE_SEO) {
    if (entry.prefix ? path.startsWith(entry.prefix) : entry.paths.includes(path)) {
      return { ...entry, path };
    }
  }

  if (NOINDEX_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) {
    return {
      path,
      title: NOINDEX_TITLE,
      description: `${SEO_SITE.name} account area.`,
      noindex: true,
      schemaType: 'WebPage',
    };
  }

  // Single-segment unknown paths are product slugs handled by the PDP.
  // Anything deeper that is not a known route is left untouched (NotFound).
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 1) return null;
  return null;
};

/* ------------------------------------------------------------------ */
/* Schema.org entity builders (single source — no duplicate objects)  */
/* ------------------------------------------------------------------ */

export const ORGANIZATION_ID = `${SEO_SITE.domain}/#organization`;
export const WEBSITE_ID = `${SEO_SITE.domain}/#website`;

export const organizationJsonLd = () => ({
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SEO_SITE.name,
  url: `${SEO_SITE.domain}/`,
  logo: {
    '@type': 'ImageObject',
    url: SEO_SITE.defaultImage,
  },
  email: SEO_SITE.contact.email,
  telephone: SEO_SITE.contact.telephone,
  address: SEO_SITE.contact.address,
});

export const websiteJsonLd = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SEO_SITE.domain}/`,
  name: SEO_SITE.name,
  inLanguage: SEO_SITE.locale,
  publisher: { '@id': ORGANIZATION_ID },
});

export const webPageJsonLd = ({ name, description, url, schemaType = 'WebPage', extra = {} }) => ({
  '@type': schemaType,
  '@id': `${url}#webpage`,
  url,
  name,
  description,
  inLanguage: SEO_SITE.locale,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORGANIZATION_ID },
  ...extra,
});

export const faqPageJsonLd = (faqs) => ({
  '@type': 'FAQPage',
  '@id': `${SEO_SITE.domain}/#faqpage`,
  mainEntity: (faqs || []).map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

/** JSON-LD payload for a resolved page config. */
export const buildPageJsonLd = (config) => {
  if (!config || config.noindex) return null;
  const url = `${SEO_SITE.domain}${config.path === '/' ? '/' : config.path}`;
  const graph = [];

  if (config.home) {
    graph.push(websiteJsonLd(), organizationJsonLd());
    graph.push(
      webPageJsonLd({
        name: config.title,
        description: config.description,
        url,
        schemaType: config.schemaType,
      }),
    );
    if (Array.isArray(HOME_FAQS) && HOME_FAQS.length) {
      graph.push(faqPageJsonLd(HOME_FAQS));
    }
    return { '@context': 'https://schema.org', '@graph': graph };
  }

  graph.push(websiteJsonLd(), organizationJsonLd());
  graph.push(
    webPageJsonLd({
      name: config.title,
      description: config.description,
      url,
      schemaType: config.schemaType,
    }),
  );
  return { '@context': 'https://schema.org', '@graph': graph };
};
