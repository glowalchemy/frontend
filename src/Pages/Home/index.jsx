import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaGem, FaTshirt, FaUtensils, FaHome, FaPlug, FaHeart } from 'react-icons/fa'
import Homeslider from '../../components/Homeslider'
import Adsbennerslider from '../../components/Adsbannerslider'
import PopularProducts from '../../components/product/popularproduct'
import LatestProducts from '../../components/Latestproduct/latestproduct'
import FeaturedSlider from '../../components/FeaturedSlider/FeaturedSlider'
import AdBannerSection from '../../components/aBanner/Banner'
import { fetchCategories } from '../../api/catalog'


// Main Home component
const Home = () => {
  const [apiCategories, setApiCategories] = useState([])
  const categoryStripRef = useRef(null)
  const [canScrollCategories, setCanScrollCategories] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await fetchCategories()
        if (cancelled) return
        setApiCategories(Array.isArray(data) ? data : [])
      } catch (_e) {
        if (!cancelled) setApiCategories([])
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = categoryStripRef.current
    if (!el) return

    const compute = () => {
      try {
        setCanScrollCategories(el.scrollWidth > el.clientWidth + 2)
      } catch (_e) {
        setCanScrollCategories(false)
      }
    }

    compute()
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('resize', compute)
    }
  }, [apiCategories.length])

  const resolveCategoryToParam = useMemo(() => {
    const list = Array.isArray(apiCategories) ? apiCategories : []
    return (name) => {
      const raw = String(name || '').trim()
      if (!raw) return ''
      const rawLower = raw.toLowerCase()
      const match = list.find((c) => {
        const n = String(c?.name || c?.title || '').trim().toLowerCase()
        const slug = String(c?.slug || '').trim().toLowerCase()
        return (n && n === rawLower) || (slug && slug === rawLower)
      })
      return String(match?.id || match?._id || raw)
    }
  }, [apiCategories])

  const categories = useMemo(() => {
    // Always show default 6 categories (ignore API count)
    const buildTo = (name) => {
      const param = resolveCategoryToParam(name)
      return param ? `/ProductListing?category=${encodeURIComponent(param)}` : '/ProductListing'
    }

    return [
      {
        name: 'Kitchen',
        icon: FaUtensils,
        img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&h=200&fit=crop',
        color: 'border-trozzi-terracotta',
        bg: 'bg-trozzi-ivory',
        to: buildTo('Kitchen'),
      },
      {
        name: 'Home & Decor',
        icon: FaHome,
        img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200&h=200&fit=crop',
        color: 'border-trozzi-charcoal',
        bg: 'bg-trozzi-sand',
        to: buildTo('Home & Decor'),
      },
      {
        name: 'Jewellery',
        icon: FaGem,
        img: 'https://stylia.in/cdn/shop/files/a_remove_crease_from_t_2.png?v=1767615306&width=800',
        color: 'border-trozzi-terracotta',
        bg: 'bg-trozzi-ivory',
        to: buildTo('Jewellery'),
      },
      {
        name: 'Fashion',
        icon: FaTshirt,
        img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
        color: 'border-trozzi-charcoal',
        bg: 'bg-trozzi-sand',
        to: buildTo('Fashion'),
      },
      {
        name: 'Electronics',
        icon: FaPlug,
        img: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=200&h=200&fit=crop',
        color: 'border-trozzi-terracotta',
        bg: 'bg-trozzi-ivory',
        to: buildTo('Electronics'),
      },
      {
        name: 'Beauty',
        icon: FaHeart,
        img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        color: 'border-trozzi-charcoal',
        bg: 'bg-trozzi-sand',
        to: buildTo('Beauty'),
      },
    ]
  }, [apiCategories, resolveCategoryToParam])

  return (
    <div className="home-page bg-trozzi-ivory min-h-screen pb-20 md:pb-0">
      {/* Categories Section - Always Visible */}
      <section className="categories-section bg-trozzi-white border-b border-trozzi-sand relative z-base">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="relative">
            {/* Desktop Scroll Buttons */}
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => categoryStripRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
              className={`${canScrollCategories ? 'hidden lg:flex' : 'hidden'} absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-trozzi-white shadow-lg border border-trozzi-sand hover:bg-trozzi-ivory transition-colors`}
            >
              <span className="text-xl leading-none text-trozzi-charcoal">‹</span>
            </button>

            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => categoryStripRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
              className={`${canScrollCategories ? 'hidden lg:flex' : 'hidden'} absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-trozzi-white shadow-lg border border-trozzi-sand hover:bg-trozzi-ivory transition-colors`}
            >
              <span className="text-xl leading-none text-trozzi-charcoal">›</span>
            </button>

            <div
              ref={categoryStripRef}
              className="flex w-full items-start justify-start gap-3 sm:gap-4 md:gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide px-1 sm:px-0 py-2 sm:py-3"
              style={{ scrollSnapType: 'x mandatory' }}
            >
            {categories.map((c) => {
              const Icon = c.icon
              return (
                <Link
                  key={c.name}
                  to={c.to}
                  className="flex flex-col items-center min-w-[64px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px] group flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className={`h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 aspect-square rounded-full border-2 ${c.color} ${c.bg} flex items-center justify-center overflow-hidden bg-trozzi-ivory shrink-0 transition-transform group-hover:scale-105 group-hover:shadow-md`}>
                    {c.img ? (
                      <img
                        src={c.img}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: '1/1' }}
                        loading="eager"
                      />
                    ) : (
                      <Icon className="text-trozzi-charcoal text-base sm:text-lg md:text-xl lg:text-2xl" />
                    )}
                  </div>
                  <div className="mt-1.5 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-trozzi-charcoal text-center group-hover:text-trozzi-terracotta transition-colors">
                    {c.name}
                  </div>
                </Link>
              )
            })}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - Slider Only */}
      <section className="hero-section">
        <Homeslider />
        <div data-scroll-top-trigger="1" />
      </section>

      {/* Products Section */}
      <section className="products-section py-4 sm:py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <PopularProducts hideAddToCart />
          {/* AdBanner */}
          <div className="mt-4 sm:mt-8 md:mt-12">
            <AdBannerSection />
          </div>
          <LatestProducts title="Latest Products" hideAddToCart />
          <FeaturedSlider hideAddToCart />
        </div>
      </section>

      {/* Promotions Section */}
      <section className="promotions-section py-4 sm:py-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Adsbennerslider items={4} />
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-sections">
      </section>
    </div>
  )
}

export default Home
