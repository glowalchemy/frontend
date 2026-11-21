/**
 * GlowAlchemy theme generator.
 *
 * Reads `src/design-system/tokens.json` (the single source of truth) and writes
 * `src/theme/tokens.css` — the canonical CSS custom properties for the app.
 *
 * Usage:
 *   node src/design-system/generate.mjs
 *
 * `.env`-free, dependency-free. Never hand-edit the generated CSS.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const tokens = JSON.parse(readFileSync(join(root, "src", "design-system", "tokens.json"), "utf8"));

const getPath = (dotPath) =>
  dotPath.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), tokens);

/** Resolve a "{$ref}" (dot path) or "$ref:path" string against the token tree. */
function resolve(value) {
  if (Array.isArray(value)) return value.map(resolve);
  if (value && typeof value === "object") {
    if (typeof value.$ref === "string") return resolve(getPath(value.$ref));
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = resolve(v);
    return out;
  }
  if (typeof value === "string" && value.startsWith("$ref:")) return resolve(getPath(value.slice(5)));
  return value;
}

const kebab = (s) =>
  String(s)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();

const cssVar = (segments) => `--${segments.map(kebab).join("-")}`;

function hexToRgbTriple(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return null;
  const int = parseInt(m[1], 16);
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

const lines = [
  "/* AUTO-GENERATED from src/design-system/tokens.json — DO NOT EDIT BY HAND. */",
  "/* Regenerate with: node src/design-system/generate.mjs */",
  ":root {",
];

function emit(node, segments = []) {
  for (const [key, value] of Object.entries(node)) {
    const next = segments.concat(kebab(key));
    if (Array.isArray(value)) {
      lines.push(`  ${cssVar(next)}: ${value.join(", ")};`);
    } else if (value && typeof value === "object") {
      emit(value, next);
    } else {
      lines.push(`  ${cssVar(next)}: ${value};`);
    }
  }
}

function section(label, node, segments = []) {
  lines.push(`\n  /* ---- ${label} ---- */`);
  emit(node, segments);
}

// 1. Raw palette (source values)
section("Raw palette", resolve(tokens.color.raw), ["color", "raw"]);

// 2. Canonical semantic theme (--color-primary, --color-surface, ...)
const theme = resolve(tokens.theme);
lines.push("\n  /* ---- Theme semantic (canonical) ---- */");
emit(theme, ["color"]);
lines.push("\n  /* RGB channel triples — let Tailwind apply /opacity modifiers */");
for (const [key, value] of Object.entries(theme)) {
  const triple = hexToRgbTriple(value);
  if (triple) lines.push(`  ${cssVar(["color", kebab(key)])}-rgb: ${triple};`);
}

// 3. Nested semantic colors used by component tokens
section("Semantic colors", resolve(tokens.color.semantic), ["color"]);

// 4. Scale + typography
section("Typography", resolve(tokens.typography));
for (const key of ["spacing", "radius", "shadow", "breakpoint", "zIndex", "transition"]) {
  section(key, resolve(tokens[key]), [kebab(key)]);
}

// 5. Component tokens
section("Component tokens", resolve(tokens.component), ["component"]);

// 6. Backwards-compatible aliases. These only reference canonical vars, so a
// change to tokens.json still propagates everywhere.
lines.push("\n  /* ---- Legacy aliases (reference canonical vars only) ---- */");
const legacy = {
  "--color-ivory": "var(--color-background)",
  "--color-charcoal": "var(--color-text)",
  "--color-sand": "var(--color-border)",
  "--color-warm-gray": "var(--color-text-muted)",
  "--color-terracotta": "var(--color-primary)",
  "--color-white": "var(--color-raw-white)",
  "--background-primary": "var(--color-background)",
  "--background-secondary": "var(--color-surface)",
  "--background-accent": "var(--color-surface-muted)",
  "--surface-primary": "var(--color-surface)",
  "--surface-secondary": "var(--color-background)",
  "--text-primary": "var(--color-text)",
  "--text-secondary": "var(--color-text-muted)",
  "--text-muted": "var(--color-text-muted)",
  "--border-primary": "var(--color-raw-border-strong)",
  "--border-secondary": "var(--color-border)",
  "--border-subtle": "var(--color-border)",
  "--action-primary": "var(--color-primary)",
  "--action-primary-hover": "var(--color-primary-hover)",
  "--action-primary-active": "var(--color-primary-active)",
  "--action-secondary": "var(--color-secondary)",
  "--action-secondary-hover": "var(--color-primary-active)",
  "--shadow-glowalchemy": "var(--shadow-sm)",
  "--shadow-glowalchemy-lg": "var(--shadow-lg)",
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
for (const [name, value] of Object.entries(legacy)) lines.push(`  ${name}: ${value};`);

lines.push("}", "");

const outFile = join(root, "src", "theme", "tokens.css");
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, lines.join("\n"), "utf8");

// Keep the historical path working as a thin re-export.
writeFileSync(
  join(root, "src", "styles", "tokens.css"),
  "/* AUTO-GENERATED shim — canonical theme lives in src/theme/tokens.css */\n@import '../theme/tokens.css';\n",
  "utf8"
);

console.log("✅ Generated src/theme/tokens.css (+ src/styles/tokens.css shim)");
