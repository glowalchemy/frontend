import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
    FiShoppingCart, FiHeart, FiShare2, FiTruck, FiRefreshCw, FiStar,
    FiMinus, FiPlus, FiPackage, FiCheck, FiAlertTriangle, FiZap, FiChevronDown, FiChevronUp,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import OptimizedImage from '../../components/shared/OptimizedImage';
import ProductGallery from '../../components/product/ProductGallery';
import ProductPdpSkeleton from '../../components/product/ProductPdpSkeleton';
import SpecificationsTable from '../../components/product/SpecificationsTable';
import PurchaseBar from '../../components/product/PurchaseBar';
import { fetchProductDetails, fetchProductReviews, submitProductReview } from '../../api/productDetails';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { normalizeColorKey, normalizeProductForColorVariants, normalizeToken } from '../../utils/colorVariants';
import { getStockStatus } from '../../utils/stockStatus';
import { trackViewContent } from '../../utils/metaPixelSdk';

const formatPrice = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(num);
};

/** Accessible, collapsible information section. */
const InfoSection = ({ id, title, children, startOpen = true }) => {
    const [open, setOpen] = useState(startOpen);
    const buttonId = `${id}-toggle`;
    const panelId = `${id}-panel`;
    return (
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden" aria-label={title}>
            <h2 className="sr-only">{title}</h2>
            <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left hover:bg-glowalchemy-ivory/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
            >
                <span className="text-base sm:text-lg font-semibold text-glowalchemy-charcoal">{title}</span>
                {open ? (
                    <FiChevronUp className="w-4 h-4 text-glowalchemy-warm-gray" />
                ) : (
                    <FiChevronDown className="w-4 h-4 text-glowalchemy-warm-gray" />
                )}
            </button>
            {open && (
                <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 sm:px-6 pb-5">
                    {children}
                </div>
            )}
        </section>
    );
};

const ProductDetailModern = () => {
    // Route is /product/:id (see App.jsx). Accept productId too so the
    // component works regardless of how the param is named.
    const routeParams = useParams();
    const productId = routeParams.productId || routeParams.id;
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [hasUserSelectedColor, setHasUserSelectedColor] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '', customerName: '', customerEmail: '' });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [reviewError, setReviewError] = useState('');

    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const productDocId = product?._id || product?.id;
    const isJewellery = String(product?.category || '').toLowerCase().includes('jewel');

    const sanitizeHtml = (input) => {
        const html = String(input ?? '').trim();
        if (!html) return '';
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            doc.querySelectorAll('script,style,iframe,object,embed').forEach((el) => el.remove());
            doc.querySelectorAll('*').forEach((el) => {
                [...el.attributes].forEach((attr) => {
                    const name = String(attr.name || '').toLowerCase();
                    const value = String(attr.value || '');
                    if (name.startsWith('on')) {
                        el.removeAttribute(attr.name);
                        return;
                    }
                    if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(value)) {
                        el.removeAttribute(attr.name);
                    }
                });
            });
            return doc.body.innerHTML;
        } catch (_e) {
            return '';
        }
    };

    const loadProductDetails = async ({ silent = false } = {}) => {
        try {
            if (!silent) setLoading(true);
            const data = await fetchProductDetails(productId);
            const normalized = normalizeProductForColorVariants(data);
            setProduct(normalized);
            setSelectedImage(0);

            const urlColor = String(searchParams.get('color') || '').trim();
            if (urlColor) setHasUserSelectedColor(true);

            if (normalized.sizes?.length > 0) {
                setSelectedSize((prev) => (prev && normalized.sizes.includes(prev) ? prev : normalized.sizes[0]));
            }

            const variants = normalized?.colorVariants || [];
            if (variants.length > 0) {
                setSelectedColor((prev) => {
                    const desired = urlColor || prev;
                    const desiredKey = normalizeColorKey(desired);
                    const desiredToken = normalizeToken(desired);
                    const match = variants.find((v) => {
                        const vName = v?.colorName ? String(v.colorName) : '';
                        const vKey = v?.color ? String(v.color) : '';
                        return (desiredToken && normalizeToken(vName) === desiredToken) || (desiredKey && normalizeToken(vKey) === normalizeToken(desiredKey));
                    });
                    return match ? match.colorName : variants[0].colorName;
                });
            } else if (normalized.colors?.length > 0) {
                setSelectedColor((prev) => {
                    const desired = urlColor || prev;
                    return desired && normalized.colors.includes(desired) ? desired : normalized.colors[0];
                });
            }
        } catch (err) {
            if (!silent) setError('Failed to load product details');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const loadReviews = async () => {
        try {
            setReviewsLoading(true);
            const data = await fetchProductReviews(productId);
            setReviews(data.reviews || []);
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            loadProductDetails();
            loadReviews();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    // ---- SEO: per-product title, meta description and JSON-LD ----
    useEffect(() => {
        if (!product) return;
        const fullTitle = `${product.name} | GlowAlchemy`;
        document.title = fullTitle;

        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', (product.metaDescription || product.description || '').slice(0, 300));

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.image || (Array.isArray(product.media) && product.media[0]?.url) || '',
            description: product.metaDescription || product.description,
            sku: product.sku || undefined,
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            offers: {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: Number(product.price ?? 0),
                availability: stockStatus.state === 'out' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
                url: window.location.href,
            },
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'product-jsonld';
        script.textContent = JSON.stringify(jsonLd);
        document.getElementById('product-jsonld')?.remove();
        document.head.appendChild(script);

        return () => {
            document.title = 'GlowAlchemy';
            document.getElementById('product-jsonld')?.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    // Meta Pixel view tracking
    const hasTrackedViewContent = useRef(false);
    const previousProductId = useRef(null);
    useEffect(() => {
        if (previousProductId.current !== productId) {
            hasTrackedViewContent.current = false;
            previousProductId.current = productId;
        }
        if (product && !loading && !hasTrackedViewContent.current) {
            trackViewContent({
                _id: product._id || product.id,
                id: product._id || product.id,
                name: product.name,
                price: Number(pricing?.displaySelling || product.price || 0),
            });
            hasTrackedViewContent.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product, loading, productId]);

    // ---- Derived state ----
    const variants = product?.colorVariants || [];
    const selectedVariant = variants.length > 0
        ? (variants.find((v) => {
            const selectedKey = normalizeColorKey(selectedColor);
            const selectedToken = normalizeToken(selectedColor);
            const vName = String(v?.colorName || '').trim();
            const vColor = String(v?.color || '').trim();
            return (
                (selectedToken && normalizeToken(vName) === selectedToken) ||
                (selectedToken && normalizeToken(vColor) === selectedToken) ||
                (selectedKey && normalizeColorKey(vName) === selectedKey) ||
                (selectedKey && normalizeColorKey(vColor) === selectedKey)
            );
        }) || variants[0])
        : null;

    const stockStatus = getStockStatus(selectedVariant?.stock ?? product?.stock);

    const pricing = (() => {
        const pickBestPrice = (...values) => {
            const nums = values.map((v) => Number(v)).filter((n) => Number.isFinite(n));
            const good = nums.find((n) => n > 1);
            if (good !== undefined) return good;
            return nums.length ? nums[0] : 0;
        };

        const price = pickBestPrice(selectedVariant?.price, product?.price, product?.management?.pricing?.sellingPrice);
        const original = pickBestPrice(
            product?.originalPrice,
            product?.management?.pricing?.originalPrice,
            product?.management?.pricing?.mrp,
        );
        const displayMrp = original > 0 ? original : price;

        const saleEnabled = Boolean(product?.saleEnabled);
        const saleDiscount = Number(product?.saleDiscount ?? product?.discount ?? 0) || 0;
        const saleStart = product?.saleStartDate ? new Date(product.saleStartDate) : null;
        const saleEnd = product?.saleEndDate ? new Date(product.saleEndDate) : null;
        const now = new Date();
        const isSaleActive = saleEnabled && saleDiscount > 0 &&
            (!saleStart || Number.isNaN(saleStart.getTime()) || saleStart <= now) &&
            (!saleEnd || Number.isNaN(saleEnd.getTime()) || saleEnd >= now);
        const displaySelling = isSaleActive ? price - (price * saleDiscount) / 100 : price;

        return { price, displayMrp, displaySelling, isSaleActive, saleDiscount };
    })();

    const baseImages = [product?.image, ...((product?.galleryImages ?? []) || [])].filter(Boolean);
    const selectedImages = variants.length > 0
        ? (hasUserSelectedColor ? (Array.isArray(selectedVariant?.images) ? selectedVariant.images.filter(Boolean) : []) : baseImages)
        : baseImages;

    // Responsive media lookup for the gallery (variants + dimensions).
    const mediaByUrl = useMemo(() => {
        const m = new Map();
        for (const e of Array.isArray(product?.media) ? product.media : []) {
            if (e && e.url) m.set(e.url, e);
        }
        if (product?.imageMedia && product.imageMedia.url) m.set(product.imageMedia.url, product.imageMedia);
        return m;
    }, [product]);

    // Deduplicated gallery: identical URLs (main == galleryImages[0] == thumbs)
    // collapse to a single entry so no duplicate thumbnails render.
    const galleryItems = useMemo(() => {
        const seen = new Set();
        const out = [];
        for (const url of selectedImages) {
            if (!url || seen.has(url)) continue;
            seen.add(url);
            const media = mediaByUrl.get(url) || null;
            out.push({ url, media });
        }
        return out;
    }, [selectedImages, mediaByUrl]);

    const activeImageIndex = Math.min(selectedImage, Math.max(0, galleryItems.length - 1));

    // ---- Real delivery / returns / seller data ----
    const management = product?.management || {};
    const shipping = management.shipping || {};
    const details = management.details || {};
    const technicalSpecs = Array.isArray(details.technicalSpecs) ? details.technicalSpecs : [];
    const returnPolicy = String(details.returnPolicy || '').trim();
    const sellerName = String(product?.brand || '').trim();
    const freeShipping = typeof product?.freeShipping === 'boolean' ? product.freeShipping : Boolean(shipping.freeShipping);
    const codAvailable = typeof product?.codAvailable === 'boolean' ? product.codAvailable : Boolean(shipping.codAvailable);
    const shippingCharge = Number(product?.shippingCharge ?? shipping.shippingCharge ?? 0) || 0;

    const trustItems = [];
    if (codAvailable) trustItems.push({ icon: FiCheck, label: 'Cash on Delivery available' });
    if (returnPolicy) trustItems.push({ icon: FiRefreshCw, label: returnPolicy });
    if (freeShipping) {
        trustItems.push({ icon: FiTruck, label: 'Free Delivery' });
    } else if (shippingCharge > 0) {
        trustItems.push({ icon: FiTruck, label: `Delivery: ${formatPrice(shippingCharge)}` });
    } else {
        trustItems.push({ icon: FiTruck, label: 'Standard delivery — calculated at checkout' });
    }

    const sizeOptions = (product?.sizes && product.sizes.length > 0) ? product.sizes : (isJewellery ? ['Free Size'] : []);
    const colorOptions = (product?.colors && product.colors.length > 0) ? product.colors : [];

    // ---- Actions ----
    const handleShare = async () => {
        if (!productDocId) return;
        const url = `${window.location.origin}${location.pathname}${location.search || ''}`;
        const title = String(product?.name || 'Product');
        try {
            if (navigator.share) {
                await navigator.share({ title, text: title, url });
                return;
            }
        } catch (_e) { /* ignore */ }
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                window.prompt('Copy this link:', url);
            }
        } catch (_e) { /* ignore */ }
    };

    const buildBuyNowItem = () => {
        const img = selectedImages[activeImageIndex] || selectedImages[0] || product.image || '';
        const cod = typeof product?.codAvailable === 'boolean' ? product.codAvailable : Boolean(shipping.codAvailable);
        const size = selectedSize || '';
        const color = variants.length > 0 ? (selectedVariant?.colorName || '') : (selectedColor || '');
        return {
            _id: productDocId,
            product: {
                _id: productDocId,
                name: product.name || 'Product',
                price: pricing.displaySelling,
                image: img,
                brand: sellerName,
                sku: selectedVariant?.sku ?? product.sku ?? '',
                size,
                color,
                codAvailable: cod,
                codCharge: Number(product?.codCharge ?? shipping.codCharge ?? 0) || 0,
                freeShipping,
                shippingCharge,
                weight: Number(product?.weight ?? shipping.weightKg ?? 0) || 0,
                dimensions: product?.dimensions ?? shipping.dimensionsCm ?? { length: 0, width: 0, height: 0 },
                management: product.management,
            },
            price: pricing.displaySelling,
            quantity,
            size,
            color,
            image: img,
        };
    };

    const handleBuyNow = async () => {
        if (isBuying) return;
        if (!productDocId || !product || stockStatus.state === 'out') return;
        if (!user) {
            navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search || ''}`)}`);
            return;
        }
        setIsBuying(true);
        try {
            try {
                sessionStorage.setItem('buy_now', JSON.stringify({ items: [buildBuyNowItem()] }));
            } catch (_e) {
                toast.error('Could not start checkout. Please try again.');
                return;
            }
            navigate('/checkout?mode=buynow');
        } finally {
            // Allow a brief visual "Processing…" state even on fast navigation.
            setTimeout(() => setIsBuying(false), 1200);
        }
    };

    const handleAddToCart = async () => {
        if (isAddingToCart || stockStatus.state === 'out' || !productDocId || !product) return;
        if (!user) {
            navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search || ''}`)}`);
            return;
        }
        try {
            setIsAddingToCart(true);
            const cartImage = selectedImages[activeImageIndex] || selectedImages[0] || product.image || '';
            await addToCart(productDocId, quantity, {
                name: product.name,
                image: cartImage,
                price: pricing.displaySelling,
                brand: sellerName,
                sku: selectedVariant?.sku ?? product.sku,
                size: selectedSize,
                color: variants.length > 0 ? (selectedVariant?.colorName || '') : (selectedColor || ''),
            });
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('Could not add to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleWishlistToggle = () => {
        if (productDocId) {
            toggleWishlist(productDocId, { size: selectedSize, color: selectedColor });
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmittingReview(true);
        setReviewError('');
        setReviewSuccess(false);
        try {
            const newReview = await submitProductReview(productId, reviewForm);
            setReviews((prev) => [newReview, ...prev]);
            setReviewForm({ rating: 5, title: '', comment: '', customerName: '', customerEmail: '' });
            setShowReviewForm(false);
            setReviewSuccess(true);
            if (product) {
                const allRatings = reviews.map((r) => r.rating).concat(reviewForm.rating);
                const averageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
                setProduct((prev) => ({ ...prev, rating: Math.round(averageRating * 10) / 10 }));
            }
            setTimeout(() => setReviewSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to submit review:', error);
            setReviewError(error.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // ---- URL color sync ----
    useEffect(() => {
        if (!selectedColor) return;
        const current = String(searchParams.get('color') || '').trim();
        if (current === selectedColor) return;
        setSearchParams((prevParams) => {
            const next = new URLSearchParams(prevParams);
            next.set('color', selectedColor);
            return next;
        }, { replace: true });
    }, [selectedColor, searchParams, setSearchParams]);

    useEffect(() => {
        setSelectedImage(0);
    }, [selectedColor]);

    // ---- Render ----
    if (loading) {
        return (
            <div className="min-h-screen bg-glowalchemy-ivory pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 pb-40 lg:pb-10">
                <ProductPdpSkeleton />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-glowalchemy-ivory flex items-center justify-center pt-20">
                <div className="text-center max-w-md px-4">
                    <FiPackage className="w-16 h-16 text-glowalchemy-sand mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-glowalchemy-charcoal mb-2">Product Not Found</h2>
                    <p className="text-glowalchemy-warm-gray mb-6">{error || 'We couldn\'t find the product you\'re looking for.'}</p>
                    <button
                        type="button"
                        onClick={() => navigate('/ProductListing')}
                        className="bg-glowalchemy-terracotta text-white px-6 py-3 rounded-xl hover:bg-glowalchemy-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    const isWishlisted = productDocId && isInWishlist(productDocId);
    const averageRating = (() => {
        const ratings = reviews.map((r) => Number(r.rating || 0)).filter((n) => n > 0);
        if (ratings.length === 0) return Number(product?.rating) > 0 ? Number(product.rating) : 0;
        return Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
    })();
    const hasRatings = averageRating > 0 || reviews.length > 0;
    const renderedDescription = sanitizeHtml(product.descriptionHtml) || product.description || '';

    const actionDisabled = stockStatus.state === 'out';

    return (
        <div className="min-h-screen bg-glowalchemy-ivory">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-48 lg:pb-10">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-5">
                    <ol className="flex items-center text-sm text-glowalchemy-warm-gray gap-1.5 flex-wrap">
                        <li><Link to="/" className="hover:text-glowalchemy-terracotta transition-colors">Home</Link></li>
                        <li aria-hidden="true">/</li>
                        <li><Link to="/ProductListing" className="hover:text-glowalchemy-terracotta transition-colors">Shop</Link></li>
                        <li aria-hidden="true">/</li>
                        <li className="text-glowalchemy-charcoal truncate max-w-[16rem] sm:max-w-xs" title={product.name}>
                            {product.name}
                        </li>
                    </ol>
                </nav>

                {/* Main product card — two columns on lg+ */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Gallery */}
                        <div className="p-4 sm:p-6 lg:p-8 bg-glowalchemy-ivory/50">
                            <ProductGallery
                                images={galleryItems}
                                alt={product.name}
                                activeIndex={activeImageIndex}
                                onSelect={setSelectedImage}
                                outOfStock={actionDisabled}
                            />
                        </div>

                        {/* Purchase column */}
                        <div className="p-5 sm:p-6 lg:p-8 flex flex-col">
                            {sellerName && (
                                <p className="text-xs text-glowalchemy-warm-gray uppercase tracking-wide mb-2">
                                    Sold by {sellerName}
                                </p>
                            )}

                            {/* Title — clamped so the purchase area stays near the top */}
                            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-glowalchemy-charcoal leading-snug mb-3 line-clamp-3">
                                {product.name}
                            </h1>

                            {/* Rating — honest empty state */}
                            <div className="flex items-center gap-2 mb-4 min-h-[24px]">
                                {hasRatings ? (
                                    <>
                                        <div className="flex items-center gap-0.5" aria-label={`Rated ${averageRating} out of 5`}>
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    aria-hidden="true"
                                                    className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-glowalchemy-terracotta fill-current' : 'text-glowalchemy-sand'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-glowalchemy-charcoal">{averageRating.toFixed(1)}</span>
                                        <span className="text-sm text-glowalchemy-warm-gray">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-glowalchemy-warm-gray">No ratings yet</span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2.5 mb-3 flex-wrap">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-glowalchemy-charcoal">
                                    {formatPrice(pricing.displaySelling)}
                                </span>
                                {Number(pricing.displayMrp ?? 0) > Number(pricing.displaySelling ?? 0) && (
                                    <>
                                        <span className="text-lg text-glowalchemy-warm-gray line-through">{formatPrice(pricing.displayMrp)}</span>
                                        <span className="text-sm font-semibold text-glowalchemy-terracotta">
                                            {Math.round(((pricing.displayMrp - pricing.displaySelling) / pricing.displayMrp) * 100)}% off
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Stock status */}
                            <div aria-live="polite" className="mb-5">
                                {stockStatus.state === 'in' && (
                                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                                        <FiCheck className="w-4 h-4" /> In Stock
                                    </span>
                                )}
                                {stockStatus.state === 'low' && (
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-glowalchemy-terracotta">
                                        <FiAlertTriangle className="w-4 h-4" /> {stockStatus.label}
                                    </span>
                                )}
                                {stockStatus.state === 'out' && (
                                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
                                        <FiPackage className="w-4 h-4" /> Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Size — chips only when there are real choices */}
                            {sizeOptions.length > 1 && (
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-glowalchemy-charcoal mb-2">Size</label>
                                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
                                        {sizeOptions.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                role="radio"
                                                aria-checked={selectedSize === size}
                                                onClick={() => setSelectedSize(size)}
                                                disabled={actionDisabled}
                                                className={`px-5 py-2.5 rounded-xl border-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50 ${
                                                    selectedSize === size
                                                        ? 'border-glowalchemy-charcoal bg-glowalchemy-charcoal text-white'
                                                        : 'border-glowalchemy-sand text-glowalchemy-charcoal hover:border-glowalchemy-warm-gray hover:bg-glowalchemy-ivory'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {sizeOptions.length === 1 && (
                                <p className="text-sm text-glowalchemy-warm-gray mb-5">
                                    <span className="font-medium text-glowalchemy-charcoal">Size:</span> {sizeOptions[0]}
                                </p>
                            )}

                            {/* Color variants */}
                            {variants.length > 0 && (
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-glowalchemy-charcoal mb-2">Color</label>
                                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select color">
                                        {variants.map((v, idx) => (
                                            <button
                                                key={`${String(v?.color || v?.colorName || 'color')}-${idx}`}
                                                type="button"
                                                role="radio"
                                                aria-checked={selectedColor === v.colorName}
                                                onClick={() => { setHasUserSelectedColor(true); setSelectedColor(v?.colorName || v?.color || ''); }}
                                                disabled={actionDisabled}
                                                className={`px-5 py-2.5 rounded-xl border-2 font-medium capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50 ${
                                                    selectedColor === v.colorName
                                                        ? 'border-glowalchemy-charcoal bg-glowalchemy-charcoal text-white'
                                                        : 'border-glowalchemy-sand text-glowalchemy-charcoal hover:border-glowalchemy-warm-gray hover:bg-glowalchemy-ivory'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {v.colorName}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-glowalchemy-charcoal mb-2" htmlFor="pdp-quantity">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        aria-label="Decrease quantity"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1 || actionDisabled}
                                        className="w-12 h-12 rounded-xl border-2 border-glowalchemy-sand flex items-center justify-center text-glowalchemy-charcoal hover:border-glowalchemy-charcoal hover:bg-glowalchemy-ivory transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                                    >
                                        <FiMinus className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                    <span
                                        id="pdp-quantity"
                                        className="text-xl font-semibold text-glowalchemy-charcoal w-16 text-center"
                                        aria-live="polite"
                                    >
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Increase quantity"
                                        onClick={() => setQuantity(Math.min((stockStatus.stock || 99), quantity + 1))}
                                        disabled={actionDisabled || quantity >= (stockStatus.stock || 99)}
                                        className="w-12 h-12 rounded-xl border-2 border-glowalchemy-sand flex items-center justify-center text-glowalchemy-charcoal hover:border-glowalchemy-charcoal hover:bg-glowalchemy-ivory transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                                    >
                                        <FiPlus className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            {/* Purchase actions (desktop/tablet) */}
                            <div className="hidden lg:flex gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={actionDisabled || isAddingToCart}
                                    aria-label={actionDisabled ? 'Add to Cart — out of stock' : 'Add to Cart'}
                                    className="flex-1 h-14 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-glowalchemy-terracotta text-glowalchemy-terracotta font-semibold transition-colors hover:bg-glowalchemy-terracotta/5 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                                >
                                    {justAdded ? (<><FiCheck className="w-5 h-5" /> Added!</>) : isAddingToCart ? (
                                        <><span className="w-5 h-5 border-2 border-glowalchemy-terracotta border-t-transparent rounded-full animate-spin" /> Adding…</>
                                    ) : (<><FiShoppingCart className="w-5 h-5" /> Add to Cart</>)}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={actionDisabled || isBuying}
                                    aria-label={actionDisabled ? 'Buy Now — out of stock' : 'Buy Now'}
                                    className="flex-1 h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-glowalchemy-terracotta text-white font-semibold shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                                >
                                    {isBuying ? (
                                        <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing…</>
                                    ) : (<><FiZap className="w-5 h-5" /> Buy Now</>)}
                                </button>
                            </div>

                            {/* Wishlist + Share (mobile shows these next to nothing else; desktop in the action row) */}
                            <div className="flex gap-3 mb-6 lg:hidden">
                                <button
                                    type="button"
                                    onClick={handleWishlistToggle}
                                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                    aria-pressed={isWishlisted}
                                    className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-glowalchemy-sand text-glowalchemy-charcoal font-medium hover:border-glowalchemy-terracotta hover:text-glowalchemy-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                                >
                                    <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-glowalchemy-terracotta' : ''}`} />
                                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    aria-label="Share product"
                                    className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-glowalchemy-sand text-glowalchemy-charcoal font-medium hover:border-glowalchemy-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                                >
                                    <FiShare2 className="w-5 h-5" /> Share
                                </button>
                            </div>

                            {/* Trust strip — REAL data only */}
                            {trustItems.length > 0 && (
                                <ul className="grid gap-3 mt-auto pt-2">
                                    {trustItems.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2.5 text-sm text-glowalchemy-charcoal">
                                            <item.icon className="w-4 h-4 text-glowalchemy-terracotta shrink-0" aria-hidden="true" />
                                            <span>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information sections — real data only */}
                <div className="space-y-4 mb-6">
                    {technicalSpecs.length > 0 && (
                        <InfoSection id="pdp-specs" title="Specifications">
                            <SpecificationsTable specs={technicalSpecs} />
                        </InfoSection>
                    )}

                    {renderedDescription && (
                        <InfoSection id="pdp-details" title="Product Details">
                            <div
                                className="text-sm leading-relaxed text-glowalchemy-charcoal space-y-2"
                                dangerouslySetInnerHTML={{ __html: product.descriptionHtml ? sanitizeHtml(product.descriptionHtml) : '' }}
                            />
                            {!product.descriptionHtml && <p className="text-sm leading-relaxed text-glowalchemy-charcoal">{product.description}</p>}
                        </InfoSection>
                    )}

                    <InfoSection id="pdp-delivery" title="Delivery & Returns">
                        <ul className="space-y-2.5 text-sm text-glowalchemy-charcoal">
                            {trustItems.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2.5">
                                    <item.icon className="w-4 h-4 text-glowalchemy-terracotta shrink-0" aria-hidden="true" />
                                    <span>{item.label}</span>
                                </li>
                            ))}
                            {sellerName && (
                                <li className="flex items-center gap-2.5">
                                    <FiPackage className="w-4 h-4 text-glowalchemy-terracotta shrink-0" aria-hidden="true" />
                                    <span>Sold by {sellerName}</span>
                                </li>
                            )}
                        </ul>
                    </InfoSection>
                </div>

                {/* Reviews */}
                <section className="bg-white rounded-2xl shadow-sm p-6 lg:p-8" aria-label="Customer Reviews">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-glowalchemy-charcoal">Customer Reviews</h2>
                        <button
                            type="button"
                            onClick={() => setShowReviewForm(true)}
                            className="bg-glowalchemy-charcoal text-white px-5 py-2.5 rounded-xl hover:bg-glowalchemy-terracotta transition-colors font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-charcoal/50"
                        >
                            Write a Review
                        </button>
                    </div>

                    {/* Rating summary */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-glowalchemy-ivory rounded-xl">
                        {hasRatings ? (
                            <>
                                <span className="text-4xl font-extrabold text-glowalchemy-charcoal">{averageRating.toFixed(1)}</span>
                                <div>
                                    <div className="flex items-center gap-0.5" aria-label={`Rated ${averageRating} out of 5`}>
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} aria-hidden="true" className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-glowalchemy-terracotta fill-current' : 'text-glowalchemy-sand'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-glowalchemy-warm-gray mt-1">
                                        Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-glowalchemy-warm-gray">No ratings yet. Be the first to review this product!</p>
                        )}
                    </div>

                    {showReviewForm && (
                        <div className="bg-glowalchemy-ivory p-6 rounded-xl mb-8">
                            <h3 className="font-semibold text-glowalchemy-charcoal mb-4">Write a Review</h3>
                            {reviewSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4" role="status">
                                    <strong>Success!</strong> Your review has been submitted successfully.
                                </div>
                            )}
                            {reviewError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                                    <strong>Error:</strong> {reviewError}
                                </div>
                            )}
                            <form onSubmit={handleSubmitReview}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={reviewForm.customerName}
                                        onChange={(e) => setReviewForm((prev) => ({ ...prev, customerName: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-glowalchemy-sand bg-white text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={reviewForm.customerEmail}
                                        onChange={(e) => setReviewForm((prev) => ({ ...prev, customerEmail: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-glowalchemy-sand bg-white text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta"
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Review Title"
                                    value={reviewForm.title}
                                    onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-glowalchemy-sand bg-white text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta mb-4"
                                    required
                                />
                                <textarea
                                    placeholder="Your Review"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-glowalchemy-sand bg-white text-glowalchemy-charcoal placeholder-glowalchemy-warm-gray focus:outline-none focus:ring-2 focus:ring-glowalchemy-sand focus:border-glowalchemy-terracotta mb-4 resize-none"
                                    required
                                />
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="bg-glowalchemy-terracotta text-white px-6 py-3 rounded-xl hover:bg-glowalchemy-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-terracotta/50"
                                    >
                                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="px-6 py-3 rounded-xl border border-glowalchemy-sand text-glowalchemy-charcoal hover:bg-glowalchemy-ivory transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glowalchemy-sand"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {reviewsLoading ? (
                        <div className="space-y-4" aria-busy="true" aria-label="Loading reviews">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="animate-pulse bg-glowalchemy-sand/40 rounded-lg h-16" aria-hidden="true" />
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <p className="text-center py-6 text-glowalchemy-warm-gray">No reviews yet. Be the first to review this product!</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review, index) => (
                                <article key={index} className="border-b border-glowalchemy-sand pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar key={i} aria-hidden="true" className={`w-4 h-4 ${i < review.rating ? 'text-glowalchemy-terracotta fill-current' : 'text-glowalchemy-sand'}`} />
                                            ))}
                                        </div>
                                        <span className="font-semibold text-glowalchemy-charcoal">{review.title}</span>
                                    </div>
                                    <p className="text-glowalchemy-warm-gray mb-2">{review.comment}</p>
                                    {Array.isArray(review.images) && review.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {review.images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt={`Review image ${i + 1}`}
                                                    loading="lazy"
                                                    className="h-16 w-16 rounded-lg object-cover border border-glowalchemy-sand"
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-sm text-glowalchemy-warm-gray">By {review.customerName}</p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky mobile purchase bar */}
            <PurchaseBar
                stockStatus={stockStatus}
                addToCartLoading={isAddingToCart}
                justAdded={justAdded}
                buying={isBuying}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
            />
        </div>
    );
};

export default ProductDetailModern;
