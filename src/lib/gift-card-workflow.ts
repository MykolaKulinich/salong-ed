import "server-only";

import {
  createGiftCardContent,
  type GiftCardOrderForDelivery,
} from "@/lib/gift-card";
import { sendGiftCardEmail } from "@/lib/gift-card-email";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type PaymentConfirmationResult =
  | { ok: true; status: "delivered"; orderReference: string }
  | { ok: false; status: "not_waiting_payment" | "delivery_failed"; orderReference?: string };

/**
 * Future authenticated admin action entry point.
 *
 * The compare-and-set update makes a double click safe: only an order still in
 * waiting_payment can be confirmed. No route exposes this function today.
 */
export async function confirmGiftCardPayment(orderId: string): Promise<PaymentConfirmationResult> {
  const supabase = getSupabaseAdmin();
  const paidAt = new Date().toISOString();
  const { data: paidOrder, error: paymentError } = await supabase
    .from("gift_card_orders")
    .update({ status: "paid", paid_at: paidAt })
    .eq("id", orderId)
    .eq("status", "waiting_payment")
    .select("*")
    .maybeSingle();

  if (paymentError) throw new Error("Could not confirm gift-card payment.");
  if (!paidOrder) return { ok: false, status: "not_waiting_payment" };

  const order = paidOrder as unknown as GiftCardOrderForDelivery;
  const deliveryEmail = order.delivery_target === "recipient"
    ? order.recipient_email
    : order.customer_email;

  if (!deliveryEmail) {
    await markDeliveryFailed(orderId);
    return { ok: false, status: "delivery_failed", orderReference: order.order_reference };
  }

  const result = await sendGiftCardEmail({
    to: deliveryEmail,
    giftCard: createGiftCardContent(order),
  });

  if (!result.ok) {
    await markDeliveryFailed(orderId);
    return { ok: false, status: "delivery_failed", orderReference: order.order_reference };
  }

  const { error: deliveredError } = await supabase
    .from("gift_card_orders")
    .update({ status: "delivered", delivered_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "paid");

  if (deliveredError) throw new Error("Could not record gift-card delivery.");

  return { ok: true, status: "delivered", orderReference: order.order_reference };
}

async function markDeliveryFailed(orderId: string) {
  const { error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .update({ status: "delivery_failed" })
    .eq("id", orderId)
    .eq("status", "paid");

  if (error) throw new Error("Could not record gift-card delivery failure.");
}
