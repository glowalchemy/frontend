import React, { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";
import { fetchProducts } from "../../api/catalog";

const FeaturedSlider = ({ title, hideAddToCart = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts({ mode: "public", page: 1, limit: 12 });
        if (cancelled) return;
        const list = Array.isArray(data) ? data : (data.items || []);
        setItems(list);
      } catch (e) {
        if (cancelled) return;
        setError("Failed to load products");
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Until products are added to the store, show the loading skeleton
  // placeholders (same treatment as Popular Products) instead of an error
  // or an empty state.
  if (loading || error || items.length === 0) {
    return (
      <section className="py-4 sm:py-8 bg-trozzi-ivory">
        <div className="px-3 sm:px-6">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-trozzi-charcoal mb-4">{title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-trozzi-sand/50 overflow-hidden">
                <div className="aspect-square bg-trozzi-ivory/50 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-trozzi-sand/50 rounded animate-pulse" />
                  <div className="h-4 bg-trozzi-sand/50 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-8 bg-trozzi-ivory">
      <div className="px-3 sm:px-6">
        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-trozzi-charcoal mb-4">{title}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item, idx) => {
            const stableId = item?.id || item?._id || item?.slug || item?.sku;
            const stableKey = String(stableId || `latest-${idx}`);
            const normalizedItem = stableId && !item?.id ? { ...item, id: stableId } : { ...(item || {}), id: stableKey };
            return (
              <ProductCard
                key={stableKey}
                product={normalizedItem}
                hideAddToCart={hideAddToCart}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSlider;
