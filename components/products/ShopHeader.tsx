import Link from "next/link";

/** Breadcrumb + eyebrow + title band, shared by the shop and category routes. */
export function ShopHeader({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="page-top mx-auto max-w-[1280px] px-4 pb-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:text-gold-text">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-text-secondary">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="mt-6 text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold-text">
          <span aria-hidden="true">— </span>
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
