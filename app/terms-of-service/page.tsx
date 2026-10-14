import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions governing use of the Rock Mountain Performance website and purchases.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfService() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50">
      <Header />
      <main className="pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-8">
            Terms of Service
          </h1>

          <div className="max-w-none space-y-8 text-text-secondary">
            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                OVERVIEW
              </h2>
              <p className="mb-4">
                This website is operated by Rock Mountain Performance. Throughout the site, the terms "we," "us," and "our" refer to Rock Mountain Performance. Rock Mountain Performance offers this website, including all information, tools, products, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
              </p>
              <p className="mb-4">
                By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following Terms and Conditions ("Terms of Service", "Terms"), including those additional terms and policies referenced herein and/or available by hyperlink.
              </p>
              <p className="mb-4">
                These Terms of Service apply to all users of the site, including without limitation users who are browsers, customers, merchants, and/or contributors of content.
              </p>
              <p className="mb-4">
                Please read these Terms carefully before accessing or using our website. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
              </p>
              <p>
                Our store may be hosted and supported by third-party platforms that provide e-commerce and digital service infrastructure.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 1 - ONLINE STORE TERMS
              </h2>
              <p className="mb-4">
                By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.
              </p>
              <p className="mb-4">
                You may not use our products or services for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.
              </p>
              <p className="mb-4">
                You must not transmit any worms, viruses, or any code of a destructive nature.
              </p>
              <p>
                A breach or violation of any of the Terms may result in immediate termination of your access to the Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 2 - GENERAL CONDITIONS
              </h2>
              <p className="mb-4">
                We reserve the right to refuse service to anyone for any reason at any time.
              </p>
              <p className="mb-4">
                You understand that your content (not including payment information) may be transferred unencrypted and involve transmissions over various networks.
              </p>
              <p className="mb-4">
                Payment information is always encrypted during transfer over networks.
              </p>
              <p>
                You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service without express written permission by us.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 3 - ACCURACY, COMPLETENESS, AND TIMELINESS OF INFORMATION
              </h2>
              <p className="mb-4">
                We are not responsible if information made available on this site is not accurate, complete, or current.
              </p>
              <p className="mb-4">
                The material on this site is provided for general informational purposes only and should not be relied upon as the sole basis for making decisions.
              </p>
              <p>
                Any reliance on the material on this site is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES
              </h2>
              <p className="mb-4">
                Prices for our products are subject to change without notice.
              </p>
              <p className="mb-4">
                We reserve the right at any time to modify or discontinue the Service (or any part thereof) without notice.
              </p>
              <p>
                We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 5 - PRODUCTS OR SERVICES
              </h2>
              <p className="mb-4">
                Certain products or services may be available exclusively online through the website.
              </p>
              <p className="mb-4">
                These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
              </p>
              <p className="mb-4">
                We reserve the right to limit the sales of our products or services to any person, geographic region, or jurisdiction.
              </p>
              <p>
                We do not warrant that the quality of any products, services, information, or other material purchased or obtained will meet your expectations.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION
              </h2>
              <p className="mb-4">
                We reserve the right to refuse any order you place with us.
              </p>
              <p className="mb-4">
                You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
              </p>
              <p>
                You agree to promptly update your information, including email address and payment details, so that we can complete your transactions.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 7 - USER COMMENTS, FEEDBACK, AND SUBMISSIONS
              </h2>
              <p className="mb-4">
                If you submit comments, feedback, ideas, suggestions, or other materials, you agree that we may edit, copy, publish, distribute, and use them in any medium without restriction.
              </p>
              <p>
                You agree your submissions will not violate any third-party rights or contain unlawful or harmful material.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 8 - PERSONAL INFORMATION
              </h2>
              <p>
                Your submission of personal information through the site is governed by our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 9 - ERRORS, INACCURACIES, AND OMISSIONS
              </h2>
              <p className="mb-4">
                Occasionally there may be information on our site that contains typographical errors or inaccuracies.
              </p>
              <p>
                We reserve the right to correct any errors and to change or update information at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 10 - PROHIBITED USES
              </h2>
              <p className="mb-4">
                You are prohibited from using the site or its content:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>For unlawful purposes</li>
                <li>To violate intellectual property rights</li>
                <li>To harass, abuse, or discriminate</li>
                <li>To upload malicious code</li>
                <li>To spam, scrape, or interfere with site security</li>
              </ul>
              <p>
                We reserve the right to terminate your use for violating these prohibited uses.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 11 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
              </h2>
              <p className="mb-4">
                We do not guarantee that your use of our service will be uninterrupted, timely, secure, or error-free.
              </p>
              <p className="mb-4">
                All products and services are provided "as is" and "as available."
              </p>
              <p>
                In no case shall Rock Mountain Performance, its directors, employees, affiliates, or service providers be liable for any injury, loss, or damages arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 12 - INDEMNIFICATION
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Rock Mountain Performance and its affiliates from any claim arising out of your breach of these Terms or violation of any law.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 13 - SEVERABILITY
              </h2>
              <p>
                If any provision of these Terms is determined to be unlawful or unenforceable, the remaining provisions shall remain valid and enforceable.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 14 - TERMINATION
              </h2>
              <p className="mb-4">
                These Terms are effective unless terminated by either you or us.
              </p>
              <p>
                We may terminate this agreement at any time without notice if you fail to comply with any term.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 15 - ENTIRE AGREEMENT
              </h2>
              <p>
                These Terms constitute the entire agreement between you and Rock Mountain Performance and govern your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 16 - GOVERNING LAW
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 17 - CHANGES TO TERMS OF SERVICE
              </h2>
              <p className="mb-4">
                We reserve the right to update or replace any part of these Terms at any time by posting updates to our website.
              </p>
              <p>
                Your continued use of the site constitutes acceptance of those changes.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 18 - CONTACT INFORMATION
              </h2>
              <p>
                Questions about the Terms of Service should be sent to us at:<br />
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
