import Link from "next/link";
import { formatGiftCardAmount, GIFT_CARD_STATUS_LABELS } from "@/lib/gift-card";
import { formatDeliveryDestination, formatOrderDateTime } from "@/lib/admin-format";
import type { GiftCardOrderRow } from "@/lib/gift-card-orders";
import { STATUS_BADGE_CLASS } from "./status-styles";

export default function OrderCard({ order }: { order: GiftCardOrderRow }) {
  const isWaitingPayment = order.status === "waiting_payment";
  const isCancelled = order.status === "cancelled";

  return (
    <Link
      href={`/admin/presentkort/${order.id}`}
      className={`block border p-5 transition-colors hover:border-foreground sm:p-6 ${
        isWaitingPayment
          ? "border-amber-300 bg-amber-50/40"
          : isCancelled
            ? "border-border bg-surface opacity-60 hover:opacity-100"
            : "border-border bg-surface"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xl text-foreground">{order.order_reference}</p>
          <p className="mt-1 text-xs text-muted">{formatOrderDateTime(order.created_at)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center border px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[order.status]}`}
          >
            {GIFT_CARD_STATUS_LABELS[order.status]}
          </span>
          <span className="font-serif text-lg text-foreground">{formatGiftCardAmount(order.amount)}</span>
        </div>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-2 border-t border-border pt-4 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted">Kund</dt>
          <dd className="text-right text-foreground sm:text-left">{order.customer_name}</dd>
        </div>
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted">Telefon</dt>
          <dd className="text-right text-foreground sm:text-left">{order.customer_phone}</dd>
        </div>
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted">E-post</dt>
          <dd className="truncate text-right text-foreground sm:text-left">{order.customer_email}</dd>
        </div>
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted">Önskad behandling</dt>
          <dd className="text-right text-foreground sm:text-left">{order.requested_treatment ?? "Ej angivet"}</dd>
        </div>
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted">Mottagare</dt>
          <dd className="text-right text-foreground sm:text-left">{order.recipient_name ?? "Inte angivet"}</dd>
        </div>
        <div className="flex justify-between gap-4 sm:block">
          <dt className="text-muted">Levereras till</dt>
          <dd className="truncate text-right text-foreground sm:text-left">{formatDeliveryDestination(order)}</dd>
        </div>
      </dl>
    </Link>
  );
}
