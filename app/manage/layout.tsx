import type { Metadata } from "next";

// Transactional page - useful to visitors, not a search landing page.
export const metadata: Metadata = {
  title: "Manage Subscription",
  robots: { index: false, follow: true },
};

export default function ManageSubscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
