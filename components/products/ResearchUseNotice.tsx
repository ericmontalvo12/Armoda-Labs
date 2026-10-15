/**
 * Product-level research-use notice.
 *
 * This sits above the product rather than only in the footer deliberately.
 * A disclaimer buried site-wide carries little weight when the page around
 * it is shaped like consumer retail; stating the restriction at the point
 * of purchase is the part that is actually load-bearing.
 *
 * WORDING IS NOT FINAL. This is placeholder text pending the disclaimer
 * work in CLAUDE.md (open decision 3) and must be reviewed by counsel
 * before launch. Do not treat it as approved language.
 */
export function ResearchUseNotice() {
  return (
    <div className="rounded-[20px] border border-danger/40 bg-danger/5 px-5 py-4 text-center">
      <p className="text-sm text-text-primary">
        <span className="font-heading font-bold text-danger">
          Product usage:
        </span>{" "}
        This product is intended for laboratory research purposes only.
      </p>
      <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-text-secondary">
        All product information on this site is provided for educational
        purposes. Introduction into humans or animals is prohibited. This
        material must be handled only by qualified professionals. It is not a
        drug, food or cosmetic, and must not be misbranded, misused or
        mislabeled as such.
      </p>
    </div>
  );
}
