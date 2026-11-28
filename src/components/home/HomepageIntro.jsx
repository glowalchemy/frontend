import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobeAsia, FaCheckCircle } from 'react-icons/fa';

/**
 * Compact visible SEO introduction rendered immediately below the hero
 * slider. Carries the single homepage H1, the manufacturing subheading and
 * the primary CTAs. Kept deliberately small so the admin-managed hero
 * banners and shopping sections stay prominent.
 */
const HomepageIntro = () => (
  <section className="border-b border-glowalchemy-sand bg-glowalchemy-white" aria-label="About GlowAlchemy Care">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      <div className="max-w-3xl">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-glowalchemy-terracotta mb-3">
          Cosmetic Manufacturer in India
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-ink leading-tight">
          Cosmetic Manufacturers in India: Third-Party Manufacturing and Our Own Beauty Brand
        </h1>
        <p className="mt-4 text-base sm:text-lg text-brand-muted leading-relaxed">
          Glow Alchemy Care develops and manufactures skincare, haircare, and personal care
          products in India, under your brand name or ours.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-glowalchemy-terracotta text-white rounded-lg font-semibold hover:bg-glowalchemy-charcoal transition-colors text-center"
          >
            Get a Free Quote
          </Link>
          <Link
            to="/ProductListing"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border-2 border-glowalchemy-terracotta text-glowalchemy-terracotta rounded-lg font-semibold hover:bg-glowalchemy-ivory transition-colors text-center"
          >
            Shop GlowAlchemy Care
          </Link>
        </div>
      </div>

      {/* Trust strip — only claims that are safe to publish */}
      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <li className="flex items-center gap-3 bg-glowalchemy-ivory border border-glowalchemy-sand rounded-xl px-4 py-3">
          <FaGlobeAsia className="text-glowalchemy-terracotta text-lg flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold text-brand-ink">Made in India</span>
        </li>
        <li className="flex items-center gap-3 bg-glowalchemy-ivory border border-glowalchemy-sand rounded-xl px-4 py-3">
          <FaCheckCircle className="text-glowalchemy-terracotta text-lg flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold text-brand-ink">Quality-Focused Manufacturing</span>
        </li>
      </ul>
      {/* NOTE: "100+ Products Developed" was intentionally omitted pending
          business-owner confirmation. */}
    </div>
  </section>
);

export default HomepageIntro;
