import React, { useCallback, useEffect, useRef, useState } from 'react';
import { variantsToSrcset } from '../shared/OptimizedImage';

/**
 * BannerImage — aspect-ratio-aware banner renderer with full-image reveal.
 *
 * - Space is reserved BEFORE the image arrives, using (in order): `ratio`,
 *   intrinsic `width`/`height` metadata from the API, or the image's own
 *   natural ratio once loaded. A 3/2 placeholder is used only while nothing
 *   is known, which keeps layout shifts to zero for API-provided banners.
 * - `ratioClassName` (e.g. "aspect-[16/9] sm:aspect-[16/6]") reserves a fixed
 *   responsive box for heroes.
 * - The image is hidden behind a neutral skeleton until it has downloaded AND
 *   decoded, then revealed with a ~150ms fade (instant for priority/LCP
 *   images so decode gating can never delay the largest paint).
 * - `variants` ({ 320: { avif, webp, width }, ... }) renders a <picture> with
 *   AVIF + WebP srcset so mobile never downloads a desktop-sized banner.
 * - Failed images render a small "Image unavailable" label, never an endless
 *   skeleton.
 * - object-contain on a flat cream backdrop keeps the FULL artwork visible:
 *   no cropping and no distortion.
 */

const DEFAULT_SIZES = '(min-width: 1280px) 1280px, 100vw';
const HANG_TIMEOUT_MS = 15000;
const DECODE_TIMEOUT_MS = 250;

const clampRatio = (r) => Math.min(2.4, Math.max(0.6, r));

const BannerImage = ({
  src,
  variants = null,
  alt = 'banner',
  ratio = null,
  eager = false,
  // Promo banners sit below the fold and must never compete with the hero/LCP
  // image for bandwidth, so they default to low priority.
  fetchPriority = 'low',
  sizes = DEFAULT_SIZES,
  width = null,
  height = null,
  className = '',
  imgClassName = '',
  onLoad,
  ratioClassName = '',
  skeletonClassName = '',
  ...rest
}) => {
  const imgRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [natural, setNatural] = useState(null); // { w, h }

  const useClassRatio = Boolean(ratioClassName);

  // Reset on src change; reveal immediately when the image is already cached.
  useEffect(() => {
    setStatus('loading');
    setNatural(null);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setStatus('ready');
      if (!ratio && !useClassRatio) setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      return undefined;
    }
    // Backstop: never leave a skeleton pulsing forever on a hung request.
    const timer = setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'ready' : current));
    }, HANG_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [src, ratio, useClassRatio]);

  const handleLoad = useCallback(
    (event) => {
      const img = imgRef.current;
      const finish = () => {
        if (img && img.naturalWidth && !ratio && !useClassRatio) {
          setNatural({ w: img.naturalWidth, h: img.naturalHeight });
        }
        setStatus('ready');
        if (typeof onLoad === 'function') onLoad(event);
      };

      // Priority (LCP) images reveal straight away — decode() gating can
      // otherwise add tens of ms to the largest paint for zero visual benefit
      // (the hero is usually the only thing on screen).
      if (eager) {
        finish();
        return;
      }

      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        finish();
      };
      const timer = setTimeout(settle, DECODE_TIMEOUT_MS);
      Promise.resolve(img && typeof img.decode === 'function' ? img.decode() : undefined)
        .catch(() => {})
        .finally(() => {
          clearTimeout(timer);
          settle();
        });
    },
    [eager, onLoad, ratio, useClassRatio]
  );

  const handleError = useCallback(() => setStatus('error'), []);

  // --- Reserved space -------------------------------------------------------
  let aspectStyle;
  if (!useClassRatio) {
    if (ratio) {
      aspectStyle = { aspectRatio: String(ratio).replace('/', ' / ') };
    } else if (Number(width) > 0 && Number(height) > 0) {
      aspectStyle = { aspectRatio: String(clampRatio(Number(width) / Number(height))) };
    } else if (natural) {
      aspectStyle = { aspectRatio: String(clampRatio(natural.w / natural.h)) };
    } else {
      aspectStyle = { aspectRatio: '3 / 2' };
    }
  }

  const avifSrcset = variantsToSrcset(variants, 'avif');
  const webpSrcset = variantsToSrcset(variants, 'webp');
  const hasVariants = Boolean(avifSrcset || webpSrcset);
  const showImage = Boolean(src) && status !== 'error';

  return (
    <div
      className={`relative w-full overflow-hidden bg-[var(--color-surface-muted)] ${ratioClassName} ${className}`}
      style={aspectStyle}
      {...rest}
    >
      {status === 'loading' && showImage && (
        <div
          className={`absolute inset-0 bg-[var(--color-surface-muted)] animate-pulse ${skeletonClassName}`}
          aria-hidden="true"
        />
      )}

      {!showImage ? (
        <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs font-medium text-[var(--color-text-muted)]">
          Image unavailable
        </div>
      ) : (
        <picture>
          {hasVariants && avifSrcset && <source type="image/avif" srcSet={avifSrcset} sizes={sizes} />}
          {hasVariants && webpSrcset && <source type="image/webp" srcSet={webpSrcset} sizes={sizes} />}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={Number(width) > 0 ? Number(width) : undefined}
            height={Number(height) > 0 ? Number(height) : undefined}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={eager ? 'high' : fetchPriority}
            onLoad={handleLoad}
            onError={handleError}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity ${
              status === 'ready' ? 'opacity-100' : 'opacity-0'
            } ${eager ? 'duration-0' : 'duration-150'} ${imgClassName}`}
          />
        </picture>
      )}
    </div>
  );
};

export default BannerImage;
