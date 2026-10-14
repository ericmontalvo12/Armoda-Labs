import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { CATEGORIES } from "@/lib/catalog";

/**
 * Category navigation. Names come from lib/catalog.ts, which classifies by
 * chemical class rather than therapeutic area on purpose — see the taxonomy
 * note there before renaming anything here.
 */
export function CategoryTiles() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <SectionHeading title="Shop by class" />
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/products/category/${c.slug}`}
              className="flex flex-col rounded-[20px] border border-border bg-surface p-5 transition-colors hover:border-gold hover:bg-surface-elevated"
            >
              <span className="font-heading text-sm font-extrabold leading-snug text-text-primary">
                {c.name}
              </span>
              <span className="mt-2 text-xs leading-relaxed text-text-muted">
                {c.blurb}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
