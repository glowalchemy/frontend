import React from 'react';
import { FaLeaf, FaShieldAlt, FaHeart, FaCheckCircle, FaShippingFast } from 'react-icons/fa';

const BENEFITS = [
  { icon: FaLeaf, title: '100% Natural Ingredients', copy: 'Botanical-first formulas' },
  { icon: FaShieldAlt, title: 'Dermatologically Tested', copy: 'Gentle on every skin type' },
  { icon: FaHeart, title: 'Cruelty-Free', copy: 'Never tested on animals' },
  { icon: FaCheckCircle, title: 'Safe & Effective', copy: 'Results you can trust' },
  { icon: FaShippingFast, title: 'Fast Shipping', copy: 'Across India, on time' },
];

const TrustStrip = () => (
  <section className="border-y border-[var(--color-border)] bg-pink-soft">
    <div className="ga-container py-6 sm:py-7">
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className={`flex items-center gap-3 lg:flex-col lg:gap-2 lg:px-4 lg:text-center ${
                index > 0 && index % 2 === 0 ? 'sm:border-none' : ''
              }`}
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-burgundy shadow-[0_4px_14px_rgba(20,61,43,0.08)] lg:h-12 lg:w-12">
                <Icon className="text-[17px]" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12.5px] font-semibold leading-tight text-[var(--color-text)] sm:text-[13px]">
                  {benefit.title}
                </span>
                <span className="mt-1 block text-[11px] leading-tight text-[var(--color-text-muted)]">{benefit.copy}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default TrustStrip;
