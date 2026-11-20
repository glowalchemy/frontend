import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { fetchPopularProducts } from '../../api/catalog';
import { pickBestsellers } from '../../utils/homeProducts';
import SectionHeading from './SectionHeading';

const Bestsellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPopularProducts({ limit: 24 });
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : data?.items || []);
      } catch (_e) {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => pickBestsellers(products), [products]);

  return (
    <section id="bestsellers" className="ga-section bg-white">
      <div className="ga-container">
        <SectionHeading
          eyebrow="Handpicked For You"
          title="Our Bestsellers"
          subtitle="Premium care. Visible results. The rituals our community reaches for again and again."
          action="View All Products"
          actionTo="/ProductListing"
          align="left"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {cards.map((card, index) => {
            const to = card.id ? `/product/${card.id}` : '/ProductListing';
            return (
              <Link
                key={card.key}
                to={to}
                className="ga-promo-card ga-product-card group flex flex-col overflow-hidden"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="ga-bestseller-image relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 55%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 65%)',
                    }}
                    aria-hidden="true"
                  />
                  <img
                    src={card.image}
                    alt={card.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="relative z-10 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.05] sm:p-6"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                  <span className="absolute left-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-burgundy shadow-sm">
                    {index === 0 ? 'Bestseller' : index === 1 ? 'New Love' : 'Cult Favourite'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="ga-serif text-[19px] leading-snug text-[#29151F] transition-colors group-hover:text-burgundy sm:text-[21px]">
                    {card.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-glowalchemy-warm-gray">
                    {card.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#F3DDE5] pt-4">
                    {card.price ? (
                      <span className="text-[15px] font-semibold text-burgundy">{card.price}</span>
                    ) : (
                      <span className="text-[11px] uppercase tracking-[0.16em] text-[#9A7C88]">
                        Natural care
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full bg-burgundy px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-all duration-300 group-hover:bg-burgundy-deep">
                      {card.cta}
                      <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {loading ? (
          <p className="sr-only" role="status">
            Loading bestselling products
          </p>
        ) : null}
      </div>
    </section>
  );
};

export default Bestsellers;
