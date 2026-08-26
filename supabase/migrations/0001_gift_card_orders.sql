create extension if not exists pgcrypto;

create table if not exists public.gift_card_orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  created_at timestamptz not null default now(),
  amount integer not null,
  requested_treatment text,
  recipient_name text,
  message text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_target text not null default 'customer',
  recipient_email text,
  status text not null default 'waiting_payment',
  paid_at timestamptz,
  delivered_at timestamptz,
  constraint gift_card_orders_amount_check check (amount between 100 and 100000),
  constraint gift_card_orders_status_check check (
    status in ('waiting_payment', 'paid', 'delivered', 'cancelled', 'delivery_failed', 'contacted')
  ),
  constraint gift_card_orders_delivery_target_check check (delivery_target in ('customer', 'recipient')),
  constraint gift_card_orders_delivery_email_check check (
    (delivery_target = 'customer' and recipient_email is null)
    or (delivery_target = 'recipient' and recipient_email is not null)
  ),
  constraint gift_card_orders_requested_treatment_check check (
    requested_treatment is null or char_length(requested_treatment) <= 100
  ),
  constraint gift_card_orders_customer_name_check check (char_length(customer_name) between 1 and 120),
  constraint gift_card_orders_customer_email_check check (char_length(customer_email) between 3 and 254),
  constraint gift_card_orders_customer_phone_check check (char_length(customer_phone) between 7 and 40),
  constraint gift_card_orders_message_check check (message is null or char_length(message) <= 500),
  constraint gift_card_orders_recipient_name_check check (recipient_name is null or char_length(recipient_name) <= 120),
  constraint gift_card_orders_recipient_email_check check (recipient_email is null or char_length(recipient_email) between 3 and 254)
);

alter table public.gift_card_orders enable row level security;

-- All reads and state changes go through authenticated server code. The
-- service-role client used by the API bypasses RLS; browser roles get nothing.
revoke all on table public.gift_card_orders from anon, authenticated;
