import "server-only";

import {
  createGiftCardContent,
  type GiftCardOrderForDelivery,
} from "@/lib/gift-card";
import { sendGiftCardEmail } from "@/lib/gift-card-email";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type MarkPaidResult =
  | { ok: true; status: "paid"; orderReference: string; paidAt: string }
  | { ok: false; status: "not_waiting_payment" };

/**
 * The admin "Bekräfta betalning" action calls only this: a compare-and-set
 * waiting_payment -> paid transition. It never touches delivery, so it's
 * safe to expose to an authenticated admin action on its own.
 *
 * The conditional `.eq("status", "waiting_payment")` makes a double click,
 * refresh, or duplicate request safe — only one call can ever win the
 * transition; every other call sees not_waiting_payment and does nothing.
 */
export async function markGiftCardOrderPaid(orderId: string): Promise<MarkPaidResult> {
  const paidAt = new Date().toISOString();
  const { data, error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .update({ status: "paid", paid_at: paidAt })
    .eq("id", orderId)
    .eq("status", "waiting_payment")
    .select("order_reference")
    .maybeSingle();

  if (error) throw new Error("Could not confirm gift-card payment.");
  if (!data) return { ok: false, status: "not_waiting_payment" };

  return { ok: true, status: "paid", orderReference: data.order_reference as string, paidAt };
}

export type PaymentConfirmationResult =
  | { ok: true; status: "delivered"; orderReference: string }
  | { ok: false; status: "not_waiting_payment" | "delivery_failed"; orderReference?: string };

/**
 * Future full paid -> delivered orchestration. Not called by the admin
 * "Bekräfta betalning" action today — that action stops at
 * markGiftCardOrderPaid() on purpose, leaving delivery for the next project
 * step. No route exposes this function yet.
 */
export async function confirmGiftCardPayment(orderId: string): Promise<PaymentConfirmationResult> {
  const supabase = getSupabaseAdmin();
  const paymentResult = await markGiftCardOrderPaid(orderId);
  if (!paymentResult.ok) return { ok: false, status: "not_waiting_payment" };

  const { data: paidOrder, error: fetchError } = await supabase
    .from("gift_card_orders")
    .select("*")
    .eq("id", orderId)
    .eq("status", "paid")
    .maybeSingle();

  if (fetchError || !paidOrder) throw new Error("Could not load gift-card order after payment.");

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
