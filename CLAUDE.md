# CLAUDE.md — Rock Mountain Performance

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Database:** Neon Postgres via `@neondatabase/serverless` (connection string in `DATABASE_URL` or `POSTGRES_URL`)
- **Payments:** Stripe (embedded checkout via `@stripe/react-stripe-js`, webhooks, live keys in prod)
- **CRM/Email/SMS:** GoHighLevel (LeadConnector) via webhooks — order confirmation + email capture
- **Analytics:** Meta Pixel (browser) + Conversions API (server, from webhook)
- **Hosting:** Vercel

## Directory Layout

- `app/` — Pages and API routes (App Router). Each page in its own folder with `page.tsx`.
- `app/api/` — Server routes: `checkout/`, `checkout-embedded/`, `webhook/`, `reviews/`, `validate-promo/`, `contact/`, `portal/`, `portal-by-email/`, `checkout-session/`, `cart-activity/`, `admin/` (orders CRUD, login, backfill).
- `components/` — React components. `sections/` holds homepage sections (Hero, WhyMostFail, etc.). `ui/` has shadcn-style primitives.
- `lib/` — Shared logic: `sale.ts` (pricing/timing), `orders-db.ts` + `reviews-db.ts` (Neon queries), `fbpixel.ts` + `meta-capi.ts` (tracking), `cart-context.tsx` (client cart in localStorage), `shipping.ts` (carrier config), `promo-codes.ts`.
- `public/` — Static assets (product images, ingredient photos, trust badges, blog images).

## Key Config Locations

- **Pricing & bundles:** `lib/sale.ts` — `SALE_END` date, `REGULAR_TOTALS`, `SALE_TOTALS`, `getPricePerBottle()`. Enforced server-side in `app/api/checkout-embedded/route.ts` (price is recomputed from quantity, not trusted from client).
- **Stripe checkout creation:** `app/api/checkout-embedded/route.ts` (primary — embedded UI mode, handles both one-time and subscription). `app/api/checkout/route.ts` (legacy redirect mode).
- **Stripe webhook:** `app/api/webhook/route.ts` — handles `checkout.session.completed`, saves order to Neon, forwards to HighLevel, sends Purchase to Meta CAPI.
- **DB schema:** Auto-created via `ensureTables()` in `lib/orders-db.ts` (orders, admin_login_attempts) and `lib/reviews-db.ts` (reviews). No migration tool.

## Meta Pixel Events

| Event | Where | Trigger |
|-------|-------|---------|
| PageView | `components/MetaPixel.tsx` | Every route change |
| ViewContent | `app/product/page.tsx` | Product page load |
| AddToCart | `lib/cart-context.tsx` | `addToCart()` called |
| InitiateCheckout | `app/product/page.tsx` + `components/CheckoutButton.tsx` | Buy Now / Complete Purchase click |
| Purchase (browser) | `app/success/page.tsx` | Success page load (deduplicated by session_id) |
| Purchase (server) | `app/api/webhook/route.ts` via `lib/meta-capi.ts` | Stripe webhook (reliable path; shares event_id with browser for dedup) |

## Error Handling Pattern

API routes use `try { ... } catch (err: any) { console.error(...); return NextResponse.json({ error: ... }, { status: 500 }) }`. Input validation returns 400 early. The webhook wraps DB saves and HighLevel calls in their own try/catch so a failure in one doesn't block the others. `meta-capi.ts` never throws — tracking failures must not break order processing.

## Constraints

- **Never remove or alter the FDA disclaimer or medical disclaimer in `components/Footer.tsx`.**
- **Never write copy that says "clinically proven", "guaranteed results", or claims Peak Performance raises testosterone.** Ingredient study results must be attributed to the cited study, not to the product.
- **Ask before changing anything in the Stripe checkout path** (`app/api/checkout*/`, `app/api/webhook/`, `components/EmbeddedCheckout.tsx`, `components/CheckoutButton.tsx`).
- **Ask before changing DB schema** (`lib/orders-db.ts`, `lib/reviews-db.ts`).
