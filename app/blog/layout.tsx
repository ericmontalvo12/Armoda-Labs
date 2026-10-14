import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Research-backed articles on testosterone, supplementation, sleep, cortisol, and training from Rock Mountain Performance.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Articles",
    description:
      "Research-backed articles on testosterone, supplementation, sleep, cortisol, and training from Rock Mountain Performance.",
    url: "/blog",
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
