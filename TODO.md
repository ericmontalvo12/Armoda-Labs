# To-Do

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
