import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../product/ProductCard';
import SectionHeading from '../home/SectionHeading';

/**
 * Shared storefront product section. Keeps every home product rail on the same
 * grid, heading, loading and empty-state treatment while reusing the existing
 * ProductCard + catalog data.
 */
const ProductRail = ({
  id,
  eyebrow,
  title,
  subtitle,
  products = [],
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No products available right now.',
  emptyHint = 'Our next collection is on its way — explore the full store in the meantime.',
  viewAllTo = '/ProductListing',
  hideAddToCart = false,
  className = '',
  // Skeleton count matches the rail's request limit so the loading grid has the
  // same number of rows as the loaded grid — replacing it causes no shift.
  skeletonCount = 12,
}) => {
  const items = Array.isArray(products) ? products : [];

  return (
    <section id={id} className={`ga-section bg-[var(--color-background)] ${className}`}>
      <div className="ga-container">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          align="left"
          action="View All"
          actionTo={viewAllTo}
        />

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white"
              >
                <div className="aspect-[4/5] animate-pulse bg-pink-light" />
                <div className="space-y-2 p-3.5">
                  <div className="h-3 w-4/5 animate-pulse rounded bg-[var(--color-border)]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--color-border)]" />
                  <div className="h-8 w-full animate-pulse rounded-full bg-pink-light" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-white px-6 py-12 text-center">
            <FiRefreshCw className="mx-auto mb-3 text-2xl text-burgundy" aria-hidden="true" />
            <p className="text-[15px] font-medium text-[var(--color-text)]">We couldn&apos;t load these products</p>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-[var(--color-text-muted)]">
              {error} Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={onRetry || (() => window.location.reload())}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-burgundy-deep"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-muted)] px-6 py-14 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-burgundy shadow-[0_8px_20px_rgba(20,61,43,0.08)]">
              <FiPackage className="text-xl" aria-hidden="true" />
            </span>
            <p className="ga-serif text-xl text-[var(--color-text)]">{emptyMessage}</p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[var(--color-text-muted)]">{emptyHint}</p>
            <Link
              to={viewAllTo}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-burgundy-deep"
            >
              Explore The Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item, index) => {
              const stableId = item?.id || item?._id || item?.slug || item?.sku;
              const stableKey = String(stableId || `${id || title}-${index}`);
              const normalizedItem = { ...(item || {}), id: stableId || stableKey };
              return (
                <ProductCard
                  key={stableKey}
                  product={normalizedItem}
                  hideAddToCart={hideAddToCart}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductRail;
