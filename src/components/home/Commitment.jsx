import React from 'react';
import {
  FaLeaf,
  FaFlask,
  FaHeart,
  FaSeedling,
  FaRecycle,
  FaHandshake,
  FaShieldAlt,
  FaCheckCircle,
  FaPumpSoap,
} from 'react-icons/fa';
import SectionHeading from './SectionHeading';

const COMMITMENTS = [
  { icon: FaShieldAlt, title: 'Toxin Free', copy: 'Clean formulas, no harsh additives' },
  { icon: FaLeaf, title: 'ECO Friendly', copy: 'Responsibly sourced botanicals' },
  { icon: FaCheckCircle, title: 'No Skin-Damaging', copy: 'Gentle, barrier-friendly care' },
  { icon: FaFlask, title: 'pH Balanced', copy: 'Tuned to your skin’s comfort' },
  { icon: FaHeart, title: 'Cruelty-Free', copy: 'Kind to every living thing' },
  { icon: FaSeedling, title: 'Herbal Blend', copy: 'Nature-first herbal actives' },
  { icon: FaPumpSoap, title: 'SLS & Paraben-Free', copy: 'No sulfates, no parabens' },
  { icon: FaRecycle, title: 'Recycle Packaging', copy: 'Designed for a second life' },
  { icon: FaHandshake, title: 'Customized Formulations', copy: 'Built around your brand' },
];

const Commitment = () => (
  <section className="ga-section bg-white">
    <div className="ga-container">
      <SectionHeading
        eyebrow="The GlowAlchemy Standard"
        title="Our Commitment to Quality"
        subtitle="Every formula is created with intention — clean, considered and kind to skin."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {COMMITMENTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group flex flex-col items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-champagne)] hover:bg-pink-light hover:shadow-[0_16px_34px_rgba(20,61,43,0.08)]"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-burgundy shadow-[0_4px_14px_rgba(20,61,43,0.08)] transition-colors duration-300 group-hover:bg-burgundy group-hover:text-white">
                <Icon className="text-[18px]" aria-hidden="true" />
              </span>
              <h3 className="text-[12.5px] font-semibold leading-tight text-[var(--color-text)] sm:text-[13px]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[10.5px] leading-snug text-[var(--color-text-muted)] sm:text-[11px]">{item.copy}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Commitment;
