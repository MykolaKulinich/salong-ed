import { describe, expect, it } from "vitest";
import { createGiftCardContent, formatGiftCardAmount } from "./gift-card";

// Intl.NumberFormat("sv-SE") groups thousands with a Unicode space
// separator whose exact codepoint depends on the ICU data available (not
// necessarily plain U+0020) — \s matches any of them, so normalizing this
// way compares the digits/grouping, not which specific character the
// runtime happened to pick.
function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, " ");
}

describe("formatGiftCardAmount", () => {
  it("formats amounts with a Swedish thousands separator and kr suffix", () => {
    expect(normalizeSpaces(formatGiftCardAmount(500))).toBe("500 kr");
    expect(normalizeSpaces(formatGiftCardAmount(1000))).toBe("1 000 kr");
    expect(normalizeSpaces(formatGiftCardAmount(1500))).toBe("1 500 kr");
    expect(normalizeSpaces(formatGiftCardAmount(2000))).toBe("2 000 kr");
  });

  it("never renders the SEK/decimal invoice-style format", () => {
    const label = formatGiftCardAmount(1500);
    expect(label).not.toMatch(/SEK/);
    expect(label).not.toMatch(/\.\d\d$/);
  });
});

describe("createGiftCardContent", () => {
  const baseOrder = {
    order_reference: "ED-2026-109180",
    amount: 1500,
    requested_treatment: null,
    recipient_name: null,
    message: null,
    customer_email: "buyer@example.com",
    delivery_target: "customer" as const,
    recipient_email: null,
  };

  it("carries only privacy-safe presentation fields, never buyer contact details", () => {
    const content = createGiftCardContent(baseOrder);
    expect(content).not.toHaveProperty("customer_email");
    expect(content).not.toHaveProperty("customer_name");
    expect(content).not.toHaveProperty("customer_phone");
    expect(content.orderReference).toBe("ED-2026-109180");
    expect(normalizeSpaces(content.amountLabel)).toBe("1 500 kr");
  });

  it("keeps optional fields null when absent, ready for the caller to skip rendering them", () => {
    const content = createGiftCardContent(baseOrder);
    expect(content.recipientName).toBeNull();
    expect(content.message).toBeNull();
    expect(content.requestedTreatment).toBeNull();
  });

  it("carries optional fields through when present", () => {
    const content = createGiftCardContent({
      ...baseOrder,
      recipient_name: "Anna",
      message: "Grattis på födelsedagen!",
      requested_treatment: "Icoone",
    });
    expect(content.recipientName).toBe("Anna");
    expect(content.message).toBe("Grattis på födelsedagen!");
    expect(content.requestedTreatment).toBe("Icoone");
  });
});
