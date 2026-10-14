// Product catalog — replaces the single-SKU model in lib/sale.ts.
//
// TAXONOMY NOTE: categories are named by chemical/structural class, not by
// therapeutic area. "GLP-1 / GIP Receptor Agonists" is a factual property of
// the molecule; "Weight Management" is a claim about what it does to a person,
// and FDA reads site taxonomy as evidence of intended use (21 CFR 201.128).
// Keep category names descriptive of what a compound IS. Counsel has final say
// on these strings — they are deliberately isolated here so the whole site
// taxonomy is one edit.
//
// PRICES ARE PLACEHOLDERS. Every `priceCents` below is invented scaffolding so
// the grid renders; set real values before launch. Pricing is enforced
// server-side from this file (see getProductBySlug) — the client never sets it.

export interface Category {
  slug: string;
  name: string;
  /** Factual description of the class. No effect or outcome language. */
  blurb: string;
}

export interface Variant {
  /** Shown on the selector pill, e.g. "Vial" or "Kit (10 vials)". */
  label: string;
  /** Appended to the product SKU, e.g. "-K10". */
  skuSuffix: string;
  priceCents: number;
  comparePriceCents?: number;
}

export interface PropertyRow {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Base stock code. Variants append their suffix to it. */
  sku: string;
  /** Short spec line shown under the name — peptides are bought on spec. */
  spec: string;
  categorySlug: string;
  priceCents: number;
  comparePriceCents?: number;
  image: string;
  /**
  * Purchase options. Price always comes from the selected variant, never
  * from the client — the checkout route must re-resolve it from this file.
  */
  variants: Variant[];
  /**
  * Neutral description of what the compound IS: sequence class, form,
  * handling. It must not describe an effect, a use in humans, or an
  * outcome. Placeholder until written per SKU.
  */
  overview?: string;
  /** Spec table rows — CAS, formula, molecular weight, purity, storage. */
  properties?: PropertyRow[];
  /**
  * Known regulatory exposure for this SKU, kept with the product rather than
  * in a doc so it travels with the data. These SKUs are listed and sellable;
  * the note records what was understood when that decision was made, and is
  * what to re-read if a processor or counsel asks.
  */
  complianceNote?: string;
}

export const CATEGORIES: Category[] = [
  {
    // NOTE: this name describes an intended effect rather than a compound
    // class, unlike the other five. See the taxonomy note above — category
    // names are read as evidence of intended use, and "weight management"
    // names a disease indication. Requested deliberately; flagged here so
    // the inconsistency is visible to whoever reviews this file. The
    // class-based alternative was "GLP Compounds".
    slug: "metabolic-and-weight-management",
    name: "Metabolic & Weight Management",
    blurb: "Incretin receptor-binding and mitochondrial-derived peptides.",
  },
  {
    slug: "copper-and-tripeptide-complexes",
    name: "Copper & Tripeptide Complexes",
    blurb: "Copper-complexed peptides and two- to four-residue sequences.",
  },
  {
    slug: "neuropeptides-and-regulatory-peptides",
    name: "Neuropeptides & Regulatory Peptides",
    blurb: "ACTH- and tuftsin-derived analogs and peptide bioregulators.",
  },
  {
    slug: "sequence-specific-peptides",
    name: "Sequence Specific Peptides",
    blurb: "Defined-sequence gastric and thymosin-derived fragments.",
  },
  {
    slug: "growth-hormone-secretagogues",
    name: "Growth Hormone Secretagogues (GHS)",
    blurb: "GHRH analogs and ghrelin receptor-binding peptides.",
  },
];

const PLACEHOLDER = "/product-placeholder.svg";

export const PRODUCTS: Product[] = [
  {
    slug: "retatrutide",
    sku: "RETATRUTIDE",
    name: "Retatrutide",
    spec: "10mg / vial",
    categorySlug: "metabolic-and-weight-management",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
    complianceNote:
      "Investigational compound, not approved in any jurisdiction.",
  },
  {
    slug: "tirzepatide",
    sku: "TIRZEPATIDE",
    name: "Tirzepatide",
    spec: "10mg / vial",
    categorySlug: "metabolic-and-weight-management",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
    complianceNote:
      "Active ingredient in an FDA-approved drug (Mounjaro/Zepbound). Distribution outside that approval carries unapproved-new-drug exposure independent of how the product is described, and is a common trigger for merchant-account termination.",
  },
  {
    slug: "mots-c",
    sku: "MOTSC",
    name: "MOTS-c",
    spec: "10mg / vial",
    categorySlug: "metabolic-and-weight-management",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "ghk-cu",
    sku: "GHKCU",
    name: "GHK-Cu",
    spec: "50mg / vial",
    categorySlug: "copper-and-tripeptide-complexes",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "glow-blend",
    sku: "GLOWBLEND",
    name: "GLOW Blend",
    spec: "Blend / vial",
    categorySlug: "copper-and-tripeptide-complexes",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "klow-blend",
    sku: "KLOWBLEND",
    name: "KLOW Blend",
    spec: "Blend / vial",
    categorySlug: "copper-and-tripeptide-complexes",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "semax",
    sku: "SEMAX",
    name: "Semax",
    spec: "10mg / vial",
    categorySlug: "neuropeptides-and-regulatory-peptides",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "selank",
    sku: "SELANK",
    name: "Selank",
    spec: "10mg / vial",
    categorySlug: "neuropeptides-and-regulatory-peptides",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "semax-selank-complex",
    sku: "SEMAXSELANKC",
    name: "Semax / Selank Complex",
    spec: "Blend / vial",
    categorySlug: "neuropeptides-and-regulatory-peptides",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "bpc-157",
    sku: "BPC157",
    name: "BPC-157",
    spec: "5mg / vial",
    categorySlug: "sequence-specific-peptides",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "tb-500",
    sku: "TB500",
    name: "TB-500",
    spec: "5mg / vial",
    categorySlug: "sequence-specific-peptides",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "bpc-157-tb-500-blend",
    sku: "BPC157TB500B",
    name: "BPC-157 / TB-500 Blend",
    spec: "Blend / vial",
    categorySlug: "sequence-specific-peptides",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "cjc-1295-ipamorelin",
    sku: "CJC1295IPAMO",
    name: "CJC-1295 (No DAC) / Ipamorelin Blend",
    spec: "Blend / vial",
    categorySlug: "growth-hormone-secretagogues",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "kpv",
    sku: "KPV",
    name: "KPV",
    spec: "10mg / vial",
    categorySlug: "copper-and-tripeptide-complexes",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "epitalon",
    sku: "EPITALON",
    name: "Epitalon",
    spec: "10mg / vial",
    categorySlug: "neuropeptides-and-regulatory-peptides",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
  {
    slug: "glutathione",
    sku: "GLUTATHIONE",
    name: "Glutathione",
    spec: "600mg / vial",
    categorySlug: "copper-and-tripeptide-complexes",
    priceCents: 0,
    variants: [
      { label: "Vial", skuSuffix: "", priceCents: 0 },
      { label: "Kit (10 vials)", skuSuffix: "-K10", priceCents: 0 },
    ],
    image: PLACEHOLDER,
  },
];

/**
 * Everything in the catalog renders. This was previously filtered to hold
 * back the two SKUs carrying complianceNote; they are now listed by
 * instruction. Kept as a named export so there is still one place to
 * reintroduce a filter if a processor requires it.
 */
export const LISTED_PRODUCTS = PRODUCTS;

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return LISTED_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function formatPrice(cents: number): string {
  return cents > 0
    ? `$${(cents / 100).toFixed(2)}`
    : "Price on request";
}

/** Lowest variant price, for range display on cards and listings. */
export function priceRange(product: Product): string {
  const prices = product.variants.map((v) => v.priceCents).filter((c) => c > 0);
  if (prices.length === 0) return "Price on request";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
}

/** Same category, excluding the product itself. Falls back to the catalog. */
export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameClass = LISTED_PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug
  );
  const filler = LISTED_PRODUCTS.filter(
    (p) => p.categorySlug !== product.categorySlug && p.slug !== product.slug
  );
  return [...sameClass, ...filler].slice(0, limit);
}
