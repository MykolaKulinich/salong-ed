// Deliberately uses relative imports to its src/lib siblings (gift-card,
// site) rather than the `@/lib/...` alias used elsewhere in the app. This
// file holds no secrets — it's pure, stateless rendering — so it is also
// imported directly by developer preview scripts (scripts/preview-gift-card-pdf.mjs,
// scripts/send-test-gift-card-email.mjs) that run under plain Node, outside
// Next.js, where the `@/` path alias does not resolve.
import type { GiftCardContent } from "./gift-card.ts";
import { CONTACT } from "./site.ts";
import { LOGO_COLORS, LOGO_GEOMETRY } from "./salong-ed-logo-geometry.ts";

export type RenderedGiftCardEmail = {
  subject: string;
  html: string;
  text: string;
};

const SUBJECT = "Du har fått ett presentkort från Salong ED";

const NO_REPLY_NOTICE = "Detta är ett automatiskt meddelande. Svara inte på detta e-postmeddelande.";

// Precomputed solid approximation of the logo box's bg-accent/5 fill,
// blended over the email panel background (#faf7f2) — a plain hex, not
// rgba(), since alpha-transparent backgrounds are unreliable in Outlook.
const LOGO_BOX_FILL = "#f6f2eb";

/**
 * Renders the exact Salong ED lock-up (bordered "ED" box + accent notch +
 * "SALONG"/"Skönhetssalong" wordmark, from salong-ed-logo-geometry.ts) as
 * conservative, table-based, inline-styled HTML — no <img>, no SVG, no
 * absolute positioning. This is the ONLY logo representation in the email:
 * there is no external image for a client to fail to load, so there is
 * nothing to show as a broken image, with or without remote images enabled.
 *
 * The box's right border is built from three stacked table cells (border,
 * no-border, border) rather than one continuous border, reproducing the
 * same decorative notch as the live component using only the table/border
 * CSS every major email client — including Outlook's Word engine — renders
 * reliably.
 */
function renderLogoTable(): string {
  const g = LOGO_GEOMETRY;
  const boxWidth = g.box.size - 1; // 1px reserved for the right-border column below
  const topSegment = g.notch.y;
  const gapSegment = g.notch.height;
  const bottomSegment = g.box.size - g.notch.y - g.notch.height;
  const wordmarkGap = g.wordmarkX - g.box.size;
  const font = "Georgia,'Times New Roman',serif";

  return `<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td style="padding-right:${wordmarkGap}px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td width="${boxWidth}" height="${g.box.size}" align="center" valign="middle" bgcolor="${LOGO_BOX_FILL}" style="border-top:1px solid ${LOGO_COLORS.accent};border-left:1px solid ${LOGO_COLORS.accent};border-bottom:1px solid ${LOGO_COLORS.accent};background:${LOGO_BOX_FILL};font-family:${font};font-size:${g.monogram.fontSize}px;letter-spacing:${g.monogram.letterSpacingEm * g.monogram.fontSize}px;color:${LOGO_COLORS.accent};">${g.monogram.text}</td>
          <td width="1" style="padding:0;font-size:0;line-height:0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr><td width="1" height="${topSegment}" bgcolor="${LOGO_BOX_FILL}" style="border-top:1px solid ${LOGO_COLORS.accent};border-right:1px solid ${LOGO_COLORS.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
              <tr><td width="1" height="${gapSegment}" bgcolor="${LOGO_COLORS.background}" style="font-size:0;line-height:0;">&nbsp;</td></tr>
              <tr><td width="1" height="${bottomSegment}" bgcolor="${LOGO_BOX_FILL}" style="border-bottom:1px solid ${LOGO_COLORS.accent};border-right:1px solid ${LOGO_COLORS.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
    <td align="left" valign="middle">
      <p style="margin:0;font-family:${font};font-size:${g.wordmark.fontSize}px;letter-spacing:${g.wordmark.letterSpacingEm * g.wordmark.fontSize}px;color:${LOGO_COLORS.foreground};">${g.wordmark.text}</p>
      <p style="margin:4px 0 0 0;font-family:${font};font-size:${g.subtitle.fontSize}px;letter-spacing:${g.subtitle.letterSpacingEm * g.subtitle.fontSize}px;color:${LOGO_COLORS.muted};">${g.subtitle.text}</p>
    </td>
  </tr>
</table>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Renders a plain-text line as inline HTML, preserving line breaks the sender typed. */
function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

/**
 * Premium, table-based transactional HTML email — Scandinavian-luxury
 * direction per AGENTS.md (warm ivory/cream, champagne accents, charcoal
 * editorial serif), built for email-client compatibility rather than
 * modern CSS: inline styles throughout, tables for layout, a safe serif
 * fallback stack, ~600px max width, no external CSS/JS/webfonts.
 */
function renderHtml(content: GiftCardContent): string {
  const rows: string[] = [];

  if (content.recipientName) {
    rows.push(`
      <tr>
        <td style="padding-top:16px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#726b60;">
            Till: <span style="color:#211d18;">${escapeHtml(content.recipientName)}</span>
          </p>
        </td>
      </tr>`);
  }

  if (content.message) {
    rows.push(`
      <tr>
        <td style="padding-top:16px;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:15px;line-height:1.6;color:#211d18;">
            &ldquo;${escapeHtmlMultiline(content.message)}&rdquo;
          </p>
        </td>
      </tr>`);
  }

  if (content.requestedTreatment) {
    rows.push(`
      <tr>
        <td style="padding-top:20px;border-top:1px solid #e6e0d4;margin-top:20px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a98a5c;">Önskad behandling</p>
          <p style="margin:4px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#211d18;">${escapeHtml(content.requestedTreatment)}</p>
        </td>
      </tr>`);
  }

  rows.push(`
    <tr>
      <td style="padding-top:20px;border-top:1px solid #e6e0d4;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#a98a5c;">Presentkortsnummer</p>
        <p style="margin:4px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#211d18;">${escapeHtml(content.orderReference)}</p>
      </td>
    </tr>`);

  return `<!doctype html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(SUBJECT)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f1ece4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1ece4;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#faf7f2;">
            <tr>
              <td align="center" style="padding:28px 24px 6px 24px;">
                ${renderLogoTable()}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:16px 24px 0 24px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#a98a5c;">Presentkort</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 24px 8px 24px;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:24px;line-height:1.35;color:#211d18;">${escapeHtml(SUBJECT)}</h1>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 32px 32px 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#211d18;">Vi hoppas att presentkortet ger dig en fin stund hos oss.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #d8c9a8;background:#ffffff;">
                  <tr>
                    <td align="center" style="padding:32px 28px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;color:#8f7247;">${escapeHtml(content.amountLabel)}</p>
                          </td>
                        </tr>
                        ${rows.join("\n")}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#211d18;">Presentkortet finns bifogat som PDF.</p>
                <p style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#211d18;">Du kan spara det i mobilen eller skriva ut det.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 40px 32px;border-top:1px solid #e6e0d4;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#726b60;">${escapeHtml(NO_REPLY_NOTICE)}</p>
                <p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#726b60;">
                  Har du frågor om presentkortet? Kontakta Salong ED på
                  <a href="${CONTACT.emailHref}" style="color:#8f7247;">${escapeHtml(CONTACT.email)}</a>
                  eller <a href="${CONTACT.phoneHref}" style="color:#8f7247;">${escapeHtml(CONTACT.phone)}</a>.
                </p>
                <p style="margin:18px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a98a5c;">Salong ED</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** High-quality plain-text fallback carrying every important field — not an afterthought. */
function renderText(content: GiftCardContent): string {
  const lines: string[] = [
    "SALONG ED",
    "",
    "PRESENTKORT",
    "",
    SUBJECT,
    "",
    "Vi hoppas att presentkortet ger dig en fin stund hos oss.",
    "",
    content.amountLabel,
  ];

  if (content.recipientName) {
    lines.push(`Till: ${content.recipientName}`);
  }

  if (content.message) {
    lines.push("", `"${content.message}"`);
  }

  if (content.requestedTreatment) {
    lines.push("", "Önskad behandling", content.requestedTreatment);
  }

  lines.push("", "Presentkortsnummer", content.orderReference);
  lines.push(
    "",
    "Presentkortet finns bifogat som PDF.",
    "Du kan spara det i mobilen eller skriva ut det.",
    "",
    NO_REPLY_NOTICE,
    `Har du frågor om presentkortet? Kontakta Salong ED på ${CONTACT.email} eller ${CONTACT.phone}.`,
    "",
    "Salong ED",
  );

  return lines.join("\n");
}

/**
 * Renders the complete gift-card delivery email — subject, premium HTML,
 * and a full plain-text fallback — from privacy-safe presentation data
 * only (see GiftCardContent in ./gift-card). Pure and side-effect-free:
 * callers own sending it (lib/gift-card-delivery.ts) and generating the
 * attached PDF (lib/gift-card-pdf.ts).
 */
export function renderGiftCardEmail(content: GiftCardContent): RenderedGiftCardEmail {
  return {
    subject: SUBJECT,
    html: renderHtml(content),
    text: renderText(content),
  };
}
