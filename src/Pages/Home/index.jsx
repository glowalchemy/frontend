import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf, FaFlask, FaHeart, FaSpa, FaTree, FaPumpSoap, FaCheckCircle, FaHandshake, FaRecycle } from 'react-icons/fa'
import Homeslider from '../../components/Homeslider'
import Adsbennerslider from '../../components/Adsbannerslider'
import PopularProducts from '../../components/product/popularproduct'
import LatestProducts from '../../components/Latestproduct/latestproduct'
import FeaturedSlider from '../../components/FeaturedSlider/FeaturedSlider'
import AdBannerSection from '../../components/aBanner/Banner'
import { useCategories } from '../../context/CategoryContext'


// Main Home component
const Home = () => {
  const { categories: apiCategories } = useCategories()
  const categoryStripRef = useRef(null)
  const [canScrollCategories, setCanScrollCategories] = useState(false)

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
        name: 'Hair Care',
        icon: FaPumpSoap,
        img: '/hair.jpg',
        color: 'border-glowalchemy-terracotta',
        bg: 'bg-glowalchemy-ivory',
        to: buildTo('Haircare'),
      },
      {
        name: 'Body Care',
        icon: FaSpa,
        img: '/body.jpg',
        color: 'border-glowalchemy-charcoal',
        bg: 'bg-glowalchemy-sand',
        to: buildTo('Body Care'),
      },
      {
        name: 'Face Care',
        icon: FaHeart,
        img: '/face.jpg',
        color: 'border-glowalchemy-terracotta',
        bg: 'bg-glowalchemy-ivory',
        to: buildTo('Face Care'),
      },
      {
        name: 'Lip Care',
        icon: FaFlask,
        img: '/lip.jpg',
        color: 'border-glowalchemy-charcoal',
        bg: 'bg-glowalchemy-sand',
        to: buildTo('Lip Care'),
      },
      {
        name: 'Skin Care',
        icon: FaSpa,
        img: '/skin.jpg',
        color: 'border-glowalchemy-terracotta',
        bg: 'bg-glowalchemy-ivory',
        to: buildTo('Skincare'),
      },
    ]
  }, [apiCategories, resolveCategoryToParam])

  return (
    <div className="home-page bg-glowalchemy-ivory min-h-screen pb-20 md:pb-0">
      {/* Categories Section - Always Visible */}
      <section className="categories-section bg-glowalchemy-white border-b border-glowalchemy-sand relative z-base">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="relative">
            {/* Desktop Scroll Buttons */}
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => categoryStripRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
              className={`${canScrollCategories ? 'hidden lg:flex' : 'hidden'} absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-glowalchemy-white shadow-lg border border-glowalchemy-sand hover:bg-glowalchemy-ivory transition-colors`}
            >
              <span className="text-xl leading-none text-glowalchemy-charcoal">‹</span>
            </button>

            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => categoryStripRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
              className={`${canScrollCategories ? 'hidden lg:flex' : 'hidden'} absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-glowalchemy-white shadow-lg border border-glowalchemy-sand hover:bg-glowalchemy-ivory transition-colors`}
            >
              <span className="text-xl leading-none text-glowalchemy-charcoal">›</span>
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
                  <div className={`h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 aspect-square rounded-full border-2 ${c.color} ${c.bg} flex items-center justify-center overflow-hidden bg-glowalchemy-ivory shrink-0 transition-transform group-hover:scale-105 group-hover:shadow-md`}>
                    {c.img ? (
                      <img
                        src={c.img}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: '1/1' }}
                        loading="eager"
                      />
                    ) : (
                      <Icon className="text-glowalchemy-charcoal text-base sm:text-lg md:text-xl lg:text-2xl" />
                    )}
                  </div>
                  <div className="mt-1.5 sm:mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-glowalchemy-charcoal text-center group-hover:text-glowalchemy-terracotta transition-colors">
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
      <section className="content-sections py-8 sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-glowalchemy-terracotta to-glowalchemy-charcoal rounded-2xl p-6 sm:p-8 md:p-12 text-white">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Third Party Colour Cosmetics Manufacturer
              </h2>
              <p className="text-sm sm:text-base text-glowalchemy-ivory mb-2">Started in 2016</p>
            </div>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-base sm:text-lg text-white leading-relaxed mb-6">
                Welcome to GlowAlchemy, where beauty knows no boundaries. Explore the mysteries of skincare and the wonders of cosmetics, crafted through private label manufacturing. Discover unique, high-quality products tailored to your needs, empowering you to shine brightly. Join us in celebrating the limitless possibilities of beauty in the universe!
              </p>
              <p className="text-base sm:text-lg text-white font-semibold">
                We strive to develop solutions for small, medium and big Brands.
              </p>
            </div>
          </div>

          {/* Key Features/Claims Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 border border-glowalchemy-sand">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
              Our Commitment to Quality
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                { icon: FaCheckCircle, text: 'Toxins Free' },
                { icon: FaLeaf, text: 'ECO Friendly' },
                { icon: FaCheckCircle, text: 'No Skin-Damaging' },
                { icon: FaFlask, text: 'pH Balanced' },
                { icon: FaHeart, text: 'Cruelty-Free' },
                { icon: FaLeaf, text: 'Herbal Blend' },
                { icon: FaCheckCircle, text: 'SLS & Paraben-Free' },
                { icon: FaRecycle, text: 'Recycle Packaging' },
                { icon: FaHandshake, text: 'Customized Formulations' },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="bg-glowalchemy-ivory rounded-xl p-4 sm:p-6 border border-glowalchemy-sand hover:shadow-lg transition-shadow text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-glowalchemy-sand rounded-full flex items-center justify-center">
                      <Icon className="text-glowalchemy-terracotta text-xl sm:text-2xl" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">{feature.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link 
              to="/contact" 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-glowalchemy-terracotta text-white rounded-lg font-semibold hover:bg-glowalchemy-charcoal transition-colors text-center"
            >
              Request an Enquiry
            </Link>
            <Link 
              to="/services" 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-glowalchemy-terracotta text-glowalchemy-terracotta rounded-lg font-semibold hover:bg-glowalchemy-ivory transition-colors text-center"
            >
              Provide Services
            </Link>
          </div>

          {/* Product Categories Section */}
          <div className="bg-glowalchemy-ivory rounded-2xl p-6 sm:p-8 md:p-12 border border-glowalchemy-sand">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Left: Stats */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Our Achievements</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 sm:p-6 border-l-4 border-glowalchemy-terracotta shadow-sm">
                    <div className="text-2xl sm:text-3xl font-bold text-glowalchemy-terracotta mb-1">3000KG</div>
                    <div className="text-sm sm:text-base text-gray-600">PRODUCTION CAPACITY</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 sm:p-6 border-l-4 border-glowalchemy-terracotta shadow-sm">
                    <div className="text-2xl sm:text-3xl font-bold text-glowalchemy-terracotta mb-1">100+</div>
                    <div className="text-sm sm:text-base text-gray-600">SATISFIED CLIENTS</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 sm:p-6 border-l-4 border-glowalchemy-terracotta shadow-sm">
                    <div className="text-2xl sm:text-3xl font-bold text-glowalchemy-terracotta mb-1">12+</div>
                    <div className="text-sm sm:text-base text-gray-600">COUNTRIES SERVED</div>
                  </div>
                </div>
              </div>

              {/* Right: Product Categories */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Product Categories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  
                  {/* Rice Water */}
                  <div className="bg-white rounded-xl overflow-hidden border border-glowalchemy-sand hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1620916566650-9427b32c8335?w=400&h=300&fit=crop&q=80" 
                        alt="Rice Water Products"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Rice Water</h4>
                      <p className="text-sm text-gray-600 mb-3">Rice Water Products MANUFACTURER</p>
                      <Link to="/contact" className="inline-block text-sm font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal">
                        VIEW DETAILS →
                      </Link>
                    </div>
                  </div>

                  {/* Hair Conditioner */}
                  <div className="bg-white rounded-xl overflow-hidden border border-glowalchemy-sand hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1570194065340-dc8ea937c859?w=400&h=300&fit=crop&q=80" 
                        alt="Hair Conditioner Products"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Hair Conditioner</h4>
                      <p className="text-sm text-gray-600 mb-3">Hair Conditioner Products MANUFACTURER</p>
                      <Link to="/contact" className="inline-block text-sm font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal">
                        VIEW DETAILS →
                      </Link>
                    </div>
                  </div>

                  {/* Shampoo */}
                  <div className="bg-white rounded-xl overflow-hidden border border-glowalchemy-sand hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1598440947619-2c35fc9ae54e?w=400&h=300&fit=crop&q=80" 
                        alt="Shampoo Products"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Shampoo</h4>
                      <p className="text-sm text-gray-600 mb-3">Shampoo Products MANUFACTURER</p>
                      <Link to="/contact" className="inline-block text-sm font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal">
                        VIEW DETAILS →
                      </Link>
                    </div>
                  </div>

                  {/* Hair Mask */}
                  <div className="bg-white rounded-xl overflow-hidden border border-glowalchemy-sand hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&h=300&fit=crop&q=80" 
                        alt="Hair Mask Products"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Hair Mask</h4>
                      <p className="text-sm text-gray-600 mb-3">Hair Mask Products MANUFACTURER</p>
                      <Link to="/contact" className="inline-block text-sm font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal">
                        VIEW DETAILS →
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Home
