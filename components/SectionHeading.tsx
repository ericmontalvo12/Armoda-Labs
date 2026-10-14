/**
 * Centered section heading with the short rule beneath it, plus the optional
 * eyebrow label used by the split sections. Every homepage band uses this so
 * the vertical rhythm stays identical across them.
 */
export function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="mb-3 text-xs font-heading font-bold uppercase tracking-[0.14em] text-gold-deep">
          <span aria-hidden="true">— </span>
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
        {title}
      </h2>
      <div
        className={`mt-3 h-[3px] w-14 rounded-full bg-gold ${centered ? "mx-auto" : ""}`}
      />
    </div>
  );
}
