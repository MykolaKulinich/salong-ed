import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_MESSAGE_LENGTH } from "./gift-card";

const sendTransactionalEmailMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/brevo", () => ({
  sendTransactionalEmail: sendTransactionalEmailMock,
}));

const { buildNewGiftCardOrderNotification, sendNewGiftCardOrderNotification } = await import(
  "./gift-card-notification"
);

const baseOrder = {
  id: "6f8c0e2a-4f47-4f67-9e0d-2b4f5e6a7c89",
  order_reference: "ED-2026-109180",
  amount: 1500,
  status: "waiting_payment" as const,
  customer_name: "Anna Andersson",
  customer_email: "buyer@example.com",
  customer_phone: "+46701234567",
  requested_treatment: null,
  recipient_name: null,
  message: null,
  delivery_target: "customer" as const,
  recipient_email: null,
};

const originalNotificationEmail = process.env.PRESENTKORT_NOTIFICATION_EMAIL;

beforeEach(() => {
  delete process.env.PRESENTKORT_NOTIFICATION_EMAIL;
  sendTransactionalEmailMock.mockReset();
  sendTransactionalEmailMock.mockResolvedValue({ ok: true });
});

afterEach(() => {
  if (originalNotificationEmail === undefined) {
    delete process.env.PRESENTKORT_NOTIFICATION_EMAIL;
  } else {
    process.env.PRESENTKORT_NOTIFICATION_EMAIL = originalNotificationEmail;
  }
});

describe("buildNewGiftCardOrderNotification", () => {
  it("renders the internal order details, production admin link, and safe optional fields", () => {
    const payload = buildNewGiftCardOrderNotification({
      ...baseOrder,
      requested_treatment: "Ansiktsbehandling",
      recipient_name: "Långa Namnet",
      message: "Grattis!\nVi ses snart.",
      delivery_target: "recipient",
      recipient_email: "recipient@example.com",
    });

    expect(payload.subject).toBe("Ny presentkortsbeställning – ED-2026-109180");
    expect(payload.subject).not.toContain("buyer@example.com");
    expect(payload.html).toContain("Salong ED");
    expect(payload.html).toContain("Ansiktsbehandling");
    expect(payload.html).toContain("recipient@example.com");
    expect(payload.html).toContain("Grattis!<br />Vi ses snart.");
    expect(payload.text).toContain("Status: Väntar på betalning");
    expect(payload.text).toContain("Öppna i admin: https://www.salongewelinadubowska.com/admin/presentkort/");
  });

  it("escapes HTML and clips the stored message to the public validation limit", () => {
    const message = `<script>alert("x")</script>${"x".repeat(MAX_MESSAGE_LENGTH)}`;
    const payload = buildNewGiftCardOrderNotification({ ...baseOrder, message });

    expect(payload.html).not.toContain("<script>");
    expect(payload.html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(payload.text).toContain(message.slice(0, MAX_MESSAGE_LENGTH));
    expect(payload.text).not.toContain(message);
  });

  it("omits optional fields when they are absent", () => {
    const payload = buildNewGiftCardOrderNotification(baseOrder);

    expect(payload.html).not.toContain("Önskad behandling");
    expect(payload.html).not.toContain("Mottagare");
    expect(payload.html).not.toContain("Hälsning");
    expect(payload.text).not.toContain("Önskad behandling:");
    expect(payload.text).not.toContain("Mottagare:");
    expect(payload.text).not.toContain("Hälsning:");
  });
});

describe("sendNewGiftCardOrderNotification", () => {
  it("does not call Brevo when the internal recipient is not configured", async () => {
    const result = await sendNewGiftCardOrderNotification(baseOrder);

    expect(result).toEqual({ ok: false, reason: "not_configured" });
    expect(sendTransactionalEmailMock).not.toHaveBeenCalled();
  });

  it("sends exactly one internal notification when configured", async () => {
    process.env.PRESENTKORT_NOTIFICATION_EMAIL = "ewelina@example.com";

    const result = await sendNewGiftCardOrderNotification(baseOrder);

    expect(result).toEqual({ ok: true });
    expect(sendTransactionalEmailMock).toHaveBeenCalledTimes(1);
    expect(sendTransactionalEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "ewelina@example.com",
        subject: "Ny presentkortsbeställning – ED-2026-109180",
      }),
    );
  });

  it("reports provider failure without throwing", async () => {
    process.env.PRESENTKORT_NOTIFICATION_EMAIL = "ewelina@example.com";
    sendTransactionalEmailMock.mockResolvedValue({ ok: false, reason: "request_failed" });

    await expect(sendNewGiftCardOrderNotification(baseOrder)).resolves.toEqual({
      ok: false,
      reason: "send_failed",
    });
  });
});
