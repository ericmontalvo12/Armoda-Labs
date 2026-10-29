-- Two test orders for armoda-test-20261026@example.com, so /account and
-- /account/orders/[id] can be seen with real data.
--
-- Run in the Neon console for armoda-labs-prod. Safe to run twice: the
-- stripe_session_id values are unique and the ON CONFLICT does nothing.
--
-- DELETE THEM BEFORE LAUNCH. They count toward the dashboard's "total spent"
-- and would appear in admin alongside real orders:
--   DELETE FROM orders WHERE stripe_session_id LIKE 'cs_test_armoda_%';

INSERT INTO orders (
  stripe_session_id, email, customer_name, amount_total, currency,
  payment_status, shipping_name, address_line1, city, state, postal_code,
  country, line_items, status, carrier, tracking_number, created_at
) VALUES
(
  'cs_test_armoda_fulfilled_001',
  'armoda-test-20261026@example.com',
  'Test Applicant',
  248.50, 'usd', 'paid',
  'Test Applicant', '5108 SW 138th Avenue Circle', 'Miami', 'FL', '33175', 'US',
  '[{"description":"BPC-157 — 5mg","quantity":2,"amountTotal":119.00},
    {"description":"Epitalon — 10mg","quantity":1,"amountTotal":117.55}]'::jsonb,
  'fulfilled', 'USPS', '9400111899223197428490',
  now() - interval '9 days'
),
(
  'cs_test_armoda_processing_002',
  'armoda-test-20261026@example.com',
  'Test Applicant',
  94.00, 'usd', 'paid',
  'Test Applicant', '5108 SW 138th Avenue Circle', 'Miami', 'FL', '33175', 'US',
  '[{"description":"KPV — 10mg","quantity":1,"amountTotal":94.00}]'::jsonb,
  'unfulfilled', NULL, NULL,
  now() - interval '2 days'
)
ON CONFLICT (stripe_session_id) DO NOTHING;
