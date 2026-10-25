import { ChevronRight } from "lucide-react";

/** Chevron + title over a hairline rule, used to open each homepage band. */
export function PanelHeading({ title }: { title: string }) {
  return (
    <>
      <h2 className="flex items-center gap-2 font-heading text-2xl font-extrabold text-text-primary sm:text-3xl">
        <ChevronRight className="h-5 w-5 text-gold" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-6 h-px w-full bg-border" />
    </>
  );
}
