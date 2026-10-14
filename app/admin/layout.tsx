import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // Belt and braces alongside robots.txt - this must never be indexed.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Deliberately no storefront Header/Footer - the admin area is its own shell.
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
