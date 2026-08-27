import { describe, expect, it } from "vitest";
import { resolveGiftCardDeliveryEmail } from "./gift-card-delivery";

describe("resolveGiftCardDeliveryEmail", () => {
  it("resolves to the customer's email when delivery_target is customer", () => {
    const email = resolveGiftCardDeliveryEmail({
      delivery_target: "customer",
      customer_email: "buyer@example.com",
      recipient_email: null,
    });
    expect(email).toBe("buyer@example.com");
  });

  it("resolves to the recipient's email when delivery_target is recipient", () => {
    const email = resolveGiftCardDeliveryEmail({
      delivery_target: "recipient",
      customer_email: "buyer@example.com",
      recipient_email: "anna@example.com",
    });
    expect(email).toBe("anna@example.com");
  });

  it("fails rather than silently falling back to the customer's email when recipient_email is missing", () => {
    const email = resolveGiftCardDeliveryEmail({
      delivery_target: "recipient",
      customer_email: "buyer@example.com",
      recipient_email: null,
    });
    expect(email).toBeNull();
    expect(email).not.toBe("buyer@example.com");
  });
});
