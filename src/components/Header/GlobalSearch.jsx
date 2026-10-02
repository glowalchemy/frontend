import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { fetchSearchSuggest } from '../../api/catalog';
import OptimizedImage from '../shared/OptimizedImage';

// Minimum query length for the lightweight autocomplete request (matches
// SEARCH_AUTOCOMPLETE_MIN_CHARS on the backend; below this we show only
// recent/popular searches — never a full catalog search per character).
const MIN_SUGGEST_CHARS = 3;

const formatInr = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '';
    return `₹${num.toLocaleString()}`;
};

const POPULAR_TERMS = ['Fashion', 'Electronics', 'Footwear', 'Bags', 'Beauty'];

/**
 * Global search used in both the desktop header and the mobile search mode.
 *
 * Props:
 *  - onBack   (mobile only) closes search mode and returns to the normal header.
 *  - autoFocus (mobile only) focuses the input when the search row mounts.
 *
 * Interaction semantics:
 *  - Back (←) closes search mode. Never clears the query.
 *  - Clear (✕ inside the field) clears the query only; it appears only when
 *    there is text to clear.
 *  - Escape closes the suggestions; a second Escape (mobile) exits search mode.
 *  - Stale responses can never overwrite newer results (request sequence guard).
 */
const GlobalSearch = ({ onBack, autoFocus = false }) => {
    const isMobile = Boolean(onBack);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const requestSeqRef = useRef(0);

    // Load recent searches from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('recentSearches');
            if (saved) setRecentSearches(JSON.parse(saved));
        } catch (_e) { /* ignore */ }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = (query) => {
        if (!query.trim()) return;
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Search suggestions — guarded against stale responses via a sequence
    // counter (a slow older response can never overwrite a newer one).
    const searchProducts = useCallback(async (query) => {
        const seq = ++requestSeqRef.current;
        setIsLoading(true);
        setSearchError(false);
        try {
            const results = await fetchSearchSuggest(query, { limit: 8 });
            if (seq !== requestSeqRef.current) return; // a newer request superseded this one
            const items = Array.isArray(results?.products) ? results.products : [];
            setSearchResults(items.map((p) => (p && typeof p === 'object' ? { ...p, id: p.id || p._id || '' } : null)).filter(Boolean));
            setIsLoading(false);
        } catch (error) {
            if (seq !== requestSeqRef.current) return;
            console.error('Search error:', error);
            setSearchResults([]);
            setSearchError(true);
            setIsLoading(false);
        }
    }, []);

    // Debounced autocomplete — only fires for queries >= MIN_SUGGEST_CHARS.
    useEffect(() => {
        const query = String(searchQuery || '').trim();
        if (query.length < MIN_SUGGEST_CHARS) {
            requestSeqRef.current += 1; // invalidate any in-flight request
            setSearchResults([]);
            setSearchError(false);
            setIsLoading(false);
            return;
        }
        const timer = setTimeout(() => searchProducts(query), 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchProducts]);

    // Flat suggestion list used for keyboard navigation.
    const suggestionItems = useCallback(() => {
        if (isLoading || searchError) return [];
        if (searchResults.length > 0) return searchResults;
        const queryLen = String(searchQuery || '').trim().length;
        if (queryLen === 0 || queryLen < MIN_SUGGEST_CHARS) {
            if (recentSearches.length > 0) return recentSearches.map((q) => ({ recent: q }));
            return POPULAR_TERMS.map((t) => ({ popular: t }));
        }
        return [];
    }, [isLoading, searchError, searchResults, searchQuery, recentSearches]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = String(searchQuery || '').trim();
        if (!query) return;
        saveRecentSearch(query);
        navigate(`/ProductListing?q=${encodeURIComponent(query)}`);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    const handleProductClick = (product) => {
        saveRecentSearch(String(searchQuery || '').trim());
        setIsSearchOpen(false);
        setSearchQuery('');
        const id = product?.id || product?._id;
        if (id) navigate(`/product/${id}`);
    };

    const handleRecentSearchClick = (query) => {
        saveRecentSearch(query);
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(`/ProductListing?q=${encodeURIComponent(query)}`);
    };

    const handleClear = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchError(false);
        requestSeqRef.current += 1;
        inputRef.current?.focus();
    };

    // Keyboard navigation for the suggestion list.
    const handleKeyDown = (e) => {
        const list = suggestionItems();
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isSearchOpen) setIsSearchOpen(true);
            setActiveIndex((prev) => (list.length ? (prev + 1) % list.length : -1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isSearchOpen) setIsSearchOpen(true);
            setActiveIndex((prev) => (list.length ? (prev - 1 + list.length) % list.length : -1));
        } else if (e.key === 'Enter') {
            const query = String(searchQuery || '').trim();
            if (!query && list.length === 0) return;
            if (activeIndex >= 0 && list[activeIndex]) {
                e.preventDefault();
                const item = list[activeIndex];
                if (item.id) handleProductClick(item);
                else handleRecentSearchClick(item.recent || item.popular || '');
            }
            // Otherwise the form's onSubmit handles the plain Enter.
        } else if (e.key === 'Escape') {
            if (isSearchOpen) {
                e.preventDefault();
                setIsSearchOpen(false);
                setActiveIndex(-1);
            } else if (isMobile && onBack) {
                e.preventDefault();
                onBack();
            }
        }
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const list = suggestionItems();

    return (
        <div className={`relative ${isMobile ? 'flex-1 min-w-0' : ''}`} ref={searchRef}>
            <div className="relative">
                <form role="search" onSubmit={handleSearch} className="flex items-stretch w-full">
                    {isMobile && (
                        <button
                            type="button"
                            onClick={onBack}
                            aria-label="Close search"
                            className="flex items-center justify-center w-11 h-11 shrink-0 mr-1 rounded-xl text-trozzi-charcoal hover:bg-trozzi-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trozzi-terracotta/50"
                        >
                            <FiArrowLeft className="text-xl" />
                        </button>
                    )}
                    <div className={`flex items-center bg-trozzi-white rounded-xl border transition-all duration-200 flex-1 min-w-0 ${isSearchOpen ? 'shadow-sm ring-2 ring-trozzi-terracotta/20 border-trozzi-terracotta/50' : 'border-trozzi-sand hover:border-trozzi-charcoal/30'}`}>
                        <div className="pl-3 pr-1 sm:pr-2 text-trozzi-warm-gray shrink-0">
                            <FiSearch className="text-[16px]" />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            autoFocus={autoFocus}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => { setIsSearchOpen(true); setActiveIndex(-1); }}
                            onKeyDown={handleKeyDown}
                            placeholder={isMobile ? 'Search products…' : 'Search for products, brands and more'}
                            aria-label="Search products"
                            aria-expanded={isSearchOpen}
                            aria-controls="global-search-suggestions"
                            autoComplete="off"
                            className="flex-1 min-w-0 pr-2 py-2.5 sm:py-3 bg-transparent outline-none text-[13px] sm:text-[14px] text-trozzi-charcoal placeholder-trozzi-warm-gray"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={handleClear}
                                aria-label="Clear search"
                                className="p-2.5 shrink-0 text-trozzi-warm-gray hover:text-trozzi-charcoal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trozzi-terracotta/50 rounded-xl"
                            >
                                <FiX className="text-lg" />
                            </button>
                        ) : null}
                    </div>
                </form>

                {/* Search Results Dropdown */}
                {isSearchOpen && (
                    <div
                        id="global-search-suggestions"
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-trozzi-sand max-h-96 overflow-y-auto z-50 animate-in slide-in-from-top-1 duration-200"
                    >
                        {/* Loading State */}
                        {isLoading && (
                            <div className="p-4 space-y-3" role="status" aria-live="polite">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-trozzi-sand/60 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 bg-trozzi-sand/60 rounded w-3/4 animate-pulse" />
                                        <div className="h-3 bg-trozzi-sand/50 rounded w-1/2 animate-pulse" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg bg-trozzi-sand/60 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 bg-trozzi-sand/60 rounded w-2/3 animate-pulse" />
                                        <div className="h-3 bg-trozzi-sand/50 rounded w-1/3 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {!isLoading && searchError && (
                            <div className="p-5 text-center">
                                <FiAlertCircle className="text-2xl text-trozzi-terracotta mx-auto mb-2" />
                                <p className="text-sm font-medium text-trozzi-charcoal">Something went wrong while searching</p>
                                <p className="text-xs text-trozzi-warm-gray mt-1">Check your connection and try again.</p>
                                <button
                                    type="button"
                                    onClick={() => searchProducts(String(searchQuery || '').trim())}
                                    className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg border border-trozzi-terracotta text-trozzi-terracotta hover:bg-trozzi-terracotta/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trozzi-terracotta/50"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Product Results */}
                        {!isLoading && !searchError && searchResults.length > 0 && (
                            <div>
                                <div className="px-4 py-3 border-b border-trozzi-sand bg-trozzi-ivory">
                                    <p className="text-xs font-semibold text-trozzi-charcoal uppercase tracking-wider">Products</p>
                                </div>
                                <ul role="listbox" aria-label="Search results">
                                    {searchResults.map((product, index) => (
                                        <li
                                            key={product.id || product._id || product.slug || product.name}
                                            role="option"
                                            aria-selected={activeIndex === index}
                                            onClick={() => handleProductClick(product)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`flex items-center p-4 cursor-pointer transition-colors duration-150 border-b border-trozzi-sand last:border-b-0 ${activeIndex === index ? 'bg-trozzi-ivory' : 'hover:bg-trozzi-ivory'}`}
                                        >
                                            <OptimizedImage
                                                src={product.image}
                                                variants={product.imageMedia?.variants || null}
                                                width={product.imageMedia?.width || undefined}
                                                height={product.imageMedia?.height || undefined}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                                wrapperClassName="w-12 h-12 rounded-lg mr-3 border border-trozzi-sand shrink-0"
                                                fallbackType="thumbnail"
                                                sizes="48px"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-trozzi-charcoal truncate">
                                                    {product.name}
                                                </h4>
                                                <p className="text-sm font-bold text-trozzi-terracotta mt-1">
                                                    {formatInr(product.price)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-3 border-t border-trozzi-sand bg-trozzi-ivory">
                                    <button
                                        onClick={() => handleSearch({ preventDefault: () => { } })}
                                        className="w-full text-center text-sm text-trozzi-terracotta hover:text-trozzi-charcoal font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trozzi-terracotta/50 rounded-lg py-1"
                                    >
                                        View all results for "{searchQuery}"
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recent Searches */}
                        {!isLoading && !searchError && searchResults.length === 0 && !String(searchQuery || '').trim() && recentSearches.length > 0 && (
                            <div>
                                <div className="px-4 py-3 border-b border-trozzi-sand bg-trozzi-ivory">
                                    <p className="text-xs font-semibold text-trozzi-charcoal uppercase tracking-wider">Recent Searches</p>
                                </div>
                                <ul role="listbox" aria-label="Recent searches">
                                    {recentSearches.map((query, index) => (
                                        <li
                                            key={query}
                                            role="option"
                                            aria-selected={activeIndex === index}
                                            onClick={() => handleRecentSearchClick(query)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`flex items-center p-3.5 cursor-pointer transition-colors duration-150 border-b border-trozzi-sand last:border-b-0 ${activeIndex === index ? 'bg-trozzi-ivory' : 'hover:bg-trozzi-ivory'}`}
                                        >
                                            <FiSearch className="text-trozzi-warm-gray mr-3 shrink-0" />
                                            <span className="text-sm text-trozzi-charcoal truncate">{query}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* No Results */}
                        {!isLoading && !searchError && String(searchQuery || '').trim().length >= MIN_SUGGEST_CHARS && searchResults.length === 0 && (
                            <div className="p-4 text-center text-trozzi-warm-gray">
                                <FiSearch className="text-2xl text-trozzi-sand mx-auto mb-2" />
                                <p className="text-sm font-medium">No products found for "{searchQuery}"</p>
                                <p className="text-xs text-trozzi-warm-gray mt-1">Try different keywords</p>
                            </div>
                        )}

                        {/* Popular Searches */}
                        {!isLoading && !searchError && searchResults.length === 0 && !String(searchQuery || '').trim() && recentSearches.length === 0 && (
                            <div className="p-4">
                                <p className="text-xs font-semibold text-trozzi-charcoal uppercase tracking-wider mb-3">Popular Searches</p>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_TERMS.map((term, index) => (
                                        <button
                                            key={term}
                                            type="button"
                                            onClick={() => handleRecentSearchClick(term)}
                                            className={`px-3 py-2 text-xs bg-trozzi-ivory text-trozzi-charcoal rounded-full hover:bg-trozzi-sand transition-colors duration-150 border border-trozzi-sand ${activeIndex === index ? 'bg-trozzi-sand' : ''}`}
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalSearch;
