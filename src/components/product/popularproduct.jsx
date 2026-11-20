import React, { useCallback, useEffect, useState } from 'react';
import ProductRail from '../home/ProductRail';
import { fetchPopularProducts } from '../../api/catalog';

const PopularProducts = ({ hideAddToCart = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPopularProducts({ limit: 12 });
      const items = Array.isArray(data) ? data : data.items || [];
      setProducts(items);
    } catch (_e) {
      setError('Failed to load popular products.');
      setProducts([]);
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
      id="popular-products"
      eyebrow="Loved By Many"
      title="Popular Products"
      subtitle="Customer favourites chosen for everyday radiance."
      products={products}
      loading={loading}
      error={error}
      onRetry={load}
      emptyMessage="Our popular edit is being restocked."
      hideAddToCart={hideAddToCart}
    />
  );
};

export default PopularProducts;
