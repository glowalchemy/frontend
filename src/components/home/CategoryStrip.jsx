import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../context/CategoryContext';

const CATEGORY_TILES = [
  { name: 'Hair Care', img: '/hair.jpg', query: 'Haircare' },
  { name: 'Body Care', img: '/body.jpg', query: 'Body Care' },
  { name: 'Face Care', img: '/face.jpg', query: 'Face Care' },
  { name: 'Lip Care', img: '/lip.jpg', query: 'Lip Care' },
  { name: 'Skin Care', img: '/skin.jpg', query: 'Skincare' },
];

const CategoryStrip = () => {
  const { categories: apiCategories } = useCategories();
  const railRef = useRef(null);

  const resolveCategoryToParam = useMemo(() => {
    const list = Array.isArray(apiCategories) ? apiCategories : [];
    return (name) => {
      const raw = String(name || '').trim().toLowerCase();
      if (!raw) return '';
      const match = list.find((c) => {
        const n = String(c?.name || c?.title || '').trim().toLowerCase();
        const slug = String(c?.slug || '').trim().toLowerCase();
        return (n && n === raw) || (slug && slug === raw);
      });
      return String(match?.id || match?._id || '');
    };
  }, [apiCategories]);

  const tiles = CATEGORY_TILES.map((tile) => {
    const param = resolveCategoryToParam(tile.name) || resolveCategoryToParam(tile.query);
    return { ...tile, to: param ? `/ProductListing?category=${encodeURIComponent(param)}` : '/ProductListing' };
  });

  const scrollBy = (delta) => {
    railRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section className="bg-white">
      <div className="ga-container py-8 sm:py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="ga-eyebrow text-burgundy">Shop By Ritual</p>
            <h2 className="ga-serif mt-2 text-[22px] text-[var(--color-text)] sm:text-[26px]">Find Your Everyday Care</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-320)}
              aria-label="Scroll categories left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-burgundy transition-colors hover:bg-pink-soft"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollBy(320)}
              aria-label="Scroll categories right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-burgundy transition-colors hover:bg-pink-soft"
            >
              ›
            </button>
          </div>
        </div>

        <div ref={railRef} className="ga-rail justify-start md:justify-between">
          {tiles.map((tile) => (
            <Link
              key={tile.name}
              to={tile.to}
              className="group flex min-w-[88px] flex-1 flex-col items-center md:min-w-0"
            >
              <span className="relative flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-pink-light p-[3px] transition-all duration-300 group-hover:border-burgundy/40 group-hover:shadow-[0_10px_24px_rgba(20,61,43,0.12)] sm:h-[92px] sm:w-[92px]">
                <img
                  src={tile.img}
                  alt={tile.name}
                  className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </span>
              <span className="mt-3 text-center text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--color-text)] transition-colors group-hover:text-burgundy sm:text-[12px]">
                {tile.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;
