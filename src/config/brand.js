/**
 * Centralized brand configuration.
 *
 * The canonical value comes from the single `BRAND_NAME` environment variable
 * (frontend/.env, documented in the root .env.example). Vite injects it into
 * the browser bundle as `import.meta.env.VITE_BRAND_NAME` — see vite.config.js.
 *
 * Components must import from here instead of hardcoding the brand name.
 */
const BRAND_NAME = (import.meta.env.VITE_BRAND_NAME || 'GlowAlchemy').trim();

export const getBrandName = () => BRAND_NAME;

export const getBrandDisplayName = () => BRAND_NAME;

/** Uppercase presentation, derived — never stored as a second variable. */
export const getBrandUppercase = () => BRAND_NAME.toUpperCase();

/** Brand tagline shown under the wordmark (single source, matches the logo). */
export const getBrandTagline = () => 'Premium Natural Beauty';

export default BRAND_NAME;
