# GlowAlchemy Design System

One authoritative token source drives the entire visual identity.

## Where tokens live

| File | Role |
| --- | --- |
| `src/design-system/tokens.json` | **Single source of truth.** Raw palette + semantic + component tokens. Edit this file to change the design. |
| `src/design-system/generate.mjs` | Regenerates `tokens.css` from `tokens.json`. |
| `src/design-system/index.ts` | TypeScript access layer (brand helpers, programmatic token access). |
| `src/styles/tokens.css` | **Generated** CSS custom properties (do not hand-edit). |
| `tailwind.config.js` | Loads `tokens.json` and maps tokens into Tailwind utility classes. |

## How to change a color

1. Open `src/design-system/tokens.json`.
2. Change the raw hex value, e.g. `"deep-forest": "#213D31"` → `"#244A3A"`.
3. Run `node src/design-system/generate.mjs`.
4. Restart the dev server. Every surface that references `--color-*` or the Tailwind `brand-*` / `trozzi-*` utilities updates automatically.

## How components consume tokens

Three equivalent paths:

```css
/* Plain CSS */
.card { background: var(--color-bg-surface); border: 1px solid var(--color-border-default); }
```

```tsx
/* Tailwind utilities (mapped from tokens.json) */
<div className="bg-surface border border-border-default text-text-primary" />
```

```ts
/* Programmatic access */
import { brandColors } from "../design-system";
brandColors.brand.primary; // "#213D31"
```

## Token naming

- Raw palette → `--color-raw-*` (usually only referenced by semantic tokens).
- Semantic → `--color-brand-*`, `--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-action-*`, `--color-status-*`.
- Scale → `--spacing-*`, `--radius-*`, `--shadow-*`, `--breakpoint-*`, `--z-index-*`, `--transition-*`, `--typography-*`.
- Component → `--component-<name>-<prop>-<state>` (e.g. `--component-button-primary-background`).
- Legacy aliases (`--color-terracotta`, `--color-ivory`, `--text-primary`, …) are kept so older CSS keeps working while the UI migrates.

## Tailwind mapping

`tailwind.config.js` derives these color families from `tokens.json`:

- `brand-*` → `--color-brand-*` (primary, secondary, sage, gold, gold-soft, cream, ivory, ink, white)
- `bg-*` (background) → `page`, `secondary`, `surface`
- `text-*` → `primary`, `secondary`, `muted`, `inverse`
- `border-*` → `default`, `strong`, `focus`
- `action-*` → `primary`, `primary-hover`, `accent`, `accent-soft`, `secondary`
- `status-*` → `success`, `warning`, `error`, `info`
- Legacy `trozzi-*` names remain as aliases of the same values.

## Adding a new semantic token

1. Add the value under `color.semantic` in `tokens.json` (use `{ "$ref": "color.raw.deep-forest" }` to reference the palette).
2. Regenerate + add the Tailwind color entry if you want a utility class.

## What NOT to do

- Do not hand-edit `src/styles/tokens.css` — regenerate it.
- Do not scatter raw hex values in components. Use CSS variables, Tailwind utilities, or `brandColors`.
- Do not create a second palette for the admin app — it consumes the same token file.
- Do not use gold for large body text (contrast) — gold is an accent (borders, badges, active states).
