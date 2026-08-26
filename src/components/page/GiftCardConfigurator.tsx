"use client";

import Link from "next/link";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
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
  PRESET_GIFT_CARD_AMOUNTS,
  type GiftCardDeliveryTarget,
} from "@/lib/gift-card";
import type { GiftCardFieldName } from "@/lib/gift-card-validation";
import { ROUTES } from "@/lib/routes";
import { trackEvent } from "@/lib/analytics";

type AmountSelection = (typeof PRESET_GIFT_CARD_AMOUNTS)[number] | "custom";
type FormErrors = Partial<Record<GiftCardFieldName, string>>;

type ServerResponse = {
  error?: string;
  fieldErrors?: FormErrors;
  order_reference?: string;
};

function parseCustomAmount(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const amount = Number(value.trim());
  return Number.isSafeInteger(amount) ? amount : null;
}

function validateClientForm({
  amount,
  requestedTreatment,
  customerName,
  customerEmail,
  customerPhone,
  deliveryTarget,
  recipientEmail,
}: {
  amount: number | null;
  requestedTreatment: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryTarget: GiftCardDeliveryTarget;
  recipientEmail: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (amount === null || amount < MIN_GIFT_CARD_AMOUNT || amount > MAX_GIFT_CARD_AMOUNT) {
    errors.amount = "Ange ett helt belopp mellan " + MIN_GIFT_CARD_AMOUNT + " och " + MAX_GIFT_CARD_AMOUNT.toLocaleString("sv-SE") + " kr.";
  }

  if (requestedTreatment.trim().length > MAX_REQUESTED_TREATMENT_LENGTH) {
    errors.requestedTreatment = "Skriv högst " + MAX_REQUESTED_TREATMENT_LENGTH + " tecken.";
  }

  if (!customerName.trim()) errors.customerName = "Fyll i ditt namn.";
  if (!/^\S+@\S+\.\S+$/.test(customerEmail.trim())) {
    errors.customerEmail = "Fyll i en giltig e-postadress.";
  }

  const phone = customerPhone.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone || !/^[0-9+().\-\s]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.customerPhone = "Fyll i ett giltigt telefonnummer.";
  }

  if (deliveryTarget === "recipient" && !/^\S+@\S+\.\S+$/.test(recipientEmail.trim())) {
    errors.recipientEmail = "Fyll i mottagarens e-postadress.";
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-2 text-sm text-accent-strong">
      {message}
    </p>
  );
}

function StepLegend({ number, children }: { number: string; children: ReactNode }) {
  return (
    <legend className="flex items-center gap-4 font-serif text-2xl text-foreground sm:text-3xl">
      <span className="font-sans text-[10px] tracking-[0.22em] text-accent">{number}</span>
      {children}
    </legend>
  );
}

const inputClass =
  "mt-2 min-h-12 w-full rounded-none border border-border bg-background px-4 font-normal text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-foreground";

export default function GiftCardConfigurator() {
  const [amountSelection, setAmountSelection] = useState<AmountSelection>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [requestedTreatment, setRequestedTreatment] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryTarget, setDeliveryTarget] = useState<GiftCardDeliveryTarget>("customer");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [successReference, setSuccessReference] = useState<string | null>(null);

  const selectedAmount = useMemo(
    () => (amountSelection === "custom" ? parseCustomAmount(customAmount) : amountSelection),
    [amountSelection, customAmount],
  );

  const selectedAmountLabel = selectedAmount === null
    ? "Välj ett belopp"
    : formatGiftCardAmount(selectedAmount);
  const deliveryLabel = deliveryTarget === "customer"
    ? "Min e-post"
    : "Mottagarens e-post";

  function clearError(field: GiftCardFieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const clientErrors = validateClientForm({
      amount: selectedAmount,
      requestedTreatment,
      customerName,
      customerEmail,
      customerPhone,
      deliveryTarget,
      recipientEmail,
    });

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setSubmitError("Kontrollera de markerade uppgifterna och försök igen.");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/presentkort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount,
          requestedTreatment: requestedTreatment.trim(),
          recipientName: recipientName.trim(),
          message: message.trim(),
          deliveryTarget,
          recipientEmail: deliveryTarget === "recipient" ? recipientEmail.trim() : "",
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          website,
        }),
      });

      const result = (await response.json().catch(() => null)) as ServerResponse | null;

      if (!response.ok) {
        setErrors(result?.fieldErrors ?? {});
        setSubmitError(result?.error ?? "Förfrågan kunde inte skickas just nu.");
        setStatus("idle");
        return;
      }

      trackEvent("presentkort_submit");
      setSuccessReference(result?.order_reference ?? null);
      setStatus("success");
    } catch {
      setSubmitError("Förfrågan kunde inte skickas just nu. Försök igen om en liten stund.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <section id="presentkort-configurator" className="configurator-surface scroll-mt-28 border-y border-border py-16 sm:py-20 md:py-28">
        <Container>
          <div className="gift-summary-card mx-auto max-w-2xl border border-accent/45 bg-background p-8 shadow-[0_35px_70px_-40px_rgba(76,58,34,0.4)] sm:p-14">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Beställning mottagen</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground sm:text-5xl">Tack för din beställning</h2>
            <p className="mt-6 max-w-xl text-muted">
              Vi kontaktar dig med information om betalning. Presentkortet skickas först när betalningen har bekräftats.
            </p>
            <div className="mt-8 border-y border-border py-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Beställningsnummer</p>
              <p className="mt-2 font-serif text-3xl text-foreground">{successReference ?? "Registrerat"}</p>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Spara gärna numret. Det används som referens i vår fortsatta kontakt om betalning och leverans.
            </p>
            <div className="mt-8 flex flex-wrap gap-5 text-sm">
              <Link href={ROUTES.home} className="inline-flex min-h-12 items-center border border-foreground px-5 font-medium text-foreground transition-colors hover:bg-foreground hover:text-background">
                Till startsidan
              </Link>
              <Link href={ROUTES.face} className="inline-flex min-h-12 items-center border-b border-accent px-1 font-medium text-foreground transition-colors hover:text-accent">
                Se våra behandlingar
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="presentkort-configurator" className="configurator-surface scroll-mt-28 border-y border-border py-16 sm:py-20 md:py-28">
      <Container className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.82fr)] lg:items-start lg:gap-20">
        <div className="min-w-0">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Skapa din gåva</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground sm:text-5xl">Ett presentkort, gjort personligt</h2>
            <p className="mt-5 text-muted">
              Välj ett belopp som passar. Du behöver inte veta exakt vilken behandling mottagaren vill ha.
            </p>
          </div>

          <form id="presentkort-form" className="mt-10 space-y-10" noValidate onSubmit={handleSubmit}>
            <fieldset
              className="min-w-0 border-t border-border pt-7"
              aria-invalid={Boolean(errors.amount || errors.requestedTreatment)}
              aria-describedby={[
                errors.amount && "amount-error",
                errors.requestedTreatment && "requested-treatment-error",
              ].filter(Boolean).join(" ") || undefined}
            >
              <StepLegend number="01">Välj presentkort</StepLegend>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">Välj ett belopp som passar mottagaren.</p>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {PRESET_GIFT_CARD_AMOUNTS.map((amount) => (
                  <label
                    key={amount}
                    className={"group flex min-h-12 cursor-pointer items-center justify-center rounded-none border px-3 text-sm transition-colors " + (amountSelection === amount
                      ? "border-accent bg-[#c9b69b] text-foreground"
                      : "border-border text-foreground hover:border-accent")}
                  >
                    <input
                      type="radio"
                      name="gift-card-amount"
                      value={amount}
                      checked={amountSelection === amount}
                      onChange={() => {
                        setAmountSelection(amount);
                        clearError("amount");
                      }}
                      className="peer sr-only"
                    />
                    <span className="peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-foreground">
                      {formatGiftCardAmount(amount)}
                    </span>
                  </label>
                ))}
                <label
                  className={"col-span-2 flex min-h-12 cursor-pointer items-center justify-center rounded-none border px-3 text-sm transition-colors sm:col-span-1 " + (amountSelection === "custom"
                    ? "border-accent bg-[#c9b69b] text-foreground"
                    : "border-border text-foreground hover:border-accent")}
                >
                  <input
                    type="radio"
                    name="gift-card-amount"
                    value="custom"
                    checked={amountSelection === "custom"}
                    onChange={() => {
                      setAmountSelection("custom");
                      clearError("amount");
                    }}
                    className="peer sr-only"
                  />
                  <span className="peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-foreground">
                    Annat belopp
                  </span>
                </label>
              </div>
              {amountSelection === "custom" && (
                <div className="mt-4 max-w-sm">
                  <label htmlFor="custom-amount" className="block text-sm font-medium text-foreground">Annat belopp i kronor</label>
                  <input
                    id="custom-amount"
                    name="customAmount"
                    type="number"
                    min={MIN_GIFT_CARD_AMOUNT}
                    max={MAX_GIFT_CARD_AMOUNT}
                    step="1"
                    inputMode="numeric"
                    value={customAmount}
                    onChange={(event) => {
                      setCustomAmount(event.target.value);
                      clearError("amount");
                    }}
                    aria-invalid={Boolean(errors.amount)}
                    aria-describedby={errors.amount ? "amount-error" : undefined}
                    className={inputClass}
                  />
                  <p className="mt-2 text-xs text-muted">
                    Mellan {MIN_GIFT_CARD_AMOUNT} och {MAX_GIFT_CARD_AMOUNT.toLocaleString("sv-SE")} kr.
                  </p>
                </div>
              )}
              <FieldError id="amount-error" message={errors.amount} />

              <div className="mt-7 max-w-2xl">
                <label htmlFor="requested-treatment" className="block text-sm font-medium text-foreground">
                  Önskad behandling <span className="font-normal text-muted">(valfritt)</span>
                </label>
                <p className="mt-2 text-sm leading-relaxed text-muted">Skriv vilken behandling mottagaren önskar eller lämna tomt.</p>
                <input
                  id="requested-treatment"
                  name="requestedTreatment"
                  type="text"
                  autoComplete="off"
                  maxLength={MAX_REQUESTED_TREATMENT_LENGTH}
                  value={requestedTreatment}
                  onChange={(event) => {
                    setRequestedTreatment(event.target.value);
                    clearError("requestedTreatment");
                  }}
                  placeholder="t.ex. ansiktsbehandling, lash lift, Exilis Ultra 360"
                  aria-invalid={Boolean(errors.requestedTreatment)}
                  aria-describedby={errors.requestedTreatment ? "requested-treatment-error" : undefined}
                  className={inputClass}
                />
                <FieldError id="requested-treatment-error" message={errors.requestedTreatment} />
              </div>
            </fieldset>

            <fieldset className="min-w-0 border-t border-border pt-7">
              <StepLegend number="02">Gör det personligt</StepLegend>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">Valfritt, men gör presentkortet ännu mer personligt.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="recipient-name" className="block text-sm font-medium text-foreground">
                    Mottagarens namn <span className="font-normal text-muted">(valfritt)</span>
                  </label>
                  <input
                    id="recipient-name"
                    name="recipientName"
                    type="text"
                    autoComplete="off"
                    maxLength={MAX_RECIPIENT_NAME_LENGTH}
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="gift-card-message" className="block text-sm font-medium text-foreground">
                    Personlig hälsning <span className="font-normal text-muted">(valfritt)</span>
                  </label>
                  <textarea
                    id="gift-card-message"
                    name="message"
                    rows={3}
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Skriv en hälsning till mottagaren..."
                    className="mt-2 min-h-28 w-full resize-y rounded-none border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-foreground"
                  />
                  <p className="mt-2 text-xs text-muted">Max {MAX_MESSAGE_LENGTH} tecken.</p>
                </div>
              </div>

              <fieldset
                className="mt-8 border-t border-border pt-6"
                aria-invalid={Boolean(errors.deliveryTarget || errors.recipientEmail)}
                aria-describedby={[
                  errors.deliveryTarget && "delivery-target-error",
                  errors.recipientEmail && "recipient-email-error",
                ].filter(Boolean).join(" ") || undefined}
              >
                <legend className="text-sm font-medium text-foreground">Presentkortet ska skickas till</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {([
                    ["customer", "Min e-postadress"],
                    ["recipient", "Mottagarens e-postadress"],
                  ] as const).map(([value, label]) => (
                    <label key={value} className={"flex min-h-12 cursor-pointer items-center gap-3 rounded-none border px-4 text-sm transition-colors " + (deliveryTarget === value
                      ? "border-accent bg-[#f5eee5]"
                      : "border-border hover:border-accent")}>
                      <input
                        type="radio"
                        name="deliveryTarget"
                        value={value}
                        checked={deliveryTarget === value}
                        onChange={() => {
                          setDeliveryTarget(value);
                          clearError("deliveryTarget");
                          clearError("recipientEmail");
                        }}
                        className="h-4 w-4 accent-[var(--accent-strong)]"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <FieldError id="delivery-target-error" message={errors.deliveryTarget} />
                {deliveryTarget === "recipient" && (
                  <div className="mt-4 max-w-md">
                    <label htmlFor="recipient-email" className="block text-sm font-medium text-foreground">
                      Mottagarens e-post <span aria-hidden="true" className="text-accent">*</span>
                    </label>
                    <input
                      id="recipient-email"
                      name="recipientEmail"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={MAX_EMAIL_LENGTH}
                      value={recipientEmail}
                      onChange={(event) => {
                        setRecipientEmail(event.target.value);
                        clearError("recipientEmail");
                      }}
                      aria-invalid={Boolean(errors.recipientEmail)}
                      aria-describedby={errors.recipientEmail ? "recipient-email-error" : undefined}
                      className={inputClass}
                    />
                    <FieldError id="recipient-email-error" message={errors.recipientEmail} />
                  </div>
                )}
              </fieldset>
            </fieldset>

            <fieldset className="min-w-0 border-t border-border pt-7">
              <StepLegend number="03">Dina uppgifter</StepLegend>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">Vi använder uppgifterna för att kontakta dig och bekräfta din beställning.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="customer-name" className="block text-sm font-medium text-foreground">
                    Namn <span aria-hidden="true" className="text-accent">*</span>
                  </label>
                  <input
                    id="customer-name"
                    name="customerName"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={MAX_CUSTOMER_NAME_LENGTH}
                    value={customerName}
                    onChange={(event) => {
                      setCustomerName(event.target.value);
                      clearError("customerName");
                    }}
                    aria-invalid={Boolean(errors.customerName)}
                    aria-describedby={errors.customerName ? "customer-name-error" : undefined}
                    className={inputClass}
                  />
                  <FieldError id="customer-name-error" message={errors.customerName} />
                </div>
                <div>
                  <label htmlFor="customer-email" className="block text-sm font-medium text-foreground">
                    E-post <span aria-hidden="true" className="text-accent">*</span>
                  </label>
                  <input
                    id="customer-email"
                    name="customerEmail"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={MAX_EMAIL_LENGTH}
                    value={customerEmail}
                    onChange={(event) => {
                      setCustomerEmail(event.target.value);
                      clearError("customerEmail");
                    }}
                    aria-invalid={Boolean(errors.customerEmail)}
                    aria-describedby={errors.customerEmail ? "customer-email-error" : undefined}
                    className={inputClass}
                  />
                  <FieldError id="customer-email-error" message={errors.customerEmail} />
                </div>
                <div>
                  <label htmlFor="customer-phone" className="block text-sm font-medium text-foreground">
                    Telefon <span aria-hidden="true" className="text-accent">*</span>
                  </label>
                  <input
                    id="customer-phone"
                    name="customerPhone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={MAX_PHONE_LENGTH}
                    value={customerPhone}
                    onChange={(event) => {
                      setCustomerPhone(event.target.value);
                      clearError("customerPhone");
                    }}
                    aria-invalid={Boolean(errors.customerPhone)}
                    aria-describedby={errors.customerPhone ? "customer-phone-error" : undefined}
                    className={inputClass}
                  />
                  <FieldError id="customer-phone-error" message={errors.customerPhone} />
                </div>
              </div>
            </fieldset>

            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label htmlFor="website">Webbplats</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </div>

            {submitError && (
              <p role="alert" aria-live="polite" className="border border-accent/45 bg-[#f5eee5] px-4 py-3 text-sm text-foreground">
                {submitError}
              </p>
            )}
          </form>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-28" aria-live="polite">
          <div className="gift-card-paper gift-summary-card border border-border p-6 shadow-[0_35px_70px_-40px_rgba(76,58,34,0.4)] sm:p-8">
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent">Din gåva</span>
            <h2 className="mt-3 font-serif text-3xl text-foreground">Sammanfattning</h2>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              <div className="flex items-start justify-between gap-6 py-4 text-sm">
                <dt className="text-muted">Typ</dt>
                <dd className="text-right text-foreground">Presentkort</dd>
              </div>
              <div className="flex items-start justify-between gap-6 py-4 text-sm">
                <dt className="text-muted">Belopp</dt>
                <dd className="text-right text-foreground">{selectedAmountLabel}</dd>
              </div>
              <div className="flex items-start justify-between gap-6 py-4 text-sm">
                <dt className="text-muted">Önskad behandling</dt>
                <dd className="max-w-[12rem] text-right text-foreground">{requestedTreatment.trim() || "Ej angivet"}</dd>
              </div>
              <div className="flex items-start justify-between gap-6 py-4 text-sm">
                <dt className="text-muted">Mottagare</dt>
                <dd className="max-w-[12rem] text-right text-foreground">{recipientName.trim() || "Inte angivet"}</dd>
              </div>
              <div className="flex items-start justify-between gap-6 py-4 text-sm">
                <dt className="text-muted">Hälsning</dt>
                <dd className="max-w-[12rem] whitespace-pre-wrap text-right text-foreground">{message.trim() || "Ingen hälsning"}</dd>
              </div>
              <div className="flex items-start justify-between gap-6 py-4 text-sm">
                <dt className="text-muted">Skickas till</dt>
                <dd className="max-w-[12rem] text-right text-foreground">{deliveryLabel}</dd>
              </div>
              <div className="flex items-start justify-between gap-6 py-4 text-sm">
                <dt className="text-muted">Leverans</dt>
                <dd className="max-w-[12rem] text-right text-foreground">Efter bekräftad betalning</dd>
              </div>
            </dl>

            <div className="mt-7 flex items-end justify-between gap-6 border-t border-border pt-5">
              <span className="text-sm text-muted">Totalt</span>
              <span className="font-serif text-3xl text-accent-strong">{selectedAmountLabel}</span>
            </div>

            <Button type="submit" form="presentkort-form" disabled={status === "submitting"} className="mt-8 min-h-12 w-full rounded-none">
              {status === "submitting" ? "Skickar förfrågan…" : "Beställ presentkort"}
            </Button>
            <p className="mt-4 text-center text-xs leading-5 text-muted">
              Vi kontaktar dig med betalningsinformation. Presentkortet skickas först efter att betalningen har bekräftats.
            </p>
          </div>
        </aside>
      </Container>
    </section>
  );
}
