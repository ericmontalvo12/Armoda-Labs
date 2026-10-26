# Structure verification worksheet

Catalog tiles do not render until an entry is marked `verified=True` in
`scripts/generate-structures.py`. This is that check.

**Why the gate exists.** Armoda's claim is documentation. A wrong structure
is a checkable error in the one field the brand claims competence in, and it
sits on the product page where a customer who knows the compound will see it.
No image is better than a wrong image.

**What is already done.** Every structure below builds, and the formula and
mass are COMPUTED by RDKit from the structure that gets drawn — they cannot
drift from the picture or be typo'd. What is not done is confirming that the
sequence is the right sequence for the product being sold.

**What you do.** For each row, open the PubChem link, compare two numbers,
tick it. Disagreement means stop and investigate, not adjust.

## How to check one row

1. Open the PubChem URL.
2. Compare **Molecular Formula** and **Molecular Weight** with the computed
   values below. They should match (mass to within ~0.1).
3. Confirm the **sequence** PubChem lists matches the one below.
4. If all three agree, set that entry's `verified` flag to `True` in
   `scripts/generate-structures.py`.

When every row you intend to ship is ticked:

```
pip install rdkit && python3 -I scripts/generate-structures.py
```

That writes the SVGs to `public/structures/` and the computed specs to
`lib/structure-data.json`.

## Rows to check

| Slug | Sequence | Computed formula | Computed MW | PubChem |
|---|---|---|---|---|
| `glutathione` | SMILES (gamma-glutamyl) | C10H17N3O6S | 307.33 | https://pubchem.ncbi.nlm.nih.gov/compound/124886 |
| `kpv` | Lys-Pro-Val | C16H30N4O4 | 342.44 | search "KPV tripeptide" |
| `ghk-cu` | Gly-His-Lys + Cu(+) at the C-terminus | C14H23CuN6O4+ | 402.92 | https://pubchem.ncbi.nlm.nih.gov/compound/10071107 |
| `epitalon` | Ala-Glu-Asp-Gly | C14H22N4O9 | 390.35 | search "Epitalon" |
| `semax` | Met-Glu-His-Phe-Pro-Gly-Pro | C37H51N9O10S | 813.93 | search "Semax" |
| `selank` | Thr-Lys-Pro-Arg-Pro-Gly-Pro | C33H57N11O9 | 751.89 | search "Selank" |
| `tb-500` | Leu-Lys-Lys-Thr-Glu-Thr-Gln | C36H66N10O13 | 846.98 | see warning below |
| `bpc-157` | Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val | C62H98N16O22 | 1419.56 | search "BPC-157" |
| `mots-c` | Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg | C101H152N28O22S2 | 2174.64 | search "MOTS-c" |

## Two rows that need a decision, not just a tick

### `ghk-cu` — RESOLVED

Was drawing the bare tripeptide under a title naming the copper complex,
which would have printed GHK's formula (C14H24N6O4 / 340.38) on a GHK-Cu
card. Now drawn from a SMILES with Cu(+) bound at the C-terminal
carboxylate, so the computed values describe the complex that is sold:
**C14H23CuN6O4+ / 402.92 g/mol**.

Confirmed two independent ways - RDKit's computation from the structure, and
a published tile for the same compound - which agree to the decimal. The
arithmetic also checks out by hand: GHK minus one hydrogen plus copper.

Outstanding: the CAS (89030-95-5) came off a third-party listing. Confirm it
against the CoA.

### `tb-500` — confirm which fragment you are selling

"TB-500" is sold as several different things: the bare 7-mer LKKTETQ, an
N-acetylated form, a C-amidated form, or both. Each has a different mass, so
the number on the card depends on which one your supplier ships.

Check the CoA for the lot, not a general reference. If the CoA says acetylated
or amidated, the sequence string in the generator needs changing before this
row can be ticked.

## Not drawable — seven SKUs

These are `kind="none"` and render no image by design:

- `retatrutide`, `tirzepatide` — non-standard residues and a fatty-acid
  chain that the sequence builder cannot express. A hand-supplied SMILES
  from PubChem would make these drawable.
- `cjc-1295-ipamorelin` — Ipamorelin contains Aib and D-residues; also a
  blend.
- `semax-selank-complex`, `bpc-157-tb-500-blend`, `glow-blend`,
  `klow-blend` — blends have no single structure.

For the blends, a structure is the wrong object anyway. They need a
different card: the component list set in the same frame, which the
`5-Amino/MIC` tile on the reference site does.
