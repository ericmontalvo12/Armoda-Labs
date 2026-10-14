import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description:
    "Our 30-day money-back guarantee, how refunds work, and how to start a return.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicy() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50">
      <Header />
      <main className="pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-8">
            Returns & Guarantee
          </h1>

          <div className="max-w-none space-y-8 text-text-secondary">
            <section>
              <p className="mb-4">
                We offer a 30-day return policy, which means you have 30 days from the date you receive your item to request a return.
              </p>
              <p className="mb-4">
                <strong className="text-text-primary">To be eligible for a return:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Items must be in the same condition as when you received them - unworn, unused, with tags, and in the original packaging.</li>
                <li>You must provide your receipt or proof of purchase.</li>
              </ul>
              <p>
                To initiate a return, please contact us at{" "}
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
                . If your return is approved, we'll provide a return shipping label along with instructions on how and where to send your package. Items sent back without prior approval will not be accepted.
              </p>
              <p className="mt-4">
                You can always reach out with any return questions at{" "}
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Damages & Issues
              </h2>
              <p>
                Please inspect your order upon receipt. If your item is defective, damaged, or incorrect, contact us immediately so we can resolve the issue.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Exceptions / Non-Returnable Items
              </h2>
              <p className="mb-4">
                The following items cannot be returned:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Perishable goods (e.g., food, flowers, plants)</li>
                <li>Custom or personalized products</li>
                <li>Personal care items (e.g., beauty products)</li>
                <li>Hazardous materials, flammable liquids, or gases</li>
                <li>Sale items or gift cards</li>
              </ul>
              <p>
                If you have questions about a specific item, please reach out to{" "}
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Ship your return/exchange to:
              </h2>
              <address className="not-italic mb-4">
                Rock Mountain Performance, LLC<br />
                Returns Department<br />
                11495 SW 60th St<br />
                Miami, FL 33173<br />
                USA
              </address>
              <p>
                Notify us at{" "}
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
                {" "}with your order number and return tracking number.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Refunds
              </h2>
              <p>
                Once we receive and inspect your return, we will notify you whether your refund has been approved. Approved refunds will be issued to your original payment method. Please note that it may take some time for your bank or credit card company to post the refund.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Guarantee Terms (Fair Use)
              </h2>
              <p className="mb-4">
                We offer a 30-day money-back guarantee on first-time purchases.
              </p>
              <p className="mb-4">
                Refunds are limited to one per customer or household and may be declined in cases of repeated claims, suspected abuse, fraud, or resale activity.
              </p>
              <p className="mb-4">
                Shipping costs are non-refundable.
              </p>
              <p>
                If you need help with a return, contact us at{" "}
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
