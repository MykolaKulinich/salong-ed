"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import Button from "@/components/ui/Button";
import {
  formatGiftCardAmount,
  MAX_CUSTOMER_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_GIFT_CARD_AMOUNT,
  MAX_MESSAGE_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_RECIPIENT_NAME_LENGTH,
  MAX_REQUESTED_TREATMENT_LENGTH,
  MIN_GIFT_CARD_AMOUNT,
  type GiftCardDeliveryTarget,
} from "@/lib/gift-card";
import type { GiftCardOrderRow } from "@/lib/gift-card-orders";
import { updateGiftCardOrderAction, type UpdateOrderState } from "../../actions";

const fieldClass =
  "mt-2 min-h-12 w-full rounded-none border border-border bg-background px-4 font-normal text-foreground outline-none transition-colors focus:border-foreground";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-accent-strong">
      {message}
    </p>
  );
}

export default function EditOrderForm({ order }: { order: GiftCardOrderRow }) {
  const amountLocked = order.status !== "waiting_payment";
  const [deliveryTarget, setDeliveryTarget] = useState<GiftCardDeliveryTarget>(order.delivery_target);
  const [state, formAction, pending] = useActionState<UpdateOrderState, FormData>(
    updateGiftCardOrderAction.bind(null, order.id),
    undefined,
  );

  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="mt-8 space-y-8" noValidate>
      <div>
        <label htmlFor="edit-amount" className="block text-sm font-medium text-foreground">
          Belopp
        </label>
        {amountLocked ? (
          <>
            <p className="mt-2 flex min-h-12 items-center border border-border bg-surface-muted px-4 text-foreground">
              {formatGiftCardAmount(order.amount)}
            </p>
            <p className="mt-2 text-xs text-muted">
              Beloppet kan inte ändras efter att betalningen har bekräftats.
            </p>
          </>
        ) : (
          <input
            id="edit-amount"
            name="amount"
            type="number"
            min={MIN_GIFT_CARD_AMOUNT}
            max={MAX_GIFT_CARD_AMOUNT}
            step="1"
            inputMode="numeric"
            required
            defaultValue={order.amount}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "edit-amount-error" : undefined}
            className={fieldClass}
          />
        )}
        <FieldError id="edit-amount-error" message={errors.amount} />
      </div>

      <div>
        <label htmlFor="edit-treatment" className="block text-sm font-medium text-foreground">
          Önskad behandling
        </label>
        <input
          id="edit-treatment"
          name="requestedTreatment"
          type="text"
          maxLength={MAX_REQUESTED_TREATMENT_LENGTH}
          defaultValue={order.requested_treatment ?? ""}
          aria-invalid={Boolean(errors.requestedTreatment)}
          aria-describedby={errors.requestedTreatment ? "edit-treatment-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="edit-treatment-error" message={errors.requestedTreatment} />
      </div>

      <div>
        <label htmlFor="edit-recipient-name" className="block text-sm font-medium text-foreground">
          Mottagarens namn
        </label>
        <input
          id="edit-recipient-name"
          name="recipientName"
          type="text"
          maxLength={MAX_RECIPIENT_NAME_LENGTH}
          defaultValue={order.recipient_name ?? ""}
          aria-invalid={Boolean(errors.recipientName)}
          aria-describedby={errors.recipientName ? "edit-recipient-name-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="edit-recipient-name-error" message={errors.recipientName} />
      </div>

      <div>
        <label htmlFor="edit-message" className="block text-sm font-medium text-foreground">
          Personlig hälsning
        </label>
        <textarea
          id="edit-message"
          name="message"
          rows={3}
          maxLength={MAX_MESSAGE_LENGTH}
          defaultValue={order.message ?? ""}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "edit-message-error" : undefined}
          className="mt-2 min-h-28 w-full resize-y rounded-none border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-foreground"
        />
        <FieldError id="edit-message-error" message={errors.message} />
      </div>

      <fieldset className="border-t border-border pt-6">
        <legend className="text-sm font-medium text-foreground">Presentkortet ska skickas till</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(
            [
              ["customer", "Kundens e-postadress"],
              ["recipient", "Mottagarens e-postadress"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 text-sm transition-colors ${
                deliveryTarget === value ? "border-accent bg-[#f5eee5]" : "border-border hover:border-accent"
              }`}
            >
              <input
                type="radio"
                name="deliveryTarget"
                value={value}
                checked={deliveryTarget === value}
                onChange={() => setDeliveryTarget(value)}
                className="h-4 w-4 accent-[var(--accent-strong)]"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <FieldError id="edit-delivery-target-error" message={errors.deliveryTarget} />
        {deliveryTarget === "recipient" && (
          <div className="mt-4 max-w-md">
            <label htmlFor="edit-recipient-email" className="block text-sm font-medium text-foreground">
              Mottagarens e-post
            </label>
            <input
              id="edit-recipient-email"
              name="recipientEmail"
              type="email"
              maxLength={MAX_EMAIL_LENGTH}
              defaultValue={order.recipient_email ?? ""}
              aria-invalid={Boolean(errors.recipientEmail)}
              aria-describedby={errors.recipientEmail ? "edit-recipient-email-error" : undefined}
              className={fieldClass}
            />
            <FieldError id="edit-recipient-email-error" message={errors.recipientEmail} />
          </div>
        )}
      </fieldset>

      <fieldset className="border-t border-border pt-6">
        <legend className="text-sm font-medium text-foreground">Kunduppgifter</legend>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="edit-customer-name" className="block text-sm font-medium text-foreground">
              Namn
            </label>
            <input
              id="edit-customer-name"
              name="customerName"
              type="text"
              maxLength={MAX_CUSTOMER_NAME_LENGTH}
              defaultValue={order.customer_name}
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={errors.customerName ? "edit-customer-name-error" : undefined}
              className={fieldClass}
            />
            <FieldError id="edit-customer-name-error" message={errors.customerName} />
          </div>
          <div>
            <label htmlFor="edit-customer-email" className="block text-sm font-medium text-foreground">
              E-post
            </label>
            <input
              id="edit-customer-email"
              name="customerEmail"
              type="email"
              maxLength={MAX_EMAIL_LENGTH}
              defaultValue={order.customer_email}
              aria-invalid={Boolean(errors.customerEmail)}
              aria-describedby={errors.customerEmail ? "edit-customer-email-error" : undefined}
              className={fieldClass}
            />
            <FieldError id="edit-customer-email-error" message={errors.customerEmail} />
          </div>
          <div>
            <label htmlFor="edit-customer-phone" className="block text-sm font-medium text-foreground">
              Telefon
            </label>
            <input
              id="edit-customer-phone"
              name="customerPhone"
              type="tel"
              maxLength={MAX_PHONE_LENGTH}
              defaultValue={order.customer_phone}
              aria-invalid={Boolean(errors.customerPhone)}
              aria-describedby={errors.customerPhone ? "edit-customer-phone-error" : undefined}
              className={fieldClass}
            />
            <FieldError id="edit-customer-phone-error" message={errors.customerPhone} />
          </div>
        </div>
      </fieldset>

      {state?.error && (
        <p role="alert" className="border border-accent/45 bg-[#f5eee5] px-4 py-3 text-sm text-foreground">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" disabled={pending} className="min-h-12 rounded-none">
          {pending ? "Sparar…" : "Spara ändringar"}
        </Button>
        <Link
          href={`/admin/presentkort/${order.id}`}
          className="inline-flex min-h-12 items-center border border-border px-5 text-sm text-foreground transition-colors hover:border-foreground"
        >
          Avbryt
        </Link>
      </div>
    </form>
  );
}
