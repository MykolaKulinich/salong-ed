export type Tone = "ivory" | "sand" | "charcoal" | "blush";

/**
 * Background tints used behind contain-fit product photography (devices
 * with transparent PNG backgrounds) so the tile reads as a finished,
 * editorial shot rather than a checkerboard. Shared with ImagePlaceholder's
 * own tone palette.
 */
export const TONE_BG_CLASSES: Record<Tone, string> = {
  ivory: "bg-[#f2ede5]",
  sand: "bg-[#ded1bf]",
  charcoal: "bg-[#302b26]",
  blush: "bg-[#e8d8cf]",
};
