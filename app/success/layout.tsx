import type { Metadata } from "next";

// Transactional page - useful to visitors, not a search landing page.
export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: true },
};

export default function OrderConfirmedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
