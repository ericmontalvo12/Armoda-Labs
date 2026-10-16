import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about a product's specification, a certificate of analysis, or an order? Get in touch with Armoda Labs.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description:
      "Questions about a product's specification, a certificate of analysis, or an order? Get in touch with Armoda Labs.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
