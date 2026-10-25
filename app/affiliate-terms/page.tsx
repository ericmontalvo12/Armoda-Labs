import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
  PolicyList,
} from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Affiliate & Partner Terms",
  description:
    "Terms for Armoda Labs affiliates and content partners, including the prohibited claims schedule, disclosure requirements and approval process.",
  alternates: { canonical: "/affiliate-terms" },
};

export default function AffiliateTermsPage() {
  return (
    <PolicyPage
      title="Affiliate & Partner Terms"
      updated="Draft"
      intro="These terms apply to anyone who receives commission, free product, discounts or any other consideration from Armoda Labs in connection with promoting our products."
    >
      <PolicySection heading="1. Eligibility">
        <PolicyList
          items={[
            "You must be 18 or over and legally able to enter a contract.",
            "You must not present yourself as a medical professional giving advice about our products.",
            "We may decline or end any partnership at our discretion.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="2. Prohibited claims">
        <p>
          This section is the core of these terms. Because we compensate you,
          what you publish about our products is treated in law as our
          advertising. You must not publish, say, imply or allow to stand any
          of the following:
        </p>
        <PolicyList
          items={[
            "Any account of using our products yourself, or of anyone else using them — including first-person narratives, logs, cycles or trip reports.",
            "Any dose, dosing schedule, protocol, stack, cycle or route of administration.",
            "Any statement that a product treats, prevents, cures, heals, improves, repairs, boosts, enhances or affects any condition, symptom, body part or bodily function.",
            "Any reference to weight loss, muscle gain, recovery, healing, anti-ageing, cognition, libido, appetite, skin or sleep in connection with a product.",
            "Before-and-after imagery, physique comparisons, or imagery of administration including syringes prepared for injection.",
            "Any suggestion that a product is a drug, medicine, supplement, food, cosmetic or anything intended for human or animal consumption.",
            "Any purity, potency or testing claim beyond what the published certificate of analysis for that lot states.",
            "Any comparison to a prescription medicine by brand name.",
          ]}
        />
        <p className="text-text-primary">
          Examples of phrasing that breaches these terms:{" "}
          <span className="text-text-secondary">
            &ldquo;I&apos;ve been running this for six weeks&rdquo;,
            &ldquo;great for recovery&rdquo;, &ldquo;I noticed results by day
            ten&rdquo;, &ldquo;start at 250mcg&rdquo;, &ldquo;this is the
            research version of [brand]&rdquo;.
          </span>
        </p>
      </PolicySection>

      <PolicySection heading="3. What you may discuss">
        <p>
          The restrictions above leave a great deal you can cover, and it is
          the material our buyers actually care about:
        </p>
        <PolicyList
          items={[
            "Certificates of analysis — what they contain and how to read a certificate.",
            "Third-party testing, lot matching and identity confirmation by mass spectrometry.",
            "Purity figures, quoted exactly as the certificate for that lot states them.",
            "Packaging, labeling and vial quality.",
            "Shipping speed, handling and cold-chain practice.",
            "Price per milligram, and comparisons against other suppliers on documentation and service.",
            "Laboratory handling and storage as technique, without reference to administration.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="4. Disclosure">
        <p>
          Every piece of content must clearly and conspicuously disclose that
          you are compensated. The disclosure must be visible without
          expanding a caption or clicking &ldquo;more&rdquo;, and must be in
          the content itself rather than only in a profile or a link in bio.
          Disclosure in video must be both spoken and on screen.
        </p>
      </PolicySection>

      <PolicySection heading="5. Approval before publication">
        <p>
          Content must be submitted to us and approved in writing before it is
          published. We aim to respond within one business day. We keep a
          record of what we approved. Publishing without approval is a breach
          of these terms regardless of the content.
        </p>
      </PolicySection>

      <PolicySection heading="6. Compensation">
        <p>
          Commission is attributed by your unique discount code. Commission is
          calculated on net order value excluding shipping, tax and refunded
          or charged-back orders, and is paid on a schedule we publish to you.
        </p>
        <p>
          We do not pay for engagement, impressions or testimonial content. We
          pay for referred orders.
        </p>
      </PolicySection>

      <PolicySection heading="7. Breach">
        <p>
          If you breach these terms we may, without notice, end the
          partnership, withhold or reclaim unpaid commission attributable to
          the breaching content, require the content to be removed, and report
          it to the platform for removal.
        </p>
        <p>
          We enforce this consistently, including with partners who perform
          well. A single non-compliant post creates liability that outweighs
          the revenue from the channel.
        </p>
      </PolicySection>

      <PolicySection heading="8. Independent contractor">
        <p>
          You act as an independent contractor. Nothing here creates an
          employment, agency, partnership or joint-venture relationship, and
          you may not represent that you speak for Armoda Labs or hold
          yourself out as able to bind us.
        </p>
      </PolicySection>

      <PolicySection heading="9. Related policies">
        <p>
          See also our{" "}
          <Link href="/ugc-policy" className="text-gold hover:underline">
            third-party content policy
          </Link>{" "}
          and{" "}
          <Link
            href="/terms-of-service"
            className="text-gold hover:underline"
          >
            terms of service
          </Link>
          .
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
