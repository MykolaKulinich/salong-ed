/**
 * Developer-only, one-off Brevo transport check. Sends the fixed test email
 * below to a single recipient you provide — never wired into the app, and
 * never triggered automatically by anything.
 *
 * This intentionally re-implements the same small Brevo request as
 * src/lib/brevo.ts rather than importing it: that module starts with
 * `import "server-only"`, which unconditionally throws outside a Next.js
 * build (by design — so a client bundle can never pull in the Brevo API
 * key). That makes it unimportable from a plain Node script, so this file
 * stays a small, self-contained mirror of the same request shape. If that
 * shape ever changes, update both.
 *
 * Usage (recipient as an argument):
 *   node --env-file=.env.local scripts/send-test-email.mjs you@example.com
 *
 * Usage (recipient via env var):
 *   BREVO_TEST_TO_EMAIL=you@example.com node --env-file=.env.local scripts/send-test-email.mjs
 */

const to = process.argv[2] || process.env.BREVO_TEST_TO_EMAIL;

if (!to) {
  console.error(
    "No recipient given. Pass one as an argument or set BREVO_TEST_TO_EMAIL.\n" +
      "  node --env-file=.env.local scripts/send-test-email.mjs you@example.com",
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
      "  node --env-file=.env.local scripts/send-test-email.mjs you@example.com",
  );
  process.exit(1);
}

const SUBJECT = "Salong ED – test av presentkortsleverans";

const HTML = `<!doctype html>
<html lang="sv">
  <body style="margin:0;padding:32px 16px;background:#faf7f2;font-family:Georgia,'Times New Roman',serif;color:#211d18;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border:1px solid #e6e0d4;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:32px 32px 4px 32px;text-align:center;">
                <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#a98a5c;">Salong ED</p>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 32px 24px 32px;text-align:center;">
                <h1 style="margin:0;font-size:22px;font-weight:normal;color:#211d18;">Test av presentkortsleverans</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#211d18;">
                <p style="margin:0 0 16px 0;">Det här är ett tekniskt test av Salong ED:s nya presentkortssystem.</p>
                <p style="margin:0 0 24px 0;">Om du ser detta fungerar e-postleveransen via Brevo.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px 32px;border-top:1px solid #e6e0d4;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#726b60;">
                Salong ED
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const TEXT = [
  "SALONG ED",
  "",
  "Test av presentkortsleverans",
  "",
  "Det här är ett tekniskt test av Salong ED:s nya presentkortssystem.",
  "Om du ser detta fungerar e-postleveransen via Brevo.",
  "",
  "Salong ED",
].join("\n");

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
      subject: SUBJECT,
      htmlContent: HTML,
      textContent: TEXT,
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
  console.log("Test email sent via Brevo.");
  if (data.messageId) console.log(`messageId: ${data.messageId}`);
} catch (error) {
  console.error("Request to Brevo failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
