import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Shared shell for policy pages. The draft banner lives in the component
 * rather than in each page's copy so it cannot be left off one of them —
 * every page using this shell carries the warning until the flag is
 * removed deliberately.
 */
export function PolicyPage({
  title,
  intro,
  updated,
  draft = true,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  draft?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="page-top pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-heading text-3xl font-extrabold text-text-primary sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {intro}
          </p>
          <p className="mt-3 text-xs text-text-muted">Last updated: {updated}</p>

          {draft && (
            <div className="mt-8 rounded-[20px] border border-danger/40 bg-danger/5 p-5">
              <p className="font-heading text-sm font-extrabold text-danger">
                Draft. Not legal advice, not yet reviewed
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                A structural draft written to be reviewed by counsel, not
                approved language. Remove this notice only once a lawyer has
                signed off on the wording.
              </p>
            </div>
          )}

          <div className="mt-10 space-y-10">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function PolicySection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-lg font-extrabold text-text-primary">
        {heading}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
    </section>
  );
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="text-gold">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
