import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar, FiCheck, FiPackage } from "react-icons/fi";
import ImageWithFallback from "../shared/ImageWithFallback";
import Button from "../shared/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { normalizeProductForColorVariants } from "../../utils/colorVariants";

const ProductCardModern = ({ product, hideAddToCart = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedColorVariant] = useState(null);

  const normalized = useMemo(() => {
    try {
      if (!product) return null;
      const baseProduct = normalizeProductForColorVariants(product);
      const id = baseProduct.id || baseProduct._id;

      const hasColorVariants = baseProduct.colorVariants && baseProduct.colorVariants.length > 0;
      const defaultVariant = hasColorVariants ? baseProduct.colorVariants[0] : null;
      const currentVariant = selectedColorVariant || defaultVariant;

      const image = currentVariant?.images?.[0] || baseProduct.image || baseProduct.img || baseProduct.galleryImages?.[0] || "";
      const price = Number(currentVariant?.price ?? baseProduct.price ?? 0);
      const originalPrice = Number(baseProduct?.originalPrice ?? baseProduct?.management?.pricing?.originalPrice ?? 0);
      const stock = Number(currentVariant?.stock ?? baseProduct.stock ?? 0);
      const sku = currentVariant?.sku || baseProduct.sku || "";
      const brand = baseProduct.brand || baseProduct.category || "";

      const saleEnabled = !!baseProduct.saleEnabled;
      const saleDiscount = Number(baseProduct.saleDiscount ?? baseProduct.discount ?? 0);
      const saleStart = baseProduct.saleStartDate ? new Date(baseProduct.saleStartDate) : null;
      const saleEnd = baseProduct.saleEndDate ? new Date(baseProduct.saleEndDate) : null;
      const now = new Date();
      const isSaleActive =
        saleEnabled &&
        saleDiscount > 0 &&
        (!saleStart || Number.isNaN(saleStart.getTime()) || saleStart <= now) &&
        (!saleEnd || Number.isNaN(saleEnd.getTime()) || saleEnd >= now);

      const displayPrice = isSaleActive ? price - (price * saleDiscount) / 100 : price;
      const displayMrp = originalPrice > 0 ? originalPrice : price;

      const reviewsArray = Array.isArray(baseProduct.reviews) ? baseProduct.reviews : [];
      const rating = reviewsArray.length > 0
        ? reviewsArray.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsArray.length
        : baseProduct.rating || 0;

      return {
        id,
        name: baseProduct.name ?? baseProduct.title ?? "",
        image,
        price: displayPrice,
        originalPrice: displayMrp,
        stock,
        sku,
        brand,
        rating,
        reviewCount: reviewsArray.length,
        isSaleActive,
        saleDiscount,
        hasColorVariants,
        colorVariants: baseProduct.colorVariants,
        colors: baseProduct.colors,
      };
    } catch (err) {
      console.error("ProductCard normalization error:", err);
      return null;
    }
  }, [product, selectedColorVariant]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!normalized || !user || normalized.stock <= 0) {
      if (!user) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(normalized.id, 1, {
        name: normalized.name,
        image: normalized.image,
        price: normalized.price,
        brand: normalized.brand,
        sku: normalized.sku,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (normalized?.id) {
      toggleWishlist(normalized.id);
    }
  };

  if (!normalized) {
    return null;
  }

  return (
    <Link
      to={`/product/${normalized.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-trozzi-sand/50 hover:border-trozzi-terracotta/50"
    >
      <div className="relative aspect-square bg-trozzi-ivory/50 overflow-hidden">
        <ImageWithFallback
          src={normalized.image}
          alt={normalized.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          fallbackType="card"
          aspectRatio="1/1"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
        >
          {isInWishlist(normalized.id) ? (
            <FiHeart className="w-4 h-4 fill-current text-trozzi-terracotta" />
          ) : (
            <FiHeart className="w-4 h-4 text-trozzi-charcoal" />
          )}
        </button>

        {/* Sale Badge */}
        {normalized.isSaleActive && normalized.saleDiscount > 0 && (
          <div className="absolute top-3 left-3 bg-trozzi-terracotta text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{normalized.saleDiscount}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {normalized.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-trozzi-charcoal px-4 py-2 rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Brand */}
        {normalized.brand && (
          <p className="text-xs text-trozzi-warm-gray uppercase tracking-wide mb-1 truncate">
            {normalized.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-trozzi-charcoal mb-2 line-clamp-2 group-hover:text-trozzi-terracotta transition-colors">
          {normalized.name}
        </h3>

        {/* Rating */}
        {normalized.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(normalized.rating)
                      ? "text-trozzi-terracotta fill-current"
                      : "text-trozzi-sand"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-trozzi-warm-gray">
              ({normalized.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-trozzi-charcoal">
            {formatPrice(normalized.price)}
          </span>
          {normalized.originalPrice > normalized.price && (
            <span className="text-sm text-trozzi-warm-gray line-through">
              {formatPrice(normalized.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {!hideAddToCart && (
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || normalized.stock <= 0}
            loading={isAddingToCart}
            variant="primary"
            size="md"
            className="w-full"
          >
            {justAdded ? (
              <>
                <FiCheck className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <FiShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </Button>
        )}
      </div>
    </Link>
  );
};

export default ProductCardModern;
