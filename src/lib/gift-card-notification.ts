import "server-only";

import { sendTransactionalEmail } from "@/lib/brevo";
import { formatDeliveryDestination } from "@/lib/admin-format";
import { formatGiftCardAmount, GIFT_CARD_STATUS_LABELS, MAX_MESSAGE_LENGTH } from "@/lib/gift-card";
import type { GiftCardOrderRow } from "@/lib/gift-card-orders";
import { absoluteUrl } from "@/lib/site";

export type NewGiftCardOrderNotification = Pick<
  GiftCardOrderRow,
  | "id"
  | "order_reference"
  | "amount"
  | "status"
  | "customer_name"
  | "customer_email"
  | "customer_phone"
  | "requested_treatment"
  | "recipient_name"
  | "message"
  | "delivery_target"
  | "recipient_email"
>;

export const NEW_GIFT_CARD_ORDER_NOTIFICATION_COLUMNS =
  "id, order_reference, amount, status, customer_name, customer_email, customer_phone, requested_treatment, recipient_name, message, delivery_target, recipient_email";

export type GiftCardNotificationPayload = {
  subject: string;
  html: string;
  text: string;
};

export type GiftCardNotificationResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "send_failed" };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function clipMessage(message: string | null): string | null {
  if (!message) return null;
  return message.slice(0, MAX_MESSAGE_LENGTH);
}

function renderHtmlRow(label: string, value: string, multiline = false): string {
  const escapedValue = multiline ? escapeHtmlMultiline(value) : escapeHtml(value);
  return `<tr>
    <td style="padding:8px 12px 8px 0;vertical-align:top;color:#726b60;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;vertical-align:top;color:#211d18;overflow-wrap:anywhere;">${escapedValue}</td>
  </tr>`;
}

export function buildNewGiftCardOrderNotification(order: NewGiftCardOrderNotification): GiftCardNotificationPayload {
  const orderReference = order.order_reference.trim();
  const status = GIFT_CARD_STATUS_LABELS[order.status];
  const amount = formatGiftCardAmount(order.amount);
  const delivery = formatDeliveryDestination(order);
  const message = clipMessage(order.message);
  const adminUrl = absoluteUrl(`/admin/presentkort/${encodeURIComponent(order.id)}`);

  const optionalHtmlRows = [
    order.requested_treatment ? renderHtmlRow("Önskad behandling", order.requested_treatment) : "",
    order.recipient_name ? renderHtmlRow("Mottagare", order.recipient_name) : "",
    message ? renderHtmlRow("Hälsning", message, true) : "",
    renderHtmlRow("Levereras till", delivery),
  ].join("");

  const optionalTextLines = [
    order.requested_treatment ? `Önskad behandling: ${order.requested_treatment}` : "",
    order.recipient_name ? `Mottagare: ${order.recipient_name}` : "",
    message ? `Hälsning: ${message}` : "",
    `Levereras till: ${delivery}`,
  ].filter(Boolean);

  return {
    subject: `Ny presentkortsbeställning – ${orderReference}`,
    html: `<!doctype html>
<html lang="sv">
  <body style="margin:0;background:#f1ece4;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;color:#211d18;">
    <main style="max-width:640px;margin:0 auto;background:#faf7f2;padding:32px;">
      <p style="margin:0;color:#a98a5c;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Salong ED</p>
      <h1 style="margin:12px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:normal;">Ny presentkortsbeställning</h1>
      <p style="margin:0;color:#726b60;">En ny beställning väntar på betalningsbekräftelse.</p>
      <table style="width:100%;margin:28px 0 24px;border-collapse:collapse;border-top:1px solid #d8c9a8;border-bottom:1px solid #d8c9a8;font-size:14px;">
        ${renderHtmlRow("Beställningsnummer", orderReference)}
        ${renderHtmlRow("Status", status)}
        ${renderHtmlRow("Belopp", amount)}
        ${renderHtmlRow("Kund", order.customer_name)}
        ${renderHtmlRow("Telefon", order.customer_phone)}
        ${renderHtmlRow("E-post", order.customer_email)}
        ${optionalHtmlRows}
      </table>
      <p style="margin:0 0 24px;"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#211d18;color:#fff;padding:12px 18px;text-decoration:none;">Öppna beställningen i admin</a></p>
      <p style="margin:0;color:#726b60;font-size:12px;line-height:1.5;">Detta är en intern notifiering till Salong ED. Ingen kund eller mottagare kontaktas av detta meddelande.</p>
    </main>
  </body>
</html>`,
    text: [
      "SALONG ED",
      "",
      "Ny presentkortsbeställning",
      "",
      `Beställningsnummer: ${orderReference}`,
      `Status: ${status}`,
      `Belopp: ${amount}`,
      `Kund: ${order.customer_name}`,
      `Telefon: ${order.customer_phone}`,
      `E-post: ${order.customer_email}`,
      ...optionalTextLines,
      "",
      `Öppna i admin: ${adminUrl}`,
    ].join("\n"),
  };
}

/**
 * Best-effort internal notification for a newly persisted order. A missing
 * recipient or Brevo failure never affects the order-creation response.
 */
export async function sendNewGiftCardOrderNotification(
  order: NewGiftCardOrderNotification,
): Promise<GiftCardNotificationResult> {
  const recipient = process.env.PRESENTKORT_NOTIFICATION_EMAIL?.trim();
  if (!recipient) return { ok: false, reason: "not_configured" };

  try {
    const { subject, html, text } = buildNewGiftCardOrderNotification(order);
    const result = await sendTransactionalEmail({
      to: recipient,
      subject,
      html,
      text,
    });

    return result.ok ? { ok: true } : { ok: false, reason: "send_failed" };
  } catch {
    return { ok: false, reason: "send_failed" };
  }
}
