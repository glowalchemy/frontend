/**
 * Canonical product URL helper.
 * SEO-friendly slug URL: /vitamin-c-face-serum
 * Falls back to the legacy /product/:id URL when no slug exists.
 */
export function productUrl(product) {
  const slug = String(product?.slug ?? '').trim();
  if (slug) return `/${slug}`;
  const id = product?.id ?? product?._id ?? product?.productId;
  return id ? `/product/${id}` : '/';
}
