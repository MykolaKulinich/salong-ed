"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { markGiftCardOrderPaid } from "@/lib/gift-card-workflow";
import { getGiftCardOrderById, isValidOrderId } from "@/lib/gift-card-orders";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { validateGiftCardFields, type GiftCardFieldName } from "@/lib/gift-card-validation";
import type { GiftCardStatus } from "@/lib/gift-card";

export type ConfirmPaymentResult =
  | { ok: true; orderReference: string }
  | { ok: false; error: string };

/**
 * The only server-side entry point for "Bekräfta betalning". Re-verifies
 * auth + admin authorization itself (a page-level check does not extend to
 * a Server Action — see Next.js data-security guide), validates the id
 * shape, then delegates the actual compare-and-set update to
 * markGiftCardOrderPaid(). Stops there on purpose: no email, no PDF, no
 * status other than paid, no delivered_at. See AGENTS.md sections 14–16.
 */
export async function confirmGiftCardPaymentAction(orderId: string): Promise<ConfirmPaymentResult> {
  await requireAdminUser();

  if (typeof orderId !== "string" || !isValidOrderId(orderId)) {
    return { ok: false, error: "Ogiltig beställning." };
  }

  const result = await markGiftCardOrderPaid(orderId);

  if (!result.ok) {
    return {
      ok: false,
      error: "Betalningen kunde inte bekräftas. Beställningen väntar kanske inte längre på betalning.",
    };
  }

  revalidatePath("/admin/presentkort");
  revalidatePath(`/admin/presentkort/${orderId}`);

  return { ok: true, orderReference: result.orderReference };
}

// Editing is meant for correcting a mistake on an order still in play, not
// for rewriting history. cancelled/delivered stay fully read-only in this pass.
const EDITABLE_STATUSES: ReadonlySet<GiftCardStatus> = new Set(["waiting_payment", "paid"]);

export type UpdateOrderState =
  | { error: string; fieldErrors?: Partial<Record<GiftCardFieldName, string>> }
  | undefined;

/**
 * Bound to a specific orderId via `.bind(null, orderId)` in EditOrderForm, so
 * it works directly as a useActionState action. Re-verifies auth, re-loads
 * the order fresh (never trusts anything the form claims about the order's
 * current status), and enforces the amount lock server-side: once a payment
 * is confirmed, any client-submitted amount is discarded and replaced with
 * the order's own current amount before validation even runs, then forced
 * again after — so no manipulated request can move it. Only an explicit
 * allow-list of columns is ever written; order_reference, created_at,
 * status, paid_at, and delivered_at are never touched here.
 */
export async function updateGiftCardOrderAction(
  orderId: string,
  _prevState: UpdateOrderState,
  formData: FormData,
): Promise<UpdateOrderState> {
  await requireAdminUser();

  if (!isValidOrderId(orderId)) {
    return { error: "Ogiltig beställning." };
  }

  const order = await getGiftCardOrderById(orderId);
  if (!order) {
    return { error: "Beställningen kunde inte hittas." };
  }

  if (!EDITABLE_STATUSES.has(order.status)) {
    return { error: "Beställningen kan inte redigeras i det här läget." };
  }

  const amountLocked = order.status !== "waiting_payment";

  const validation = validateGiftCardFields({
    amount: amountLocked ? order.amount : formData.get("amount"),
    requestedTreatment: formData.get("requestedTreatment"),
    recipientName: formData.get("recipientName"),
    message: formData.get("message"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    deliveryTarget: formData.get("deliveryTarget"),
    recipientEmail: formData.get("recipientEmail"),
  });

  if (!validation.success) {
    return { error: validation.message, fieldErrors: validation.fieldErrors };
  }

  const update = { ...validation.data };
  if (amountLocked) {
    // Belt-and-suspenders: the amount can never move on a paid order from
    // this action, regardless of what validateGiftCardFields returned.
    update.amount = order.amount;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .update(update)
    .eq("id", orderId)
    .eq("status", order.status)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update gift-card order.", error.message);
    return { error: "Beställningen kunde inte sparas just nu." };
  }

  if (!data) {
    return {
      error: "Beställningens status ändrades innan sparningen. Ladda om sidan och försök igen.",
    };
  }

  revalidatePath("/admin/presentkort");
  revalidatePath(`/admin/presentkort/${orderId}`);
  redirect(`/admin/presentkort/${orderId}`);
}

export type CancelOrderResult = { ok: true } | { ok: false; error: string };

/**
 * Soft-cancels an order. Only waiting_payment -> cancelled is allowed, via a
 * compare-and-set update — never a hard delete, never touches order history.
 */
export async function cancelGiftCardOrderAction(orderId: string): Promise<CancelOrderResult> {
  await requireAdminUser();

  if (!isValidOrderId(orderId)) {
    return { ok: false, error: "Ogiltig beställning." };
  }

  const { data, error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .eq("status", "waiting_payment")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to cancel gift-card order.", error.message);
    return { ok: false, error: "Beställningen kunde inte avbrytas just nu." };
  }

  if (!data) {
    return {
      ok: false,
      error: "Beställningen väntar inte längre på betalning och kan inte avbrytas.",
    };
  }

  revalidatePath("/admin/presentkort");
  revalidatePath(`/admin/presentkort/${orderId}`);

  return { ok: true };
}
