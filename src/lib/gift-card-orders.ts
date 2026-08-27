import "server-only";

import { requireAdminUser } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { GiftCardDeliveryTarget, GiftCardStatus } from "@/lib/gift-card";

export type GiftCardOrderRow = {
  id: string;
  order_reference: string;
  created_at: string;
  amount: number;
  status: GiftCardStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  requested_treatment: string | null;
  recipient_name: string | null;
  message: string | null;
  delivery_target: GiftCardDeliveryTarget;
  recipient_email: string | null;
  paid_at: string | null;
  delivered_at: string | null;
};

// Explicit column list rather than `select("*")` — this is the admin Data
// Transfer Object boundary; add a field here deliberately, not by accident.
const ORDER_COLUMNS =
  "id, order_reference, created_at, amount, status, customer_name, customer_email, customer_phone, requested_treatment, recipient_name, message, delivery_target, recipient_email, paid_at, delivered_at";

const ORDER_LIST_LIMIT = 50;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidOrderId(value: string): boolean {
  return UUID_RE.test(value);
}

/**
 * Newest-first, capped at 50. gift_card_orders has no public SELECT policy
 * (RLS revokes anon/authenticated entirely — see supabase/migrations), so
 * this always goes through the service-role admin client, gated by
 * requireAdminUser() first.
 */
export async function listGiftCardOrders(): Promise<GiftCardOrderRow[]> {
  await requireAdminUser();

  const { data, error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(ORDER_LIST_LIMIT);

  if (error) {
    console.error("Failed to list gift-card orders.", error.message);
    throw new Error("Kunde inte hämta beställningar.");
  }

  return (data ?? []) as unknown as GiftCardOrderRow[];
}

export async function getGiftCardOrderById(id: string): Promise<GiftCardOrderRow | null> {
  await requireAdminUser();

  if (!isValidOrderId(id)) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("gift_card_orders")
    .select(ORDER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load gift-card order.", error.message);
    throw new Error("Kunde inte hämta beställningen.");
  }

  return (data as unknown as GiftCardOrderRow | null) ?? null;
}
