/**
 * Developer-only: sends ONE synthetic gift-card delivery email — the real
 * rendered HTML/text (lib/gift-card-email-template.ts) and the real
 * generated PDF (lib/gift-card-pdf.ts) — to a recipient you provide. Uses
 * the fixed fixture data in scripts/gift-card-fixtures.mjs; never reads a
 * real order from Supabase, never triggered automatically.
 *
 * This mirrors the small Brevo request in src/lib/brevo.ts rather than
 * importing it, for the same reason as scripts/send-test-email.mjs: that
 * module starts with `import "server-only"`, which unconditionally throws
 * outside a Next.js build. The email/PDF content above, which is what this
 * script actually exists to verify, IS the real app code — only the raw
 * HTTP call to Brevo is re-implemented here.
 *
 * Usage:
 *   node --env-file=.env.local scripts/send-test-gift-card-email.mjs recipient@example.com
 *
 * Usage (recipient via env var):
 *   BREVO_TEST_TO_EMAIL=recipient@example.com node --env-file=.env.local scripts/send-test-gift-card-email.mjs
 */
import { renderGiftCardEmail } from "../src/lib/gift-card-email-template.ts";
import { generateGiftCardPdf, buildGiftCardPdfFilename } from "../src/lib/gift-card-pdf.ts";
import { FULL_FIXTURE } from "./gift-card-fixtures.mjs";

const to = process.argv[2] || process.env.BREVO_TEST_TO_EMAIL;

if (!to) {
  console.error(
    "No recipient given. Pass one as an argument or set BREVO_TEST_TO_EMAIL.\n" +
      "  node --env-file=.env.local scripts/send-test-gift-card-email.mjs you@example.com",
  );
  process.exit(1);
}

const apiKey = process.env.BREVO_API_KEY;
const fromEmail = process.env.BREVO_FROM_EMAIL;
const fromName = process.env.BREVO_FROM_NAME;

if (!apiKey || !fromEmail || !fromName) {
  console.error(
    "Missing BREVO_API_KEY, BREVO_FROM_EMAIL, or BREVO_FROM_NAME.\n" +
      "Run with --env-file=.env.local, e.g.:\n" +
      "  node --env-file=.env.local scripts/send-test-gift-card-email.mjs you@example.com",
  );
  process.exit(1);
}

const { subject, html, text } = renderGiftCardEmail(FULL_FIXTURE);
const pdfBytes = await generateGiftCardPdf(FULL_FIXTURE);
const filename = buildGiftCardPdfFilename(FULL_FIXTURE.orderReference);

console.log(`Rendered email + ${filename} (${pdfBytes.length} bytes). Sending...`);

try {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
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
      attachment: [{ name: filename, content: Buffer.from(pdfBytes).toString("base64") }],
    }),
  });

  if (!response.ok) {
    // Brevo's error body is a small {code, message} JSON object — no PII —
    // safe to print. The recipient address is never logged.
    const body = await response.text().catch(() => "");
    console.error(`Brevo request failed: HTTP ${response.status}`);
    if (body) console.error(body);
    process.exit(1);
  }

  const data = await response.json().catch(() => ({}));
  console.log("Synthetic gift-card email sent via Brevo.");
  if (data.messageId) console.log(`messageId: ${data.messageId}`);
} catch (error) {
  console.error("Request to Brevo failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
