import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Technical notes on handling, storage and documentation from Armoda Labs.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Articles",
    description:
      "Technical notes on handling, storage and documentation from Armoda Labs.",
    url: "/blog",
  },
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
