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

Not legal advice. Formation, trademark and labeling each need counsel.

**How the work splits.** You own what is bounded by your own effort — code,
backend, copy. Gabe owns what is bounded by other people's response times:
anything where the task is send it and wait. Headings below carry the owner.

Gabe needs spending authority inside agreed limits, or he blocks on you for
every choice and the split buys nothing. What he should not decide alone: the
brand name, anything a lawyer must see, anything published publicly, and
whether Retatrutide and Tirzepatide stay listed.

---

### Website — YOU

- [ ] **Finish the website**
  - [x] Catalog model, `/products`, `/products/category/[slug]`, `/products/[slug]`
  - [x] Homepage, `/about`, `/how-to-pay`, `/how-to-profit`, `/help`, footer
  - [ ] Retire `/product` and `ProductPageClient.tsx` (the single-product path)
  - [ ] Dark-theme pass on legacy routes: `/cart`, `/success`, `/blog`, `/manage`
  - [x] `/refund-policy` replaced by `/shipping-and-claims` — all sales final
  - [ ] Rebrand `/terms-of-service` and `/privacy-policy` — still Rock
        Mountain's, and where the real restrictions belong
  - [ ] Real prices per SKU and per variant (all currently `0` →
        "Price on request")
  - [ ] Decide fonts — Poppins/Outfit are inherited and wrong for the palette
  - [ ] Checkout rebuild once the processor is confirmed; price must be
        re-resolved server-side from `lib/catalog.ts`, never taken from the client

- [ ] **AI image mockups**
  - [ ] **Structure images, not vial renders** — `scripts/generate-structures.py`
        renders brand-styled SVGs per SKU from sequence or SMILES. Nothing
        renders until its entry is marked `verified`, which requires checking
        the sequence against PubChem, the supplier CoA or the literature.
        A wrong structure is a visible, checkable error in the one field this
        brand claims competence in — worse than no image at all.
  - [ ] Decide the card treatment for large molecules. Structures stay legible
        to roughly 60 heavy atoms; BPC-157 is 100, MOTS-c 153, tirzepatide 294.
        The GLP compounds cannot use a structure on a card at any size
  - [ ] Blends (GLOW, KLOW, Semax/Selank, BPC-157/TB-500, CJC/Ipamorelin) have
        no single structure and need their own treatment
  - [ ] Vial photography for the PDP gallery, once packaging exists
  - [ ] Label artwork mockups, which double as the supplier proof for item 7
  - [ ] Hero and lab/facility imagery for the homepage and `/about`
  - [ ] Keep renders consistent: one angle, one lighting setup, one background,
        or the grid looks like a marketplace rather than a brand
  - [ ] Do not render anything implying human use — no syringes staged for
        injection, no body imagery, no clinical-administration scenes

- [ ] **Surface the buyer acknowledgement in the admin**
      Checkout now records `buyer_ack`, `buyer_ack_version` and `buyer_ack_at`
      in session metadata, so it reaches the webhook. The order views do not
      display it. The record is only useful if it can be produced on demand —
      show it on the order detail, and include it in any dispute response.
      Also confirm the webhook persists session metadata onto the order row
      rather than dropping it.

- [ ] **Version the acknowledgement wording, never edit it in place**
      `lib/buyer-acknowledgement.ts` holds `ACK_TEXT` and `ACK_VERSION`. A
      stored acknowledgement is only evidence of what someone agreed to if the
      wording shown on that date can be reproduced. Bump the version on every
      change and keep the old text retrievable.

- [ ] **Store credit has no implementation**
      `/shipping-and-claims` commits to resolving verified issues with store
      credit, and nothing in the codebase issues or tracks it. There is no
      credit balance on a customer, and `lib/promo-codes.ts` is not the source
      of truth for codes — `validate-promo` resolves against the processor.
      **Interim:** issue a single-use processor promotion code per claim, by
      hand, and log it against the order. Workable at launch volume.
      **Later:** a credit balance per customer, which is a schema change.
      Do not let the page promise something the system cannot do.

- [ ] **Decide the non-delivery carve-out**
      The policy offers credit first on a confirmed-lost shipment and says we
      will discuss the alternative. That wording is deliberate: card networks
      treat "merchandise not received" as near-automatic for the cardholder,
      and store credit does not satisfy that dispute — so a hard credit-only
      line on non-delivery converts those cases into chargebacks, costing the
      revenue anyway plus the fee plus ratio damage against the ~0.9%
      threshold that ends a high-risk account. Confirm the stance with the
      processor and with counsel, then tighten or loosen the wording.

- [ ] **Customer accounts do not exist**
      The hero's primary CTAs are now Login and Apply for account. `/apply` is
      real — it collects qualification details and sends them through the
      contact route — but it creates no account, and `/account/login` renders
      no form, because there is nothing to authenticate against. A form that
      takes a password and does nothing teaches people their password does not
      matter and invites them to reuse a real one.
      **Needs:** customer accounts, sessions, and an approval state. Schema
      change, so it needs a go-ahead. When built, `/apply` becomes the
      registration step rather than being replaced.
      **Then decide:** whether to gate prices behind an account, as the
      reference does. That is what makes a catalog read B2B rather than
      consumer retail, and it helps both the intended-use posture and
      processor underwriting.

- [ ] **Build the affiliate portal**
      `/affiliate/login` currently explains that access is manual rather than
      rendering a login form, because there is no affiliate auth: no accounts
      table, no sessions, no dashboard. A form that takes credentials and does
      nothing teaches partners their password does not matter and invites them
      to reuse a real one. Replace the page when the portal exists.
      **Needs:** affiliate accounts, per-partner code attribution reporting
      against `orders`, and a payout ledger. Schema change, so it needs a
      go-ahead.

- [ ] **Set the affiliate commercial terms**
      `app/affiliate/page.tsx` drives the hero, stat strip and earnings
      estimator from one `COMMISSION_RATE` constant, currently a placeholder
      20%, with `AUDIENCE_DISCOUNT` and `APPROVAL_WINDOW` beside it. The page
      says on its face that rates are indicative until confirmed. Set them
      from real margin, then remove that line. Wholesale tiers in
      `app/wholesale/page.tsx` are `TBC` for the same reason.

- [ ] **Review moderation — blocked on a schema change, needs your call**
      Reviews currently publish the moment they are submitted:
      `app/api/reviews/route.ts` validates and inserts, and `lib/reviews-db.ts`
      has no approved/status column. So the moderation commitment in the
      third-party content policy is unenforceable as the code stands — the
      policy says we remove human-use reviews, but nothing holds one back
      before it is public.
      **Needs:** an `approved BOOLEAN NOT NULL DEFAULT false` column on
      `reviews`, public queries filtered to approved rows, and an approve
      and reject pair in the admin. CLAUDE.md requires asking before schema
      changes, so this is waiting on a go-ahead.

- [ ] **Publish the policy drafts after legal review**
      `/ugc-policy` and `/affiliate-terms` are live but carry a draft banner,
      rendered by `components/legal/PolicyPage.tsx`. Remove the banner by
      passing `draft={false}` once counsel has approved the wording. The same
      review should cover the footer research-use notice and the product-page
      notice in `components/products/ResearchUseNotice.tsx`, which are the
      other two placeholder legal texts.

- [ ] **Add a "Popularity" sort to the shop page**
      `components/products/ProductsBrowser.tsx` omits it deliberately: there is
      no order data to rank by, and a sort that silently does nothing is worse
      than an absent one.
      **Blocked on:** order volume worth ranking.
      **When unblocked:** rank by units sold per SKU over a trailing window
      (not all-time, or new products can never surface), then make it default.

---

### 1. Name — BOTH, decide together

- [ ] USPTO TESS conflict search, classes 1 and 5
- [ ] `.com` available, or pick again
- [ ] State business registry clear
- [ ] Social handles: IG, X, Reddit, Telegram, Discord
- [ ] Lock it, then set the real domain in `SITE_URL` (`app/layout.tsx`),
      currently the placeholder `https://www.armodalabs.com`

### 2. LLC — GABE

- [ ] Formation state (home state unless there is a reason — Delaware/Wyoming
      add foreign qualification and protect you from nothing here)
- [ ] Registered agent — not your home address, it becomes public
- [ ] EIN direct from the IRS, free, never pay a service
- [ ] Operating agreement, even single-member — banks and processors ask
- [ ] Business bank account
- [ ] Ask counsel about a two-entity split: IP holding company owns the brand
      and licenses it to the operating company, so the brand survives anything
      that happens to the operating entity

### 3. Trademark — GABE (search), BOTH (attorney call)

- [ ] Clearance search (start now, long lead time)
- [ ] Trademark attorney consult **specifically on registrability**

USPTO requires lawful use in commerce and refuses marks for goods unlawful
under federal law — settled in the CBD context (*In re Stanley Brothers*, Fed.
Cir. 2020). Research peptides are plausibly unapproved new drugs, so filing for
"peptides for research use" invites a refusal. Ask counsel about registering
for unambiguously lawful goods/services instead. Common-law rights exist from
use regardless of registration.

### 4. COAs and third-party testing — GABE

- [ ] Supplier is chosen on price. Qualify it by buying a single vial of each
      compound and sending those to an independent lab before committing to a
      full lot. (Anonymous purchasing was considered and dropped.)
- [ ] **Test the production lot too, separately.** The sample vials will not be
      from the lot you end up buying, so the sample test qualifies the supplier,
      not the inventory. The COA published against a lot number has to come from
      that lot or the documentation does not match what shipped — which is the
      one failure this whole positioning cannot survive
- [ ] Get repeat-customer pricing from the lab: per-lot testing is a permanent
      recurring cost, not a one-off
- [ ] Select an ISO 17025-accredited lab
- [ ] Price the panel: HPLC purity, mass spec identity, peptide content, water
      content, residual solvents (TFA), endotoxin if positioning warrants
- [ ] Build into unit economics — $150–400 per compound per lot, recurring,
      across 16 SKUs
- [ ] COA publishing workflow: PDF named by lot → lot printed on vial →
      `/lab-results` entry. The route exists; the discipline has to be real

Mass spec matters as much as purity: purity alone does not confirm identity.

#### Catalog structure images — blocked on information we do not have

Eight of sixteen SKUs now render a tile (`public/structures/`). The rest are
waiting on facts, not on code. Full worksheet: `docs/structure-verification.md`.

- [ ] **TB-500 — which fragment?** Sold as the bare 7-mer LKKTETQ, N-acetylated,
      C-amidated, or both, and each has a different mass. The number printed on
      the tile must match what the supplier actually ships, so this comes off the
      lot CoA, not a reference site. Once the CoA says which, the sequence string
      in `scripts/generate-structures.py` gets updated and the flag flipped.
- [ ] **Retatrutide and tirzepatide — need a SMILES.** Both carry non-standard
      residues and a fatty-acid chain that the sequence builder cannot express.
      Either source a SMILES (PubChem, or the supplier's documentation) or accept
      no image for these two. No reference tile to copy yet.
- [ ] **Five blends need component lists.** GLOW, KLOW, CJC-1295/Ipamorelin,
      Semax-Selank, BPC-157/TB-500. A structure is the wrong object for a blend;
      these want a component-list card in the same frame. The renderer is a small
      job — the blocker is the per-blend composition, which comes from the
      supplier's formulation.
- [ ] **Confirm GHK-Cu's CAS (89030-95-5)** against the CoA. The structure and
      mass are confirmed two ways; the CAS came off a third-party listing.
- [ ] **Confirm the eight rendered structures against PubChem** when convenient.
      Computed formula and mass agree with published values, but PubChem is
      unreachable from the build container so none were checked against it
      directly. Two numbers per row — `docs/structure-verification.md` has the list.


### 5. Payment processing — GABE

- [ ] Confirm rolling reserve percentage and hold period — this sets working capital
- [ ] Confirm chargeback threshold (usually ~0.9%); monitor weekly
- [ ] Get written answers on what triggers termination
- [ ] **Underwrite a backup processor before you need it.** Single processor is
      a single point of failure and termination in this category is routine
- [ ] Crypto as a secondary rail only — non-reversible, but a conversion killer
- [ ] Keep the site underwriteable: class-based categories, no efficacy claims,
      research-use notices. Processors re-review periodically

### 6. Influencer payouts — YOU (terms), GABE (outreach list)

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

### 7. Vial packaging — GABE (negotiate), YOU (artwork)

- [ ] Label must carry: "For Laboratory Research Use Only — Not for Human
      Consumption", compound name, net quantity, lot number, CAS where
      applicable, storage conditions, entity name and contact
- [ ] Label must NOT carry: dosing, reconstitution-for-injection instructions,
      any indication, or a pharmaceutical-looking presentation
- [ ] Negotiate: MOQ, tiered per-unit, tooling/plate fees, lead time, who holds
      the artwork
- [ ] Sample run and a physical proof before full production

The label travels, gets photographed, and is the artifact most likely to end up
as an enforcement exhibit.

### 7b. Fulfillment / 3PL — GABE

**Settle the temperature question first.** Lyophilized peptides tolerate
ambient transit for weeks — that is the point of lyophilizing them. Freezer
storage is for long-term inventory, not shipping. Ask the supplier what their
stability data actually supports before specifying −20°C, because insisting on
frozen cuts the provider list down and raises per-unit cost for possibly no
benefit. If inventory turns in 30–60 days, ambient may be enough.

- [ ] Decide: −20°C frozen / 2–8°C refrigerated / ambient

**Candidates found (all self-reported marketing, none verified):**

- [ ] Wholesale Peptide Supply — Costa Mesa CA; −20°C and 2–8°C, temperature
      logging, lot-record picking, ships under your brand; also a manufacturer
- [ ] 3PLGuys — Paramount CA; FDA-registered, temperature-controlled, lot
      tracking, FEFO expiry management
- [ ] AMZ Prep — FDA-registered, −20°C and 2–8°C cold chain
- [ ] Peptides3PL — cold-chain peptide fulfillment
- [ ] Partner3PL — directory, useful for finding more
- [ ] Flow Fulfillment — Jacksonville FL; free freezer storage, but markets
      "discreet shipping". Treat as a flag: discretion marketing signals
      grey-market positioning, which is the opposite of this brand's, and it is
      the sort of association that surfaces in a processor review

"FDA-registered facility" means the facility filed a registration. It is not
approval of anything stored there.

**The disqualifying question:**

- [ ] **Can they pick by lot and record which lot shipped to which order?**
      Most 3PLs treat units as fungible. The whole brand is a COA matched to
      the lot number on the customer's vial — if they cannot say which lot went
      in which box, /lab-results is a promise the operation cannot keep, and
      nobody finds out until a customer asks

**Rest of the vetting list:**

- [ ] Will their terms accept research-use-only reagents? **Get it in writing.**
      Same failure mode as payment processors: verbal yes, contractual no,
      inventory stranded later
- [ ] Temperature mapping, monitoring, alarms, and the excursion policy — what
      happens when a freezer fails at 2am
- [ ] Who applies the lot label, them or us (ties to the packaging decision)
- [ ] Receiving, storage and pick fees; minimums; same-day cutoff time
- [ ] Restricted destinations for international orders
- [ ] Insurance, and who owns inventory sitting on their floor

**Consider self-fulfilling at first.** At early volume a 3PL's fees often
exceed the time cost of packing yourself, and self-fulfillment keeps absolute
control of lot traceability while that discipline is being established. Move to
a 3PL when packing becomes the bottleneck — by then the spec will be obvious.

### 8. Thank-you cards / UGC — YOU (decide mechanic)

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

### 9. Marketing — GABE (channel groundwork)

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
