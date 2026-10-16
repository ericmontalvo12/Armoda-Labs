# Fulfillment SOP — Armoda Labs

Self-fulfillment at launch volume. Starting inventory: 24 kits / 240 vials.

Written for two people. Follow it exactly rather than from memory — the lot
record is the part the whole brand rests on, and it is the part that gets
skipped when you are busy.

---

## Phase 1 — Identity and address, before any inventory arrives

**Nothing anywhere should carry a home address, a personal phone number, or a
personal email.** Each of the following is a separate leak and has to be closed
on its own.

### 1.1 Get a commercial mailbox (CMRA)

A CMRA is a private mailbox service at a real street address. Unlike a USPS PO
Box it accepts UPS and FedEx, and it gives you a street address you can put on
a shipping label.

- [ ] Open one. ~$15–30/month. The UPS Store, PostNet, or any local operator
- [ ] You will complete **USPS Form 1583** and show two forms of ID. This is
      normal and required for any CMRA
- [ ] The address will look like: `1234 Example St, Ste 200` or `#200`
- [ ] **Do not** use a USPS PO Box as the business address — UPS and FedEx
      cannot deliver to one, which breaks inbound supplier shipments and
      returned parcels

This one address becomes: the return address on every label, the address on
the website, the address on the vial label, and the address on the LLC filing.

### 1.2 Close the other leaks

- [ ] **Registered agent** — use a registered agent service for the LLC, not
      your home. The registered agent address is public record forever
- [ ] **Domain WHOIS privacy** — on, at the registrar
- [ ] **Business phone** — a VoIP number (Google Voice, OpenPhone). Never a
      personal cell. It goes on the website and the vial label
- [ ] **Business email** — on the brand domain, never personal
- [ ] **No Google Business Profile** at a home address. If you want a map
      listing later, it has to be the CMRA, and some CMRAs disallow it
- [ ] **Social accounts** — created under the business email, with no personal
      account linked as a recovery address

### 1.3 Know the one thing a CMRA does not hide

The return address on the parcel will be the CMRA. But **tracking shows the
city and ZIP where the parcel entered the mail stream** — the acceptance scan.
If you drop parcels at the post office nearest your house, tracking shows that
town.

This reveals your metro area, not your street or your name. Decide which you
want:

- **Accept it** — most buyers never look, and a metro area is not an address
- **Drop at a post office near the CMRA** instead, so origin and return address
  agree. Costs you a trip
- **Schedule USPS pickup** — free, carrier collects, but from wherever you are

Pick one and be consistent. Inconsistent origin cities look stranger than
either option.

---

## Phase 2 — Receiving and quarantine

Inventory arriving is not inventory you can sell.

1. [ ] Shipment arrives at the CMRA. Collect it
2. [ ] Open and count. Record in the inventory log: **compound, lot number,
       quantity received, date received**
3. [ ] Pull sample vials for testing and send to the lab
4. [ ] Mark the lot **QUARANTINED**. It is not sellable and does not go live
       on the site
5. [ ] Certificate returns:
   - **Pass** → publish the PDF to `public/coa/`, add the row to
     `app/lab-results/page.tsx`, then mark the lot sellable
   - **Fail** → it never ships. Quarantine permanently, pursue the supplier
6. [ ] Only now does the product go live in the catalog

**Rule: nothing is offered for sale before its certificate is published.** This
is the operational version of the entire brand promise. Breaking it once makes
every certificate on the site worth less.

---

## Phase 3 — Labeling

Each vial label must carry:

- [ ] Compound name
- [ ] Net quantity (e.g. `10mg`)
- [ ] **Lot number**
- [ ] Storage conditions
- [ ] `FOR LABORATORY RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION`
- [ ] `ARMODA LABS` and the **CMRA address + business phone**
- [ ] CAS number where one applies

Must **not** carry: dosing, reconstitution-for-injection instructions, any
indication or condition, or anything resembling a pharmaceutical presentation.

Labels: waterproof/freezer-grade stock. Paper labels fail in a freezer, and a
vial whose lot number has peeled off is unsellable — you cannot prove which
certificate it belongs to.

---

## Phase 4 — Freezer setup

- [ ] Mini chest freezer, 3.5 cu ft or smaller. 240 vials fit in a shoebox
- [ ] **WiFi temperature alarm with phone alerts.** Non-optional. A silent
      overnight failure is a total loss
- [ ] Organize by **lot**, not by compound. Picking is by lot, so storage
      should be too. One labeled bin or bag per lot
- [ ] Keep a thermometer log, or let the alarm device log it
- [ ] Chest, not upright — holds temperature far longer when opened or during
      a power cut

---

## Phase 5 — Pack and ship

Do these in order, every time. Step 3 is the one that cannot slip.

1. [ ] Order arrives → open it in the admin, read the line items
2. [ ] Pull the vial(s) from the freezer, **from the oldest sellable lot first**
3. [ ] **Record the lot number against the order in the admin.** Do this now,
       at the bench, not later from memory
4. [ ] Vial into a foam sleeve or bubble wrap
5. [ ] Into a **small rigid box** — not a poly mailer. Glass in a poly mailer
       breaks
6. [ ] Void fill so nothing moves when shaken. Shake it; if you hear the vial,
       repack
7. [ ] Insert the thank-you card
8. [ ] Seal, apply the label, weigh
9. [ ] Hand to carrier / drop off
10. [ ] Mark fulfilled in the admin with carrier + tracking number — this fires
        the tracking email through GoHighLevel

### Shipping specifics

| Setting | Value |
|---|---|
| **Carrier/service** | USPS **Ground Advantage** — cheapest under 1 lb, 2–5 days, tracking and $100 insurance included |
| **Faster option** | USPS Priority Mail, 1–3 days |
| **Label platform** | **Pirate Ship** — free, no monthly fee, commercial rates |
| **Ship-from address** | **The CMRA.** Set it once in Pirate Ship as the default so it cannot be forgotten |
| **Return address on label** | `ARMODA LABS` + CMRA address. Never a personal name |
| **Cold packs** | **None.** Lyophilized peptides are stable at ambient in transit. Cold packs add weight, cost and nothing |
| **Signature** | Not required — adds cost, and nobody is home |
| **Typical parcel weight** | 4–8 oz for a small box with 1–2 vials |
| **Package type** | Small rigid box. 6x4x2 or 7x5x3 covers most orders |
| **Declared contents** | `Laboratory reagents` — accurate and unremarkable |
| **Insurance** | $100 included on Ground Advantage; add more only for high-value kits |

**Set the ship-from in Pirate Ship once, as the account default.** The single
most likely way a home address ends up on a parcel is a label created in a
hurry with the wrong from-address.

### Before the first real order

- [ ] Ship 3–5 test parcels to yourselves and to a friend, through the real
      checkout
- [ ] Confirm: the vial survives transit, the label prints correctly, the
      return address is the CMRA, the tracking email fires, the lot was
      recorded against the order
- [ ] Time the packing. That number tells you when a 3PL starts to make sense

---

## Phase 6 — Records to keep

| Record | Why |
|---|---|
| Inventory log: compound, lot, qty, received date, status | Knowing what is sellable |
| Lot → order mapping | The brand promise. Also how you handle a recall |
| COA PDF per lot | Published, and kept offline too |
| Temperature log | Evidence the cold chain held |
| Claim log: order, issue, evidence, resolution | Chargeback defense |

---

## When to stop self-fulfilling

Any one of:

- Packing exceeds ~10 hours a week
- ~300–500 orders a month
- Multi-region dispatch is needed for delivery times

Have a 3PL vetted **before** then — §7b in TODO.md. The wall arrives faster
than onboarding does.
