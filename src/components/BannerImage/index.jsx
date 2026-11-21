import React, { useState } from 'react';

/**
 * BannerImage — aspect-ratio-aware banner renderer.
 *
 * - `ratio` (e.g. "16/6", "4/5"): fixed container ratio. The image is shown
 *   with object-contain so the FULL artwork is always visible; mismatched
 *   artwork gets soft cream space (no blur bands, no crop, no distortion).
 * - `ratio={null}` (default): the container adopts the image's intrinsic
 *   aspect ratio once loaded (clamped to sane bounds), so portrait posters
 *   get portrait cards and landscape art gets landscape cards — zero
 *   letterboxing. Before load, a 3/2 placeholder reserves space (CLS-safe).
 *
 * Background is a flat brand cream — never a blurred copy of the image.
 */
const BannerImage = ({
  src,
  alt = 'banner',
  ratio = null,
  eager = false,
  fetchPriority = 'auto',
  className = '',
  imgClassName = '',
  onLoad,
  ratioClassName = '',
  ...rest
}) => {
  const [natural, setNatural] = useState(null); // { w, h }

  const handleLoad = (e) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    }
    onLoad?.(e);
  };

  const useClassRatio = Boolean(ratioClassName);
  let aspectStyle;
  if (!useClassRatio) {
    if (ratio) {
      aspectStyle = { aspectRatio: ratio.replace('/', ' / ') };
    } else if (natural) {
      // Clamp extreme ratios so a panorama doesn't become a sliver and a tall
      // poster doesn't become a skyscraper inside promo grids.
      const r = natural.w / natural.h;
      const clamped = Math.min(2.4, Math.max(0.6, r));
      aspectStyle = { aspectRatio: String(clamped) };
    } else {
      aspectStyle = { aspectRatio: '3 / 2' }; // pre-load placeholder
    }
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-[var(--color-surface-muted)] ${ratioClassName} ${className}`}
      style={aspectStyle}
      {...rest}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : fetchPriority}
        onLoad={handleLoad}
        className={`absolute inset-0 h-full w-full object-contain ${imgClassName}`}
      />
    </div>
  );
};

export default BannerImage;
