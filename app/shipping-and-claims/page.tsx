import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
  PolicyList,
} from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping & Claims",
  description:
    "All sales are final at Armoda Labs. How shipping works and how damaged, lost or incorrectly picked orders are resolved.",
  alternates: { canonical: "/shipping-and-claims" },
};

export default function ShippingAndClaimsPage() {
  return (
    <PolicyPage
      title="Shipping & Claims"
      updated="Draft"
      intro="All sales are final — we do not accept returns on any product. Where we can verify that something went wrong with an order, we resolve it with store credit. This page explains how that works."
    >
      <PolicySection heading="1. All sales are final">
        <p>
          We do not accept returns or exchanges on any product, opened or
          unopened.
        </p>
        <p>
          Once material leaves our custody we cannot verify how it was stored,
          what temperature it reached, or whether the vial that comes back is
          the vial that went out. Material in that condition can never re-enter
          inventory, so accepting a return would mean either destroying it or
          reselling something we can no longer stand behind. Neither is
          acceptable, so we do not take them at all.
        </p>
        <p>
          Please check your order carefully before purchasing. We are glad to
          answer questions about specification, format or documentation before
          you buy.
        </p>
      </PolicySection>

      <PolicySection heading="2. What we resolve, and how">
        <p>
          Final sale is not a refusal to put things right. Where we can verify
          an issue, we resolve it with <strong>store credit</strong> applied to
          your account, issued at the value of the affected items.
        </p>
        <p>We issue credit where:</p>
        <PolicyList
          items={[
            "The shipment arrives damaged — broken, cracked or compromised packaging.",
            "We picked the wrong product, format or quantity.",
            "The lot you received does not match the certificate published for it.",
            "A shipment is confirmed lost in transit by the carrier.",
          ]}
        />
        <p className="text-text-primary">
          In every case we do not want the product back. Keep it or dispose of
          it — we will not ask you to return it, for the same reason we do not
          accept returns at all.
        </p>
        <p>
          Credit does not expire, applies to any product, and can be combined
          with an order of any size. Where a shipment is confirmed undelivered
          by the carrier and you would prefer not to take credit, contact us
          and we will discuss the alternative.
        </p>
      </PolicySection>

      <PolicySection heading="3. Verification">
        <p>
          Credit is issued on a verified issue, not on a report of one. We
          check the claim against the lot records, the pick record for your
          order, and the carrier&apos;s tracking before resolving it. Claims we
          cannot verify are declined, and we will tell you what was missing.
        </p>
      </PolicySection>

      <PolicySection heading="4. Making a claim">
        <p>
          Contact us within <strong>7 days of delivery</strong> — or of the
          expected delivery date where a shipment has not arrived — with:
        </p>
        <PolicyList
          items={[
            "Your order number.",
            "Photographs of the outer packaging, the packing material and the product, taken before anything is discarded.",
            "The lot number printed on the vial, where it is legible.",
          ]}
        />
        <p>
          The packaging photographs matter as much as the product. Carrier
          claims depend on them, and without them we cannot pursue the carrier
          or verify what happened in transit.
        </p>
        <Link href="/contact" className="text-gold hover:underline">
          Start a claim →
        </Link>
      </PolicySection>

      <PolicySection heading="5. Shipping">
        <p>
          Orders placed before the weekday cut-off are dispatched the same day.
          Material is supplied as a lyophilized preparation, which is stable at
          ambient temperature in transit; it does not require cold shipping.
        </p>
        <p>
          Delivery estimates are the carrier&apos;s and are not guaranteed. Once
          a parcel is handed to the carrier we no longer control its timing.
        </p>
      </PolicySection>

      <PolicySection heading="6. Addresses, refusal and undeliverable parcels">
        <p>
          You are responsible for the accuracy of the address you enter. A
          parcel returned to us as undeliverable, refused, or unclaimed cannot
          be reshipped — it has left our custody — and is not refundable.
          Contact us before dispatch if an address needs correcting.
        </p>
      </PolicySection>

      <PolicySection heading="7. International orders">
        <p>
          Where we can ship internationally, import duties, taxes and customs
          charges are the recipient&apos;s responsibility. Parcels seized or
          returned by customs are not refundable. Check your own
          jurisdiction&apos;s import rules before ordering.
        </p>
      </PolicySection>

      <PolicySection heading="8. Cancellations">
        <p>
          An order can be cancelled before it is dispatched — contact us as
          quickly as you can with your order number. Once a parcel is handed to
          the carrier it cannot be recalled.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
