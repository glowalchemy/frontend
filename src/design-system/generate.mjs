/**
 * GlowAlchemy design-token generator.
 *
 * Reads `tokens.json` (the single source of truth) and writes
 * `src/styles/tokens.css` (CSS custom properties consumed by the app).
 *
 * Usage:
 *   node src/design-system/generate.mjs
 *
 * Keep tokens.css in sync with tokens.json by running this after any edit
 * to tokens.json. Never hand-edit tokens.css.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const tokens = JSON.parse(readFileSync(join(root, "src", "design-system", "tokens.json"), "utf8"));

/** Resolve a "$ref" (dot path) or "$ref:path" string against the token tree. */
function resolve(value, path = []) {
  if (Array.isArray(value)) {
    return value.map((v) => resolve(v, path));
  }
  if (value && typeof value === "object") {
    if (typeof value.$ref === "string") {
      return resolve(getPath(tokens, value.$ref), []);
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolve(v, path.concat(k));
    }
    return out;
  }
  if (typeof value === "string" && value.startsWith("$ref:")) {
    return resolve(getPath(tokens, value.slice(5)), []);
  }
  return value;
}

function getPath(tree, dotPath) {
  return dotPath.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), tree);
}

const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();
const cssVarName = (segments) => `--${segments.map(kebab).join("-")}`;

const lines = [
  "/* AUTO-GENERATED from src/design-system/tokens.json — DO NOT EDIT BY HAND. */",
  "/* Regenerate with: node src/design-system/generate.mjs */",
  ":root {",
];

const sections = [];

// 1. Raw color palette
const rawColors = resolve(tokens.color.raw);
sections.push(["Raw palette", ["color", "raw"], rawColors]);

// 2. Semantic colors
const semanticColors = resolve(tokens.color.semantic);
sections.push(["Semantic colors", ["color"], semanticColors]);

// 3. Typography
sections.push(["Typography", ["typography"], resolve(tokens.typography)]);

// 4. Spacing / radius / shadow / breakpoint / z-index / transition
for (const key of ["spacing", "radius", "shadow", "breakpoint", "zIndex", "transition"]) {
  sections.push([key, [kebab(key)], resolve(tokens[key])]);
}

// 5. Component tokens
sections.push(["Component tokens", ["component"], resolve(tokens.component)]);

let body = "";
for (const [label, prefix, obj] of sections) {
  body += `\n  /* ---- ${label} ---- */\n`;
  const emit = (node, segments, keyMapper) => {
    for (const [key, value] of Object.entries(node)) {
      const mapped = keyMapper ? keyMapper(key) : key;
      const next = segments.concat([mapped]);
      if (Array.isArray(value)) {
        body += `  ${cssVarName(next)}: ${value.join(", ")};\n`;
      } else if (value && typeof value === "object") {
        emit(value, next, keyMapper);
      } else if (typeof value === "string" || typeof value === "number") {
        body += `  ${cssVarName(next)}: ${value};\n`;
      }
    }
  };
  // Semantic color groups: "background" is exposed as the shorter `bg` prefix.
  const colorKeyMapper = (key) => (key === "background" ? "bg" : key);
  emit(obj, prefix, label === "Semantic colors" ? colorKeyMapper : undefined);
}

// Legacy aliases so pre-existing CSS keeps working while the UI migrates to
// the new token names. `terracotta` (old rust CTA) intentionally maps to the
// deep-forest primary action; `sand` maps to the soft border tone.
const legacy = {
  "--color-ivory": "var(--color-brand-cream)",
  "--color-charcoal": "var(--color-brand-ink)",
  "--color-sand": "var(--color-border-default)",
  "--color-warm-gray": "var(--color-text-muted)",
  "--color-terracotta": "var(--color-action-primary)",
  "--color-white": "var(--color-brand-white)",
  "--background-primary": "var(--color-bg-primary)",
  "--background-secondary": "var(--color-bg-surface)",
  "--background-accent": "var(--color-bg-secondary)",
  "--surface-primary": "var(--color-bg-surface)",
  "--surface-secondary": "var(--color-bg-primary)",
  "--text-primary": "var(--color-text-primary)",
  "--text-secondary": "var(--color-text-secondary)",
  "--text-muted": "var(--color-text-muted)",
  "--border-primary": "var(--color-border-strong)",
  "--border-secondary": "var(--color-border-default)",
  "--border-subtle": "var(--color-border-default)",
  "--action-primary": "var(--color-action-primary)",
  "--action-primary-hover": "var(--color-action-primary-hover)",
  "--action-primary-active": "var(--color-action-primary-active)",
  "--action-secondary": "var(--color-action-secondary)",
  "--action-secondary-hover": "var(--color-brand-ink)",
  "--shadow-glowalchemy": "var(--shadow-sm)",
  "--shadow-glowalchemy-lg": "var(--shadow-lg)",
  "--transition-fast": "var(--transition-fast)",
  "--transition-base": "var(--transition-base)",
  "--transition-slow": "var(--transition-slow)",
  "--z-base": "var(--z-index-base)",
  "--z-dropdown": "var(--z-index-dropdown)",
  "--z-sticky": "var(--z-index-sticky)",
  "--z-header": "var(--z-index-header)",
  "--z-mobile-nav": "var(--z-index-mobile-nav)",
  "--z-modal-backdrop": "var(--z-index-modal-backdrop)",
  "--z-modal": "var(--z-index-modal)",
  "--z-popover": "var(--z-index-popover)",
  "--z-tooltip": "var(--z-index-tooltip)",
  "--z-toast": "var(--z-index-toast)",
  "--z-mobile-menu": "var(--z-index-mobile-menu)",
};

body += "\n  /* ---- Legacy aliases (backwards compatibility) ---- */\n";
for (const [name, value] of Object.entries(legacy)) {
  body += `  ${name}: ${value};\n`;
}

body += "\n}";

const output = lines.join("\n") + body + "\n";
writeFileSync(join(root, "src", "styles", "tokens.css"), output);
console.log("✅ Generated src/styles/tokens.css from tokens.json");
