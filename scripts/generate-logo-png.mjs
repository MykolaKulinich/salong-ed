/**
 * Derives the email-safe transparent PNG from the canonical logo SVG —
 * never hand/separately redrawn. Run again only if
 * public/images/salong-ed/logo/salong-ed-logo.svg itself changes.
 *
 * Usage:
 *   node scripts/generate-logo-png.mjs
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const svgPath = path.join(root, "public/images/salong-ed/logo/salong-ed-logo.svg");
const pngPath = path.join(root, "public/images/salong-ed/logo/salong-ed-logo-email.png");

// Rasterize at 3x the SVG's 200x44 viewBox for a crisp, non-blurry result
// in email clients that render the declared HTML width smaller than this.
const SCALE = 3;

const svg = readFileSync(svgPath);

await sharp(svg, { density: 96 * SCALE })
  .resize({ width: 200 * SCALE, height: 44 * SCALE })
  .png()
  .toFile(pngPath);

console.log(`Wrote ${path.relative(root, pngPath)} from ${path.relative(root, svgPath)}.`);
