// Deliberately uses relative imports (see gift-card-email-template.ts for
// why) so this file is directly importable by developer preview scripts
// running under plain Node, outside Next.js.
import { readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import type { GiftCardContent } from "./gift-card.ts";
import { LOGO_BOX_OPACITY, LOGO_COLORS, LOGO_GEOMETRY } from "./salong-ed-logo-geometry.ts";

const MM_TO_PT = 72 / 25.4;

/** A5 landscape — 210 × 148mm, the size specified for the printed/on-screen gift card. */
const PAGE_WIDTH = 210 * MM_TO_PT;
const PAGE_HEIGHT = 148 * MM_TO_PT;

const COLORS = {
  background: hexToRgb(LOGO_COLORS.background), // warm cream/ivory
  border: hexToRgb(LOGO_COLORS.accent), // thin champagne/muted-gold frame
  foreground: hexToRgb(LOGO_COLORS.foreground),
  muted: hexToRgb(LOGO_COLORS.muted),
  accent: hexToRgb(LOGO_COLORS.accent),
  accentStrong: hexToRgb("#8f7247"),
};

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

type Fonts = { serif: PDFFont; serifBold: PDFFont; serifItalic: PDFFont };

/**
 * Draws a line of text with letter-spacing (pdf-lib has no built-in
 * tracking), character by character. Used for the editorial tracked-caps
 * labels and to redraw the logo's own tracked text natively.
 */
function drawTrackedText(
  page: PDFPage,
  text: string,
  {
    x,
    y,
    size,
    font,
    color,
    trackingEm = 0,
    align = "left",
  }: {
    x: number;
    y: number;
    size: number;
    font: PDFFont;
    color: ReturnType<typeof rgb>;
    trackingEm?: number;
    align?: "left" | "center";
  },
): void {
  const tracking = trackingEm * size;
  const chars = Array.from(text);
  const widths = chars.map((char) => font.widthOfTextAtSize(char, size));
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + tracking * Math.max(chars.length - 1, 0);

  let cursorX = align === "center" ? x - totalWidth / 2 : x;
  for (let i = 0; i < chars.length; i += 1) {
    page.drawText(chars[i], { x: cursorX, y, size, font, color });
    cursorX += widths[i] + tracking;
  }
}

/** Word-wraps text (respecting explicit line breaks) to fit within maxWidth at the given size. */
function wrapText(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  return text.split(/\r\n|\r|\n/).flatMap((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [""];

    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    return lines;
  });
}

/** Draws text horizontally centered on an arbitrary x (defaults to the page center). */
function drawCenteredText(
  page: PDFPage,
  text: string,
  y: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
  centerX: number = PAGE_WIDTH / 2,
): void {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: centerX - width / 2, y, size, font, color });
}

/**
 * Redraws the exact Salong ED lock-up as native PDF vector shapes/text,
 * using the same geometry as the static SVG asset (salong-ed-logo-geometry.ts)
 * — not reinterpreted, just placed and scaled for the card. Callers choose
 * the scale; the geometry (proportions) never changes.
 */
function drawLogo(page: PDFPage, { left, top, scale, serifFont }: { left: number; top: number; scale: number; serifFont: PDFFont }): number {
  const g = LOGO_GEOMETRY;
  const toX = (svgX: number) => left + svgX * scale;
  const toY = (svgY: number) => top - svgY * scale;

  page.drawRectangle({
    x: toX(g.box.x),
    y: toY(g.box.y + g.box.size),
    width: g.box.size * scale,
    height: g.box.size * scale,
    borderColor: COLORS.accent,
    borderOpacity: LOGO_BOX_OPACITY.borderOpacity,
    borderWidth: g.box.strokeWidth * scale,
    color: COLORS.accent,
    opacity: LOGO_BOX_OPACITY.fillOpacity,
  });

  drawTrackedText(page, g.monogram.text, {
    x: toX(g.monogram.x),
    y: toY(g.monogram.y),
    size: g.monogram.fontSize * scale,
    font: serifFont,
    color: COLORS.accent,
    trackingEm: g.monogram.letterSpacingEm,
    align: "center",
  });

  page.drawRectangle({
    x: toX(g.notch.x),
    y: toY(g.notch.y + g.notch.height),
    width: g.notch.width * scale,
    height: g.notch.height * scale,
    color: COLORS.background,
  });

  drawTrackedText(page, g.wordmark.text, {
    x: toX(g.wordmarkX),
    y: toY(g.wordmark.y),
    size: g.wordmark.fontSize * scale,
    font: serifFont,
    color: COLORS.foreground,
    trackingEm: g.wordmark.letterSpacingEm,
  });

  drawTrackedText(page, g.subtitle.text, {
    x: toX(g.wordmarkX),
    y: toY(g.subtitle.y),
    size: g.subtitle.fontSize * scale,
    font: serifFont,
    color: COLORS.muted,
    trackingEm: g.subtitle.letterSpacingEm,
  });

  return g.height * scale;
}

// The two approved botanical corner assets. Used exactly as provided —
// never redrawn, recolored, or merged — only placed and scaled here. Read
// from disk via a path Next.js's output file tracing can statically
// resolve (a literal path.join from process.cwd()), the standard pattern
// for bundling a public/ asset into a server-only code path.
const BOTANICAL_ASSETS_DIR = path.join(process.cwd(), "public", "images", "salong-ed", "presentkort");

function loadBotanicalArtwork() {
  return {
    topRight: readFileSync(path.join(BOTANICAL_ASSETS_DIR, "botanical-top-right.png")),
    bottomLeft: readFileSync(path.join(BOTANICAL_ASSETS_DIR, "botanical-bottom-left.png")),
  };
}

/** Both approved assets are square (1254×1254) — this is their fixed display size, aspect ratio always preserved. */
const BOTANICAL_SIZE = 105;
// A small deliberate overlap into the frame border, so the artwork reads as
// tucked into the corner rather than floating just inside it.
const BOTANICAL_BORDER_OVERLAP = 6;

/**
 * Places the two corner botanicals directly on the page — outside
 * drawCard's flowing layout, since they're fixed decoration, not dynamic
 * content. Drawn after the background/frame but before drawCard, so any
 * text always paints on top and stays legible even at the shared corner.
 */
function drawBotanicalCorners(page: PDFPage, topRight: PDFImage, bottomLeft: PDFImage): void {
  page.drawImage(topRight, {
    x: PAGE_WIDTH - BOTANICAL_BORDER_OVERLAP - BOTANICAL_SIZE,
    y: PAGE_HEIGHT - BOTANICAL_BORDER_OVERLAP - BOTANICAL_SIZE,
    width: BOTANICAL_SIZE,
    height: BOTANICAL_SIZE,
  });

  page.drawImage(bottomLeft, {
    x: BOTANICAL_BORDER_OVERLAP,
    y: BOTANICAL_BORDER_OVERLAP,
    width: BOTANICAL_SIZE,
    height: BOTANICAL_SIZE,
  });
}

/** Sanitizes an order reference into a clean, filesystem/email-safe PDF filename. */
export function buildGiftCardPdfFilename(orderReference: string): string {
  const safeReference = orderReference.replace(/[^A-Za-z0-9-]/g, "-");
  return `Salong-ED-Presentkort-${safeReference}.pdf`;
}

const FRAME_INSET = 14;
const CONTENT_WIDTH = PAGE_WIDTH - FRAME_INSET * 2 - 64; // horizontal padding inside the frame
// The band the whole composition (logo through footer) is vertically
// centered within, and the hard floor the message-truncation safeguard
// below must never let content cross.
const ZONE_TOP = PAGE_HEIGHT - FRAME_INSET - 18;
const ZONE_BOTTOM = FRAME_INSET + 18;

const LOGO_WIDTH = 190; // ~1.65x the previous pass's 116pt — reads as intentional branding, exact same geometry/proportions

/**
 * Draws the full gift card starting at `topY` and returns the y-coordinate
 * of the last thing drawn (the domain line's baseline). Used twice: once on
 * a throwaway scratch page purely to measure the total height the content
 * needs (see generateGiftCardPdf), and once for real on the actual page
 * after that height is used to center the whole block in the frame. This
 * keeps the layout math in exactly one place — the measurement pass reuses
 * this function itself rather than a hand-duplicated estimate, so it can
 * never drift out of sync with what's actually drawn.
 */
function drawCard(page: PDFPage, content: GiftCardContent, fonts: Fonts, topY: number): number {
  let cursorY = topY;

  const logoScale = LOGO_WIDTH / LOGO_GEOMETRY.width;
  const logoHeight = drawLogo(page, {
    left: (PAGE_WIDTH - LOGO_WIDTH) / 2,
    top: cursorY,
    scale: logoScale,
    serifFont: fonts.serif,
  });
  cursorY -= logoHeight + 20;

  drawTrackedText(page, "PRESENTKORT", {
    x: PAGE_WIDTH / 2,
    y: cursorY,
    size: 12,
    font: fonts.serif,
    color: COLORS.accent,
    trackingEm: 0.22,
    align: "center",
  });
  cursorY -= 46;

  // The amount is the visual anchor of the whole card: largest element,
  // bold weight, the strongest accent color.
  drawCenteredText(page, content.amountLabel, cursorY, 52, fonts.serifBold, COLORS.accentStrong);
  cursorY -= 46;

  if (content.recipientName) {
    // recipient_name can be up to 120 characters — wrap rather than let a
    // long name run past the card's border.
    const recipientLines = wrapText(fonts.serif, `Till ${content.recipientName}`, 15, CONTENT_WIDTH).slice(0, 2);
    for (const line of recipientLines) {
      drawCenteredText(page, line, cursorY, 15, fonts.serif, COLORS.muted);
      cursorY -= 20;
    }
    cursorY -= 6;
  }

  if (content.message) {
    cursorY = drawMessage(page, fonts.serifItalic, content.message, cursorY, Boolean(content.requestedTreatment));
  }

  cursorY -= 12;
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - CONTENT_WIDTH / 2, y: cursorY },
    end: { x: PAGE_WIDTH / 2 + CONTENT_WIDTH / 2, y: cursorY },
    thickness: 0.75,
    color: COLORS.border,
    opacity: 0.5,
  });
  cursorY -= 24;

  cursorY = drawMetadataRow(page, cursorY, fonts.serif, content);

  cursorY -= 22;
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - CONTENT_WIDTH / 2, y: cursorY },
    end: { x: PAGE_WIDTH / 2 + CONTENT_WIDTH / 2, y: cursorY },
    thickness: 0.75,
    color: COLORS.border,
    opacity: 0.5,
  });
  cursorY -= 24;

  drawTrackedText(page, "SALONG ED", {
    x: PAGE_WIDTH / 2,
    y: cursorY,
    size: 11,
    font: fonts.serif,
    color: COLORS.foreground,
    trackingEm: 0.16,
    align: "center",
  });
  cursorY -= 15;
  drawCenteredText(page, "salongewelinadubowska.com", cursorY, 10, fonts.serif, COLORS.muted);

  return cursorY;
}

/**
 * Draws the personal message, italic and centered. The message can be up
 * to 500 characters (see MAX_MESSAGE_LENGTH) — with a long recipient name
 * and treatment too, naively allowing a fixed number of lines can push the
 * rest of the card (metadata row, rule, footer) below the frame's bottom
 * edge. This computes exactly how much room is actually left above
 * ZONE_BOTTOM for everything that still has to render below the message —
 * the metadata row's worst case, both rules, and the footer — and caps the
 * message to that, truncating with an ellipsis only in this genuine worst
 * case, never silently overlapping/corrupting the layout.
 */
function drawMessage(page: PDFPage, italicFont: PDFFont, message: string, startY: number, hasTreatment: boolean): number {
  const MESSAGE_SIZE = 14;
  const MESSAGE_LINE_HEIGHT = 19;
  const RULE_AND_GAP = 12 + 24; // gap+rule before the metadata row
  const METADATA_ROW_HEIGHT = hasTreatment ? 16 + 2 * 16 : 16 + 16; // label + up to 2 wrapped lines, or label + 1 line
  const FOOTER_BLOCK_HEIGHT = 22 + 24 + 11 + 15 + 10; // gap+rule, gap, "SALONG ED", gap, domain

  const reservedBelow = RULE_AND_GAP + METADATA_ROW_HEIGHT + FOOTER_BLOCK_HEIGHT;
  const availableForMessage = startY - ZONE_BOTTOM - reservedBelow;
  const maxMessageLines = Math.max(2, Math.min(6, Math.floor(availableForMessage / MESSAGE_LINE_HEIGHT)));

  const rawLines = wrapText(italicFont, `"${message}"`, MESSAGE_SIZE, CONTENT_WIDTH);
  const truncated = rawLines.length > maxMessageLines;
  const lines = truncated ? rawLines.slice(0, maxMessageLines) : rawLines;
  if (truncated) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/["\s]+$/, "")}…"`;
  }

  let y = startY;
  for (const line of lines) {
    drawCenteredText(page, line, y, MESSAGE_SIZE, italicFont, COLORS.foreground);
    y -= MESSAGE_LINE_HEIGHT;
  }
  return y;
}

/**
 * The lower metadata section. When a treatment was requested, this is a
 * compact two-column row (treatment left, reference right) rather than two
 * stacked blocks, so it reads as a single restrained band, not an invoice.
 * When there is no treatment, the reference is centered alone across the
 * full width — never leaving an empty left column. Returns the y-coordinate
 * of the row's lowest drawn line.
 */
function drawMetadataRow(page: PDFPage, y: number, serifFont: PDFFont, content: GiftCardContent): number {
  const LABEL_SIZE = 9.5;
  const VALUE_SIZE = 13;
  let lowestY = y;

  function drawColumn(centerX: number, columnWidth: number, label: string, value: string) {
    drawTrackedText(page, label, {
      x: centerX,
      y,
      size: LABEL_SIZE,
      font: serifFont,
      color: COLORS.accent,
      trackingEm: 0.14,
      align: "center",
    });

    const lines = wrapText(serifFont, value, VALUE_SIZE, columnWidth).slice(0, 2);
    let valueY = y - 18;
    for (const line of lines) {
      drawCenteredText(page, line, valueY, VALUE_SIZE, serifFont, COLORS.foreground, centerX);
      lowestY = Math.min(lowestY, valueY);
      valueY -= 16;
    }
  }

  if (content.requestedTreatment) {
    const halfWidth = CONTENT_WIDTH / 2;
    const columnWidth = halfWidth - 20;
    const leftCenterX = PAGE_WIDTH / 2 - halfWidth / 2;
    const rightCenterX = PAGE_WIDTH / 2 + halfWidth / 2;

    drawColumn(leftCenterX, columnWidth, "ÖNSKAD BEHANDLING", content.requestedTreatment);
    drawColumn(rightCenterX, columnWidth, "PRESENTKORTSNUMMER", content.orderReference);
  } else {
    drawColumn(PAGE_WIDTH / 2, CONTENT_WIDTH, "PRESENTKORTSNUMMER", content.orderReference);
  }

  return lowestY;
}

/**
 * Generates the premium A5-landscape gift-card PDF, in memory, from
 * privacy-safe presentation data only (see GiftCardContent in ./gift-card).
 * Contains no buyer/internal data — no customer name/email/phone, no
 * internal id, no status, no timestamps. Deterministic and side-effect-free:
 * no filesystem, no network. Server-only in practice (only ever called from
 * lib/gift-card-delivery.ts), but intentionally not `import "server-only"`-
 * guarded — it holds no secret, and developer preview scripts
 * (scripts/preview-gift-card-pdf.mjs) need to call it directly outside
 * Next.js.
 */
export async function generateGiftCardPdf(content: GiftCardContent): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const fonts: Fonts = {
    serif: await pdf.embedFont(StandardFonts.TimesRoman),
    serifBold: await pdf.embedFont(StandardFonts.TimesRomanBold),
    serifItalic: await pdf.embedFont(StandardFonts.TimesRomanItalic),
  };

  // Measure on a throwaway scratch page first, so the real composition can
  // be vertically centered in the frame regardless of how much optional
  // content is present — a short card (no message, no treatment) looks
  // like a deliberately composed card, not a sparse certificate with a
  // stray footer stranded at the bottom.
  const scratchPage = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const measuredBottomY = drawCard(scratchPage, content, fonts, ZONE_TOP);
  pdf.removePage(pdf.getPageCount() - 1);

  const contentHeight = ZONE_TOP - measuredBottomY;
  const zoneHeight = ZONE_TOP - ZONE_BOTTOM;
  const slack = Math.max(0, zoneHeight - contentHeight);
  const startY = ZONE_TOP - slack / 2;

  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Warm ivory/cream background, full bleed.
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLORS.background });

  // Thin champagne/muted-gold frame — unchanged from the previous pass.
  page.drawRectangle({
    x: FRAME_INSET,
    y: FRAME_INSET,
    width: PAGE_WIDTH - FRAME_INSET * 2,
    height: PAGE_HEIGHT - FRAME_INSET * 2,
    borderColor: COLORS.border,
    borderWidth: 1.1,
    borderOpacity: 0.7,
  });

  // Approved botanical corner artwork, used exactly as provided (see
  // salong-ed-logo-geometry.ts-style note above drawBotanicalCorners).
  // Drawn before the dynamic content so text always paints on top.
  const artwork = loadBotanicalArtwork();
  const [topRightImage, bottomLeftImage] = await Promise.all([
    pdf.embedPng(artwork.topRight),
    pdf.embedPng(artwork.bottomLeft),
  ]);
  drawBotanicalCorners(page, topRightImage, bottomLeftImage);

  drawCard(page, content, fonts, startY);

  return pdf.save();
}
