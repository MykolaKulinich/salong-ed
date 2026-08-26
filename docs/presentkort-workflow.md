# Presentkort workflow

The presentkort form creates an order with status waiting_payment and returns
only its human-readable order_reference to the browser. It does not generate
or send a gift card when the form is submitted.

## Manual payment phase

1. Add the migration in supabase/migrations/0001_gift_card_orders.sql to the
   intended Supabase project manually.
2. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY only in the
   server environment.
3. Build an authenticated /admin/presentkort view before exposing owner
   actions. It should list orders and call confirmGiftCardPayment(orderId) only
   after Ewelina has verified the Swish payment.
4. The confirmation helper uses a compare-and-set transition from
   waiting_payment to paid. It then sends the gift card to the selected
   address and records delivered only after a provider confirms success.
   Provider failure is recorded as delivery_failed.

The customer-facing flow should display the order reference as the future Swish
message, for example ED-2026-00124. A Swish number is intentionally not stored
in this repository; it must be verified business data before being added to
payment instructions.

## Email and gift-card rendering

src/lib/gift-card.ts contains the private-data-free gift-card representation.
src/lib/gift-card-email.ts is the server-only provider boundary. It currently
does not make a network call, even if environment variables are present. A
future Resend (or equivalent) implementation should be added there with a
verified sender, an HTML gift-card email, and optionally a PDF attachment.

Before enabling payment confirmation in production:

- add Supabase Auth and protect the admin route and all state-changing actions;
- keep the service-role key server-only;
- configure a verified email sender and retry/observability policy;
- test that an order can never move directly to delivered from the public form;
- decide how retries handle a provider timeout after the provider may have sent;
- verify the Swish number, payment instructions, and business terms.
