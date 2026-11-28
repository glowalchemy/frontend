import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { applySeo } from '../utils/seo';
import { SEO_SITE } from '../config/seo';

const NotFound = () => {
    // 404 routes (including invalid product slugs) get their own noindex
    // metadata so they never inherit the previous page's title/canonical.
    useEffect(() => {
        applySeo({
            title: `Page Not Found | ${SEO_SITE.name}`,
            description: `The page or product you are looking for does not exist on ${SEO_SITE.name}.`,
            canonicalUrl: `${SEO_SITE.domain}/`,
            noindex: true,
            jsonLd: null,
        });
    }, []);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-glowalchemy-ivory">
                    <FiSearch className="h-8 w-8 text-glowalchemy-terracotta" />
                </div>
                <h1 className="text-3xl font-bold text-glowalchemy-charcoal mb-3">Page not found</h1>
                <p className="text-glowalchemy-warm-gray mb-8">
                    The page or product you are looking for does not exist or is no longer available.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-xl bg-glowalchemy-terracotta px-6 py-3 text-white font-medium hover:bg-glowalchemy-charcoal transition-colors"
                    >
                        Back to Home
                    </Link>
                    <Link
                        to="/ProductListing"
                        className="inline-flex items-center justify-center rounded-xl border border-glowalchemy-sand px-6 py-3 text-glowalchemy-charcoal font-medium hover:bg-glowalchemy-ivory transition-colors"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
