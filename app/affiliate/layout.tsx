import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Earn commission referring Armoda Labs. Code-based attribution, no cost to join, and clear content rules so partners know exactly what they can publish.",
  alternates: { canonical: "/affiliate" },
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
