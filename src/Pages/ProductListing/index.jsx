import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import ProductCardModern from "../../components/product/ProductCardModern";
import { fetchProducts } from "../../api/catalog";
import { useCategories } from "../../context/CategoryContext";
import { ProductCardSkeleton } from "../../components/shared/LoadingSkeleton";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";

const ProductListing = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { categories: apiCategories } = useCategories();

    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [category, setCategory] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy] = useState("relevance");
    const [priceRange, setPriceRange] = useState([0, 10000]);

    const [selectedFilters, setSelectedFilters] = useState({
        availability: 'all',
        sizes: [],
        rating: 0,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [facets, setFacets] = useState(null);

    const resolvedCategory = useMemo(() => {
        const raw = String(category || '').trim();
        if (!raw) return '';

        const rawLower = raw.toLowerCase();
        const list = Array.isArray(apiCategories) ? apiCategories : [];

        const match = list.find((c) => {
            if (!c || typeof c !== 'object') return false;
            const id = String(c.id || c._id || '').trim();
            if (id && id === raw) return true;

            const name = String(c.name || c.title || '').trim().toLowerCase();
            const slug = String(c.slug || '').trim().toLowerCase();
            return (name && name === rawLower) || (slug && slug === rawLower);
        });

        return match ? String(match.name || raw) : raw;
    }, [category, apiCategories]);

    useEffect(() => {
        const urlCategory = searchParams.get("category") || "";
        const urlSubCategoryId = searchParams.get("subCategoryId") || "";
        const urlSearch = searchParams.get("q") || "";
        setCategory(urlCategory);
        setSubCategoryId(urlSubCategoryId);
        setSearchQuery(urlSearch);
        setPage(1);
    }, [searchParams]);

    const normalizeSizeToken = (value) => {
        const raw = String(value ?? '').trim();
        if (!raw) return '';

        const lower = raw.toLowerCase();
        if (lower === 's' || lower === 'small') return 'S';
        if (lower === 'm' || lower === 'medium') return 'M';
        if (lower === 'l' || lower === 'large') return 'L';
        if (lower === 'xl' || lower === 'x-large' || lower === 'extra large' || lower === 'extra-large') return 'XL';
        if (lower === 'xxl' || lower === '2xl' || lower === 'xx-large' || lower === 'extra extra large' || lower === 'extra-extra-large') return 'XXL';
        return raw.toUpperCase();
    };

    const normalizedSelectedSizes = useMemo(() => {
        return (Array.isArray(selectedFilters.sizes) ? selectedFilters.sizes : [])
            .map(normalizeSizeToken)
            .filter(Boolean);
    }, [selectedFilters.sizes]);

    const handleFiltersChange = useCallback((sidebarFilters) => {
        const nextAvailability = sidebarFilters.availability || 'all';
        const nextSizes = sidebarFilters.sizes || [];
        const nextRating = sidebarFilters.rating || 0;
        const nextPriceRange = sidebarFilters.priceRange;

        setSelectedFilters((prev) => {
            const prevAvailability = prev.availability || 'all';
            const prevSizes = Array.isArray(prev.sizes) ? prev.sizes : [];
            const prevRating = prev.rating || 0;

            const sameAvailability = prevAvailability === nextAvailability;
            const sameRating = Number(prevRating) === Number(nextRating);
            const sameSizes = prevSizes.length === nextSizes.length && prevSizes.every((s, idx) => s === nextSizes[idx]);

            if (sameAvailability && sameRating && sameSizes) return prev;

            return {
                ...prev,
                availability: nextAvailability,
                sizes: nextSizes,
                rating: nextRating,
            };
        });

        if (Array.isArray(nextPriceRange) && nextPriceRange.length === 2) {
            setPriceRange((prev) => {
                if (!Array.isArray(prev) || prev.length !== 2) return nextPriceRange;
                if (Number(prev[0]) === Number(nextPriceRange[0]) && Number(prev[1]) === Number(nextPriceRange[1])) return prev;
                return nextPriceRange;
            });
        }

        setPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSelectedFilters({
            availability: 'all',
            sizes: [],
            rating: 0,
        });
        setPriceRange([0, 10000]);
        setPage(1);
    }, []);

    const sidebarInitialFilters = useMemo(() => {
        return {
            availability: selectedFilters.availability || 'all',
            sizes: selectedFilters.sizes,
            priceRange: priceRange,
            rating: selectedFilters.rating,
        };
    }, [priceRange, selectedFilters]);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            try {
                setLoading(true);
                setError("");

                const minPrice = Array.isArray(priceRange) ? Number(priceRange[0]) : undefined;
                const maxPrice = Array.isArray(priceRange) ? Number(priceRange[1]) : undefined;
                const inStock = String(selectedFilters.availability || 'all') === 'in_stock' ? true : undefined;
                const outOfStock = String(selectedFilters.availability || 'all') === 'not_available' ? true : undefined;
                const rating = Number(selectedFilters.rating) > 0 ? Number(selectedFilters.rating) : undefined;

                const data = await fetchProducts({
                    mode: "public",
                    page,
                    limit,
                    category: subCategoryId ? undefined : (resolvedCategory || undefined),
                    subCategoryId: subCategoryId || undefined,
                    q: searchQuery || undefined,
                    sort: sortBy && sortBy !== "relevance" ? sortBy : undefined,
                    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
                    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
                    inStock,
                    outOfStock,
                    rating,
                    sizes: normalizedSelectedSizes.length > 0 ? normalizedSelectedSizes : undefined,
                    facets: page === 1, // Only fetch facets on first page
                });

                if (cancelled) return;
                const list = Array.isArray(data) ? data : (data?.items || []);
                setItems(Array.isArray(list) ? list : []);
                setTotalPages(Number(data?.totalPages) > 0 ? Number(data.totalPages) : 1);
                if (data?.facets) setFacets(data.facets);
            } catch {
                if (!cancelled) {
                    setItems([]);
                    setTotalPages(1);
                    setError("Failed to load products");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, [resolvedCategory, subCategoryId, limit, normalizedSelectedSizes, page, priceRange, searchQuery, selectedFilters.availability, selectedFilters.rating, sortBy]);

    return (
        <section className="py-4 sm:py-6 min-h-screen">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
                <nav className="hidden sm:flex mb-4 text-sm">
                    <Link to="/" className="text-glowalchemy-warm-gray hover:text-glowalchemy-terracotta transition-colors">
                        Home
                    </Link>
                    <span className="mx-2 text-glowalchemy-sand">/</span>
                    <span className="text-glowalchemy-charcoal">Products</span>
                </nav>
            </div>

            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex gap-4 sm:gap-6">

                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-glowalchemy-white rounded-lg shadow-sm p-4 sticky z-sticky" style={{ top: 'calc(var(--app-header-height, 0px) + 1rem)' }}>
                            <Sidebar
                                selectedCategory={category}
                                categories={apiCategories}
                                onChangeCategory={(next) => {
                                    setCategory(next);

                                    setPage(1);
                                    const nextParams = new URLSearchParams(searchParams);
                                    if (next) nextParams.set("category", next);
                                    else nextParams.delete("category");
                                    setSearchParams(nextParams, { replace: true });
                                }}
                                onFiltersChange={handleFiltersChange}
                                onClearFilters={handleClearFilters}
                                initialFilters={sidebarInitialFilters}
                                facets={facets}
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        {loading && items.length === 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <ProductCardSkeleton key={`skeleton-${idx}`} />
                                ))}
                            </div>
                        ) : error ? (
                            <ErrorState
                                title="Failed to load products"
                                description="We couldn't load the products. Please try again."
                                onAction={() => setPage(1)}
                                actionText="Try Again"
                            />
                        ) : items.length === 0 ? (
                            <EmptyState
                                icon="search"
                                title="No products found"
                                description="Try adjusting your filters or search terms"
                            />
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                                {items.map((product, idx) => {
                                    const stableId = product?.id || product?._id || product?.slug || product?.sku || `listing-${idx}`;
                                    const normalizedProduct = stableId && !product?.id ? { ...product, id: stableId } : product;
                                    return (
                                        <ProductCardModern key={stableId} product={normalizedProduct} />
                                    );
                                })}
                            </div>
                        )}

                        {!loading && !error && totalPages > 1 && (
                            <div className="flex justify-center mt-6 sm:mt-8 gap-2">
                                <button
                                    onClick={() => {
                                        if (page > 1) {
                                            setPage(page - 1);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                    disabled={page === 1}
                                    className="px-3 sm:px-4 py-2 rounded-lg border border-glowalchemy-sand bg-white text-glowalchemy-charcoal hover:bg-glowalchemy-ivory disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Previous
                                </button>
                                <span className="px-3 sm:px-4 py-2 text-glowalchemy-charcoal text-sm">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => {
                                        if (page < totalPages) {
                                            setPage(page + 1);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                    disabled={page === totalPages}
                                    className="px-3 sm:px-4 py-2 rounded-lg border border-glowalchemy-sand bg-white text-glowalchemy-charcoal hover:bg-glowalchemy-ivory disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductListing;