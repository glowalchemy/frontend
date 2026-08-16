/**
 * Stock-status normalization shared by product cards and the product detail
 * page so listing and PDP always apply the EXACT same rules.
 *
 * Authoritative field: `product.stock` (Product schema, Number, default 0).
 * Color-variant products may carry per-variant `stock`; callers keep the
 * existing precedence (selected variant stock ?? product stock).
 *
 * Rules:
 *   stock <= 0            -> "Out of Stock"
 *   stock 1..5            -> "Left N"
 *   stock > 5             -> "In Stock"
 *
 * Missing/invalid values are treated as UNAVAILABLE (Out of Stock), matching
 * the application's existing behavior: `Number(undefined ?? 0)` produced 0 and
 * every consumer treated <= 0 as out of stock. We never guess "In Stock".
 */

/**
 * Normalize any stock value to a safe non-negative integer.
 * null / undefined / '' / NaN / invalid strings / negatives -> 0 (unavailable).
 */
export function normalizeStock(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

/**
 * Compute the display status for a stock value.
 * @returns {{ state: 'in'|'low'|'out', label: string, stock: number }}
 */
export function getStockStatus(value) {
  const stock = normalizeStock(value);
  if (stock <= 0) return { state: 'out', label: 'Out of Stock', stock };
  if (stock <= 5) return { state: 'low', label: `Left ${stock}`, stock };
  return { state: 'in', label: 'In Stock', stock };
}
