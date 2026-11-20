import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const CAPABILITIES = [
  'In-house R&D and formulation lab',
  'Private label & third-party manufacturing',
  'Small, medium and large batch runs',
  'Colour cosmetics, skincare and haircare',
];

const ManufacturerSection = () => (
  <section className="relative overflow-hidden bg-burgundy-deep">
    <div
      className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(239,195,210,0.18) 0%, rgba(111,18,48,0) 70%)' }}
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-white/10 lg:block"
      aria-hidden="true"
    />

    <div className="ga-container relative py-14 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p className="ga-eyebrow mb-4 flex items-center gap-3 text-white/60">
            <span className="h-px w-10 bg-white/30" aria-hidden="true" />
            Since 2016
          </p>
          <h2 className="site-section-title text-white">
            Third Party Colour<br className="hidden sm:block" /> Cosmetics Manufacturer
          </h2>
          <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-white/75">
            Welcome to GlowAlchemy, where beauty knows no boundaries. Explore the mysteries of skincare and
            the wonders of cosmetics, crafted through private label manufacturing. Discover unique,
            high-quality products tailored to your needs, empowering you to shine brightly. Join us in
            celebrating the limitless possibilities of beauty.
          </p>
          <p className="mt-4 text-[14.5px] font-medium text-white">
            We strive to develop solutions for small, medium and big brands.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-burgundy-deep transition-all duration-300 hover:bg-pink-soft"
            >
              Request an Enquiry
              <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              Our Services
            </Link>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-8">
          <h3 className="ga-serif text-lg text-white">Manufacturing Capabilities</h3>
          <ul className="mt-5 space-y-3.5">
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[13.5px] leading-snug text-white/80">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                  <FiCheck className="text-[11px] text-pink-soft" aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-6 text-center">
            {[
              ['3000KG', 'Capacity'],
              ['100+', 'Clients'],
              ['12+', 'Countries'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="ga-serif text-xl text-white">{value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ManufacturerSection;
