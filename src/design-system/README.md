# GlowAlchemy Design System

One authoritative token source drives the entire visual identity:
forest green, botanical green, sage, antique gold, champagne and ivory.

## Where tokens live

| File | Role |
| --- | --- |
| `src/design-system/tokens.json` | **Single source of truth.** Raw palette + theme semantics + component tokens. Edit this file to change the design. |
| `src/design-system/generate.mjs` | Regenerates the CSS custom properties from `tokens.json`. |
| `src/theme/tokens.css` | **Generated** canonical CSS variables (do not hand-edit). |
| `src/styles/tokens.css` | Generated shim that `@import`s `src/theme/tokens.css`. |
| `tailwind.config.js` | Maps the same variables into Tailwind utilities (`bg-brand-primary`, `text-brand-ink`, …). |
| `src/theme/muiTheme.js` | Builds the Material UI theme from the same tokens. |

## How to change a color

1. Open `src/design-system/tokens.json`.
2. Change the raw hex value, e.g. `"forest": "#143D2B"` → `"#1B4A34"`.
3. Run `node src/design-system/generate.mjs`.
4. Restart the dev server. Tailwind, plain CSS and MUI all update, because
   every surface reads `var(--color-*)` / `rgb(var(--color-*-rgb))`.

## Canonical variables

Semantic names (defined in `theme` in `tokens.json`):

```
--color-primary          --color-background        --color-border
--color-primary-hover    --color-surface           --color-focus
--color-primary-active   --color-surface-muted     --color-success
--color-secondary        --color-text              --color-warning
--color-accent           --color-text-muted        --color-error
--color-text-inverse
```

Each also exposes an RGB channel triple (`--color-primary-rgb`) so Tailwind can
apply opacity modifiers, e.g. `bg-brand-primary/10`.

## How components consume tokens

```css
.card { background: var(--color-surface); border: 1px solid var(--color-border); }
```

```jsx
<button className="bg-brand-primary text-brand-ivory hover:bg-brand-primary-hover" />
```

```js
// MUI inherits the same palette through src/theme/muiTheme.js
```

Legacy aliases (`--color-terracotta`, `--surface-primary`, the
`glowalchemy-*` Tailwind utilities, …) are generated as references to the
canonical variables, so older components re-theme without being rewritten.
