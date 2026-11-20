import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from './SectionHeading';

const ACHIEVEMENTS = [
  { value: '3000KG', label: 'Production Capacity', copy: 'Consistent monthly manufacturing output' },
  { value: '100+', label: 'Satisfied Clients', copy: 'Brands trusting our formulations' },
  { value: '12+', label: 'Countries Served', copy: 'Beauty shipped across the globe' },
];

const CATEGORIES = [
  {
    title: 'Rice Water',
    description: 'Rice water products manufacturer',
    image: '/images/category-rice-water.jpg',
    to: '/ProductListing?q=Rice%20Water',
  },
  {
    title: 'Hair Conditioner',
    description: 'Hair conditioner products manufacturer',
    image: '/images/category-conditioner.jpg',
    to: '/ProductListing?q=Conditioner',
  },
  {
    title: 'Shampoo',
    description: 'Shampoo products manufacturer',
    image: '/images/category-shampoo.jpg',
    to: '/ProductListing?q=Shampoo',
  },
  {
    title: 'Hair Mask',
    description: 'Hair mask products manufacturer',
    image: '/images/category-hair-mask.jpg',
    to: '/ProductListing?q=Hair%20Mask',
  },
];

const AchievementsCategories = () => (
  <section className="ga-section bg-[#FFF9F5]">
    <div className="ga-container">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Achievements */}
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="Milestones"
            title="Our Achievements"
            subtitle="A manufacturing partner built on trust, scale and consistency."
            align="left"
            className="mb-6 md:mb-8"
          />

          <div className="space-y-3">
            {ACHIEVEMENTS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl border border-[#F3DDE5] bg-white px-5 py-4 shadow-[0_2px_10px_rgba(111,18,48,0.04)]"
              >
                <span className="ga-serif min-w-[92px] text-[26px] leading-none text-burgundy">
                  {item.value}
                </span>
                <span>
                  <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#29151F]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[11.5px] leading-snug text-[#9A7C88]">{item.copy}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product categories */}
        <div className="lg:col-span-8">
          <SectionHeading
            eyebrow="What We Craft"
            title="Product Categories"
            subtitle="Specialist manufacturing across the haircare rituals your customers love."
            align="left"
            action="Explore Products"
            actionTo="/ProductListing"
            className="mb-6 md:mb-8"
          />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.title}
                to={category.to}
                className="ga-product-card group overflow-hidden rounded-2xl border border-[#F3DDE5] bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-pink-light">
                  <img
                    src={category.image}
                    alt={category.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="ga-serif text-[15px] text-[#29151F] group-hover:text-burgundy">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-snug text-[#9A7C88]">{category.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-burgundy">
                    View Details
                    <FiArrowRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AchievementsCategories;
