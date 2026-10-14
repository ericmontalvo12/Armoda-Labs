# To-Do

---

## Armoda Labs — launch plan

Ordered by what blocks what, not by priority. The three gates on everything
else are: the **name**, a **supplier whose material passes blind testing**,
and **influencer/UGC content rules**.

**The tension to keep in view:** the marketing workstreams (6, 8, 9) are what
generate revenue, and are also what manufacture evidence of human-use intent
— which is what costs you the trademark (3) and the processor (5). Content
rules are not paperwork to do later; they are a precondition for the
marketing existing at all.

Not legal advice. Formation, trademark and labelling each need counsel.

---

### Website

- [ ] **Finish the website**
  - [x] Catalog model, `/products`, `/products/category/[slug]`, `/products/[slug]`
  - [x] Homepage, `/about`, `/how-to-pay`, `/how-to-profit`, `/help`, footer
  - [ ] Retire `/product` and `ProductPageClient.tsx` (the single-product path)
  - [ ] Dark-theme pass on legacy routes: `/cart`, `/success`, `/blog`, `/manage`
  - [ ] Rebrand `/terms-of-service`, `/privacy-policy`, `/refund-policy` —
        still Rock Mountain's, and where the real restrictions belong
  - [ ] Real prices per SKU and per variant (all currently `0` →
        "Price on request")
  - [ ] Decide fonts — Poppins/Outfit are inherited and wrong for the palette
  - [ ] Checkout rebuild once the processor is confirmed; price must be
        re-resolved server-side from `lib/catalog.ts`, never taken from the client

- [ ] **AI image mockups**
  - [ ] Vial renders per SKU — `public/` images were deleted (~182MB) and every
        card currently shows `product-placeholder.svg`
  - [ ] Label artwork mockups, which double as the supplier proof for item 7
  - [ ] Hero and lab/facility imagery for the homepage and `/about`
  - [ ] Keep renders consistent: one angle, one lighting setup, one background,
        or the grid looks like a marketplace rather than a brand
  - [ ] Do not render anything implying human use — no syringes staged for
        injection, no body imagery, no clinical-administration scenes

- [ ] **Add a "Popularity" sort to the shop page**
      `components/products/ProductsBrowser.tsx` omits it deliberately: there is
      no order data to rank by, and a sort that silently does nothing is worse
      than an absent one.
      **Blocked on:** order volume worth ranking.
      **When unblocked:** rank by units sold per SKU over a trailing window
      (not all-time, or new products can never surface), then make it default.

---

### 1. Name — blocks everything

- [ ] USPTO TESS conflict search, classes 1 and 5
- [ ] `.com` available, or pick again
- [ ] State business registry clear
- [ ] Social handles: IG, X, Reddit, Telegram, Discord
- [ ] Lock it, then set the real domain in `SITE_URL` (`app/layout.tsx`),
      currently the placeholder `https://www.armodalabs.com`

### 2. LLC

- [ ] Formation state (home state unless there is a reason — Delaware/Wyoming
      add foreign qualification and protect you from nothing here)
- [ ] Registered agent — not your home address, it becomes public
- [ ] EIN direct from the IRS, free, never pay a service
- [ ] Operating agreement, even single-member — banks and processors ask
- [ ] Business bank account
- [ ] Ask counsel about a two-entity split: IP holding company owns the brand
      and licenses it to the operating company, so the brand survives anything
      that happens to the operating entity

### 3. Trademark — expect a lawfulness problem

- [ ] Clearance search (start now, long lead time)
- [ ] Trademark attorney consult **specifically on registrability**

USPTO requires lawful use in commerce and refuses marks for goods unlawful
under federal law — settled in the CBD context (*In re Stanley Brothers*, Fed.
Cir. 2020). Research peptides are plausibly unapproved new drugs, so filing for
"peptides for research use" invites a refusal. Ask counsel about registering
for unambiguously lawful goods/services instead. Common-law rights exist from
use regardless of registration.

### 4. COAs and third-party testing — the actual product

- [ ] Blind-qualify 3–4 suppliers: order as an anonymous buyer, send samples to
      your own lab, compare. Expect at least one to come back off-spec. This is
      the step that separates vendors who last from vendors who don't
- [ ] Select an ISO 17025-accredited lab
- [ ] Price the panel: HPLC purity, mass spec identity, peptide content, water
      content, residual solvents (TFA), endotoxin if positioning warrants
- [ ] Build into unit economics — $150–400 per compound per lot, recurring,
      across 16 SKUs
- [ ] COA publishing workflow: PDF named by lot → lot printed on vial →
      `/lab-results` entry. The route exists; the discipline has to be real

Mass spec matters as much as purity: purity alone does not confirm identity.

### 5. Payment processing — have one, protect it

- [ ] Confirm rolling reserve percentage and hold period — this sets working capital
- [ ] Confirm chargeback threshold (usually ~0.9%); monitor weekly
- [ ] Get written answers on what triggers termination
- [ ] **Underwrite a backup processor before you need it.** Single processor is
      a single point of failure and termination in this category is routine
- [ ] Crypto as a secondary rail only — non-reversible, but a conversion killer
- [ ] Keep the site underwriteable: class-based categories, no efficacy claims,
      research-use notices. Processors re-review periodically

### 6. Influencer payouts — highest-risk item

- [ ] Payout model: coupon-code attribution by default (ties to the promo code
      infrastructure already built); flat fee for known quantities; 10–20% rev
      share for long-term partners
- [ ] **Contract terms, non-negotiable:** no human-use claims, no dosing, no
      before/after, no condition language, with examples of prohibited phrasing
- [ ] Pre-approval of content before posting
- [ ] FTC disclosure required — `#ad`, clear and conspicuous (16 CFR Part 255)
- [ ] Immediate termination and clawback for violation
- [ ] Keep an approved-content log
- [ ] Budget monitoring time, not just payouts

You are liable for what affiliates say. A creator improvising a testimonial has
made a drug claim with your name on it, and your processor may see it first.

### 7. Vial packaging

- [ ] Label must carry: "For Laboratory Research Use Only — Not for Human
      Consumption", compound name, net quantity, lot number, CAS where
      applicable, storage conditions, entity name and contact
- [ ] Label must NOT carry: dosing, reconstitution-for-injection instructions,
      any indication, or a pharmaceutical-looking presentation
- [ ] Negotiate: MOQ, tiered per-unit, tooling/plate fees, lead time, who holds
      the artwork
- [ ] Sample run and a physical proof before full production

The label travels, gets photographed, and is the artefact most likely to end up
as an enforcement exhibit.

### 8. Thank-you cards / UGC

- [ ] Reconsider the mechanic. Incentivised social posts are material
      connections requiring FTC disclosure, and Meta/TikTok prohibit this
      category — so driving customers to post branded vials there generates the
      content that gets your accounts banned and hands a reviewer a gallery of
      consumer use
- [ ] **Safer version of the same idea:** incentivise reviews on your own site
      (reviews with photo upload are already built). Same social proof, you
      control the surface, disclosure is manageable
- [ ] If social anyway: "no human-use content" printed on the card, and reject
      submissions showing it
- [ ] Card copy must itself carry the disclosure requirement

### 9. Marketing

- [ ] **Closed, do not spend time on:** Google Ads (Unapproved Substances
      policy), Meta and TikTok ads (prohibited category)
- [ ] **Open:** SEO/content (technical and handling only — articles are
      intended-use evidence), email (yours, unbannable, highest ROI, capture
      already built), Discord/Telegram (where the buyers are), influencer
      (primary paid channel by default since the others are closed), affiliate
- [ ] Reddit: organic reputation only. Most relevant subs ban vendor
      self-promotion, and astroturfing gets found — worse than nothing
- [ ] Allocation: influencer + Discord/Telegram for immediate volume, SEO and
      email as the compounding base, affiliate once creatives convert

---

### First 30 days, in order

1. [ ] Lock the name; buy domain and handles
2. [ ] File LLC, EIN, bank account
3. [ ] Trademark clearance search → attorney consult
4. [ ] Order blind samples from 3–4 suppliers *(start day 1 — longest lead time)*
5. [ ] Select lab, price the panel
6. [ ] Confirm processor reserve terms; start backup underwriting
7. [ ] Draft influencer content rules *(before any outreach)*
8. [ ] Packaging artwork → supplier proof
9. [ ] Sample results → select supplier → first production lot

Start today, because they gate everything downstream: **supplier samples** and
the **trademark clearance search**.

---

## Stale — Rock Mountain Performance

Everything below this line belongs to the brand this repo was forked from.
It references that site's domain, its single product, its sale dates and its
Vercel project. Kept for reference only; none of it is an Armoda task, and
several items are actively wrong for this project. Delete once the rebrand
pass is finished.

Things that need a human with account access. Tick them off as you go.

---

## 1. Submit the sitemap to Google Search Console

**What it means:** A sitemap is a list of every page on your site. It already
exists at https://www.rockmountainperformance.com/sitemap.xml (18 URLs). But
Google doesn't automatically know to look at it. Search Console is Google's
free dashboard for site owners, and submitting the sitemap there is how you
say "here is every page I have, please index them." Without this, Google
finds pages slowly and may miss the articles entirely.

**Steps:**
1. Go to https://search.google.com/search-console
2. Sign in with a Google account
3. Click **Add property** → choose the **URL prefix** box (the right-hand one)
4. Enter `https://www.rockmountainperformance.com` exactly, including `https://` and `www`
5. Verify ownership. Easiest route is the **HTML tag** method — it gives you a
   `<meta name="google-site-verification" ...>` tag. Send me that tag and
   I'll add it to the site, then come back and click Verify.
   (If Vercel offers a DNS verification option, that works too.)
6. Once verified, open **Sitemaps** in the left sidebar
7. Type `sitemap.xml` in the box and click **Submit**

**Done when:** the sitemap shows status "Success" with 18 discovered URLs.
Indexing takes days to weeks after that — it is not instant.

---

## 2. Run the product page through the Rich Results Test

**What it means:** We added invisible structured data to the product page —
machine-readable code telling Google "this is a product, it costs $39.95,
shipping is free, it has N reviews averaging X stars." When Google accepts it,
your search listings can show gold stars and a price instead of just a blue
link. This tool checks whether Google can read it correctly.

I could not fully verify this myself: the star rating is pulled from the live
database, which my sandbox has no access to. Everything else validated.

**Steps:**
1. Go to https://search.google.com/test/rich-results
2. Paste `https://www.rockmountainperformance.com/product`
3. Click **Test URL** and wait for the crawl

**What you want to see:** a "Product" result detected, with no errors.

**Then check specifically:** expand the Product result and look for
`aggregateRating`. If it's there with a rating and review count, stars are
working. If it's missing, tell me — that means the page isn't reading the
reviews at render time and I need to fix it.

Warnings (as opposed to errors) about optional fields are fine to ignore.

---

## 3. Meta Purchase tracking — DONE ✅

Purchase events now send server-side from the Stripe webhook, which fires for
every completed order regardless of whether the customer's browser reaches the
thank-you page. This was the root cause of Ads Manager showing zero purchases
against real orders.

Verified end to end: a resent Stripe webhook produced a clean Server Purchase
in Meta Test Events, correct value and currency, and event-ID deduplication
confirmed working. `META_CAPI_ACCESS_TOKEN` is live in Production and the
temporary `META_CAPI_TEST_EVENT_CODE` has been removed.

**What to watch over the next week:** Purchase counts in Ads Manager should
begin tracking your actual Stripe order count. Meta only attributes conversions
going forward — past sales will not backfill.

**Optional follow-ups (neither is urgent):**
- **Rotate `META_CAPI_ACCESS_TOKEN`.** It was pasted into a chat transcript
  during setup. Its blast radius is limited to sending events to your own
  pixel, but regenerating it in Events Manager and updating Vercel closes it
  out. Two minutes.
- **Enable phone collection at checkout.** Stripe currently never captures a
  phone number, so that match field is always absent. Adding it would lift
  Event Match Quality at the cost of one more checkout field. Worth doing once
  you have conversion volume, not before.

---

## 4. Admin dashboard — set up before first use

The dashboard lives at `/admin`. It will not work until three environment
variables exist in Vercel (project `rock-v1-6tkp`, **Production**), and it
fails closed — no password set means nobody gets in, including you.

**Required:**

1. `ADMIN_PASSWORD` — generate a long random one, do not invent it yourself.
   In a terminal: `openssl rand -base64 32`
   Treat this like the Stripe key. Anyone with it sees every customer's name,
   email and shipping address.

2. `ADMIN_SESSION_SECRET` — a second, different random value, 32+ characters.
   `openssl rand -base64 48`
   This signs the login cookie. Changing it later logs everyone out, which is
   also how you revoke access if the password leaks.

3. `GHL_TRACKING_WEBHOOK_URL` — see below.

**Setting up the tracking email in GoHighLevel:**

1. Create a new Workflow with an **Inbound Webhook** trigger
2. Copy its webhook URL into `GHL_TRACKING_WEBHOOK_URL` in Vercel
3. Add an email action using these fields, which the dashboard sends:
   `email`, `first_name`, `full_name`, `order_id`, `carrier`,
   `tracking_number`, `tracking_url`, `amount_total`, `currency`,
   `shipping_name`, `shipping_address_line1`, `shipping_address_line2`,
   `shipping_address_city`, `shipping_address_state`,
   `shipping_address_postal_code`, `shipping_address_country`
4. Make `tracking_url` a clickable link in the template — it is prebuilt for
   USPS/UPS/FedEx/DHL, and empty for "Other / manual"
5. Send it from the **same sender** as your order confirmations, or it lands
   as a stranger in the customer's inbox and hurts deliverability

**First run:** open `/admin`, sign in, then click **Import from Stripe** once.
That pulls in every past paid order. It is safe to run repeatedly and never
overwrites tracking numbers you have already entered.

**Note:** login requires the database, so if Neon is down you cannot sign in.
That is deliberate — the dashboard needs the database anyway.

---

## 5. Decide what happens when the sale ends — 28 Aug 2026

Prices revert to $49.99 automatically and the countdown disappears on its own,
so nothing breaks if you do nothing. But decide before the date whether you're
extending, ending, or replacing it rather than letting it lapse mid-campaign
while ads are running. One line change in `lib/sale.ts`.

---

## 6. Open engineering work (my side, not yours)

- **LCP 6.5s** — render-blocking JS (est. 1,810 ms) and unused JS (254 KiB).
  The real performance bottleneck. Images are *not* the problem: Lighthouse
  puts total image savings at 49 KiB.
- **Accessibility 91** — contrast ratios, links without discernible names,
  non-sequential heading order.
- **Best Practices 96** — missing CSP / HSTS headers, one image with a
  mismatched aspect ratio.

---

## Decisions for you (not bugs)

- A "20% OFF" banner plus the 10% `WELCOME10` code stacks to ~28% off the
  original $49.99 ($35.96/bottle). Worth confirming the margin works.
