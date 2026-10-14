import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Rock Mountain Performance collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-surface/50">
      <Header />
      <main className="pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-8">
            Privacy Policy
          </h1>

          <div className="max-w-none space-y-8 text-text-secondary">
            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 1 - WHAT DO WE DO WITH YOUR INFORMATION?
              </h2>
              <p className="mb-4">
                When you purchase a product or service from Rock Mountain Performance, as part of the buying and selling process, we collect the personal information you provide such as your name, billing address, shipping address, email address, phone number, and payment-related details.
              </p>
              <p className="mb-4">
                When you browse our website, we also automatically receive your computer's Internet Protocol (IP) address and related technical information in order to help us learn about your browser, device, and operating system.
              </p>
              <p className="mb-4">
                <strong>Email marketing (if applicable):</strong><br />
                With your permission, we may send you emails about Rock Mountain Performance, new products, services, promotions, and other updates.
              </p>
              <p>
                <strong>Text marketing (if applicable):</strong><br />
                With your permission, we may send text messages about our products, services, promotions, and other updates. These messages may include checkout reminders or service-related notifications. Automated systems and webhooks may be used to deliver these messages.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 2 - CONSENT
              </h2>
              <p className="mb-4">
                <strong>How do you get my consent?</strong><br />
                When you provide us with personal information to complete a transaction, verify payment details, place an order, schedule a service, or request support, we imply that you consent to our collecting and using that information for that specific purpose only.
              </p>
              <p className="mb-4">
                If we request your personal information for a secondary purpose, such as marketing, we will either ask for your explicit consent or provide you with an opportunity to opt out.
              </p>
              <p>
                <strong>How do I withdraw my consent?</strong><br />
                If after opting in you change your mind, you may withdraw your consent for us to contact you or for the continued collection, use, or disclosure of your information at any time by contacting us at:<br />
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 3 - DISCLOSURE
              </h2>
              <p>
                We may disclose your personal information if required by law, regulation, or legal process, or if you violate our Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 4 - WEBSITE PLATFORM & PAYMENTS
              </h2>
              <p className="mb-4">
                Our website is built and managed using WordPress and may utilize third-party plugins, tools, and services to operate functionality such as forms, analytics, email delivery, and checkout processing.
              </p>
              <p className="mb-4">
                <strong>Payment Processing</strong><br />
                Payments are processed securely through third-party payment processors. We do not store your full credit card information on our servers.
              </p>
              <p>
                Payment data is encrypted and handled in compliance with the Payment Card Industry Data Security Standard (PCI-DSS). Transaction data is retained only as long as necessary to complete your purchase and meet legal or accounting requirements.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 5 - THIRD-PARTY SERVICES
              </h2>
              <p className="mb-4">
                In general, third-party providers used by us will only collect, use, and disclose your information to the extent necessary to perform the services they provide to us.
              </p>
              <p className="mb-4">
                Certain third-party service providers—such as payment processors, email platforms, SMS providers, and analytics tools—have their own privacy policies regarding the information we are required to provide to them.
              </p>
              <p className="mb-4">
                We recommend reviewing their privacy policies to understand how your personal information is handled.
              </p>
              <p className="mb-4">
                Some providers may be located in different jurisdictions than you or us. As a result, your information may be subject to the laws of those jurisdictions.
              </p>
              <p>
                Once you leave our website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SMS / MMS MOBILE MESSAGING MARKETING PROGRAM
              </h2>
              <p className="mb-4">
                We respect your privacy. Information collected through our mobile messaging program is used solely to transmit messages and respond when necessary. This may include sharing information with messaging platforms, wireless carriers, and service providers who assist in message delivery.
              </p>
              <p className="mb-4">
                We do NOT sell, rent, trade, lease, or transfer phone numbers or customer information for profit.
              </p>
              <p className="mb-4">
                We reserve the right to disclose information if required by law, regulation, or governmental request, or to protect our rights or property.
              </p>
              <p className="mb-4">
                You agree to provide accurate and truthful information when opting into the program.
              </p>
              <p>
                Providing false or misleading information may result in removal from the program.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                CALIFORNIA PRIVACY RIGHTS
              </h2>
              <p className="mb-4">
                California Civil Code Section 1798.83 permits California residents to request information regarding the disclosure of personal information to third parties for direct marketing purposes.
              </p>
              <p className="mb-4">
                To make such a request, please contact:<br />
                Rock Mountain Performance<br />
                <a href="mailto:contact@rockmountainperformance.com" className="text-primary hover:underline">
                  contact@rockmountainperformance.com
                </a>
              </p>
              <p>
                This Privacy Policy applies only to this website and program and does not affect other privacy policies that may govern separate relationships.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                Links
              </h2>
              <p>
                When you click on links on our website, they may direct you away from our site. We are not responsible for the privacy practices of other websites and encourage you to read their privacy statements.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 6 - SECURITY
              </h2>
              <p>
                To protect your personal information, we take reasonable precautions and follow industry best practices to prevent loss, misuse, unauthorized access, disclosure, alteration, or destruction. Sensitive data such as payment information is encrypted using SSL technology and handled by secure, PCI-compliant processors. While no method of transmission over the Internet is 100% secure, we implement industry-standard safeguards.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 7 - COOKIES
              </h2>
              <p>
                We use cookies and similar technologies to enhance user experience, analyze website traffic, and improve functionality. Cookies may collect information such as session data, page interactions, and preferences. You can choose to disable cookies through your browser settings; however, some site features may not function properly.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 8 - AGE OF CONSENT
              </h2>
              <p>
                By using this website, you represent that you are at least the age of majority in your state or province of residence, or that you have given consent for any minor dependents to use this site.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                SECTION 9 - CHANGES TO THIS PRIVACY POLICY
              </h2>
              <p className="mb-4">
                We reserve the right to modify this Privacy Policy at any time. Changes take effect immediately upon posting on the website.
              </p>
              <p className="mb-4">
                If material changes are made, we will update this page to reflect the changes.
              </p>
              <p>
                If Rock Mountain Performance is acquired or merged with another company, your information may be transferred to the new owners so we may continue to operate and serve you.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-text-primary mb-4">
                QUESTIONS AND CONTACT INFORMATION
              </h2>
              <p>
                If you would like to access, correct, amend, or delete any personal information we have about you, register a complaint, or request more information, contact:<br />
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
