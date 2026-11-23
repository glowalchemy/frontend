import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

import { fetchBanners } from "../../api/catalog";
import BannerImage from "../BannerImage";

const AdBannerSection = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchBanners({ position: "home_ad_grid" });
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

  if (items.length === 0) return null;

  return (
    <section className="container banner-section">
      <div className="md:hidden -mx-3">
        <Swiper
          slidesPerView={1.15}
          spaceBetween={10}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          modules={[Autoplay, Pagination]}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <Link to={item.linkUrl || '/'} className="banner-card block px-3" key={item.id}>
                <BannerImage
                  src={item.imageUrl}
                  variants={item.imageMedia?.variants || null}
                  width={item.imageMedia?.width || null}
                  height={item.imageMedia?.height || null}
                  alt={`banner-${item.id}`}
                  sizes="(min-width: 768px) 25vw, 100vw"
                  className="rounded-lg h-full"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden md:block">
        <div className="banner-container">
          {items.map((item) => (
            <Link to={item.linkUrl || '/'} className="banner-card block" key={item.id}>
              <BannerImage
                src={item.imageUrl}
                variants={item.imageMedia?.variants || null}
                width={item.imageMedia?.width || null}
                height={item.imageMedia?.height || null}
                alt={`banner-${item.id}`}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="rounded-lg h-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdBannerSection;
