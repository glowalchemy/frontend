/** @type {import('tailwindcss').Config} */
/*
 * GlowAlchemy theme — Tailwind utilities are wired to the CSS variables in
 * `src/theme/tokens.css`, which is generated from `src/design-system/tokens.json`.
 *
 * To change the brand palette, edit tokens.json and run:
 *   node src/design-system/generate.mjs
 * No component edits are required.
 */
const tokens = require('./src/design-system/tokens.json');

function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === 'object') {
    if (typeof value.$ref === 'string') {
      return resolve(value.$ref.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), tokens));
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolve(v);
    return out;
  }
  if (typeof value === 'string' && value.startsWith('$ref:')) {
    return resolve(value.slice(5).split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), tokens));
  }
  return value;
}

/** Reference a canonical CSS variable, with Tailwind `/opacity` support. */
const c = (name) => `rgb(var(--color-${name}-rgb) / <alpha-value>)`;

const raw = resolve(tokens.color.raw);
const semantic = resolve(tokens.color.semantic);

// Legacy numbered `primary-*` utilities, backed by the token palette.
const primaryScale = { DEFAULT: c('primary') };
for (const shade of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
  primaryScale[shade] = raw[`forest-${shade}`];
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  screens: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'system-ui', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        '8xl': '1400px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'soft-float': 'soft-float 7s ease-in-out infinite',
      },
      colors: {
        // Pure white is replaced by the warm-white surface tint so no cool
        // white leaks into the ivory/green palette.
        white: raw['warm-white'],
        // ---- Canonical semantic palette (CSS-variable driven) ----
        brand: {
          primary: c('primary'),
          'primary-hover': c('primary-hover'),
          'primary-active': c('primary-active'),
          secondary: c('secondary'),
          accent: c('accent'),
          sage: raw.sage,
          'sage-light': raw['sage-light'],
          champagne: raw.champagne,
          'champagne-soft': raw['champagne-soft'],
          ivory: c('background'),
          surface: c('surface'),
          'surface-muted': c('surface-muted'),
          ink: c('text'),
          muted: c('text-muted'),
          line: c('border'),
          success: c('success'),
          warning: c('warning'),
          error: c('error'),
          white: raw['warm-white'],
        },
        page: {
          primary: semantic.background.primary,
          secondary: semantic.background.secondary,
          surface: semantic.background.surface,
        },
        surface: {
          DEFAULT: c('surface'),
          muted: c('surface-muted'),
        },
        ink: {
          DEFAULT: c('text'),
          muted: c('text-muted'),
          soft: c('text-muted'),
        },
        line: {
          DEFAULT: c('border'),
          strong: raw['border-strong'],
        },
        action: {
          primary: c('primary'),
          'primary-hover': c('primary-hover'),
          'primary-active': c('primary-active'),
          secondary: c('secondary'),
          accent: c('accent'),
          'accent-soft': raw['champagne-soft'],
        },
        status: {
          success: c('success'),
          warning: c('warning'),
          error: c('error'),
          info: c('secondary'),
        },
        accent: c('accent'),
        primary: primaryScale,

        // ---- Legacy aliases (kept so every existing surface re-themes) ----
        burgundy: c('secondary'),
        'burgundy-deep': c('primary'),
        'pink-soft': raw['champagne-soft'],
        'pink-light': c('surface-muted'),
        cream: c('background'),
        charcoal: c('text'),
        glowalchemy: {
          ivory: c('background'),
          charcoal: c('text'),
          sand: c('border'),
          warmGray: c('text-muted'),
          terracotta: c('primary'),
          white: raw['warm-white'],
        },
      },
      backgroundColor: {
        'glowalchemy-ivory': c('background'),
        'glowalchemy-charcoal': c('text'),
        'glowalchemy-sand': c('surface-muted'),
        'glowalchemy-warm-gray': c('text-muted'),
        'glowalchemy-terracotta': c('primary'),
        'glowalchemy-white': raw['warm-white'],
      },
      textColor: {
        'glowalchemy-ivory': c('background'),
        'glowalchemy-charcoal': c('text'),
        'glowalchemy-sand': c('border'),
        'glowalchemy-warm-gray': c('text-muted'),
        'glowalchemy-terracotta': c('primary'),
        'glowalchemy-white': raw['warm-white'],
      },
      borderColor: {
        DEFAULT: c('border'),
        'glowalchemy-ivory': c('background'),
        'glowalchemy-charcoal': c('text'),
        'glowalchemy-sand': c('border'),
        'glowalchemy-warm-gray': c('text-muted'),
        'glowalchemy-terracotta': c('primary'),
        'glowalchemy-white': raw['warm-white'],
      },
      placeholderColor: {
        'glowalchemy-ivory': c('background'),
        'glowalchemy-charcoal': c('text'),
        'glowalchemy-sand': c('border'),
        'glowalchemy-warm-gray': c('text-muted'),
        'glowalchemy-terracotta': c('primary'),
        'glowalchemy-white': raw['warm-white'],
      },
      ringColor: {
        DEFAULT: c('focus'),
      },
      outlineColor: {
        DEFAULT: c('focus'),
      },
      spacing: {
        xs: tokens.spacing.xs,
        sm: tokens.spacing.sm,
        md: tokens.spacing.md,
        lg: tokens.spacing.lg,
        xl: tokens.spacing.xl,
        '2xl': tokens.spacing['2xl'],
        '3xl': tokens.spacing['3xl'],
        '4xl': tokens.spacing['4xl'],
        '5xl': tokens.spacing['5xl'],
        '6xl': tokens.spacing['6xl'],
        '7xl': '80px',
        '8xl': '96px',
      },
      borderRadius: {
        sm: tokens.radius.sm,
        md: tokens.radius.md,
        lg: tokens.radius.lg,
        xl: tokens.radius.xl,
        pill: tokens.radius.pill,
        circle: tokens.radius.circle,
      },
      boxShadow: {
        sm: tokens.shadow.sm,
        md: tokens.shadow.md,
        lg: tokens.shadow.lg,
        glowalchemy: tokens.shadow.sm,
        'glowalchemy-lg': tokens.shadow.lg,
      },
      zIndex: {
        base: tokens.zIndex.base,
        stories: tokens.zIndex.stories,
        dropdown: tokens.zIndex.dropdown,
        sticky: tokens.zIndex.sticky,
        'mobile-nav': tokens.zIndex.mobileNav,
        'modal-backdrop': tokens.zIndex.modalBackdrop,
        modal: tokens.zIndex.modal,
        popover: tokens.zIndex.popover,
        tooltip: tokens.zIndex.tooltip,
        toast: tokens.zIndex.toast,
        header: tokens.zIndex.header,
        'mobile-menu': tokens.zIndex.mobileMenu,
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
