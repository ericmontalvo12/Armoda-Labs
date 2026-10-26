import type { Metadata } from "next";
import Link from "next/link";
import {
  PolicyPage,
  PolicySection,
  PolicyList,
} from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Third-Party Content Policy",
  description:
    "How Armoda Labs treats customer and third-party content, what we do not endorse, and how to report content that misrepresents our products.",
  alternates: { canonical: "/ugc-policy" },
};

export default function UgcPolicyPage() {
  return (
    <PolicyPage
      title="Third-Party Content Policy"
      updated="Draft"
      intro="This policy covers content about Armoda Labs published by people other than us: customers, commentators, forum posters and paid partners. It sets out what we do and do not stand behind."
    >
      <PolicySection heading="1. We do not endorse third-party content">
        <p>
          People write about our products without our involvement. We do not
          control, review, approve or adopt that content. A post, video,
          comment or review published by someone else is their statement, not
          ours, and does not reflect any position of Armoda Labs.
        </p>
        <p>
          In particular, statements by third parties about using our products
          in humans or animals are made without our knowledge or agreement,
          contradict the terms on which our products are supplied, and are not
          endorsed, adopted or ratified by us in any way.
        </p>
      </PolicySection>

      <PolicySection heading="2. What our products are supplied for">
        <p>
          All material supplied by Armoda Labs is for laboratory research use
          only, to purchasers qualified to receive and handle it. It is not
          supplied for human or veterinary use. We make no representation that
          any product is safe or effective for any use in humans or animals,
          and we make no claim about what any compound does.
        </p>
      </PolicySection>

      <PolicySection heading="3. Paid and incentivised partners">
        <p>
          Where we pay a partner, provide free product, offer a commission or
          give anything else of value in connection with content, that is a
          material connection and we require it to be clearly disclosed in the
          content itself.
        </p>
        <p>
          Partners operate under written terms that prohibit describing human
          use, dosing, protocols, outcomes or personal experience with our
          products. Content from partners is reviewed before publication.
          Partners who breach those terms are removed from the program and
          their content is reported for removal.
        </p>
        <p>
          Our{" "}
          <Link href="/affiliate-terms" className="text-gold hover:underline">
            affiliate and partner terms
          </Link>{" "}
          set out the full requirements.
        </p>
      </PolicySection>

      <PolicySection heading="4. Content on surfaces we control">
        <p>
          On our own website and channels we do not publish, and will remove,
          content that:
        </p>
        <PolicyList
          items={[
            "Describes using our products in a human or an animal",
            "States or implies a dose, protocol, cycle or route of administration",
            "Claims a therapeutic, physiological, cosmetic or performance outcome",
            "Refers to a disease, condition or symptom in connection with a product",
            "Shows administration, injection, or before-and-after imagery",
            "Presents our products as a drug, supplement, food or cosmetic",
          ]}
        />
        <p>
          This applies to product reviews, comments and any community space we
          operate. Removal under this policy is not a judgement about the
          person; it reflects the terms on which the material is supplied.
        </p>
      </PolicySection>

      <PolicySection heading="5. Reporting content">
        <p>
          If you see content that misrepresents our products, claims an
          affiliation that does not exist, or presents our material as intended
          for human use, tell us at{" "}
          <Link href="/contact" className="text-gold hover:underline">
            our contact page
          </Link>
          . We review reports and request removal where appropriate.
        </p>
      </PolicySection>

      <PolicySection heading="6. Trademarks and imagery">
        <p>
          Our name, logo, label artwork and product photography remain ours.
          Use of them does not imply partnership, sponsorship or endorsement,
          and we may ask for their removal from content that conflicts with
          this policy.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
