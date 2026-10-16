import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
  PolicyList,
} from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing the purchase of research materials from Armoda Labs, including eligibility, permitted use and restrictions on resale and redistribution.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      title="Terms of Service"
      updated="Draft"
      intro="These terms govern your purchase and use of materials supplied by Armoda Labs. By placing an order you agree to them. If you do not, do not order."
    >
      {/*
        Sections 2 to 5 are the load-bearing ones and were absent from the
        inherited supplement terms: buyer qualification, permitted use, the
        resale restriction and the no-advice clause. A footer disclaimer with
        none of these behind it is the pattern regulators describe as a fig
        leaf — the restriction has to be a condition of sale, agreed at
        purchase, not a notice printed nearby.
      */}

      <PolicySection heading="1. Who we are">
        <p>
          Armoda Labs supplies defined-sequence peptides and related materials
          for laboratory research. We are a supplier of research reagents. We
          are not a pharmacy, a compounding facility, a manufacturer of drugs,
          or a provider of medical services of any kind.
        </p>
      </PolicySection>

      <PolicySection heading="2. Eligibility">
        <p>By placing an order you represent and warrant that:</p>
        <PolicyList
          items={[
            "You are at least 18 years of age.",
            "You are acquiring the material for laboratory research purposes only.",
            "You are qualified by training or experience to handle research chemicals safely, or are acquiring on behalf of an organization whose personnel are.",
            "You will handle, store and dispose of the material in accordance with applicable law and good laboratory practice.",
            "You are not acquiring the material for yourself or any other person to consume, administer or otherwise introduce into a human or an animal.",
            "Your purchase and possession of the material is lawful in your jurisdiction.",
          ]}
        />
        <p>
          We may decline or cancel any order, and may require evidence of
          eligibility before dispatch.
        </p>
      </PolicySection>

      <PolicySection heading="3. Permitted use">
        <p>
          Material is supplied <strong>for laboratory research use only</strong>
          . It is not a drug, food, cosmetic, dietary supplement or medical
          device, and it is not supplied for human or veterinary use.
        </p>
        <p>You must not:</p>
        <PolicyList
          items={[
            "Consume, administer or introduce the material into a human or an animal, or permit anyone else to.",
            "Use the material in the diagnosis, treatment, cure, mitigation or prevention of any condition.",
            "Represent the material as approved, safe or effective for any use in humans or animals.",
            "Relabel, repackage or re-present the material as a drug, supplement, food or cosmetic.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="4. Resale and redistribution">
        <p>
          Material is supplied for your own research use. You must not resell,
          distribute, transfer or supply it to any other person except where we
          have agreed in writing, and any such agreement requires you to
          impose these same restrictions on your buyer.
        </p>
        <p>
          You may not list our material on any consumer marketplace, or offer
          it for sale in any context that presents it as suitable for human or
          veterinary use.
        </p>
      </PolicySection>

      <PolicySection heading="5. No advice, no warranty of fitness">
        <p>
          Nothing on this site is medical, veterinary, scientific or legal
          advice. We do not provide dosing, protocols, administration guidance
          or any recommendation about use, and we will not do so on request.
        </p>
        <p>
          Material is supplied as described in its certificate of analysis and
          for no other purpose. To the fullest extent permitted by law, we
          disclaim all warranties not expressly stated here, including any
          implied warranty of merchantability or fitness for a particular
          purpose. A certificate of analysis states what a lot was measured to
          contain; it is not a representation that the material is safe or
          effective for anything.
        </p>
      </PolicySection>

      <PolicySection heading="6. Export, import and jurisdiction">
        <p>
          You are responsible for compliance with the import, export and
          controlled-substance laws of your own jurisdiction and of any
          destination you have material shipped to. Where we cannot lawfully
          ship to an address, checkout will not accept it. Parcels seized or
          returned by customs are not refundable.
        </p>
      </PolicySection>

      <PolicySection heading="7. Orders, pricing and availability">
        <p>
          Prices and availability may change without notice. We may correct
          pricing errors and cancel affected orders with a full refund. An
          order is accepted when it is dispatched, not when it is placed.
        </p>
        <p>
          All sales are final — see{" "}
          <Link href="/shipping-and-claims" className="text-gold hover:underline">
            Shipping &amp; Claims
          </Link>{" "}
          for how verified issues are resolved.
        </p>
      </PolicySection>

      <PolicySection heading="8. Reviews and submitted content">
        <p>
          We may publish reviews and other content you submit. We will not
          publish, and will remove, content that describes use in a human or an
          animal, states a dose or protocol, or claims any outcome or effect —
          see our{" "}
          <Link href="/ugc-policy" className="text-gold hover:underline">
            third-party content policy
          </Link>
          . You grant us a non-exclusive licence to publish what you submit, and
          you confirm it is your own.
        </p>
      </PolicySection>

      <PolicySection heading="9. Limitation of liability">
        <p>
          To the fullest extent permitted by law, our total liability arising
          out of or relating to any order is limited to the amount you paid for
          that order. We are not liable for indirect, incidental or
          consequential loss.
        </p>
        <p>
          You agree to indemnify us against claims arising from your use,
          handling, storage, resale or disposal of material in breach of these
          terms — in particular, any use in a human or an animal.
        </p>
      </PolicySection>

      <PolicySection heading="10. Accounts and acceptable use">
        <p>
          You are responsible for activity under your account and for keeping
          your credentials secure. Do not attempt to disrupt, probe or gain
          unauthorized access to the site.
        </p>
      </PolicySection>

      <PolicySection heading="11. Changes, governing law and contact">
        <p>
          We may update these terms; the version in force is the one published
          when you order. These terms are governed by the laws of the state in
          which Armoda Labs is organized, without regard to conflict of laws
          rules.
        </p>
        <p>
          Questions:{" "}
          <Link href="/contact" className="text-gold hover:underline">
            contact us
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
