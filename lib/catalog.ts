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

export interface Product {
  slug: string;
  name: string;
  /** Short spec line shown under the name — peptides are bought on spec. */
  spec: string;
  categorySlug: string;
  priceCents: number;
  comparePriceCents?: number;
  image: string;
  /** Marks SKUs needing a legal/processor decision before they go live. */
  restricted?: boolean;
  restrictionNote?: string;
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
    name: "Retatrutide",
    spec: "10mg / vial",
    categorySlug: "metabolic-and-weight-management",
    priceCents: 0,
    image: PLACEHOLDER,
    restricted: true,
    restrictionNote:
      "Investigational compound, not approved in any jurisdiction. Confirm with counsel and with the payment processor before listing.",
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    spec: "10mg / vial",
    categorySlug: "metabolic-and-weight-management",
    priceCents: 0,
    image: PLACEHOLDER,
    restricted: true,
    restrictionNote:
      "Active ingredient in an FDA-approved drug (Mounjaro/Zepbound). Distribution outside that approval carries unapproved-new-drug exposure independent of how it is described. Confirm with counsel and with the payment processor before listing.",
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    spec: "10mg / vial",
    categorySlug: "metabolic-and-weight-management",
    priceCents: 0,
    image: PLACEHOLDER,
  },
  { slug: "ghk-cu", name: "GHK-Cu", spec: "50mg / vial", categorySlug: "copper-and-tripeptide-complexes", priceCents: 0, image: PLACEHOLDER },
  { slug: "glow-blend", name: "GLOW Blend", spec: "Blend / vial", categorySlug: "copper-and-tripeptide-complexes", priceCents: 0, image: PLACEHOLDER },
  { slug: "klow-blend", name: "KLOW Blend", spec: "Blend / vial", categorySlug: "copper-and-tripeptide-complexes", priceCents: 0, image: PLACEHOLDER },
  { slug: "semax", name: "Semax", spec: "10mg / vial", categorySlug: "neuropeptides-and-regulatory-peptides", priceCents: 0, image: PLACEHOLDER },
  { slug: "selank", name: "Selank", spec: "10mg / vial", categorySlug: "neuropeptides-and-regulatory-peptides", priceCents: 0, image: PLACEHOLDER },
  { slug: "semax-selank-complex", name: "Semax / Selank Complex", spec: "Blend / vial", categorySlug: "neuropeptides-and-regulatory-peptides", priceCents: 0, image: PLACEHOLDER },
  { slug: "bpc-157", name: "BPC-157", spec: "5mg / vial", categorySlug: "sequence-specific-peptides", priceCents: 0, image: PLACEHOLDER },
  { slug: "tb-500", name: "TB-500", spec: "5mg / vial", categorySlug: "sequence-specific-peptides", priceCents: 0, image: PLACEHOLDER },
  { slug: "bpc-157-tb-500-blend", name: "BPC-157 / TB-500 Blend", spec: "Blend / vial", categorySlug: "sequence-specific-peptides", priceCents: 0, image: PLACEHOLDER },
  { slug: "cjc-1295-ipamorelin", name: "CJC-1295 (No DAC) / Ipamorelin Blend", spec: "Blend / vial", categorySlug: "growth-hormone-secretagogues", priceCents: 0, image: PLACEHOLDER },
  { slug: "kpv", name: "KPV", spec: "10mg / vial", categorySlug: "copper-and-tripeptide-complexes", priceCents: 0, image: PLACEHOLDER },
  { slug: "epitalon", name: "Epitalon", spec: "10mg / vial", categorySlug: "neuropeptides-and-regulatory-peptides", priceCents: 0, image: PLACEHOLDER },
  { slug: "glutathione", name: "Glutathione", spec: "600mg / vial", categorySlug: "copper-and-tripeptide-complexes", priceCents: 0, image: PLACEHOLDER },
];

/** Products safe to render today — restricted SKUs stay out until cleared. */
export const LISTED_PRODUCTS = PRODUCTS.filter((p) => !p.restricted);

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
