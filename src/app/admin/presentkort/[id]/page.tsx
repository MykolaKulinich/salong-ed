import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatGiftCardAmount, GIFT_CARD_STATUS_LABELS } from "@/lib/gift-card";
import { formatDeliveryDestination, formatOrderDateTime } from "@/lib/admin-format";
import { getGiftCardOrderById } from "@/lib/gift-card-orders";
import { STATUS_BADGE_CLASS } from "../status-styles";
import ConfirmPaymentForm from "./ConfirmPaymentForm";
import CancelOrderButton from "./CancelOrderButton";

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

  return (
    <div className="max-w-2xl">
      <Link href="/admin/presentkort" className="text-sm text-muted transition-colors hover:text-accent">
        ← Alla beställningar
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <h2 className="font-serif text-3xl text-foreground">{order.order_reference}</h2>
        <span
          className={`inline-flex items-center border px-3 py-1 text-sm font-medium ${STATUS_BADGE_CLASS[order.status]}`}
        >
          {GIFT_CARD_STATUS_LABELS[order.status]}
        </span>
      </div>

      <dl className="mt-6 divide-y divide-border border-y border-border">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-6 py-3 text-sm">
            <dt className="text-muted">{field.label}</dt>
            <dd className="max-w-xs text-right text-foreground">{field.value}</dd>
          </div>
        ))}
        <div className="flex items-start justify-between gap-6 py-3 text-sm">
          <dt className="text-muted">Hälsning</dt>
          <dd className="max-w-xs whitespace-pre-wrap text-right text-foreground">
            {order.message ?? "Ingen hälsning"}
          </dd>
        </div>
      </dl>

      {(order.status === "waiting_payment" || order.status === "paid") && (
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/admin/presentkort/${order.id}/redigera`}
            className="inline-flex min-h-11 items-center border border-border px-5 text-sm text-foreground transition-colors hover:border-foreground"
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

      {order.status === "cancelled" && (
        <p className="mt-8 border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
          Den här beställningen är avbruten och är skrivskyddad.
        </p>
      )}

      {order.status === "delivered" && (
        <p className="mt-8 border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
          Presentkortet är skickat och beställningen är skrivskyddad.
        </p>
      )}
    </div>
  );
}
