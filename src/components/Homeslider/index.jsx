import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Autoplay, Navigation } from 'swiper/modules';

import { fetchBanners } from '../../api/catalog';
import BannerImage from '../BannerImage';

// Hero slider (position: home_hero).
//
// Performance contract:
//  - The hero box is reserved at its final responsive ratio BEFORE the banner
//    API answers, so the section never collapses to 0px and pushes the page
//    down when banners arrive (CLS).
//  - Only the active slide ±1 neighbour render an <img>. Hidden slides render
//    an identically sized empty box, so Swiper's translate/autoplay can never
//    trigger a bulk download of every banner.
//  - The active slide is `eager` + `fetchpriority=high` (the LCP image); its
//    neighbours are lazy and low priority.
const HERO_RATIO_CLASS = 'aspect-[16/9] sm:aspect-[16/6]';
const HERO_SIZES = '(min-width: 1280px) 1280px, 100vw';
const NEIGHBOURS = 1;

const Homeslider = () => {
  // null = still loading (reserve space), [] = loaded but empty.
  const [items, setItems] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchBanners({ position: 'home_hero' });
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setItems([]);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) {
    return (
      <div className='homesilder py-3 md:py-4'>
        <div className='container'>
          <div
            className={`w-full rounded-2xl bg-[var(--color-surface-muted)] animate-pulse ${HERO_RATIO_CLASS}`}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <>
      <div className='homesilder py-3 md:py-4'>
        <div className='container'>
          <Swiper
            spaceBetween={10}
            navigation={true}
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            onSlideChange={(swiper) => setActive(swiper.realIndex || 0)}
            className="silderhome"
          >
            {items.map((b, idx) => {
              const media = b.imageMedia || null;
              const isNear = Math.abs(idx - active) <= NEIGHBOURS;
              return (
                <SwiperSlide key={b.id}>
                  <div className='item rounded-2xl overflow-hidden'>
                    {isNear ? (
                      <BannerImage
                        src={b.imageUrl}
                        variants={media?.variants || null}
                        width={media?.width || null}
                        height={media?.height || null}
                        sizes={HERO_SIZES}
                        alt={b.title || 'Banner slider'}
                        ratioClassName={HERO_RATIO_CLASS}
                        eager={idx === active}
                        fetchPriority={idx === active ? 'high' : 'low'}
                        className="rounded-2xl"
                      />
                    ) : (
                      <div className={`w-full bg-[var(--color-surface-muted)] ${HERO_RATIO_CLASS}`} aria-hidden="true" />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default Homeslider
