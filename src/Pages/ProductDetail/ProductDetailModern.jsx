import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiStar, FiMinus, FiPlus, FiPackage, FiCheck } from 'react-icons/fi';
import ImageWithFallback from '../../components/shared/ImageWithFallback';
import { fetchProductDetails, fetchProductReviews, submitProductReview } from '../../api/productDetails';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { normalizeColorKey, normalizeProductForColorVariants, normalizeToken } from '../../utils/colorVariants';
import { trackViewContent } from '../../utils/metaPixelSdk';

const ProductDetailModern = () => {
    const { productId } = useParams();
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

    const productDocId = product?._id || product?.id;
    const isJewellery = String(product?.category || '').toLowerCase().includes('jewel');
    const sizeOptions = (product?.sizes && product.sizes.length > 0) ? product.sizes : (isJewellery ? ['Free Size'] : []);
    const colorOptions = (product?.colors && product.colors.length > 0) ? product.colors : [];

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

    const handleShare = async () => {
        if (!productDocId) return;
        const url = `${window.location.origin}${location.pathname}${location.search || ''}`;
        const title = String(product?.name || 'Product');
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

    useEffect(() => {
        if (productId) {
            loadProductDetails();
            loadReviews();
        }
    }, [productId]);

    const hasTrackedViewContent = React.useRef(false);
    const previousProductId = React.useRef(null);
    useEffect(() => {
        if (previousProductId.current !== productId) {
            hasTrackedViewContent.current = false;
            previousProductId.current = productId;
        }
        if (product && !loading && !hasTrackedViewContent.current) {
            const price = pricing?.displaySelling || product.price || product.sellingPrice || 0;
            trackViewContent({
                _id: product._id || product.id,
                id: product._id || product.id,
                name: product.name,
                price: Number(price),
            });
            hasTrackedViewContent.current = true;
        }
    }, [product, loading, productId]);

    const loadProductDetails = async ({ silent = false } = {}) => {
        try {
            if (!silent) setLoading(true);
            const data = await fetchProductDetails(productId);
            const normalized = normalizeProductForColorVariants(data);
            setProduct(normalized);

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
                    return (match ? match.colorName : variants[0].colorName);
                });
            } else if (normalized.colors?.length > 0) {
                setSelectedColor((prev) => {
                    const desired = urlColor || prev;
                    return (desired && normalized.colors.includes(desired) ? desired : normalized.colors[0]);
                });
            }
        } catch (err) {
            if (!silent) setError('Failed to load product details');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const variants = product?.colorVariants || [];
    const selectedVariant = variants.length > 0
        ? (
            variants.find((v) => {
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
            }) || variants[0]
        )
        : null;

    const pricing = (() => {
        const pickBestPrice = (...values) => {
            const nums = values.map((v) => Number(v)).filter((n) => Number.isFinite(n));
            const good = nums.find((n) => n > 1);
            if (good !== undefined) return good;
            return nums.length ? nums[0] : 0;
        };

        const price = pickBestPrice(
            selectedVariant?.price,
            product?.price,
            product?.management?.pricing?.sellingPrice,
        );

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

        const isSaleActive =
            saleEnabled &&
            saleDiscount > 0 &&
            (!saleStart || Number.isNaN(saleStart.getTime()) || saleStart <= now) &&
            (!saleEnd || Number.isNaN(saleEnd.getTime()) || saleEnd >= now);

        const displaySelling = isSaleActive ? price - (price * saleDiscount) / 100 : price;

        return {
            price,
            displayMrp,
            displaySelling,
            isSaleActive,
            saleDiscount,
        };
    })();

    const baseImages = [product?.image, ...((product?.galleryImages ?? []) || [])].filter(Boolean);
    const selectedImages = variants.length > 0
        ? (hasUserSelectedColor ? (Array.isArray(selectedVariant?.images) ? selectedVariant.images.filter(Boolean) : []) : baseImages)
        : baseImages;

    useEffect(() => {
        setSelectedImage(0);
    }, [selectedColor]);

    useEffect(() => {
        if (!selectedColor) return;
        const current = String(searchParams.get('color') || '').trim();
        if (current === selectedColor) return;
        setSearchParams((prevParams) => {
            const next = new URLSearchParams(prevParams);
            next.set('color', selectedColor);
            return next;
        }, { replace: true });
    }, [selectedColor]);

    useEffect(() => {
        if (!productId) return;
        let cancelled = false;
        const refresh = async () => {
            if (cancelled) return;
            await loadProductDetails({ silent: true });
        };
        const onFocus = () => { void refresh(); };
        const onVisibility = () => {
            if (document.visibilityState === 'visible') void refresh();
        };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            cancelled = true;
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [productId]);

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

    const handleAddToCart = async () => {
        const stock = Number(product?.stock ?? 0);
        if (!productDocId || !product || stock <= 0) return;
        if (!user) {
            navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search || ''}`)}`);
            return;
        }

        try {
            setIsAddingToCart(true);
            const cartImage = variants.length > 0
                ? (hasUserSelectedColor
                    ? (selectedImages?.[selectedImage] || selectedImages?.[0] || '')
                    : (baseImages?.[0] || ''))
                : (selectedImages?.[selectedImage] || selectedImages?.[0] || product?.image || product?.galleryImages?.[0] || '');
            const cartPrice = pricing.displaySelling;
            const cartSku = selectedVariant?.sku ?? product?.sku;
            const cartName = product?.name;

            await addToCart(productDocId, quantity, {
                name: cartName,
                image: cartImage,
                price: cartPrice,
                brand: product?.brand,
                sku: cartSku,
                size: selectedSize,
                color: selectedColor,
            });

            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmittingReview(true);
        setReviewError('');
        setReviewSuccess(false);

        try {
            const newReview = await submitProductReview(productId, reviewForm);
            setReviews(prev => [newReview, ...prev]);
            setReviewForm({ rating: 5, title: '', comment: '', customerName: '', customerEmail: '' });
            setShowReviewForm(false);
            setReviewSuccess(true);

            if (product) {
                const allRatings = reviews.map(r => r.rating).concat(reviewForm.rating);
                const averageRating = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
                setProduct(prev => ({ ...prev, rating: Math.round(averageRating * 10) / 10 }));
            }

            setTimeout(() => setReviewSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to submit review:', error);
            setReviewError(error.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-trozzi-ivory flex items-center justify-center pt-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-trozzi-sand border-t-trozzi-terracotta rounded-full animate-spin"></div>
                    <p className="text-trozzi-warm-gray">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-trozzi-ivory flex items-center justify-center pt-20">
                <div className="text-center max-w-md px-4">
                    <FiPackage className="w-16 h-16 text-trozzi-sand mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-trozzi-charcoal mb-2">Product Not Found</h2>
                    <p className="text-trozzi-warm-gray mb-6">{error || 'We couldn\'t find the product you\'re looking for.'}</p>
                    <button
                        onClick={() => navigate('/ProductListing')}
                        className="bg-trozzi-terracotta text-white px-6 py-3 rounded-xl hover:bg-trozzi-charcoal transition-colors"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-trozzi-ivory">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center text-sm text-trozzi-warm-gray">
                        <li>
                            <Link to="/" className="hover:text-trozzi-terracotta transition-colors">Home</Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li>
                            <Link to="/ProductListing" className="hover:text-trozzi-terracotta transition-colors">Shop</Link>
                        </li>
                        <li className="mx-2">/</li>
                        <li className="text-trozzi-charcoal truncate max-w-xs">{product.name}</li>
                    </ol>
                </nav>

                {/* Main Product Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Product Image Gallery */}
                        <div className="p-6 lg:p-8 bg-trozzi-ivory/50">
                            <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4 relative">
                                {selectedImages.length > 0 && selectedImages[selectedImage] ? (
                                    <ImageWithFallback
                                        src={selectedImages[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                        fallbackType="product"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-trozzi-sand/30">
                                        <FiPackage className="w-16 h-16 text-trozzi-warm-gray mb-4" />
                                        <p className="text-trozzi-warm-gray">Image unavailable</p>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {selectedImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {selectedImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? 'border-trozzi-terracotta ring-2 ring-trozzi-terracotta/20'
                                                    : 'border-trozzi-sand hover:border-trozzi-warm-gray'
                                            }`}
                                        >
                                            <ImageWithFallback
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-contain"
                                                fallbackType="thumbnail"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className="p-6 lg:p-8">
                            {/* Brand */}
                            {product.brand && (
                                <p className="text-sm text-trozzi-warm-gray uppercase tracking-wide mb-2">{product.brand}</p>
                            )}

                            {/* Product Name */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-trozzi-charcoal mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i < Math.floor(product.rating || 0)
                                                    ? 'text-trozzi-terracotta fill-current'
                                                    : 'text-trozzi-sand'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-semibold text-trozzi-charcoal">
                                    {(product.rating || 0).toFixed(1)}
                                </span>
                                <span className="text-trozzi-warm-gray">({reviews.length} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl sm:text-4xl font-bold text-trozzi-charcoal">
                                    {formatPrice(pricing.displaySelling)}
                                </span>
                                {Number(pricing.displayMrp ?? 0) > Number(pricing.displaySelling ?? 0) && (
                                    <span className="text-xl text-trozzi-warm-gray line-through">
                                        {formatPrice(pricing.displayMrp)}
                                    </span>
                                )}
                                {pricing.isSaleActive && (
                                    <span className="bg-trozzi-terracotta text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        -{pricing.saleDiscount}%
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-trozzi-warm-gray mb-8 leading-relaxed">
                                {product.description || 'No description available.'}
                            </p>

                            {/* Product Options */}
                            <div className="space-y-6 mb-8">
                                {/* Size Selection */}
                                {sizeOptions.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-trozzi-charcoal mb-3">Size</label>
                                        <div className="flex flex-wrap gap-2">
                                            {sizeOptions.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    disabled={!product.stock || product.stock <= 0}
                                                    className={`px-5 py-3 rounded-xl border-2 font-medium transition-all ${
                                                        selectedSize === size
                                                            ? 'border-trozzi-charcoal bg-trozzi-charcoal text-white'
                                                            : 'border-trozzi-sand text-trozzi-charcoal hover:border-trozzi-warm-gray hover:bg-trozzi-ivory'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Color Selection */}
                                {variants.length > 0 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-trozzi-charcoal mb-3">Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {variants.map((v, idx) => (
                                                <button
                                                    key={`${String(v?.color || v?.colorName || 'color')}-${idx}`}
                                                    onClick={() => {
                                                        setHasUserSelectedColor(true);
                                                        setSelectedColor(v?.colorName || v?.color || '');
                                                    }}
                                                    className={`px-5 py-3 rounded-xl border-2 font-medium capitalize transition-all ${
                                                        selectedColor === v.colorName
                                                            ? 'border-trozzi-charcoal bg-trozzi-charcoal text-white'
                                                            : 'border-trozzi-sand text-trozzi-charcoal hover:border-trozzi-warm-gray hover:bg-trozzi-ivory'
                                                    }`}
                                                >
                                                    {v.colorName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : colorOptions.length > 0 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-trozzi-charcoal mb-3">Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {colorOptions.map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => {
                                                        setHasUserSelectedColor(true);
                                                        setSelectedColor(c);
                                                    }}
                                                    className={`px-5 py-3 rounded-xl border-2 font-medium capitalize transition-all ${
                                                        selectedColor === c
                                                            ? 'border-trozzi-charcoal bg-trozzi-charcoal text-white'
                                                            : 'border-trozzi-sand text-trozzi-charcoal hover:border-trozzi-warm-gray hover:bg-trozzi-ivory'
                                                    }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-trozzi-charcoal mb-3">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            className="w-12 h-12 rounded-xl border-2 border-trozzi-sand flex items-center justify-center text-trozzi-charcoal hover:border-trozzi-charcoal hover:bg-trozzi-ivory transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiMinus className="w-5 h-5" />
                                        </button>
                                        <span className="text-xl font-semibold text-trozzi-charcoal w-16 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(Number(product.stock ?? 0) || 99, quantity + 1))}
                                            disabled={quantity >= (Number(product.stock ?? 0) || 99)}
                                            className="w-12 h-12 rounded-xl border-2 border-trozzi-sand flex items-center justify-center text-trozzi-charcoal hover:border-trozzi-charcoal hover:bg-trozzi-ivory transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiPlus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-8">
                                {Number(product.stock ?? 0) > 0 ? (
                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                        <FiCheck className="w-5 h-5" />
                                        <span>In Stock ({Number(product.stock ?? 0)} available)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-600 font-medium">
                                        <FiPackage className="w-5 h-5" />
                                        <span>Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart || Number(product.stock ?? 0) <= 0}
                                    className="flex-1 bg-trozzi-terracotta text-white py-4 rounded-xl hover:bg-trozzi-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-trozzi-terracotta/20"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Adding...
                                        </>
                                    ) : justAdded ? (
                                        <>
                                            <FiCheck className="w-5 h-5" />
                                            Added to Cart!
                                        </>
                                    ) : (
                                        <>
                                            <FiShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => productDocId && toggleWishlist(productDocId, { size: selectedSize, color: selectedColor })}
                                    className="p-4 rounded-xl border-2 border-trozzi-sand hover:border-trozzi-terracotta hover:text-trozzi-terracotta transition-all"
                                >
                                    {productDocId && isInWishlist(productDocId) ? (
                                        <FiHeart className="w-6 h-6 fill-current text-trozzi-terracotta" />
                                    ) : (
                                        <FiHeart className="w-6 h-6" />
                                    )}
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="p-4 rounded-xl border-2 border-trozzi-sand hover:border-trozzi-charcoal transition-all"
                                >
                                    <FiShare2 className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Product Features */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center gap-2 p-4 bg-trozzi-ivory rounded-xl">
                                    <FiTruck className="w-6 h-6 text-trozzi-charcoal" />
                                    <span className="text-xs font-medium text-trozzi-charcoal text-center">Free Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-trozzi-ivory rounded-xl">
                                    <FiShield className="w-6 h-6 text-trozzi-charcoal" />
                                    <span className="text-xs font-medium text-trozzi-charcoal text-center">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-trozzi-ivory rounded-xl">
                                    <FiRefreshCw className="w-6 h-6 text-trozzi-charcoal" />
                                    <span className="text-xs font-medium text-trozzi-charcoal text-center">Easy Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-trozzi-charcoal">Customer Reviews</h2>
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-trozzi-charcoal text-white px-6 py-3 rounded-xl hover:bg-trozzi-terracotta transition-colors font-medium"
                        >
                            Write a Review
                        </button>
                    </div>

                    {showReviewForm && (
                        <div className="bg-trozzi-ivory p-6 rounded-xl mb-8">
                            <h3 className="font-semibold text-trozzi-charcoal mb-4">Write a Review</h3>

                            {reviewSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                                    <strong>Success!</strong> Your review has been submitted successfully.
                                </div>
                            )}

                            {reviewError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    <strong>Error:</strong> {reviewError}
                                </div>
                            )}

                            <form onSubmit={handleSubmitReview}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={reviewForm.customerName}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, customerName: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-trozzi-sand bg-white text-trozzi-charcoal placeholder-trozzi-warm-gray focus:outline-none focus:ring-2 focus:ring-trozzi-sand focus:border-trozzi-terracotta"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={reviewForm.customerEmail}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-trozzi-sand bg-white text-trozzi-charcoal placeholder-trozzi-warm-gray focus:outline-none focus:ring-2 focus:ring-trozzi-sand focus:border-trozzi-terracotta"
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Review Title"
                                    value={reviewForm.title}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-trozzi-sand bg-white text-trozzi-charcoal placeholder-trozzi-warm-gray focus:outline-none focus:ring-2 focus:ring-trozzi-sand focus:border-trozzi-terracotta mb-4"
                                    required
                                />
                                <textarea
                                    placeholder="Your Review"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-trozzi-sand bg-white text-trozzi-charcoal placeholder-trozzi-warm-gray focus:outline-none focus:ring-2 focus:ring-trozzi-sand focus:border-trozzi-terracotta mb-4 resize-none"
                                    required
                                />
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="bg-trozzi-terracotta text-white px-6 py-3 rounded-xl hover:bg-trozzi-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="px-6 py-3 rounded-xl border border-trozzi-sand text-trozzi-charcoal hover:bg-trozzi-ivory transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {reviewsLoading ? (
                        <div className="text-center py-8">
                            <div className="w-8 h-8 border-2 border-trozzi-sand border-t-trozzi-terracotta rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-trozzi-warm-gray">Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-8">
                            <FiStar className="w-12 h-12 text-trozzi-sand mx-auto mb-4" />
                            <p className="text-trozzi-warm-gray">No reviews yet. Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review, index) => (
                                <div key={index} className="border-b border-trozzi-sand pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < review.rating
                                                            ? 'text-trozzi-terracotta fill-current'
                                                            : 'text-trozzi-sand'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-semibold text-trozzi-charcoal">{review.title}</span>
                                    </div>
                                    <p className="text-trozzi-warm-gray mb-2">{review.comment}</p>
                                    <p className="text-sm text-trozzi-warm-gray">By {review.customerName}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModern;
