import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shared premium section heading used across the storefront.
 */
const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  action,
  actionTo,
  align = 'center',
  light = false,
  className = '',
}) => {
  const isLeft = align === 'left';
  return (
    <div
      className={`flex flex-col gap-4 mb-8 sm:mb-10 md:mb-12 ${
        isLeft ? 'md:flex-row md:items-end md:justify-between text-left' : 'items-center text-center'
      } ${className}`}
    >
      <div className={isLeft ? 'max-w-2xl' : 'max-w-2xl mx-auto'}>
        {eyebrow ? (
          <p
            className={`ga-eyebrow mb-3 flex items-center gap-3 ${
              isLeft ? '' : 'justify-center'
            } ${light ? 'text-white/70' : 'text-burgundy'}`}
          >
            {!isLeft && !light ? <span className="h-px w-8 bg-burgundy/40" aria-hidden="true" /> : null}
            {eyebrow}
            {!isLeft ? <span className="h-px w-8 bg-burgundy/40" aria-hidden="true" /> : null}
          </p>
        ) : null}
        <h2
          className={`site-section-title ${light ? 'text-white' : 'text-[var(--color-text)]'}`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={`mt-3 text-[14px] sm:text-[15px] leading-relaxed ${
              light ? 'text-white/75' : 'text-glowalchemy-warm-gray'
            }`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {action && actionTo ? (
        <Link
          to={actionTo}
          className={`group inline-flex items-center gap-2 text-sm font-medium tracking-wide whitespace-nowrap ${
            light ? 'text-white' : 'text-burgundy'
          }`}
        >
          {action}
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
};

export default SectionHeading;
