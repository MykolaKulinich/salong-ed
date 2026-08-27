/**
 * Canonical geometry for the Salong ED lock-up (bordered "ED" box + accent
 * notch + "SALONG" wordmark + "Skönhetssalong" subtitle), derived directly
 * from components/brand/SalongEdLogo.tsx's non-compact, dark-variant CSS
 * (Tailwind classes resolved to their pixel/rem values, default 16px root)
 * and the color tokens in app/globals.css.
 *
 * This is the single source of truth for two static reproductions of that
 * exact on-screen mark, needed because a React/CSS component cannot run
 * inside an email client or a PDF:
 *   - public/images/salong-ed/logo/salong-ed-logo.svg (hand-authored to
 *     these exact numbers)
 *   - the PDF's native vector redraw in lib/gift-card-pdf.ts
 *
 * Both must match this file exactly — it is a faithful, read-only
 * geometric description of what SalongEdLogo.tsx already renders, not a
 * new interpretation. SalongEdLogo.tsx itself is unchanged and remains the
 * source of truth on the actual website.
 *
 * Derivation notes (Tailwind default spacing scale: 1 unit = 0.25rem = 4px):
 *   - box: h-11 w-11 = 2.75rem = 44px square, border-accent/80, bg-accent/5,
 *     no border-radius (this site never rounds corners).
 *   - "ED": font-serif, tracking-[0.04em], text-base (16px), text-accent,
 *     centered in the box (flex items-center justify-center).
 *   - notch: absolute -right-px top-2 (8px) h-4 (16px) w-px (1px),
 *     background-colored — CSS's way of cutting a visual gap into the
 *     box's right border; reproduced here as a same-colored rectangle
 *     painted over that spot.
 *   - gap-2.5 = 0.625rem = 10px between the box and the wordmark block.
 *   - "SALONG": font-serif, tracking-[0.18em], text-xl (20px), text-foreground.
 *   - "Skönhetssalong": mt-1 (4px), text-[9px], uppercase, tracking-[0.24em],
 *     text-muted. Written pre-uppercased here since static SVG/PDF
 *     consumers should not depend on CSS text-transform.
 *   - The two-line text block (leading-none, i.e. line-height:1) is
 *     vertically centered against the 44px box, matching the flex
 *     `items-center` on the outer lock-up.
 */
export const LOGO_COLORS = {
  accent: "#a98a5c", // --accent (box border, "ED" glyphs)
  foreground: "#211d18", // --foreground (SALONG wordmark)
  muted: "#726b60", // --muted (Skönhetssalong subtitle)
  background: "#faf7f2", // --background — also used to paint the notch
} as const;

/** border-accent/80 and bg-accent/5 — kept numeric so both the hand-authored SVG (as rgba()) and the PDF's native drawing (as fill/stroke opacity) apply the identical values. */
export const LOGO_BOX_OPACITY = {
  borderOpacity: 0.8,
  fillOpacity: 0.05,
} as const;

export const LOGO_GEOMETRY = {
  /** Tight viewBox/canvas for the whole lock-up. */
  width: 200,
  height: 44,

  box: {
    x: 0,
    y: 0,
    size: 44,
    strokeWidth: 1,
  },

  monogram: {
    text: "ED",
    fontSize: 16,
    letterSpacingEm: 0.04,
    /** Center of the box. */
    x: 22,
    /** Visual baseline for a centered serif glyph in a 44px box. */
    y: 28,
  },

  /** The decorative gap cut into the box's right border. */
  notch: {
    x: 43,
    y: 8,
    width: 2,
    height: 16,
  },

  /** Left edge of the wordmark block (box width + gap-2.5). */
  wordmarkX: 54,

  wordmark: {
    text: "SALONG",
    fontSize: 20,
    letterSpacingEm: 0.18,
    y: 22,
  },

  subtitle: {
    text: "SKÖNHETSSALONG",
    fontSize: 9,
    letterSpacingEm: 0.24,
    y: 37,
  },

  /** Concrete serif resolving this site's --font-serif stack for contexts without access to it (static SVG, PDF). */
  fontFamily: "Georgia, 'Times New Roman', Times, serif",
} as const;
