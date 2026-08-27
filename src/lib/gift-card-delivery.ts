import "server-only";

import { createGiftCardContent, type GiftCardOrderForDelivery } from "@/lib/gift-card";
import { renderGiftCardEmail } from "@/lib/gift-card-email-template";
import { generateGiftCardPdf, buildGiftCardPdfFilename } from "@/lib/gift-card-pdf";
import { sendTransactionalEmail } from "@/lib/brevo";

export type DeliveryAttemptResult =
  | { ok: true }
  | { ok: false; reason: "missing_recipient_email" | "pdf_generation_failed" | "send_failed" };

/**
 * Resolves where a gift card must go. No silent fallback: if
 * delivery_target is "recipient" but recipient_email is somehow missing,
 * this is a failure to surface (delivery_failed), never a quiet
 * substitution of customer_email.
 */
export function resolveGiftCardDeliveryEmail(
  order: Pick<GiftCardOrderForDelivery, "delivery_target" | "customer_email" | "recipient_email">,
): string | null {
  if (order.delivery_target === "recipient") {
    return order.recipient_email;
  }
  return order.customer_email;
}

/**
 * The one clear server-side delivery function: prepares the privacy-safe
 * presentation data, generates the PDF, renders the email, and sends it
 * through Brevo with the PDF attached.
 *
 * Pure orchestration — never reads or writes gift_card_orders itself.
 * Callers (lib/gift-card-workflow.ts) own every database transition, so
 * each status change stays an explicit, auditable compare-and-set rather
 * than being buried inside this function.
 */
export async function sendGiftCardDelivery(order: GiftCardOrderForDelivery): Promise<DeliveryAttemptResult> {
  const to = resolveGiftCardDeliveryEmail(order);
  if (!to) {
    console.error("Gift-card delivery has no destination email for this order.");
    return { ok: false, reason: "missing_recipient_email" };
  }

  const content = createGiftCardContent(order);

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await generateGiftCardPdf(content);
  } catch {
    console.error(`Gift-card PDF generation failed (${content.orderReference}).`);
    return { ok: false, reason: "pdf_generation_failed" };
  }

  const { subject, html, text } = renderGiftCardEmail(content);

  const result = await sendTransactionalEmail({
    to,
    subject,
    html,
    text,
    attachments: [
      {
        filename: buildGiftCardPdfFilename(content.orderReference),
        content: pdfBytes,
        contentType: "application/pdf",
      },
    ],
  });

  if (!result.ok) {
    console.error(`Gift-card delivery send failed (${result.reason}).`);
    return { ok: false, reason: "send_failed" };
  }

  return { ok: true };
}
