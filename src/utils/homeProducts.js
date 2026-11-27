/**
 * Helpers for the merchandised home sections (hero + bestsellers).
 * Product data always comes from the existing catalog API — these helpers
 * only pick which real products to surface and give safe copy fallbacks.
 */

export const stripHtml = (value) => {
  const raw = typeof value === 'string' ? value : '';
  if (!raw) return '';
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
};

const matches = (product, needles) => {
  const haystack = `${product?.name || product?.title || ''} ${product?.category || ''}`.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
};

export const productImage = (product) =>
  product?.image ||
  product?.img ||
  product?.galleryImages?.[0] ||
  product?.colorVariants?.[0]?.images?.[0] ||
  '';

export const productId = (product) => product?.id || product?._id || '';

export const productSlug = (product) => String(product?.slug ?? '').trim();

export const pickHeroProducts = (products) => {
  const list = Array.isArray(products) ? products.filter((p) => productImage(p)) : [];
  const slots = [
    ['body wash', 'bodywash', 'exfoliating', 'body lotion'],
    ['pomegranate', 'night cream', 'cream', 'moistur'],
    ['rosemary', 'hair spray', 'hair growth', 'hair'],
  ];

  const used = new Set();
  const picked = slots.map((needles) => {
    const found = list.find((p) => {
      const id = productId(p) || productImage(p);
      if (used.has(id)) return false;
      return matches(p, needles);
    });
    if (found) used.add(productId(found) || productImage(found));
    return found || null;
  });

  const leftovers = list.filter((p) => !used.has(productId(p) || productImage(p)));

  return picked.map((product, index) => {
    if (product) {
      return {
        name: product.name || product.title || 'GlowAlchemy',
        image: productImage(product),
        id: productId(product),
        slug: productSlug(product),
        fromApi: true,
      };
    }
    const fallbackProducts = [
      { name: 'Daily Exfoliating Body Wash', image: '/body.jpg' },
      { name: 'Pomegranate Youth Renewal Night Cream', image: '/skin.jpg' },
      { name: 'Rosemary Water Hair Re-Growth Spray', image: '/hair.jpg' },
    ];
    const extra = leftovers[index];
    if (extra) {
      return {
        name: extra.name || extra.title || 'GlowAlchemy',
        image: productImage(extra),
        id: productId(extra),
        slug: productSlug(extra),
        fromApi: true,
      };
    }
    return { ...fallbackProducts[index], id: '', fromApi: false };
  });
};

export const BESTSELLER_FALLBACKS = [
  {
    key: 'body-wash',
    title: 'Daily Exfoliating Body Wash',
    needles: ['body wash', 'bodywash', 'exfoliating', 'body cleanser'],
    image: '/body.jpg',
    description:
      'A creamy, gently exfoliating body wash that lifts away dullness and leaves skin soft, smooth and beautifully scented.',
    cta: 'Shop Now',
  },
  {
    key: 'night-cream',
    title: 'Pomegranate Youth Renewal Night Cream',
    needles: ['pomegranate', 'night cream', 'renewal', 'night moistur'],
    image: '/skin.jpg',
    description:
      'An overnight renewing cream with pomegranate goodness that restores moisture and reveals a fresh, radiant morning glow.',
    cta: 'Shop Now',
  },
  {
    key: 'rosemary-water',
    title: 'Rosemary Water Hair Re-Growth Spray',
    needles: ['rosemary', 'hair spray', 'hair growth', 'hair water'],
    image: '/hair.jpg',
    description:
      'A lightweight rosemary water mist that refreshes the scalp, strengthens roots and supports healthier, fuller-looking hair.',
    cta: 'Shop Now',
  },
];

export const pickBestsellers = (products) => {
  const list = Array.isArray(products) ? products : [];
  const used = new Set();

  return BESTSELLER_FALLBACKS.map((fallback) => {
    const match = list.find((p) => {
      const id = productId(p) || productImage(p) || p?.name;
      if (used.has(id)) return false;
      return matches(p, fallback.needles) && productImage(p);
    });

    if (match) {
      used.add(productId(match) || productImage(match) || match?.name);
      const price = Number(match?.saleEnabled && match?.saleDiscount ? 0 : match?.price) || 0;
      return {
        key: fallback.key,
        id: productId(match),
        slug: productSlug(match),
        title: match.name || match.title || fallback.title,
        description: stripHtml(match.description || match.shortDescription || '') || fallback.description,
        image: productImage(match),
        price: price > 0 ? `₹${price.toLocaleString('en-IN')}` : '',
        cta: fallback.cta,
      };
    }

    return {
      key: fallback.key,
      id: '',
      title: fallback.title,
      description: fallback.description,
      image: fallback.image,
      price: '',
      cta: fallback.cta,
    };
  });
};
