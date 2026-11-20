import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Autoplay, Navigation } from 'swiper/modules';

import { fetchBanners } from '../../api/catalog';
import BannerImage from '../BannerImage';

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
                  {/* Fixed responsive ratios: 16:9 mobile, 16:6 desktop.
                      object-contain keeps the full artwork visible; the flat
                      cream backdrop handles aspect mismatch without blur
                      bands, crops, or distortion. */}
                  <BannerImage
                    src={b.imageUrl}
                    alt='Banner silder'
                    ratioClassName="aspect-[16/9] sm:aspect-[16/6]"
                    eager={idx === 0}
                    className="rounded-2xl"
                  />
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
