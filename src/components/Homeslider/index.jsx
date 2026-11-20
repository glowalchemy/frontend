import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
// import "App.css";

import { Autoplay, Navigation } from 'swiper/modules';

import { fetchBanners } from '../../api/catalog';

const Homeslider = () => {
  const [items, setItems] = useState([]);

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

  return (
    <>
      <div className='homesilder py-3 md:py-4'>
        <div className='container'>
          <Swiper spaceBetween={10} navigation={true} modules={[Navigation, Autoplay]} autoplay={{ delay: 2500, disableOnInteraction: false }} className="silderhome">
            {items.map((b, idx) => (
              <SwiperSlide key={b.id}>
                <div className='item rounded-2xl overflow-hidden'>
                  {/* aspect-ratio box reserves space (no CLS); object-contain
                      keeps the FULL banner visible on every device — no
                      cropping of products, faces, text or buttons. */}
                  <div className='w-full aspect-[16/9] sm:aspect-[16/6] bg-[#f3efe8] relative'>
                    <img
                      src={b.imageUrl}
                      alt='Banner silder'
                      width={1920}
                      height={1080}
                      decoding="async"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      fetchPriority={idx === 0 ? 'high' : 'auto'}
                      className='relative z-10 w-full h-full object-contain'
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}


          </Swiper>
        </div>
      </div>
    </>
  )
}

export default Homeslider
