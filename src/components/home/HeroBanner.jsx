import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { fetchPopularProducts } from '../../api/catalog';
import OptimizedImage from '../shared/OptimizedImage';
import { pickHeroProducts } from '../../utils/homeProducts';

const HeroBanner = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPopularProducts({ limit: 24 });
        if (cancelled) return;
        const items = Array.isArray(data) ? data : data?.items || [];
        setProducts(items);
      } catch (_e) {
        if (!cancelled) setProducts([]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroProducts = useMemo(() => pickHeroProducts(products), [products]);
  const [first, second, third] = heroProducts;

  const productLink = (product) => (product?.id ? `/product/${product.id}` : '/ProductListing');

  return (
    <section className="ga-hero">
      {/* botanical decoration */}
      <div
        className="ga-hero-blob -top-24 -left-24 h-72 w-72 opacity-70"
        style={{ background: 'radial-gradient(circle, var(--color-surface-muted) 0%, rgba(231,234,221,0) 72%)' }}
        aria-hidden="true"
      />
      <div
        className="ga-hero-blob right-[-10%] top-1/3 h-[520px] w-[520px] opacity-80"
        style={{ background: 'radial-gradient(circle, var(--color-surface-muted) 0%, rgba(255,252,247,0) 70%)' }}
        aria-hidden="true"
      />
      <FaLeaf
        className="absolute left-6 top-10 hidden text-5xl text-[var(--color-accent)]/40 lg:block"
        aria-hidden="true"
        style={{ transform: 'rotate(-18deg)' }}
      />
      <FaLeaf
        className="absolute bottom-10 right-1/3 hidden text-4xl text-[var(--color-accent)]/30 lg:block"
        aria-hidden="true"
        style={{ transform: 'rotate(24deg)' }}
      />

      <div className="ga-container relative">
        <div className="grid items-center gap-10 py-8 sm:py-10 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-0 lg:min-h-[500px]">
          {/* ---------- Copy ---------- */}
          <div className="relative z-10 text-center lg:text-left animate-fade-up">
            <p className="ga-eyebrow mb-4 flex items-center justify-center gap-3 text-burgundy lg:justify-start">
              <span className="h-px w-10 bg-burgundy/40" aria-hidden="true" />
              GlowAlchemy
              <span className="hidden h-px w-10 bg-burgundy/40 lg:inline-block" aria-hidden="true" />
            </p>

            <h1 className="ga-serif text-[2.25rem] leading-[1.06] text-[var(--color-text)] sm:text-5xl lg:text-[3.6rem] xl:text-[3.9rem]">
              Natural Care.
              <br />
              <span className="italic text-burgundy">Lasting Glow.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-glowalchemy-warm-gray lg:mx-0">
              Your complete beauty &amp; wellness range, crafted with nature&apos;s finest botanicals for
              skin that glows from within.
            </p>

            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)] lg:justify-start">
              <span>Skincare</span>
              <span className="text-[var(--color-accent)]">•</span>
              <span>Haircare</span>
              <span className="text-[var(--color-accent)]">•</span>
              <span>Bodycare</span>
              <span className="text-[var(--color-accent)]">•</span>
              <span>Selfcare</span>
            </p>

            <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/ProductListing"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-burgundy px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.14em] text-white shadow-[0_14px_30px_rgba(20,61,43,0.24)] transition-all duration-300 hover:bg-burgundy-deep hover:shadow-[0_18px_36px_rgba(20,61,43,0.3)] sm:w-auto"
              >
                Shop The Collection
                <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#bestsellers"
                className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--color-text)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-8 transition-colors hover:text-burgundy"
              >
                Our Bestsellers
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[var(--color-text-muted)] lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <FiCheck className="text-burgundy" /> 100% Natural
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCheck className="text-burgundy" /> Dermatologically Tested
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCheck className="text-burgundy" /> Cruelty-Free
              </span>
            </div>
          </div>

          {/* ---------- Product composition ---------- */}
          <div className="relative mx-auto w-full max-w-[540px]">
            {/* desktop composition */}
            <div className="relative hidden h-[440px] lg:block xl:h-[470px]">
              <div
                className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'linear-gradient(150deg, var(--color-surface-muted) 0%, var(--color-surface) 60%, var(--color-background) 100%)' }}
                aria-hidden="true"
              />
              <div
                className="ga-hero-ring left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <div
                className="ga-hero-ring left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2"
                aria-hidden="true"
              />

              {/* small left */}
              <Link
                to={productLink(first)}
                className="ga-hero-product ga-float-slow absolute left-0 top-6 h-[168px] w-[140px] transition-transform duration-500 hover:-translate-y-1"
                aria-label={first?.name}
              >
                <OptimizedImage
                  src={first?.image}
                  alt={first?.name || 'GlowAlchemy product'}
                  className="h-full w-full object-contain p-2"
                  wrapperClassName="h-full w-full"
                  fallbackType="card"
                  priority
                  sizes="140px"
                />
              </Link>

              {/* small right */}
              <Link
                to={productLink(second)}
                className="ga-hero-product ga-float absolute right-0 top-20 h-[190px] w-[158px] transition-transform duration-500 hover:-translate-y-1"
                aria-label={second?.name}
              >
                <OptimizedImage
                  src={second?.image}
                  alt={second?.name || 'GlowAlchemy product'}
                  className="h-full w-full object-contain p-2"
                  wrapperClassName="h-full w-full"
                  fallbackType="card"
                  sizes="158px"
                />
              </Link>

              {/* main centre */}
              <Link
                to={productLink(third)}
                className="ga-hero-product absolute bottom-2 left-1/2 z-10 h-[240px] w-[204px] -translate-x-1/2 transition-transform duration-500 hover:-translate-y-1"
                aria-label={third?.name}
              >
                <OptimizedImage
                  src={third?.image}
                  alt={third?.name || 'GlowAlchemy product'}
                  className="h-full w-full object-contain p-3"
                  wrapperClassName="h-full w-full"
                  fallbackType="card"
                  sizes="204px"
                />
                <span className="absolute inset-x-4 bottom-3 rounded-full bg-white/95 py-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-burgundy shadow-sm">
                  Bestseller
                </span>
              </Link>

              <div className="absolute right-2 bottom-8 z-20 rounded-2xl border border-[var(--color-border)] bg-white/95 px-4 py-3 text-center shadow-[0_12px_28px_rgba(20,61,43,0.12)] backdrop-blur">
                <p className="ga-serif text-lg leading-none text-burgundy">100%</p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Natural &amp; Safe
                </p>
              </div>
            </div>

            {/* mobile / tablet composition */}
            <div className="lg:hidden">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {[first, second, third].map((product, index) => (
                  <Link
                    key={`${product?.name}-${index}`}
                    to={productLink(product)}
                    className={`ga-hero-product relative aspect-[3/4] ${
                      index === 1 ? 'mt-5 sm:mt-8' : ''
                    }`}
                    aria-label={product?.name}
                  >
                    <OptimizedImage
                      src={product?.image}
                      alt={product?.name || 'GlowAlchemy product'}
                      className="h-full w-full object-contain p-1.5"
                      wrapperClassName="h-full w-full"
                      fallbackType="card"
                      priority={index === 0}
                      sizes="(min-width: 640px) 30vw, 32vw"
                    />
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Skincare • Haircare • Bodycare
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
