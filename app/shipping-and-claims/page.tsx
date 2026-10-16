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
      intro="All sales are final — we do not accept returns. This page explains why, how shipping works, and how we resolve an order that arrives damaged, never arrives, or is picked incorrectly."
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

      <PolicySection heading="2. What we do resolve">
        <p>
          A final-sale policy is not a refusal to make things right. Contact us
          and we will replace or refund, at our discretion, where:
        </p>
        <PolicyList
          items={[
            "The shipment arrives damaged — broken, cracked or compromised packaging.",
            "The shipment is confirmed lost in transit.",
            "We picked the wrong product, format or quantity.",
            "The lot you received does not match the certificate published for it.",
          ]}
        />
        <p className="text-text-primary">
          In every one of these cases we do not want the product back. Keep it
          or dispose of it — we will not ask you to return it, for the same
          reason we do not accept returns in the first place.
        </p>
      </PolicySection>

      <PolicySection heading="3. Making a claim">
        <p>
          Contact us within <strong>7 days of delivery</strong> (or of the
          expected delivery date, where a shipment has not arrived) with:
        </p>
        <PolicyList
          items={[
            "Your order number.",
            "Photographs of the outer packaging, the packing material and the product, taken before anything is discarded.",
            "The lot number printed on the vial, where it is legible.",
          ]}
        />
        <p>
          Photographs of the packaging matter as much as the product — carrier
          claims depend on them, and we cannot pursue the carrier without them.
        </p>
        <Link href="/contact" className="text-gold hover:underline">
          Start a claim →
        </Link>
      </PolicySection>

      <PolicySection heading="4. Shipping">
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

      <PolicySection heading="5. Addresses, refusal and undeliverable parcels">
        <p>
          You are responsible for the accuracy of the address you enter. A
          parcel returned to us as undeliverable, refused, or unclaimed cannot
          be reshipped — it has left our custody — and is not refundable.
          Contact us before dispatch if an address needs correcting.
        </p>
      </PolicySection>

      <PolicySection heading="6. International orders">
        <p>
          Where we can ship internationally, import duties, taxes and customs
          charges are the recipient&apos;s responsibility. Parcels seized or
          returned by customs are not refundable. Check your own
          jurisdiction&apos;s import rules before ordering.
        </p>
      </PolicySection>

      <PolicySection heading="7. Cancellations">
        <p>
          An order can be cancelled before it is dispatched — contact us as
          quickly as you can with your order number. Once a parcel is handed to
          the carrier it cannot be recalled.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
