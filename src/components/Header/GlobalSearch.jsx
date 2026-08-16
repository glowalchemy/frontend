import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { fetchProducts } from '../../api/catalog';
import ImageWithFallback from '../shared/ImageWithFallback';

const formatInr = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return '';
    return `₹${num.toLocaleString()}`;
};

const GlobalSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = (query) => {
        if (!query.trim()) return;

        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Search products
    const searchProducts = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const normalizeProduct = (p) => {
            if (!p || typeof p !== 'object') return null;
            const id = p.id || p._id || '';
            return {
                ...p,
                id,
            };
        };

        setIsLoading(true);
        try {
            const results = await fetchProducts({ mode: "public", q: query, limit: 10 });
            const items = Array.isArray(results) ? results : (results && Array.isArray(results.items) ? results.items : []);
            setSearchResults(items.map(normalizeProduct).filter(Boolean));
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                searchProducts(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle search submit
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            saveRecentSearch(searchQuery);
            navigate(`/ProductListing?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Handle product click
    const handleProductClick = (product) => {
        saveRecentSearch(searchQuery);
        setIsSearchOpen(false);
        setSearchQuery('');
        const id = product?.id || product?._id;
        if (id) {
            navigate(`/product/${id}`);
        }
    };

    // Handle recent search click
    const handleRecentSearchClick = (query) => {
        setSearchQuery(query);
        navigate(`/ProductListing?q=${encodeURIComponent(query)}`);
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    // Close search on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={searchRef}>
            {/* Search Input */}
            <div className="relative">
                <form onSubmit={handleSearch}>
                    <div className={`flex items-center bg-white rounded-xl border border-gray-200 transition-all duration-200 ${isSearchOpen ? 'shadow-sm ring-2 ring-[#2874F0]/10 border-[#2874F0]/40' : 'hover:border-gray-300'}`}>
                        <div className="pl-3 pr-2 text-gray-500">
                            <FiSearch className="text-[16px]" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchOpen(true)}
                            placeholder="Search for Products, Brands and More"
                            className="flex-1 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-transparent outline-none text-[13px] sm:text-[14px] text-gray-900 placeholder-gray-400"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                <FiX className="text-lg" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Search Results Dropdown */}
                {isSearchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-trozzi-sand max-h-96 overflow-hidden z-50 animate-in slide-in-from-top-1 duration-200">
                        {/* Loading State */}
                        {isLoading && (
                            <div className="p-4 text-center text-trozzi-warm-gray">
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-trozzi-terracotta border-t-transparent"></div>
                                <span className="ml-2 text-sm font-medium">Searching...</span>
                            </div>
                        )}

                        {/* Search Results */}
                        {!isLoading && searchResults.length > 0 && (
                            <div>
                                <div className="px-4 py-3 border-b border-trozzi-sand bg-trozzi-ivory">
                                    <p className="text-xs font-semibold text-trozzi-charcoal uppercase tracking-wider">Products</p>
                                </div>
                                {searchResults.map((product) => (
                                    <div
                                        key={product.id || product._id || product.slug || product.name}
                                        onClick={() => handleProductClick(product)}
                                        className="flex items-center p-4 hover:bg-trozzi-ivory cursor-pointer transition-colors duration-150 border-b border-trozzi-sand last:border-b-0"
                                    >
                                        <ImageWithFallback
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-lg mr-3 border border-trozzi-sand"
                                            fallbackType="thumbnail"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-trozzi-charcoal truncate">
                                                {product.name}
                                            </h4>
                                            <p className="text-xs text-trozzi-warm-gray truncate mt-0.5">
                                                {product.description}
                                            </p>
                                            <p className="text-sm font-bold text-trozzi-terracotta mt-1">
                                                {formatInr(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-3 border-t border-trozzi-sand bg-trozzi-ivory">
                                    <button
                                        onClick={() => handleSearch({ preventDefault: () => { } })}
                                        className="w-full text-center text-sm text-trozzi-terracotta hover:text-trozzi-charcoal font-medium transition-colors"
                                    >
                                        View all results for "{searchQuery}"
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recent Searches */}
                        {!isLoading && searchResults.length === 0 && searchQuery.length === 0 && recentSearches.length > 0 && (
                            <div>
                                <div className="px-4 py-3 border-b border-trozzi-sand bg-trozzi-ivory">
                                    <p className="text-xs font-semibold text-trozzi-charcoal uppercase tracking-wider">Recent Searches</p>
                                </div>
                                {recentSearches.map((query, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleRecentSearchClick(query)}
                                        className="flex items-center p-3 hover:bg-trozzi-ivory cursor-pointer transition-colors duration-150 border-b border-trozzi-sand last:border-b-0"
                                    >
                                        <FiSearch className="text-trozzi-warm-gray mr-3" />
                                        <span className="text-sm text-trozzi-charcoal">{query}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {!isLoading && searchQuery.length > 0 && searchResults.length === 0 && (
                            <div className="p-4 text-center text-trozzi-warm-gray">
                                <FiSearch className="text-2xl text-trozzi-sand mx-auto mb-2" />
                                <p className="text-sm font-medium">No products found for "{searchQuery}"</p>
                                <p className="text-xs text-trozzi-warm-gray mt-1">Try different keywords</p>
                            </div>
                        )}

                        {/* Search Suggestions */}
                        {!isLoading && searchResults.length === 0 && searchQuery.length === 0 && recentSearches.length === 0 && (
                            <div className="p-4">
                                <p className="text-xs font-semibold text-trozzi-charcoal uppercase tracking-wider mb-3">Popular Searches</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Fashion', 'Electronics', 'Footwear', 'Bags', 'Medicine'].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleRecentSearchClick(term)}
                                            className="px-3 py-1.5 text-xs bg-trozzi-ivory text-trozzi-charcoal rounded-full hover:bg-trozzi-sand transition-colors duration-150 border border-trozzi-sand"
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
