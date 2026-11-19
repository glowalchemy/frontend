//         </div>

//         <button
//           type="button"
//           onClick={handleAddToCart}
//           disabled={isAddingToCart || normalized.stock <= 0}
//           className={
//             isList
//               ? "mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
//               : "mt-auto w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
//           }
//         >
//           {justAdded ? (
//             <>
//               <FaCheck />
//               Added
//             </>
//           ) : (
//             <>
//               <FaShoppingCart />
//               {isAddingToCart ? "Adding..." : "Add to cart"}
//             </>
//           )}
//         </button>
//       </div>
//     </div>
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaHeart, FaRegHeart, FaShareAlt, FaShoppingCart, FaStar, FaTruck, FaExclamationTriangle, FaBan } from "react-icons/fa";
import OptimizedImage from "../shared/OptimizedImage";
import { getStockStatus } from "../../utils/stockStatus";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { normalizeProductForColorVariants } from "../../utils/colorVariants";

const ProductCard = ({ product, view = "grid", hideAddToCart = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [selectedColorVariant] = useState(null);

  const normalized = useMemo(() => {
    try {
      if (!product) return null;
      const baseProduct = normalizeProductForColorVariants(product);
      const id = baseProduct.id || baseProduct._id;
      const name = baseProduct.name ?? baseProduct.title ?? "";

      // Handle color variants
      const hasColorVariants = baseProduct.colorVariants && baseProduct.colorVariants.length > 0;
      const defaultVariant = hasColorVariants ? baseProduct.colorVariants[0] : null;
      const currentVariant = selectedColorVariant || defaultVariant;

      // Get image from variant or fallback to product image
      const image = currentVariant?.images?.[0] || baseProduct.image || baseProduct.img || baseProduct.galleryImages?.[0] || "";

      // Responsive metadata for the displayed image (only when it matches).
      const primaryMedia =
        baseProduct.imageMedia && baseProduct.imageMedia.url === image
          ? baseProduct.imageMedia
          : (Array.isArray(baseProduct.media)
              ? baseProduct.media.find((m) => m && m.url === image && m.variants)
              : null) || null;
      const mediaByUrl = new Map();
      for (const e of Array.isArray(baseProduct.media) ? baseProduct.media : []) {
        if (e && e.url) mediaByUrl.set(e.url, e);
      }

      // Get price from variant or fallback to product price
      const price = Number(currentVariant?.price ?? baseProduct.price ?? 0);

      const originalPrice = Number(baseProduct?.originalPrice ?? baseProduct?.management?.pricing?.originalPrice ?? 0);

      // Get stock from variant or fallback to product stock
      const stock = Number(currentVariant?.stock ?? baseProduct.stock ?? 0);
      const stockStatus = getStockStatus(stock);

      // Get SKU from variant or fallback to product SKU
      const sku = currentVariant?.sku || baseProduct.sku || "";

      const brand = baseProduct.brand || baseProduct.category || "";

      const featured = Boolean(baseProduct.featured ?? baseProduct?.management?.marketing?.featured);
      const badge = String(baseProduct.badge ?? baseProduct?.management?.marketing?.badge ?? '').trim();
      const freeShipping = typeof baseProduct?.freeShipping === 'boolean'
        ? baseProduct.freeShipping
        : Boolean(baseProduct?.management?.shipping?.freeShipping);

      const salePageEnabled = Boolean(baseProduct?.salePageEnabled ?? baseProduct?.management?.salePage?.enabled);
      const salePageBannerText = String(baseProduct?.salePageBannerText ?? baseProduct?.management?.salePage?.bannerText ?? '');

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
      const reviewsCount = Number.isFinite(Number(baseProduct.reviews))
        ? Number(baseProduct.reviews)
        : reviewsArray.length;

      const ratingNumber = Number(baseProduct.rating);
      const avgFromReviews = reviewsArray.length
        ? reviewsArray.reduce((sum, r) => sum + Number(r?.rating ?? 0), 0) / reviewsArray.length
        : 0;
      const rating = Number.isFinite(ratingNumber) && ratingNumber > 0 ? ratingNumber : avgFromReviews;
      const reviews = Number.isFinite(reviewsCount) ? reviewsCount : 0;

      const discountPercent = displayMrp > 0 && displayPrice > 0 && displayMrp > displayPrice
        ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
        : 0;

      return {
        id,
        name,
        brand,
        price,
        originalPrice: displayMrp,
        image,
        imageMedia: primaryMedia,
        mediaByUrl,
        stockStatus,
        galleryImages: currentVariant?.images ?? (Array.isArray(baseProduct.galleryImages) ? baseProduct.galleryImages : []),
        isSaleActive,
        saleDiscount,
        displayPrice,
        rating,
        reviews,
        stock,
        sku,
        hasColorVariants,
        colorVariants: baseProduct.colorVariants || [],
        currentVariant,
        discountPercent,
        featured,
        badge,
        freeShipping,
        salePageEnabled,
        salePageBannerText,
        management: baseProduct?.management,
      };
    } catch (_e) {
      return null;
    }
  }, [product, selectedColorVariant]);

  if (!normalized) return null;

  const displayImage = hoveredImage || normalized.image;
  const currentImageMedia =
    (normalized.mediaByUrl && normalized.mediaByUrl.get(displayImage)) ||
    (displayImage === normalized.image ? normalized.imageMedia : null) ||
    null;
  const wishlisted = isInWishlist(normalized.id);

  const formatPrice = (value) => `₹${Number(value || 0).toLocaleString()}`;

  const handleProductClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${normalized.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!normalized.id) return;
    await toggleWishlist(normalized.id);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (!normalized.id) return;

    const url = `${window.location.origin}/product/${normalized.id}`;
    const title = String(normalized.name || 'Product');

    try {
      if (navigator.share) {
        await navigator.share({ title, text: title, url });
        return;
      }
    } catch (_e) {
      // ignore
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        window.prompt('Copy this link:', url);
      }
    } catch (_e) {
      window.prompt('Copy this link:', url);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAddingToCart || normalized.stock <= 0 || !normalized.id) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search || ""}`)}`);
      return;
    }

    try {
      setIsAddingToCart(true);

      await addToCart(normalized.id, 1, {
        name: normalized.name,
        image: displayImage,
        price: displaySelling,
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

  const isList = view === "list";
  const safeRating = Number.isFinite(Number(normalized.rating)) ? Number(normalized.rating) : 0;
  const displayMrp = Number(normalized.originalPrice ?? 0) || 0;
  const displaySelling = Number(normalized.displayPrice ?? 0) || 0;

  const shouldShowDiscount = (String(normalized?.badge || '').toLowerCase() === 'sale') || Boolean(normalized?.isSaleActive);
  const shouldShowOffers = Boolean(normalized?.salePageEnabled) || Boolean(String(normalized?.salePageBannerText || '').trim());
  const shouldShowFreeDelivery = Boolean(normalized?.freeShipping);
  const shouldShowRating = safeRating > 0 || Number(normalized?.reviews || 0) > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleProductClick}

      onKeyDown={(e) => {
        if (e.key === "Enter") handleProductClick();
      }}
      className={
        isList
          ? "group cursor-pointer overflow-hidden rounded-lg bg-glowalchemy-white border border-glowalchemy-sand hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex h-[280px]"
          : "group cursor-pointer overflow-hidden rounded-lg bg-glowalchemy-white border border-glowalchemy-sand hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
      }
    >
      <div className={isList ? "transition-transform duration-300 flex flex-row h-full" : "transition-transform duration-300 flex flex-col"}>
        {/* Image Section */}
        <div
          className={
            isList
              ? "aspect-[4/5] bg-glowalchemy-ivory overflow-hidden relative w-[220px] min-w-[220px]"
              : "aspect-square sm:aspect-[4/5] bg-glowalchemy-ivory overflow-hidden relative"
          }
        >
          <div className="relative overflow-hidden w-full h-full">
            <OptimizedImage
              src={displayImage}
              variants={currentImageMedia?.variants || null}
              width={currentImageMedia?.width || undefined}
              height={currentImageMedia?.height || undefined}
              alt={normalized.name}
              className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
              wrapperClassName="w-full h-full"
              fallbackType="card"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          </div>

          {/* Out of Stock Overlay — light gray, image stays visible underneath */}
          {normalized.stockStatus?.state === "out" && (
            <div className="absolute inset-0 bg-white/55 flex items-center justify-center z-[5]">
              <span className="bg-white/90 text-glowalchemy-charcoal border border-glowalchemy-sand px-3 py-1.5 rounded-lg font-semibold text-xs shadow-sm">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {shouldShowDiscount && normalized.discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-glowalchemy-terracotta text-white text-xs px-2 py-1 rounded-md font-bold shadow-md animate-bounce-in">
              {normalized.discountPercent}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 h-9 w-9 rounded-full bg-glowalchemy-white/95 backdrop-blur flex items-center justify-center shadow-sm hover:bg-glowalchemy-white transition-all"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlisted ? (
              <FaHeart className="text-glowalchemy-terracotta" />
            ) : (
              <FaRegHeart className="text-glowalchemy-charcoal" />
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="absolute top-2 right-12 h-9 w-9 rounded-full bg-glowalchemy-white/95 backdrop-blur flex items-center justify-center shadow-sm hover:bg-glowalchemy-white transition-all"
            aria-label="Share product"
          >
            <FaShareAlt className="text-glowalchemy-charcoal" />
          </button>

          {/* Gallery Thumbnails */}
          {normalized.galleryImages?.length > 1 && !isList && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              {normalized.galleryImages.slice(0, 4).map((url, idx) => (
                <button
                  key={`${normalized.id}-thumb-${idx}`}
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredImage(url);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setHoveredImage(null);
                  }}
                  className={
                    hoveredImage === url
                      ? "h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-glowalchemy-terracotta overflow-hidden"
                      : "h-6 w-6 sm:h-7 sm:w-7 rounded-full border border-glowalchemy-white/60 overflow-hidden"
                  }
                >
                  <OptimizedImage
                    src={url}
                    variants={(normalized.mediaByUrl && normalized.mediaByUrl.get(url)?.variants) || null}
                    alt=""
                    className="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
                    fallbackType="thumbnail"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div
          className={
            isList
              ? "p-3 space-y-2 flex flex-col flex-1 min-w-0"
              : "p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 flex flex-col flex-1"
          }
        >
          {/* Product Title */}
          <h3 className="font-semibold text-xs sm:text-[15px] text-glowalchemy-charcoal line-clamp-2 leading-snug">
            {normalized.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-[20px] font-extrabold text-glowalchemy-charcoal">{formatPrice(displaySelling)}</span>
            {displayMrp > displaySelling ? (
              <span className="text-xs sm:text-sm text-glowalchemy-warm-gray line-through">{formatPrice(displayMrp)}</span>
            ) : null}
            {normalized.discountPercent > 0 ? (
              <span className="text-xs sm:text-sm text-glowalchemy-terracotta font-semibold">{normalized.discountPercent}% off</span>
            ) : null}
          </div>

          <div className="mt-1 hidden sm:block">
            {shouldShowOffers ? (
              <div className="inline-flex items-center rounded-md border border-glowalchemy-sand bg-glowalchemy-ivory text-glowalchemy-charcoal px-2 py-1 text-[10px] sm:text-[12px] font-semibold">
                ₹{Math.max(1, Math.round(displaySelling * 0.055))} with 2 Special Offers
              </div>
            ) : null}
          </div>

          <div className="mt-1 hidden sm:block">
            {shouldShowFreeDelivery ? (
              <div className="flex items-center gap-2 text-[12px] text-glowalchemy-warm-gray">
                <span className="inline-flex items-center gap-1">
                  <FaTruck className="text-[14px] text-glowalchemy-charcoal" />
                  Free Delivery
                </span>
              </div>
            ) : null}
          </div>

          {/* Stock Status */}
          {normalized.stockStatus?.state === "in" && (
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-green-700">
              <FaCheck className="text-[11px]" /> In Stock
            </div>
          )}
          {normalized.stockStatus?.state === "low" && (
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-glowalchemy-terracotta">
              <FaExclamationTriangle className="text-[11px]" /> {normalized.stockStatus.label}
            </div>
          )}
          {normalized.stockStatus?.state === "out" && (
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-red-600">
              <FaBan className="text-[11px]" /> Out of Stock
            </div>
          )}

          <div className="flex items-center justify-between pt-1 sm:pt-2">
            {shouldShowRating ? (
              <div className="inline-flex items-center gap-1 bg-glowalchemy-terracotta text-white px-2 py-1 rounded-md text-[10px] sm:text-[12px] font-semibold">
                <span>{safeRating.toFixed(1)}</span>
                <FaStar className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                <span className="text-white/90">({Number(normalized.reviews || 0)})</span>
              </div>
            ) : (
              <span />
            )}
          </div>

          {!hideAddToCart ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart || normalized.stock <= 0}
              className="mt-1.5 sm:mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-[13px] font-semibold bg-glowalchemy-terracotta text-white hover:bg-glowalchemy-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {justAdded ? (
                <>
                  <FaCheck />
                  Added
                </>
              ) : (
                <>
                  <FaShoppingCart />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;