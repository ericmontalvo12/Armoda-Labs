import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story behind Rock Mountain Performance and why we build fully disclosed, research-aligned supplements for men who read labels.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us",
    description:
      "The story behind Rock Mountain Performance and why we build fully disclosed, research-aligned supplements for men who read labels.",
    url: "/about",
  },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
