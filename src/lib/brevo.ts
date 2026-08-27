import "server-only";

export type EmailAttachment = {
  filename: string;
  content: Uint8Array;
  contentType?: string;
};

export type SendTransactionalEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
};

export type SendTransactionalEmailResult =
  | { ok: true; messageId?: string }
  | { ok: false; reason: "not_configured" | "request_failed" };

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/**
 * Server-only Brevo transactional email transport. Used by
 * lib/gift-card-delivery.ts to send the confirmed gift-card email (with its
 * PDF attached), and by one-off manual transport verification scripts
 * (scripts/send-test-email.mjs, scripts/send-test-gift-card-email.mjs).
 *
 * Fails safely (returns ok:false) if any Brevo env var is missing — never
 * throws for a missing/misconfigured provider. Never logs the API key, the
 * recipient address, customer PII, attachment content/base64, or any
 * request/response body — only a generic, non-identifying outcome.
 */
export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: SendTransactionalEmailInput): Promise<SendTransactionalEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME;

  if (!apiKey || !fromEmail || !fromName) {
    return { ok: false, reason: "not_configured" };
  }

  // Brevo-specific formatting (its `attachment` field wants base64 content
  // under `name`/`content`, no separate content-type) stays contained here
  // — domain code only ever deals with the generic {filename, content,
  // contentType} shape.
  const attachment = attachments?.map(({ filename, content }) => ({
    name: filename,
    content: Buffer.from(content).toString("base64"),
  }));

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
        ...(attachment && attachment.length > 0 ? { attachment } : {}),
      }),
    });

    if (!response.ok) {
      console.error(`Brevo transactional email request failed (status ${response.status}).`);
      return { ok: false, reason: "request_failed" };
    }

    const data = (await response.json().catch(() => null)) as { messageId?: string } | null;
    return { ok: true, messageId: data?.messageId };
  } catch {
    console.error("Brevo transactional email request threw an error.");
    return { ok: false, reason: "request_failed" };
  }
}
