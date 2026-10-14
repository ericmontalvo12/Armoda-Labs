import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about Peak Performance, your order, or our formula? Get in touch with the Rock Mountain Performance team.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description:
      "Questions about Peak Performance, your order, or our formula? Get in touch with the Rock Mountain Performance team.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
