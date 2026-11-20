import React, { useCallback, useEffect, useState } from 'react';
import ProductRail from '../home/ProductRail';
import { fetchProducts } from '../../api/catalog';

const FeaturedSlider = ({ hideAddToCart = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ mode: 'public', page: 1, limit: 12, featured: true, fields: 'basic' });
      const list = Array.isArray(data) ? data : data.items || [];
      setItems(list);
    } catch (_e) {
      setError('Failed to load featured products.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return (
    <ProductRail
      id="featured-products"
      eyebrow="Curated For You"
      title="Featured Products"
      subtitle="Standout formulas from our founders' edit."
      products={items}
      loading={loading}
      error={error}
      onRetry={load}
      emptyMessage="Our featured edit is being curated."
      hideAddToCart={hideAddToCart}
    />
  );
};

export default FeaturedSlider;
