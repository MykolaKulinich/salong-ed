import "server-only";

import type { GiftCardContent } from "@/lib/gift-card";

export type GiftCardEmailResult =
  | { ok: true }
  | { ok: false; reason: "provider_not_configured" | "provider_not_implemented" };

/**
 * Server-only email boundary. The future transactional provider belongs here;
 * callers should never need to know whether it is Resend or another service.
 *
 * Deliberately returns a safe failure until a provider and verified sender are
 * configured. This keeps local builds and manual-payment development inert.
 */
export async function sendGiftCardEmail({
  to,
  giftCard,
}: {
  to: string;
  giftCard: GiftCardContent;
}): Promise<GiftCardEmailResult> {
  void to;
  void giftCard;

  if (!process.env.GIFT_CARD_EMAIL_PROVIDER || !process.env.GIFT_CARD_EMAIL_FROM) {
    return { ok: false, reason: "provider_not_configured" };
  }

  return { ok: false, reason: "provider_not_implemented" };
}
