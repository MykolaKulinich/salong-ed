import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatGiftCardAmount, GIFT_CARD_STATUS_LABELS } from "@/lib/gift-card";
import { formatDeliveryDestination, formatOrderDateTime } from "@/lib/admin-format";
import { getGiftCardOrderById } from "@/lib/gift-card-orders";
import { retryGiftCardOrderDeliveryAction, sendGiftCardOrderDeliveryAction } from "../actions";
import { STATUS_BADGE_CLASS } from "../status-styles";
import ConfirmPaymentForm from "./ConfirmPaymentForm";
import CancelOrderButton from "./CancelOrderButton";
import SendDeliveryButton from "./SendDeliveryButton";
import ResendDeliveryButton from "./ResendDeliveryButton";

export const metadata: Metadata = {
  title: "Beställning",
};

export default async function PresentkortOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getGiftCardOrderById(id);

  if (!order) notFound();

  const fields: { label: string; value: string }[] = [
    { label: "Beställningsnummer", value: order.order_reference },
    { label: "Belopp", value: formatGiftCardAmount(order.amount) },
    { label: "Datum", value: formatOrderDateTime(order.created_at) },
    { label: "Kund", value: order.customer_name },
    { label: "Telefon", value: order.customer_phone },
    { label: "E-post", value: order.customer_email },
    { label: "Önskad behandling", value: order.requested_treatment ?? "Ej angivet" },
    { label: "Mottagare", value: order.recipient_name ?? "Inte angivet" },
    { label: "Leverans", value: formatDeliveryDestination(order) },
  ];

  if (order.delivered_at) {
    fields.push({ label: "Skickad", value: formatOrderDateTime(order.delivered_at) });
  }

  return (
    <div className="min-w-0 max-w-2xl">
      <Link href="/admin/presentkort" className="text-sm text-muted transition-colors hover:text-accent">
        ← Alla beställningar
      </Link>

      <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <h2 className="break-words font-serif text-3xl text-foreground [overflow-wrap:anywhere]">{order.order_reference}</h2>
        <span
          className={`inline-flex shrink-0 items-center border px-3 py-1 text-sm font-medium ${STATUS_BADGE_CLASS[order.status]}`}
        >
          {GIFT_CARD_STATUS_LABELS[order.status]}
        </span>
      </div>

      <dl className="mt-6 divide-y divide-border border-y border-border">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0 py-3 text-sm sm:flex sm:items-start sm:justify-between sm:gap-6">
            <dt className="text-muted">{field.label}</dt>
            <dd className="mt-1 break-words text-foreground [overflow-wrap:anywhere] sm:mt-0 sm:max-w-xs sm:text-right">
              {field.value}
            </dd>
          </div>
        ))}
        <div className="min-w-0 py-3 text-sm sm:flex sm:items-start sm:justify-between sm:gap-6">
          <dt className="text-muted">Hälsning</dt>
          <dd className="mt-1 max-w-none break-words whitespace-pre-wrap text-foreground [overflow-wrap:anywhere] sm:mt-0 sm:max-w-xs sm:text-right">
            {order.message ?? "Ingen hälsning"}
          </dd>
        </div>
      </dl>

      {(order.status === "waiting_payment" || order.status === "paid") && (
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={`/admin/presentkort/${order.id}/redigera`}
            className="inline-flex min-h-11 items-center justify-center border border-border px-5 text-sm text-foreground transition-colors hover:border-foreground"
          >
            Redigera beställning
          </Link>
        </div>
      )}

      {order.status === "waiting_payment" && <ConfirmPaymentForm orderId={order.id} />}

      {order.status === "waiting_payment" && (
        <div className="mt-4">
          <CancelOrderButton orderId={order.id} orderReference={order.order_reference} />
        </div>
      )}

      {order.status === "paid" && (
        <div className="mt-4">
          <SendDeliveryButton
            orderId={order.id}
            label="Skicka presentkort"
            pendingLabel="Skickar…"
            action={sendGiftCardOrderDeliveryAction}
          />
        </div>
      )}

      {order.status === "delivery_failed" && (
        <div className="mt-8">
          <SendDeliveryButton
            orderId={order.id}
            label="Försök skicka igen"
            pendingLabel="Skickar…"
            action={retryGiftCardOrderDeliveryAction}
          />
        </div>
      )}

      {order.status === "delivered" && (
        <div className="mt-8">
          <ResendDeliveryButton orderId={order.id} />
        </div>
      )}

      {order.status === "cancelled" && (
        <p className="mt-8 border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
          Den här beställningen är avbruten och är skrivskyddad.
        </p>
      )}
    </div>
  );
}
