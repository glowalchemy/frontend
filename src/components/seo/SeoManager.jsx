import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolvePageSeo } from '../../config/seo';
import { applySeo } from '../../utils/seo';

/**
 * Applies centralized per-route SEO metadata (title, description, canonical,
 * Open Graph, Twitter, robots and JSON-LD) on every React Router navigation.
 *
 * Product-slug routes resolve to null here — ProductDetailModern manages its
 * own product metadata through the same applySeo() head manager, so there is
 * exactly one writer per page and no duplicate or stale tags.
 */
const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const config = resolvePageSeo(location.pathname);
    if (!config) return;
    applySeo(config);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
