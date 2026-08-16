import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { FiPackage } from "react-icons/fi";

import { fetchCategories, fetchProducts } from "../../api/catalog";

const PopularProducts = ({ hideAddToCart = false }) => {
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCategories();
        if (cancelled) return;

        const top = (Array.isArray(data) ? data : [])
          .filter((c) => c && c.active)
          .filter((c) => !c.parentId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        if (top.length > 0) {
          setActiveCategoryId((prev) => prev || top[0].id);
        }
      } catch (e) {
        if (cancelled) return;
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!activeCategoryId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts({ mode: "public", page: 1, limit: 60, category: activeCategoryId });
        if (cancelled) return;
        const items = Array.isArray(data) ? data : (data.items || []);
        setProducts(items);
      } catch (e) {
        if (cancelled) return;
        setError("Failed to load products");
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeCategoryId]);

  if (loading) {
    return (
      <section className="py-4 sm:py-8 bg-trozzi-ivory">
        <div className="px-3 sm:px-6">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-trozzi-charcoal mb-4">Popular Products</h2>
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

  if (error) {
    return (
      <section className="py-4 sm:py-8 bg-trozzi-ivory">
        <div className="px-3 sm:px-6">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-trozzi-charcoal mb-4">Popular Products</h2>
          <div className="bg-white rounded-2xl border border-trozzi-sand p-6 text-center">
            <p className="text-trozzi-warm-gray mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-trozzi-terracotta text-white rounded-xl font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-4 sm:py-8 bg-trozzi-ivory">
        <div className="px-3 sm:px-6">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-trozzi-charcoal mb-4">Popular Products</h2>
          <div className="bg-white rounded-2xl border border-trozzi-sand p-8 text-center">
            <FiPackage className="w-12 h-12 text-trozzi-sand mx-auto mb-3" />
            <p className="text-trozzi-warm-gray">No products available right now.</p>
            <p className="text-sm text-trozzi-sand mt-1">Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-8 bg-trozzi-ivory">
      <div className="px-3 sm:px-6">
        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-trozzi-charcoal mb-4">Popular Products</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {products.map((product, idx) => {
            const stableId = product?.id || product?._id || product?.slug || product?.sku;
            const stableKey = String(stableId || `popular-${idx}`);
            const normalizedProduct = stableId && !product?.id ? { ...product, id: stableKey } : { ...(product || {}), id: stableKey };
            return (
              <ProductCard
                key={stableKey}
                product={normalizedProduct}
                hideAddToCart={hideAddToCart}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
