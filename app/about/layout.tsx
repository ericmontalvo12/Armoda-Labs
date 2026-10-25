import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Armoda Labs supplies defined-sequence research peptides, independently tested with a certificate of analysis published for every lot.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Who We Are",
    description:
      "Armoda Labs supplies defined-sequence research peptides, independently tested with a certificate of analysis published for every lot.",
    url: "/about",
  },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
