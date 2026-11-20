import React, { useCallback, useEffect, useState } from 'react';
import ProductRail from '../home/ProductRail';
import { fetchProducts } from '../../api/catalog';

const LatestProducts = ({ title = 'Latest Products', hideAddToCart = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ mode: 'public', page: 1, limit: 12, fields: 'basic' });
      const list = Array.isArray(data) ? data : data.items || [];
      setItems(list);
    } catch (_e) {
      setError('Failed to load the latest products.');
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
      id="latest-products"
      eyebrow="Just Arrived"
      title={title}
      subtitle="Fresh additions to the GlowAlchemy ritual."
      products={items}
      loading={loading}
      error={error}
      onRetry={load}
      emptyMessage="New launches are on their way."
      hideAddToCart={hideAddToCart}
    />
  );
};

export default LatestProducts;
