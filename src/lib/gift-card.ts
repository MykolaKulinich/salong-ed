export const PRESET_GIFT_CARD_AMOUNTS = [500, 1000, 1500, 2000] as const;

export const MIN_GIFT_CARD_AMOUNT = 100;
export const MAX_GIFT_CARD_AMOUNT = 100_000;
export const MAX_REQUESTED_TREATMENT_LENGTH = 100;
export const MAX_CUSTOMER_NAME_LENGTH = 120;
export const MAX_RECIPIENT_NAME_LENGTH = 120;
export const MAX_MESSAGE_LENGTH = 500;
export const MAX_PHONE_LENGTH = 40;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_HONEYPOT_LENGTH = 120;

export const GIFT_CARD_DELIVERY_TARGETS = ["customer", "recipient"] as const;
export type GiftCardDeliveryTarget = (typeof GIFT_CARD_DELIVERY_TARGETS)[number];

export const GIFT_CARD_STATUSES = [
  "waiting_payment",
  "paid",
  "delivered",
  "cancelled",
  "delivery_failed",
  "contacted",
] as const;
export type GiftCardStatus = (typeof GIFT_CARD_STATUSES)[number];

/** Swedish labels for the admin UI. The underlying database values never change. */
export const GIFT_CARD_STATUS_LABELS: Record<GiftCardStatus, string> = {
  waiting_payment: "Väntar på betalning",
  paid: "Betald",
  delivered: "Skickad",
  cancelled: "Avbruten",
  delivery_failed: "Leverans misslyckades",
  contacted: "Kontaktad",
};

export type GiftCardOrderForDelivery = {
  order_reference: string;
  amount: number;
  requested_treatment: string | null;
  recipient_name: string | null;
  message: string | null;
  customer_email: string;
  delivery_target: GiftCardDeliveryTarget;
  recipient_email: string | null;
};

export type GiftCardContent = {
  brand: "Salong ED";
  title: "Presentkort";
  orderReference: string;
  amount: number;
  amountLabel: string;
  recipientName: string | null;
  message: string | null;
  requestedTreatment: string | null;
};

export function isGiftCardDeliveryTarget(value: string): value is GiftCardDeliveryTarget {
  return GIFT_CARD_DELIVERY_TARGETS.includes(value as GiftCardDeliveryTarget);
}

export function formatGiftCardAmount(amount: number): string {
  return `${new Intl.NumberFormat("sv-SE").format(amount)} kr`;
}

/**
 * Public gift-card representation used by the future email/PDF renderer.
 * Deliberately excludes customer contact details and other private metadata.
 */
export function createGiftCardContent(order: GiftCardOrderForDelivery): GiftCardContent {
  return {
    brand: "Salong ED",
    title: "Presentkort",
    orderReference: order.order_reference,
    amount: order.amount,
    amountLabel: formatGiftCardAmount(order.amount),
    recipientName: order.recipient_name,
    message: order.message,
    requestedTreatment: order.requested_treatment,
  };
}
