import React from 'react';
import { FiShoppingCart, FiZap, FiCheck, FiAlertTriangle } from 'react-icons/fi';

/**
 * Mobile sticky purchase bar: Add to Cart + Buy Now, thumb-reachable, pinned
 * to the very bottom of the viewport (the app's bottom nav is hidden on
 * product pages), hidden on lg+ where the in-flow buttons are used.
 * Disabled with a clear label when out of stock.
 */
const PurchaseBar = ({
  stockStatus,
  addToCartLoading,
  justAdded,
  buying,
  onAddToCart,
  onBuyNow,
}) => {
  const out = stockStatus?.state === 'out';

  return (
    <div className="fixed inset-x-0 lg:hidden z-50 bg-white border-t border-glowalchemy-sand px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ bottom: 0 }}
    >
      <div className="flex gap-3 max-w-3xl mx-auto">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={out || addToCartLoading}
          aria-label={out ? 'Add to Cart — out of stock' : 'Add to Cart'}
          aria-live="polite"
          className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-glowalchemy-terracotta text-glowalchemy-terracotta font-semibold text-sm transition-colors active:bg-glowalchemy-terracotta/10 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
        >
          {justAdded ? (
            <>
              <FiCheck className="w-4 h-4" /> Added
            </>
          ) : addToCartLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-glowalchemy-terracotta border-t-transparent rounded-full animate-spin" /> Adding…
            </>
          ) : (
            <>
              <FiShoppingCart className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          disabled={out || buying}
          aria-label={out ? 'Buy Now — out of stock' : 'Buy Now'}
          aria-live="polite"
          className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-glowalchemy-terracotta text-white font-semibold text-sm shadow-sm transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
        >
          {buying ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…
            </>
          ) : out ? (
            <>
              <FiAlertTriangle className="w-4 h-4" /> Out of Stock
            </>
          ) : (
            <>
              <FiZap className="w-4 h-4" /> Buy Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PurchaseBar;
