/** @type {import('tailwindcss').Config} */
/*
 * GlowAlchemy theme — derived from src/design-system/tokens.json.
 * Edit tokens.json, regenerate tokens.css, and these utilities follow.
 */
const tokens = require('./src/design-system/tokens.json');

function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve).join(', ');
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

const semantic = resolve(tokens.color.semantic);
const spacing = resolve(tokens.spacing);
const radius = resolve(tokens.radius);
const shadow = resolve(tokens.shadow);
const zIndex = resolve(tokens.zIndex);

// Forest-green scale for the legacy numbered utilities (primary-600, etc.)
const forestScale = {
  50: '#F0F5F1',
  100: '#DCE7DF',
  200: '#B9CFC2',
  300: '#90B09E',
  400: '#5F8A75',
  500: '#3F6B56',
  600: '#315A46',
  700: '#294A3A',
  800: '#243F33',
  900: '#213D31',
  950: '#16291F',
  DEFAULT: '#315A46',
};

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
        sans: ['Roboto', 'system-ui', 'Arial', 'sans-serif'],
        serif: ['Rasa', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        // ---- GlowAlchemy semantic tokens ----
        brand: {
          primary: semantic.brand.primary,
          secondary: semantic.brand.secondary,
          sage: semantic.brand.sage,
          gold: semantic.brand.gold,
          'gold-soft': semantic.brand.goldSoft,
          cream: semantic.brand.cream,
          ivory: semantic.brand.ivory,
          ink: semantic.brand.ink,
          white: semantic.brand.white,
        },
        page: {
          primary: semantic.background.primary,
          secondary: semantic.background.secondary,
          surface: semantic.background.surface,
        },
        surface: {
          primary: semantic.background.surface,
          secondary: semantic.background.primary,
          ...forestScale,
        },
        text: {
          primary: semantic.text.primary,
          secondary: semantic.text.secondary,
          muted: semantic.text.muted,
          inverse: semantic.text.inverse,
          ...forestScale,
        },
        border: {
          default: semantic.border.default,
          strong: semantic.border.strong,
          focus: semantic.border.focus,
          ...forestScale,
        },
        action: {
          primary: semantic.action.primary,
          'primary-hover': semantic.action.primaryHover,
          'primary-active': semantic.action.primaryActive,
          secondary: semantic.action.secondary,
          accent: semantic.action.accent,
          'accent-soft': semantic.action.accentSoft,
        },
        status: {
          success: semantic.status.success,
          warning: semantic.status.warning,
          error: semantic.status.error,
          info: semantic.status.info,
        },
        // ---- Legacy flat aliases ----
        ink: semantic.text.primary,
        charcoal: semantic.text.primary,
        primary: forestScale,
        accent: semantic.action.accent,
        // ---- Legacy `trozzi-*` design-token aliases (mapped to new palette) ----
        trozzi: {
          ivory: semantic.brand.cream,
          charcoal: semantic.brand.ink,
          sand: semantic.border.default,
          warmGray: semantic.text.muted,
          terracotta: semantic.action.primary,
          white: '#FFFFFF',
        },
      },
      backgroundColor: {
        'trozzi-ivory': semantic.brand.cream,
        'trozzi-charcoal': semantic.brand.ink,
        'trozzi-sand': semantic.border.default,
        'trozzi-warm-gray': semantic.text.muted,
        'trozzi-terracotta': semantic.action.primary,
        'trozzi-white': '#FFFFFF',
      },
      textColor: {
        'trozzi-ivory': semantic.brand.cream,
        'trozzi-charcoal': semantic.brand.ink,
        'trozzi-sand': semantic.border.default,
        'trozzi-warm-gray': semantic.text.muted,
        'trozzi-terracotta': semantic.action.primary,
        'trozzi-white': '#FFFFFF',
      },
      borderColor: {
        'trozzi-ivory': semantic.brand.cream,
        'trozzi-charcoal': semantic.brand.ink,
        'trozzi-sand': semantic.border.default,
        'trozzi-warm-gray': semantic.text.muted,
        'trozzi-terracotta': semantic.action.primary,
        'trozzi-white': '#FFFFFF',
      },
      placeholderColor: {
        'trozzi-ivory': semantic.brand.cream,
        'trozzi-charcoal': semantic.brand.ink,
        'trozzi-sand': semantic.border.default,
        'trozzi-warm-gray': semantic.text.muted,
        'trozzi-terracotta': semantic.action.primary,
        'trozzi-white': '#FFFFFF',
      },
      spacing: {
        xs: spacing.xs,
        sm: spacing.sm,
        md: spacing.md,
        lg: spacing.lg,
        xl: spacing.xl,
        '2xl': spacing['2xl'],
        '3xl': spacing['3xl'],
        '4xl': spacing['4xl'],
        '5xl': spacing['5xl'],
        '6xl': spacing['6xl'],
        '7xl': '80px',
        '8xl': '96px',
      },
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        pill: radius.pill,
        circle: radius.circle,
      },
      boxShadow: {
        sm: shadow.sm,
        md: shadow.md,
        lg: shadow.lg,
        trozzi: shadow.sm,
        'trozzi-lg': shadow.lg,
      },
      zIndex: {
        base: zIndex.base,
        stories: zIndex.stories,
        dropdown: zIndex.dropdown,
        sticky: zIndex.sticky,
        'mobile-nav': zIndex.mobileNav,
        'modal-backdrop': zIndex.modalBackdrop,
        modal: zIndex.modal,
        popover: zIndex.popover,
        tooltip: zIndex.tooltip,
        toast: zIndex.toast,
        header: zIndex.header,
        'mobile-menu': zIndex.mobileMenu,
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
