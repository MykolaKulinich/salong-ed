import type { GiftCardDeliveryTarget } from "@/lib/gift-card";

/** Swedish date/time formatting shared by the admin order list and detail view. */
export function formatOrderDateTime(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

/** Where the gift card is being sent, shared by the admin order list and detail view. */
export function formatDeliveryDestination(order: {
  delivery_target: GiftCardDeliveryTarget;
  recipient_email: string | null;
}): string {
  if (order.delivery_target === "recipient") {
    return order.recipient_email ? `Mottagarens e-post: ${order.recipient_email}` : "Mottagarens e-post";
  }
  return "Kundens e-post";
}
