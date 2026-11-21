/**
 * Material UI theme — derived from the same token source as Tailwind and CSS.
 * Edit src/design-system/tokens.json and run `node src/design-system/generate.mjs`
 * to change the palette; this file resolves the new values automatically.
 */
import { createTheme } from '@mui/material/styles';
import tokens from '../design-system/tokens.json';

const getPath = (dotPath) =>
  dotPath.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), tokens);

function resolve(value) {
  if (value && typeof value === 'object') {
    if (typeof value.$ref === 'string') return resolve(getPath(value.$ref));
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolve(v);
    return out;
  }
  if (typeof value === 'string' && value.startsWith('$ref:')) return resolve(getPath(value.slice(5)));
  return value;
}

const palette = resolve(tokens.theme);
const raw = resolve(tokens.color.raw);
const radius = tokens.radius;
const fontSans = tokens.typography.fontFamily.sans.join(', ');
const fontSerif = tokens.typography.fontFamily.serif.join(', ');

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.primary,
      dark: palette['primary-active'],
      light: palette['primary-hover'],
      contrastText: palette['text-inverse'],
    },
    secondary: {
      main: palette.accent,
      dark: raw['champagne'],
      light: raw['champagne-soft'],
      contrastText: palette.text,
    },
    background: {
      default: palette.background,
      paper: palette.surface,
    },
    text: {
      primary: palette.text,
      secondary: palette['text-muted'],
      disabled: raw.muted,
    },
    divider: palette.border,
    success: { main: palette.success, contrastText: palette['text-inverse'] },
    warning: { main: palette.warning, contrastText: palette['text-inverse'] },
    error: { main: palette.error, contrastText: palette['text-inverse'] },
    info: { main: palette.secondary },
    action: {
      active: palette.primary,
      hover: palette['primary-hover'],
      selected: raw['sage-light'],
      disabled: raw.muted,
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: fontSans,
    h1: { fontFamily: fontSerif, fontWeight: 600 },
    h2: { fontFamily: fontSerif, fontWeight: 600 },
    h3: { fontFamily: fontSerif, fontWeight: 600 },
    h4: { fontFamily: fontSerif, fontWeight: 600 },
    h5: { fontFamily: fontSerif, fontWeight: 600 },
    h6: { fontFamily: fontSerif, fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: radius.md, textTransform: 'none', fontWeight: 500 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          '&:hover': { backgroundColor: raw['sage-light'] },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: palette.surface, color: palette.text },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: palette['primary-active'],
          color: palette['text-inverse'],
          fontSize: 12,
        },
        arrow: { color: palette['primary-active'] },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: palette.primary,
          color: palette['text-inverse'],
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: palette.surface,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: palette.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: raw['border-strong'] },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.focus,
            borderWidth: 2,
          },
        },
      },
    },
    MuiCheckbox: { defaultProps: { color: 'primary' } },
    MuiRadio: { defaultProps: { color: 'primary' } },
    MuiSwitch: { defaultProps: { color: 'primary' } },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: palette.primary },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: palette.border },
      },
    },
  },
});

export default theme;
