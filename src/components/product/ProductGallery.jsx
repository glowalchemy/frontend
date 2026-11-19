import React, { useCallback } from 'react';
import OptimizedImage from '../shared/OptimizedImage';

/**
 * Product image gallery.
 *
 * `images` is a DEDUPLICATED array of { url, media } — the parent is
 * responsible for removing duplicate URLs. If only one unique image exists the
 * thumbnail rail is hidden entirely.
 *
 * Main image uses the 1200w optimized variant with priority (LCP image);
 * thumbnails use 320w variants, lazy. Reveal follows the OptimizedImage
 * lifecycle: placeholder -> download -> load -> decode -> reveal.
 */
const ProductGallery = ({ images = [], alt = '', activeIndex = 0, onSelect, outOfStock = false }) => {
  const current = images[Math.min(activeIndex, Math.max(0, images.length - 1))];

  const goTo = useCallback(
    (dir) => {
      if (images.length < 2) return;
      const next = (Math.min(activeIndex, images.length - 1) + dir + images.length) % images.length;
      if (typeof onSelect === 'function') onSelect(next);
    },
    [images.length, activeIndex, onSelect]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(1);
      }
    },
    [goTo]
  );

  return (
    <div>
      {/* Main image */}
      <div
        className="aspect-square bg-white rounded-xl overflow-hidden relative"
        tabIndex={images.length > 1 ? 0 : -1}
        role={images.length > 1 ? 'group' : undefined}
        aria-roledescription="Product image gallery"
        aria-label={`${alt} — use arrow keys to change image`}
        onKeyDown={handleKeyDown}
      >
        {current ? (
          <OptimizedImage
            src={current.url}
            variants={current.media?.variants || null}
            width={current.media?.width || undefined}
            height={current.media?.height || undefined}
            alt={alt}
            priority
            className="w-full h-full object-contain"
            wrapperClassName="w-full h-full"
            fallbackType="product"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-glowalchemy-sand/30">
            <span className="text-glowalchemy-warm-gray">Image unavailable</span>
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-white/55 flex items-center justify-center z-[5]">
            <span className="bg-white/90 text-glowalchemy-charcoal border border-glowalchemy-sand px-4 py-2 rounded-lg font-semibold text-sm shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 text-xs font-medium bg-white/85 text-glowalchemy-warm-gray px-2 py-1 rounded-md">
            {Math.min(activeIndex, images.length - 1) + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnail rail — hidden when there is only one unique image */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-3" role="tablist" aria-label="Product images">
          {images.map((img, index) => (
            <button
              key={img.url}
              type="button"
              role="tab"
              aria-selected={index === Math.min(activeIndex, images.length - 1)}
              aria-label={`View image ${index + 1}`}
              onClick={() => typeof onSelect === 'function' && onSelect(index)}
              className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta ${
                index === Math.min(activeIndex, images.length - 1)
                  ? 'border-glowalchemy-terracotta ring-2 ring-glowalchemy-terracotta/20'
                  : 'border-glowalchemy-sand hover:border-glowalchemy-warm-gray'
              }`}
            >
              <OptimizedImage
                src={img.url}
                variants={img.media?.variants || null}
                alt=""
                className="w-full h-full object-contain"
                wrapperClassName="w-full h-full"
                fallbackType="thumbnail"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
