# Vercel setup

Every variable the app reads, what breaks without it, and the order to do
things in. Generated from a grep of `process.env` across `app/`, `lib/`,
`components/` and `middleware.ts` — if you add a variable to the code, add it
here too.

## 1. Database

Vercel Postgres is Neon. Create it from the Vercel dashboard:

**Storage → Create Database → Neon (Postgres)**, then connect it to the
project. Vercel injects the connection strings automatically — you do not
type them in by hand.

The code reads `DATABASE_URL || POSTGRES_URL`, so whichever naming the
integration uses, it works.

Connect the database to **Production, Preview and Development**. A preview
deploy without a database throws on the first query.

### No migration step

Tables are created on first use by `ensureTables()` in `lib/orders-db.ts`,
`lib/reviews-db.ts` and `lib/customers-db.ts`, using `CREATE TABLE IF NOT
EXISTS` and `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. There is no migration
tool and nothing to run after deploy. The first request that touches a table
creates it.

> Note: preview deploys share the production database unless you create a
> separate one. That means test orders land in the real `orders` table, which
> is also what the referral commission query sums. If you are going to click
> through test checkouts, make a second Neon database for Preview.

## 2. Secrets to generate

Generate each one separately — do not reuse a value across two variables:

```
openssl rand -base64 48
```

| Variable | Needed for | Minimum |
|---|---|---|
| `ADMIN_SESSION_SECRET` | signs the admin session cookie | 32 chars, enforced |
| `CUSTOMER_SESSION_SECRET` | signs the customer session cookie | 32 chars, enforced |
| `ADMIN_PASSWORD` | the single shared admin login | your choice |

Both session secrets are checked at use time and **throw** if missing or
shorter than 32 characters. `ADMIN_SESSION_SECRET` is read inside
`middleware.ts`, so without it every `/admin` request fails, not just login.

Changing either secret invalidates all existing sessions for that side.
That is the logout-everyone lever if you ever need it.

## 3. Required variables

Set these in **Settings → Environment Variables** for Production (and Preview
if you want previews to work).

| Variable | Consequence if unset |
|---|---|
| `DATABASE_URL` or `POSTGRES_URL` | every DB query throws (set by the Neon integration) |
| `ADMIN_SESSION_SECRET` | all of `/admin` and `/api/admin` returns an error |
| `CUSTOMER_SESSION_SECRET` | register, login and `/account` all throw |
| `ADMIN_PASSWORD` | admin login always rejects |
| `STRIPE_SECRET_KEY` | checkout and the webhook throw |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | the embedded checkout iframe never mounts |
| `STRIPE_WEBHOOK_SECRET` | the webhook 400s on signature verification, so **no order is ever saved** |
| `NEXT_PUBLIC_SITE_URL` | checkout creation and the billing portal throw |

`NEXT_PUBLIC_SITE_URL` is the full origin with scheme and no trailing slash,
e.g. `https://www.armodalabs.com`. It is used for Stripe return URLs, so a
wrong value sends paying customers to a dead page.

It is deliberately separate from `SITE_URL` in `app/layout.tsx`, which is a
hardcoded constant used for canonical tags, the sitemap and JSON-LD. Both
currently say `www.armodalabs.com`. **Confirm that is the real production
domain** — it is still a placeholder.

## 4. Optional variables

Each one degrades a feature rather than breaking the app.

| Variable | Without it |
|---|---|
| `SITE_PASSWORD` | the site-wide password gate is **off** and the site is public. Set it during pre-launch; `/api/site-auth` returns `{ok:true}` to everyone when it is unset. |
| `STRIPE_SUBSCRIPTION_PRICE_ID` | subscription checkout fails; one-time checkout is unaffected |
| `PROMO_CODES_JSON` | falls back to the codes compiled into `lib/promo-codes.ts` |
| `GHL_ORDER_WEBHOOK_URL` | no order-confirmation email. Also used for renewals. |
| `GHL_SUBSCRIBER_WELCOME_WEBHOOK_URL` | no subscriber welcome email |
| `GHL_PAYMENT_FAILED_WEBHOOK_URL` | no dunning email on a declined card |
| `GHL_CANCELLATION_WEBHOOK_URL` | no cancellation-pending email |
| `GHL_SUBSCRIPTION_ENDED_WEBHOOK_URL` | no subscription-ended email |
| `GHL_EMAIL_WEBHOOK_URL` | newsletter signups are not forwarded |
| `GHL_CART_ABANDONMENT_WEBHOOK_URL` | no abandoned-cart email |
| `GHL_TRACKING_WEBHOOK_URL` | no shipment-tracking email |

Unset GoHighLevel URLs are skipped with a `console.warn`, not an error — by
design, so a CRM outage cannot block order processing. There is deliberately
no fallback URL: routing an unconfigured event type at the order-confirmation
workflow would email "your order shipped" to someone whose card just
declined.

## 5. Leave these alone

| Variable | Why |
|---|---|
| `NEXT_PUBLIC_FB_PIXEL_ID` | **Do not set.** Meta prohibits peptides. Unset keeps `MetaPixel` rendering nothing and `meta-capi.ts` short-circuiting. See decision 2 in CLAUDE.md. |
| `META_CAPI_ACCESS_TOKEN` | same — the Conversions API stays inert |
| `META_CAPI_TEST_EVENT_CODE` | only meaningful if the above are set |

## 6. Stripe webhook

Without this, payments succeed and **no order is recorded** — no DB row, no
confirmation email, no referral attribution. It is the single easiest thing
to forget.

In the Stripe dashboard: **Developers → Webhooks → Add endpoint**

- URL: `https://<your-domain>/api/webhook`
- Events:
  - `checkout.session.completed` — saves the order
  - `invoice.paid` — subscription renewals
  - `invoice.payment_failed` — dunning
  - `customer.subscription.updated` — cancellation scheduled
  - `customer.subscription.deleted` — subscription ended
  - `payment_intent.succeeded` — logged only

Copy the endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
Test and live mode have different signing secrets.

> The processor question in CLAUDE.md is still open. Stripe's restricted
> business list covers unapproved pharmaceuticals and peptide vendors are
> routinely terminated. Do not take this section as a decision that Stripe is
> the processor.

## 7. Domain

**Settings → Domains**, add the apex and `www`, point one at the other. Then
make sure `NEXT_PUBLIC_SITE_URL` and `SITE_URL` in `app/layout.tsx` both match
whichever you made canonical.

## 8. After the first deploy

1. Sign in at `/admin/login` with `ADMIN_PASSWORD`.
2. Register a test account at `/apply`.
3. Approve it at `/admin/accounts`, then approve its referral application and
   assign a code.
4. Place a test order with that code in the referral field.
5. Confirm the order appears at `/admin/orders` and the commission appears
   against the code at `/admin/accounts`.

If step 5 shows nothing, the webhook is the cause — check
**Stripe → Webhooks → your endpoint** for failed deliveries, then check the
Vercel function logs for `/api/webhook`.
