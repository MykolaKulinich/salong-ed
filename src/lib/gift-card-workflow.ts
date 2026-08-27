import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { GiftCardOrderForDelivery, GiftCardStatus } from "@/lib/gift-card";
import { sendGiftCardDelivery } from "@/lib/gift-card-delivery";

/**
 * State machine (see AGENTS.md):
 *
 *   waiting_payment -> cancelled
 *   waiting_payment -> paid -> delivered              (automatic, on payment confirmation)
 *   waiting_payment -> paid -> delivery_failed         (automatic, on payment confirmation)
 *   paid -> delivered                                  (manual recovery send)
 *   delivery_failed -> delivered                        (manual retry)
 *   delivered -> delivered                              (manual resend, delivered_at refreshed)
 *
 * Every transition below is a compare-and-set UPDATE guarded by the row's
 * current status, so a double click, refresh, or duplicate request can
 * never re-run a transition that already happened.
 */

const DELIVERY_COLUMNS =
  "order_reference, amount, requested_treatment, recipient_name, message, customer_email, delivery_target, recipient_email";

type OrderForDeliveryRow = GiftCardOrderForDelivery & { status: GiftCardStatus };

export type MarkPaidResult =
  | { ok: true; status: "paid"; orderReference: string; paidAt: string }
  | { ok: false; status: "not_waiting_payment" };

/**
 * Compare-and-set waiting_payment -> paid. This transition is the sole gate
 * for automatic first delivery — see confirmGiftCardPaymentAndDeliver below.
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

async function loadOrderForDelivery(orderId: string): Promise<OrderForDeliveryRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .select(`status, ${DELIVERY_COLUMNS}`)
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as OrderForDeliveryRow;
}

async function markGiftCardDelivered(
  orderId: string,
  fromStatus: GiftCardStatus,
): Promise<{ ok: true; deliveredAt: string } | { ok: false }> {
  const deliveredAt = new Date().toISOString();
  const { data, error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .update({ status: "delivered", delivered_at: deliveredAt })
    .eq("id", orderId)
    .eq("status", fromStatus)
    .select("id")
    .maybeSingle();

  if (error) throw new Error("Could not record gift-card delivery.");
  if (!data) return { ok: false };
  return { ok: true, deliveredAt };
}

async function markGiftCardDeliveryFailed(orderId: string, fromStatus: GiftCardStatus): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .update({ status: "delivery_failed" })
    .eq("id", orderId)
    .eq("status", fromStatus);

  // paid_at is untouched by this update — the fact of payment is preserved
  // regardless of delivery outcome.
  if (error) throw new Error("Could not record gift-card delivery failure.");
}

export type DeliveryOutcome =
  | { ok: true; status: "delivered"; orderReference: string; deliveredAt: string }
  | { ok: false; status: "delivery_failed"; orderReference: string }
  | { ok: false; status: "not_eligible" };

/**
 * Shared engine behind every delivery-triggering path. Always re-reads the
 * order fresh from the database (never trusts stale caller data — Ewelina
 * may have just corrected the recipient email or message), verifies the
 * order is currently in the expected source status, attempts delivery, and
 * writes exactly one of two outcomes via its own compare-and-set update.
 */
async function runGiftCardDelivery(
  orderId: string,
  fromStatus: Extract<GiftCardStatus, "paid" | "delivery_failed" | "delivered">,
): Promise<DeliveryOutcome> {
  const order = await loadOrderForDelivery(orderId);
  if (!order || order.status !== fromStatus) {
    return { ok: false, status: "not_eligible" };
  }

  const attempt = await sendGiftCardDelivery(order);

  if (!attempt.ok) {
    await markGiftCardDeliveryFailed(orderId, fromStatus);
    return { ok: false, status: "delivery_failed", orderReference: order.order_reference };
  }

  const delivered = await markGiftCardDelivered(orderId, fromStatus);
  if (!delivered.ok) {
    // The order's status moved under us between the read above and this
    // write (e.g. a concurrent duplicate request already recorded an
    // outcome first). The email may have gone out twice in that narrow
    // window, but the database is left in a valid, consistent state.
    return { ok: false, status: "not_eligible" };
  }

  return { ok: true, status: "delivered", orderReference: order.order_reference, deliveredAt: delivered.deliveredAt };
}

export type PaymentAndDeliveryResult =
  | { ok: true; delivery: DeliveryOutcome; paidAt: string }
  | { ok: false; status: "not_waiting_payment" };

/**
 * The full "Bekräfta betalning" workflow: waiting_payment -> paid, then —
 * only for the single request that actually won that transition — one
 * automatic first-delivery attempt. A double click, refresh, or retried
 * request that finds the order already past waiting_payment gets
 * `not_waiting_payment` here and never reaches delivery, so the gift card
 * can never be auto-sent twice. The gift card is never generated or sent
 * before this transition succeeds.
 */
export async function confirmGiftCardPaymentAndDeliver(orderId: string): Promise<PaymentAndDeliveryResult> {
  const paymentResult = await markGiftCardOrderPaid(orderId);
  if (!paymentResult.ok) return { ok: false, status: "not_waiting_payment" };

  const delivery = await runGiftCardDelivery(orderId, "paid");
  return { ok: true, delivery, paidAt: paymentResult.paidAt };
}

/**
 * Manual recovery for an order stuck at paid with delivered_at still null —
 * e.g. the server crashed between payment confirmation and delivery.
 * "Skicka presentkort" in the admin UI.
 */
export async function sendGiftCardOrderDelivery(orderId: string): Promise<DeliveryOutcome> {
  return runGiftCardDelivery(orderId, "paid");
}

/** "Försök skicka igen" for a delivery_failed order. */
export async function retryGiftCardOrderDelivery(orderId: string): Promise<DeliveryOutcome> {
  return runGiftCardDelivery(orderId, "delivery_failed");
}

/**
 * "Skicka igen" for an already-delivered order — an intentional resend, not
 * a new delivery. Keeps order_reference and paid_at untouched (this action
 * never writes them); on success, delivered_at is updated to this newer
 * successful send, per the documented resend behavior.
 */
export async function resendGiftCardOrderDelivery(orderId: string): Promise<DeliveryOutcome> {
  return runGiftCardDelivery(orderId, "delivered");
}
