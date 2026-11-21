import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { FaLeaf, FaSpa, FaStar } from 'react-icons/fa';

const PROMISES = [
  { icon: FaSpa, title: 'Smooth & Radiant Skin', copy: 'Nourishing botanicals for a soft, even-toned glow.' },
  { icon: FaLeaf, title: 'Healthy Hair Growth', copy: 'Scalp-loving actives that strengthen from the root.' },
  { icon: FaStar, title: 'Youthful Glow', copy: 'Antioxidant-rich care that helps skin look its best.' },
];

const BeautyCares = () => (
  <section className="ga-section bg-[var(--color-background)]">
    <div className="ga-container">
      <div className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white shadow-[0_18px_50px_rgba(20,61,43,0.08)]">
        <div className="grid lg:grid-cols-[1.05fr_1fr_0.85fr]">
          {/* lifestyle image */}
          <div className="relative min-h-[240px] overflow-hidden sm:min-h-[320px] lg:min-h-[380px]">
            <img
              src="/skin.jpg"
              alt="GlowAlchemy skincare ritual"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, rgba(20,61,43,0.18) 0%, rgba(20,61,43,0) 60%)' }}
              aria-hidden="true"
            />
          </div>

          {/* copy */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <p className="ga-eyebrow mb-3 text-burgundy">Because You Deserve More</p>
            <h2 className="site-section-title text-[var(--color-text)]">
              Beauty <span className="italic text-burgundy">That Cares</span>
            </h2>
            <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-glowalchemy-warm-gray">
              Because your skin deserves the best. Thoughtfully formulated rituals that respect your
              skin barrier while delivering visible, lasting results.
            </p>
            <Link
              to="/about"
              className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full border border-burgundy/25 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-burgundy transition-all duration-300 hover:bg-burgundy hover:text-white"
            >
              Know More
              <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* promises */}
          <div className="flex flex-col justify-center gap-1 bg-pink-light px-6 py-8 sm:px-9 lg:py-12">
            {PROMISES.map((promise, index) => {
              const Icon = promise.icon;
              return (
                <div
                  key={promise.title}
                  className={`flex gap-3 py-4 ${index > 0 ? 'border-t border-[var(--color-border)]' : ''}`}
                >
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-burgundy shadow-sm">
                    <Icon className="text-[14px]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="ga-serif text-[15px] font-semibold text-[var(--color-text)]">{promise.title}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-text-muted)]">{promise.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BeautyCares;
