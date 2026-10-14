import type { Metadata } from "next";

// Transactional page - useful to visitors, not a search landing page.
export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: true },
};

export default function YourCartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
