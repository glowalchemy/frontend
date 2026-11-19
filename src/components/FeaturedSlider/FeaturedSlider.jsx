import React, { useEffect, useState } from "react";
import ProductCard from "../product/ProductCard";

import { fetchProducts } from "../../api/catalog";

const FeaturedSlider = ({ hideAddToCart = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts({ mode: "public", page: 1, limit: 12, featured: true, fields: "basic" });
        if (cancelled) return;
        const list = Array.isArray(data) ? data : (data.items || []);
        setItems(list);
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load products");
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-4 sm:py-8 bg-glowalchemy-ivory">
        <div className="px-3 sm:px-6">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-glowalchemy-charcoal mb-4">Featured Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-glowalchemy-sand/50 overflow-hidden">
                <div className="aspect-square bg-glowalchemy-ivory/50 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-glowalchemy-sand/50 rounded animate-pulse" />
                  <div className="h-4 bg-glowalchemy-sand/50 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-4 sm:py-8 bg-glowalchemy-ivory">
        <div className="px-3 sm:px-6">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-glowalchemy-charcoal mb-4">Featured Products</h2>
          <div className="bg-white rounded-2xl border border-glowalchemy-sand p-6 text-center">
            <p className="text-glowalchemy-warm-gray mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-glowalchemy-terracotta text-white rounded-xl font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-4 sm:py-8 bg-glowalchemy-ivory">
        <div className="px-3 sm:px-6">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-glowalchemy-charcoal mb-4">Featured Products</h2>
          <div className="bg-white rounded-2xl border border-glowalchemy-sand p-8 text-center">
            <p className="text-glowalchemy-warm-gray">No featured products available right now.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-10 px-3 sm:px-6 bg-glowalchemy-ivory">
      <div className="">
        <h2 className="text-[16px] sm:text-[22px] md:text-[26px] font-bold text-glowalchemy-charcoal mb-1.5 sm:mb-4 text-center">Featured Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 lg:gap-6">
          {items.map((item, idx) => {
            const stableId = item?.id || item?._id || item?.slug || item?.sku;
            const stableKey = String(stableId || `featured-${idx}`);
            const normalizedItem = stableId && !item?.id ? { ...item, id: stableKey } : { ...(item || {}), id: stableKey };
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
