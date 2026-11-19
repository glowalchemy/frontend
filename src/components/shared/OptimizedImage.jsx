import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FiImage, FiPackage } from 'react-icons/fi';
import { getBrandDisplayName } from '../../config/brand';

/**
 * OptimizedImage — centralized responsive image component.
 *
 * - <picture> with AVIF + WebP <source> (srcset) and a compatible fallback
 *   <img> (the `src` prop is the primary display URL, already optimized).
 * - Full-load + decode reveal: the actual image stays hidden behind a
 *   skeleton until the resource has (1) downloaded, (2) fired `load`, and
 *   (3) successfully decoded via HTMLImageElement.decode() (with a safety
 *   timeout so it can never hang). Cached images are detected via
 *   img.complete && naturalWidth and revealed immediately.
 * - Explicit width/height + aspect-ratio so there is no layout shift.
 * - loading="lazy" by default, fetchpriority="high" for priority images only.
 * - Error fallback (no infinite loader).
 *
 * `variants` is the API shape: { 320: { slot, width, avif, webp }, ... } or
 * null for legacy images without optimized variants (plain img mode).
 */

const DEFAULT_SIZES = '(min-width: 640px) 50vw, 100vw';

const FALLBACK_STYLES = {
  product: 'min-h-[200px] md:min-h-[400px]',
  card: 'h-40 md:h-48',
  thumbnail: 'h-20 w-20',
  logo: 'h-12 w-32',
  default: 'min-h-[100px]',
};

const FALLBACK_ICON = {
  product: <FiPackage className="text-3xl md:text-5xl text-glowalchemy-warm-gray" />,
  card: <FiPackage className="text-3xl text-glowalchemy-warm-gray" />,
  thumbnail: <FiImage className="text-xl text-glowalchemy-warm-gray" />,
  logo: <span className="text-2xl font-bold text-glowalchemy-charcoal">{getBrandDisplayName()}</span>,
  default: <FiImage className="text-3xl text-glowalchemy-warm-gray" />,
};

const FALLBACK_TEXT = {
  product: 'Image unavailable',
  card: null,
  thumbnail: null,
  logo: null,
  default: 'Image not available',
};

/** Build a srcset string ("640w, 1200w") for one format from the variants map. */
export function variantsToSrcset(variants, format) {
  if (!variants || typeof variants !== 'object') return '';
  return Object.values(variants)
    .filter((v) => v && v[format] && Number(v.width) > 0)
    .sort((a, b) => Number(a.width) - Number(b.width))
    .map((v) => `${v[format]} ${Math.round(Number(v.width))}w`)
    .join(', ');
}

/** Derive the media descriptor (url/variants/width/height) for a product. */
export function mediaForProduct(product) {
  if (!product || typeof product !== 'object') return null;
  const primaryUrl = String(
    product.imageMedia?.url || product.image || product.img || (Array.isArray(product.galleryImages) && product.galleryImages[0]) || ''
  ).trim();
  if (!primaryUrl) return null;
  return {
    url: primaryUrl,
    variants: product.imageMedia?.variants || null,
    width: Number(product.imageMedia?.width) > 0 ? Number(product.imageMedia.width) : null,
    height: Number(product.imageMedia?.height) > 0 ? Number(product.imageMedia.height) : null,
  };
}

const OptimizedImage = ({
  src,
  variants = null,
  alt = '',
  width = null,
  height = null,
  aspectRatio = null,
  sizes = DEFAULT_SIZES,
  priority = false,
  lazy = true,
  className = '',
  wrapperClassName = '',
  style,
  fallbackType = 'default',
  decoding = 'async',
  onLoad,
  onError,
  revealTimeoutMs = 1500,
  hangTimeoutMs = 20000,
}) => {
  const imgRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  // Reset on src change; reveal immediately if the image is already cached
  // (complete + real dimensions) before React attached the load handler.
  useEffect(() => {
    setStatus('loading');
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setStatus('ready');
      return;
    }
    // Backstop: never stay behind the skeleton forever (e.g. hung request).
    const timer = setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'error' : current));
    }, hangTimeoutMs);
    return () => clearTimeout(timer);
  }, [src, hangTimeoutMs]);

  const handleLoad = useCallback(() => {
    const img = imgRef.current;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setStatus('ready');
      if (typeof onLoad === 'function') onLoad();
    };
    // decode() may reject (e.g. SVG, or a decode race) — never block reveal.
    // The safety timeout guarantees we cannot hang if decode() misbehaves.
    const timer = setTimeout(finish, revealTimeoutMs);
    Promise.resolve(typeof img?.decode === 'function' ? img.decode() : undefined)
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        finish();
      });
  }, [onLoad, revealTimeoutMs]);

  const handleError = useCallback(() => {
    setStatus('error');
    if (typeof onError === 'function') onError();
  }, [onError]);

  const resolvedRatio =
    aspectRatio ||
    (width && height ? `${width} / ${height}` : null);

  // --- Error / empty fallback (never an infinite loader) ---
  if (status === 'error' || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-glowalchemy-sand/30 ${FALLBACK_STYLES[fallbackType] || FALLBACK_STYLES.default} ${wrapperClassName}`}
        style={resolvedRatio ? { aspectRatio: resolvedRatio } : undefined}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        {FALLBACK_ICON[fallbackType] || FALLBACK_ICON.default}
        {FALLBACK_TEXT[fallbackType] && (
          <span className="mt-2 text-sm text-glowalchemy-warm-gray">{FALLBACK_TEXT[fallbackType]}</span>
        )}
      </div>
    );
  }

  const avifSrcset = variantsToSrcset(variants, 'avif');
  const webpSrcset = variantsToSrcset(variants, 'webp');
  const hasSrcset = Boolean(avifSrcset || webpSrcset);

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={resolvedRatio ? { aspectRatio: resolvedRatio } : undefined}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 bg-glowalchemy-sand/40 animate-pulse" aria-hidden="true" />
      )}

      <picture>
        {hasSrcset && avifSrcset && (
          <source type="image/avif" srcSet={avifSrcset} sizes={sizes} />
        )}
        {hasSrcset && webpSrcset && (
          <source type="image/webp" srcSet={webpSrcset} sizes={sizes} />
        )}
        <img
          ref={imgRef}
          src={src}
          srcSet={hasSrcset ? webpSrcset : undefined}
          sizes={hasSrcset ? sizes : undefined}
          alt={alt}
          width={width || undefined}
          height={height || undefined}
          loading={priority ? 'eager' : lazy ? 'lazy' : 'eager'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${status === 'ready' ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={style}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
