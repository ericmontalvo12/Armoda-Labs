import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inside the Formula",
  description:
    "A breakdown of all seven ingredients in Peak Performance - the exact dose, the form used, and the human research behind each one.",
  alternates: { canonical: "/formula" },
  openGraph: {
    title: "Inside the Formula",
    description:
      "A breakdown of all seven ingredients in Peak Performance - the exact dose, the form used, and the human research behind each one.",
    url: "/formula",
  },
};

export default function InsidetheFormulaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
