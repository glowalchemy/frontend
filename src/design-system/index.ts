/**
 * GlowAlchemy design-token access layer.
 *
 * The canonical source is `tokens.json`. This module re-exports the parsed
 * tokens so components can consume the same values programmatically that the
 * CSS variables in `src/styles/tokens.css` expose.
 */
import tokens from "./tokens.json";

export type DesignTokens = typeof tokens;

export const designTokens: DesignTokens = tokens;

/** Convenience: brand colors (semantic). */
export const brandColors = tokens.color.semantic;

/** Convenience: brand name from the canonical BRAND_NAME env value. */
export const BRAND_NAME: string = (import.meta.env.VITE_BRAND_NAME as string | undefined) || "GlowAlchemy";

export const getBrandName = (): string => BRAND_NAME;

export const getBrandDisplayName = (): string => BRAND_NAME;

/** Brand color helper — returns the resolved hex for a semantic path. */
export function brandColor(path: keyof typeof brandColors): string;
export function brandColor<K extends string>(path: K): string | undefined;
export function brandColor(path: string): string | undefined {
  const group = brandColors[path as keyof typeof brandColors];
  if (typeof group === "string") return group;
  return undefined;
}

export default designTokens;
