import {
  isGiftCardDeliveryTarget,
  MAX_CUSTOMER_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_GIFT_CARD_AMOUNT,
  MAX_HONEYPOT_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_RECIPIENT_NAME_LENGTH,
  MAX_REQUESTED_TREATMENT_LENGTH,
  MIN_GIFT_CARD_AMOUNT,
  type GiftCardDeliveryTarget,
} from "@/lib/gift-card";

export type GiftCardFieldName =
  | "amount"
  | "requestedTreatment"
  | "recipientName"
  | "message"
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "deliveryTarget"
  | "recipientEmail"
  | "website";

export type GiftCardOrderInsert = {
  amount: number;
  requested_treatment: string | null;
  recipient_name: string | null;
  message: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_target: GiftCardDeliveryTarget;
  recipient_email: string | null;
  status: "waiting_payment";
};

export type GiftCardValidationSuccess = {
  success: true;
  data: GiftCardOrderInsert;
};

export type GiftCardValidationFailure = {
  success: false;
  message: string;
  fieldErrors: Partial<Record<GiftCardFieldName, string>>;
};

export type GiftCardValidationResult = GiftCardValidationSuccess | GiftCardValidationFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(input: Record<string, unknown>, field: GiftCardFieldName): string | null {
  const value = input[field];

  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value : null;
}

function cleanSingleLine(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function cleanMessage(value: string): string {
  return value.trim();
}

function invalid(
  fieldErrors: Partial<Record<GiftCardFieldName, string>>,
): GiftCardValidationFailure {
  return {
    success: false,
    message: "Kontrollera uppgifterna och försök igen.",
    fieldErrors,
  };
}

function parseAmount(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) ? value : null;
  }

  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const amount = Number(value.trim());
    return Number.isSafeInteger(amount) ? amount : null;
  }

  return null;
}

export function validateGiftCardSubmission(input: unknown): GiftCardValidationResult {
  if (!isRecord(input)) return invalid({ amount: "Ange ett belopp." });

  const website = readString(input, "website");
  if (website === null || website.length > MAX_HONEYPOT_LENGTH || website.trim() !== "") {
    return invalid({ website: "Ogiltig förfrågan." });
  }

  const amount = parseAmount(input.amount);
  if (amount === null || amount < MIN_GIFT_CARD_AMOUNT || amount > MAX_GIFT_CARD_AMOUNT) {
    return invalid({
      amount: `Ange ett helt belopp mellan ${MIN_GIFT_CARD_AMOUNT} och ${MAX_GIFT_CARD_AMOUNT.toLocaleString("sv-SE")} kr.`,
    });
  }

  const requestedTreatmentValue = readString(input, "requestedTreatment");
  if (requestedTreatmentValue === null || requestedTreatmentValue.length > MAX_REQUESTED_TREATMENT_LENGTH) {
    return invalid({
      requestedTreatment: `Skriv högst ${MAX_REQUESTED_TREATMENT_LENGTH} tecken.`,
    });
  }

  const deliveryTargetValue = readString(input, "deliveryTarget");
  const deliveryTarget = deliveryTargetValue?.trim();
  if (!deliveryTarget || !isGiftCardDeliveryTarget(deliveryTarget)) {
    return invalid({ deliveryTarget: "Välj vart presentkortet ska skickas." });
  }

  const recipientEmailValue = readString(input, "recipientEmail");
  if (recipientEmailValue === null || recipientEmailValue.length > MAX_EMAIL_LENGTH) {
    return invalid({ recipientEmail: "Fyll i en giltig e-postadress." });
  }

  const recipientNameValue = readString(input, "recipientName");
  const messageValue = readString(input, "message");
  const customerNameValue = readString(input, "customerName");
  const customerEmailValue = readString(input, "customerEmail");
  const customerPhoneValue = readString(input, "customerPhone");

  if (
    recipientNameValue === null ||
    recipientNameValue.length > MAX_RECIPIENT_NAME_LENGTH ||
    messageValue === null ||
    messageValue.length > MAX_MESSAGE_LENGTH ||
    customerNameValue === null ||
    customerNameValue.length > MAX_CUSTOMER_NAME_LENGTH ||
    customerEmailValue === null ||
    customerEmailValue.length > MAX_EMAIL_LENGTH ||
    customerPhoneValue === null ||
    customerPhoneValue.length > MAX_PHONE_LENGTH
  ) {
    return invalid({ customerName: "Kontrollera att fälten inte är för långa." });
  }

  const requestedTreatment = cleanSingleLine(requestedTreatmentValue);
  const recipientName = cleanSingleLine(recipientNameValue);
  const message = cleanMessage(messageValue);
  const customerName = cleanSingleLine(customerNameValue);
  const customerEmail = customerEmailValue.trim().toLowerCase();
  const customerPhone = cleanSingleLine(customerPhoneValue);
  const recipientEmail = recipientEmailValue.trim().toLowerCase();

  const fieldErrors: Partial<Record<GiftCardFieldName, string>> = {};
  if (!customerName) fieldErrors.customerName = "Fyll i ditt namn.";
  if (!/^\S+@\S+\.\S+$/.test(customerEmail)) {
    fieldErrors.customerEmail = "Fyll i en giltig e-postadress.";
  }

  const phoneDigits = customerPhone.replace(/\D/g, "");
  if (!customerPhone || !/^[0-9+().\-\s]+$/.test(customerPhone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    fieldErrors.customerPhone = "Fyll i ett giltigt telefonnummer.";
  }

  if (deliveryTarget === "recipient") {
    if (!/^\S+@\S+\.\S+$/.test(recipientEmail)) {
      fieldErrors.recipientEmail = "Fyll i mottagarens e-postadress.";
    }
  } else if (recipientEmail) {
    fieldErrors.recipientEmail = "Rensa mottagarens e-postadress eller välj mottagaren som leveransmål.";
  }

  if (Object.keys(fieldErrors).length > 0) return invalid(fieldErrors);

  return {
    success: true,
    data: {
      amount,
      requested_treatment: requestedTreatment || null,
      recipient_name: recipientName || null,
      message: message || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      delivery_target: deliveryTarget,
      recipient_email: deliveryTarget === "recipient" ? recipientEmail : null,
      status: "waiting_payment",
    },
  };
}
