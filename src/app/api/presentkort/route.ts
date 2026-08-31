import { randomInt } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { validateGiftCardSubmission } from "@/lib/gift-card-validation";
import {
  NEW_GIFT_CARD_ORDER_NOTIFICATION_COLUMNS,
  sendNewGiftCardOrderNotification,
  type NewGiftCardOrderNotification,
} from "@/lib/gift-card-notification";

export const runtime = "nodejs";

function createOrderReference(): string {
  const year = new Date().getFullYear();
  const sequence = randomInt(100000, 1_000_000);
  return `ED-${year}-${sequence}`;
}

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Kunde inte läsa förfrågan." }, { status: 400 });
  }

  const validation = validateGiftCardSubmission(input);
  if (!validation.success) {
    return Response.json(
      {
        error: validation.message,
        fieldErrors: validation.fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // The database unique constraint is the final authority. A retry keeps the
    // human-readable reference safe if a random reference ever collides.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const orderReference = createOrderReference();
      const { data: insertedOrder, error } = await supabase
        .from("gift_card_orders")
        .insert({
          ...validation.data,
          order_reference: orderReference,
        })
        .select(NEW_GIFT_CARD_ORDER_NOTIFICATION_COLUMNS)
        .single();

      if (!error) {
        try {
          if (insertedOrder) {
            await sendNewGiftCardOrderNotification(insertedOrder as NewGiftCardOrderNotification);
          }
        } catch {
          // Internal notification is best-effort and must never turn a
          // successfully persisted order into a failed customer request.
        }
        return Response.json({ ok: true, order_reference: orderReference });
      }

      if (error.code !== "23505" || attempt === 2) {
        console.error("Gift-card order persistence failed.", error);
        return Response.json({ error: "Förfrågan kunde inte skickas just nu." }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Gift-card order request failed.", error);
    return Response.json({ error: "Förfrågan kunde inte skickas just nu." }, { status: 500 });
  }

  return Response.json({ error: "Förfrågan kunde inte skickas just nu." }, { status: 500 });
}
