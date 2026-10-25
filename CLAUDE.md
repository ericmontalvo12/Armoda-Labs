# CLAUDE.md — Armoda Labs

## Read this first

This repo was cloned from **Rock Mountain Performance**, a single-product
testosterone supplement store, and is being converted into **Armoda Labs**, a
**multi-product research peptide** brand. The two businesses differ in product
category, regulatory posture, payment processing and page architecture, so
inherited code is guilty until proven innocent.

Assume any Rock Mountain copy, claim, identifier or product assumption you find
is wrong for Armoda Labs. Three compliance questions below are still open and
**gate the storefront build** — do not treat the inherited checkout, ads
tracking or supplement framing as settled.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Database:** Neon Postgres via `@neondatabase/serverless` (`DATABASE_URL` or `POSTGRES_URL`)
- **Payments:** Stripe today — **see "Open compliance decisions" before building on it**
- **CRM/Email/SMS:** GoHighLevel (LeadConnector) via webhooks
- **Analytics:** Meta Pixel + Conversions API, currently **disabled** (see below)
- **Hosting:** Vercel

## Open compliance decisions (blocking)

These three are unresolved. Do not build storefront or checkout features that
assume an answer; ask first.

1. **Payment processor.** Stripe's restricted business list covers unapproved
   pharmaceuticals, and peptide vendors are routinely terminated — often with a
   funds hold. The entire checkout path is Stripe. A processor must be
   confirmed before the catalog ships. The checkout *mechanics* (embedded
   session → webhook → DB) are worth keeping; the *provider* may not be.
2. **Meta advertising.** Meta prohibits peptides, so the pixel, Conversions API
   and ads strategy do not transfer. The tracking code is left in place but
   **inert**: `FB_PIXEL_ID` now reads `NEXT_PUBLIC_FB_PIXEL_ID`, which is unset,
   so `MetaPixel` renders nothing and `meta-capi.ts` short-circuits. Do not
   hardcode a pixel ID. A compliant analytics destination still needs choosing.
3. **Supplement framing.** The site is shaped like a dietary supplement:
   supplement facts panel, "30 Day Supply", dosing guidance, and a DSHEA FDA
   disclaimer in `components/Footer.tsx`. All of it is wrong for research
   peptides and parts of it are legally risky. The research-use positioning and
   its disclaimer language need to be decided before those pages are rewritten;
   the DSHEA disclaimer is **not** the right text and must not simply be
   carried over.

## Directory Layout

- `app/` — Pages and API routes (App Router). Each page in its own folder with `page.tsx`.
- `app/api/` — `checkout-embedded/`, `webhook/`, `reviews/`, `validate-promo/`,
  `contact/`, `portal/`, `portal-by-email/`, `checkout-session/`,
  `cart-activity/`, `email-subscribe/`, `site-auth/`, `admin/`.
- `components/` — `sections/` holds homepage sections, `ui/` shadcn-style primitives.
- `lib/` — `orders-db.ts` + `reviews-db.ts` (Neon), `cart-context.tsx`,
  `promo-codes.ts`, `shipping.ts`, `blog-posts.ts`, `fbpixel.ts` + `meta-capi.ts`
  (inert), `sale.ts` (**single-SKU legacy — being replaced**).
- `public/` — Product imagery was deleted in the fork (~182MB) and needs
  replacing. `public/email/` holds 14 HTML templates — **keep and rebrand these,
  do not rebuild**; they are already debugged for Gmail dark mode, Outlook and
  DMARC.

## Architecture: single-product → catalog

The inherited app is hardcoded to one SKU. This is the main build:

- `lib/sale.ts` prices by *quantity of one product* (`getPricePerBottle`,
  `REGULAR_TOTALS`, `SALE_TOTALS`) — needs replacing with per-SKU pricing.
- There is one `/product` page with bundles hardcoded in `ProductPageClient.tsx`
  — needs `/products` (listing) and `/products/[slug]` (detail) routes backed by
  a product catalog.
- `app/api/checkout-embedded/route.ts` recomputes price server-side from that
  single function and hard-rejects any item not named `"Peak Performance"`
  (~line 118). Server-side price authority must be preserved per SKU: **never
  trust a price sent by the client.**
- Admin needs per-line-item display. The `orders.line_items` JSONB column
  already exists, so this is a read/render change, not a schema change.

## What survives unchanged

Stripe embedded checkout *mechanics*, the webhook → Neon → GoHighLevel → Meta
CAPI pipeline shape, cart context, reviews with photo upload, admin orders CRUD,
promo codes, and the blog engine.

## Key Config Locations

- **Checkout creation:** `app/api/checkout-embedded/route.ts` (primary, embedded
  UI mode, one-time + subscription). `app/api/checkout/route.ts` is legacy redirect mode.
- **Webhook:** `app/api/webhook/route.ts` — `checkout.session.completed`, saves
  to Neon, forwards to GoHighLevel, sends Purchase to Meta CAPI (now inert).
- **DB schema:** auto-created by `ensureTables()` in `lib/orders-db.ts` (orders,
  admin_login_attempts) and `lib/reviews-db.ts` (reviews). No migration tool —
  additive `ALTER TABLE ... IF NOT EXISTS` only.
- **Canonical origin:** `SITE_URL` in `app/layout.tsx`. Currently the placeholder
  `https://www.armodalabs.com` — confirm the real production domain.

## Error Handling Pattern

API routes use `try { ... } catch (err: any) { console.error(...); return
NextResponse.json({ error: ... }, { status: 500 }) }`. Validate input and return
400 early. The webhook wraps DB saves and GoHighLevel calls in separate
try/catch so one failure doesn't block the others. `meta-capi.ts` never throws —
tracking must not break order processing.

## Copy conventions

- **US English.** Armoda is a US business dealing with the FDA and FTC:
  program, organization, labeling, lyophilized, center, fulfillment. An
  earlier pass wrote the site in British spellings and had to be converted.
- Product and policy copy states facts about the operation — testing,
  documentation, handling — never an effect on a person.
- **"Independently tested", not "assayed".** Plain language in customer-facing
  copy; "assay" is jargon that makes the trust claim harder to scan. The site
  previously used three phrasings for the same thing (third-party assayed,
  independently assayed, third-party tested), which read as unconsidered for
  the brand's central claim.

## Constraints

- **Never write copy claiming a therapeutic or performance effect of a peptide**,
  and never use "clinically proven", "guaranteed results", or consumer dosing
  guidance. Study results belong to the cited study, not to an Armoda product.
- **Do not carry over Rock Mountain's supplement disclaimers as-is.** The DSHEA
  FDA disclaimer in `components/Footer.tsx` is wrong for research peptides;
  replace it deliberately as part of decision 3, not by copy-paste.
- **Do not reintroduce Rock Mountain identifiers** — the Meta pixel ID, the
  `rockmountainperformance.com` origin, or its facebook-domain-verification
  token. They route Armoda traffic into another brand's accounts.
- **Ask before changing the checkout path** (`app/api/checkout*/`,
  `app/api/webhook/`, `components/EmbeddedCheckout.tsx`,
  `components/CheckoutButton.tsx`).
- **Ask before changing DB schema** (`lib/orders-db.ts`, `lib/reviews-db.ts`).
- Brand text still says "Rock Mountain Performance" across pages, email
  templates and legal copy. That rebrand pass is pending; don't assume a file is
  already converted.
