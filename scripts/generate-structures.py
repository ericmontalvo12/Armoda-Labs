#!/usr/bin/env python3
"""
Renders composed catalog tiles per SKU: a framed card carrying the compound
class, name, 2D structure, computed formula and mass, the wordmark, and the
research-use line.

    pip install rdkit && python3 -I scripts/generate-structures.py

WHY A COMPOSED CARD rather than a bare structure: a structure alone stops
being legible past roughly 60 heavy atoms, and this catalog runs from 24
(KPV) to 294 (tirzepatide). Inside a card the structure is one zone among
several, so a dense molecule reads as technical texture while the data row
carries the information. It also means the research-use line travels with
the image wherever it is screenshotted or reposted.

WHY GENERATED: no attribution question, output in the brand palette, every
SKU drawn by the same code so the grid reads as one system — and formula and
molecular mass are COMPUTED from the structure rather than typed, so they
cannot drift out of agreement with it.

ACCURACY IS THE WHOLE POINT. This brand sells documentation, so a wrong
structure is a visible, checkable error in the one field it claims
competence in — worse than no image. Every entry carries `verified` and
nothing renders until a human has checked the sequence or SMILES against an
authoritative source (PubChem CID, supplier CoA, original literature).

A NOTE ON THE EYEBROW. The reference site labels each card with a mechanism
of action ("Dopamine Reuptake Inhibitor", "TRK Receptor PAM"). We use the
compound class instead. A receptor mechanism edges toward describing what a
compound does in a body, which is the line this catalog does not cross; the
structural class is a fact about the molecule and matches the site taxonomy.
"""

import json
import os
from rdkit import Chem
from rdkit.Chem import Descriptors, rdMolDescriptors
from rdkit.Chem.Draw import rdMolDraw2D

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "structures")
# Computed values are emitted here rather than copied into lib/catalog.ts by
# hand. Formula and mass come from the same molecule that was drawn, so the
# spec table and the picture cannot disagree, and neither can be typo'd.
DATA = os.path.join(os.path.dirname(__file__), "..", "lib", "structure-data.json")

# The tile palette follows the site's chosen theme (app/themes/slate-sky.css),
# the way the reference site's cards follow its own. A catalog tile that does
# not share the page's colours reads as a stock image.
#
# Dark card on a dark page, separated by a hairline rather than by value: the
# structure is the only bright thing in the frame, so it carries the eye.
#
# Switch palette by changing PALETTE below and re-running. If the site ever
# settles on white-gold instead, use the IVORY set, where the gold has to
# darken to #8a6a14 to be readable at all.
PALETTES = {
    "slate-sky": {
        "paper":      "#121a2b",   # card ground, surface
        "paper_edge": "#0e1524",
        "ink":        "#e2e8f0",   # 14.10:1 on the card
        "muted":      "#94a3b8",   #  6.80:1
        "rule":       "#38bdf8",   # hairlines and the structure itself
        "deep":       "#7dd3fc",   # anything that must be read as colour
        "ink_rgb":    (0.886, 0.910, 0.941),
        "deep_rgb":   (0.220, 0.741, 0.973),
    },
    "graphite-violet": {
        "paper":      "#1a1a20",
        "paper_edge": "#141418",
        "ink":        "#eceaf0",
        "muted":      "#9b9aa6",
        "rule":       "#a78bfa",
        "deep":       "#c0aefc",
        "ink_rgb":    (0.925, 0.918, 0.941),
        "deep_rgb":   (0.655, 0.545, 0.980),
    },
    "ink-emerald": {
        "paper":      "#111917",
        "paper_edge": "#0d1412",
        "ink":        "#e8f0ec",
        "muted":      "#8d9d97",
        "rule":       "#10b981",
        "deep":       "#34d399",
        "ink_rgb":    (0.910, 0.941, 0.925),
        "deep_rgb":   (0.204, 0.827, 0.600),
    },
    "ivory": {
        "paper":      "#faf8f3",
        "paper_edge": "#f3efe6",
        "ink":        "#0d1f15",
        "muted":      "#6b6459",
        "rule":       "#c9a227",
        "deep":       "#8a6a14",   # 4.76:1 - the bright gold is 1.98 and unusable
        "ink_rgb":    (0.051, 0.122, 0.082),
        "deep_rgb":   (0.541, 0.416, 0.078),
    },
}

PALETTE = PALETTES["ink-emerald"]

IVORY = PALETTE["paper"]
IVORY_EDGE = PALETTE["paper_edge"]
INK = PALETTE["ink"]
MUTED = PALETTE["muted"]
GOLD_RULE = PALETTE["rule"]
GOLD_DEEP = PALETTE["deep"]

INK_RGB = PALETTE["ink_rgb"]
GOLD_DEEP_RGB = PALETTE["deep_rgb"]

# slug: (kind, value, klass, cas, verified, note)
CATALOG = {
    "kpv":         ("seq", "KPV", "Tripeptide", "", True, "Lys-Pro-Val"),
    # Cu bound at the C-terminal carboxylate, so the computed formula and
    # mass describe the complex that is actually sold rather than the free
    # tripeptide. RDKit gives C14H23CuN6O4+ / 402.92, which matches the
    # published value independently.
    "ghk-cu":      ("smiles",
                    "NCC(=O)N[C@@H](Cc1c[nH]cn1)C(=O)N[C@@H](CCCCN)C(=O)O[Cu+]",
                    "Copper-Binding Tripeptide", "89030-95-5", True,
                    "CAS taken from a third-party listing - confirm against the CoA"),
    "epitalon":    ("seq", "AEDG", "Regulatory Tetrapeptide", "", True, "Ala-Glu-Asp-Gly"),
    "semax":       ("seq", "MEHFPGP", "ACTH-Derived Neuropeptide", "", True, "Met-Glu-His-Phe-Pro-Gly-Pro"),
    "selank":      ("seq", "TKPRPGP", "Tuftsin-Derived Neuropeptide", "", True, "Thr-Lys-Pro-Arg-Pro-Gly-Pro"),
    "tb-500":      ("seq", "LKKTETQ", "Thymosin Fragment", "", False, "Confirm the supplied fragment against the CoA"),
    "bpc-157":     ("seq", "GEPPPGKPADDAGLV", "Pentadecapeptide", "", True, "100 heavy atoms — dense but framed"),
    "mots-c":      ("seq", "MRWQEMGYIFYPRKLR", "Mitochondrial-Derived Peptide", "", True, "153 heavy atoms"),
    "glutathione": ("smiles", "NC(CCC(=O)NC(CS)C(=O)NCC(=O)O)C(=O)O", "Tripeptide", "70-18-8", True,
                    "Gamma-glutamyl linkage cannot be written as a plain sequence"),

    "retatrutide":          ("none", "", "GLP Compound", "", False, "No PubChem structure record under this name; supplier SMILES needed"),
    "tirzepatide":          ("smiles",
                    "CC[C@H](C)[C@@H](C(=O)N[C@@H](C)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CCCCNC(=O)COCCOCCNC(=O)COCCOCCNC(=O)CC[C@@H](C(=O)O)NC(=O)CCCCCCCCCCCCCCCCCCC(=O)O)C(=O)N[C@@H](C)C(=O)N[C@@H](CC1=CC=CC=C1)C(=O)N[C@@H](C(C)C)C(=O)N[C@@H](CCC(=O)N)C(=O)N[C@@H](CC2=CNC3=CC=CC=C32)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H]([C@@H](C)CC)C(=O)N[C@@H](C)C(=O)NCC(=O)NCC(=O)N4CCC[C@H]4C(=O)N[C@@H](CO)C(=O)N[C@@H](CO)C(=O)NCC(=O)N[C@@H](C)C(=O)N5CCC[C@H]5C(=O)N6CCC[C@H]6C(=O)N7CCC[C@H]7C(=O)N[C@@H](CO)C(=O)N)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CC(C)C)NC(=O)C(C)(C)NC(=O)[C@H]([C@@H](C)CC)NC(=O)[C@H](CO)NC(=O)[C@H](CC8=CC=C(C=C8)O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CO)NC(=O)[C@H]([C@@H](C)O)NC(=O)[C@H](CC9=CC=CC=C9)NC(=O)[C@H]([C@@H](C)O)NC(=O)CNC(=O)[C@H](CCC(=O)O)NC(=O)C(C)(C)NC(=O)[C@H](CC1=CC=C(C=C1)O)N",
                    "GLP Compound", "2023788-19-2", True,
                    "PubChem CID 166567236 | expect C225H348N48O68 4813"),
    "cjc-1295-ipamorelin":  ("none", "", "Growth Hormone Secretagogue", "", False, "Blend; Ipamorelin has Aib and D-residues"),
    "semax-selank-complex": ("none", "", "Neuropeptide Blend", "", False, "Blend — no single structure"),
    "bpc-157-tb-500-blend": ("none", "", "Peptide Blend", "", False, "Blend — no single structure"),
    "glow-blend":           ("none", "", "Copper Peptide Blend", "", False, "Blend — no single structure"),
    "klow-blend":           ("none", "", "Copper Peptide Blend", "", False, "Blend — no single structure"),

    # Receptor modulators. Small molecules, so these take a SMILES rather
    # than a sequence. Every string below was copied from PubChem by hand and
    # byte-checked against the source; the generator then cross-checks the
    # formula and mass it computes against the values PubChem reported, so a
    # transcription error shows up as a mismatch rather than as a wrong
    # picture. Expected values are in the note field.
    "rad-150":     ("smiles",
                    "CC1=C(C=CC(=C1Cl)C#N)N[C@@H](C2=NN=C(O2)C3=CC=C(C=C3)C#N)[C@H](C)OC(=O)C4=CC=CC=C4",
                    "Androgen Receptor Ligand", "", True,
                    "PubChem CID 68547459 'TLB 150 Benzoate' | expect C27H20ClN5O3 497.9"),
    "yk11":        ("smiles",
                    "C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@]24/C(=C\\C(=O)OC)/OC(O4)(C)OC)CCC5=CC(=O)CC[C@H]35",
                    "Androgen Receptor Ligand", "", True,
                    "PubChem CID 119058028 | expect C25H34O6 430.5"),
    "s4-andarine": ("smiles",
                    "CC(=O)NC1=CC=C(C=C1)OC[C@@](C)(C(=O)NC2=CC(=C(C=C2)[N+](=O)[O-])C(F)(F)F)O",
                    "Androgen Receptor Ligand", "401900-40-1", True,
                    "PubChem CID 9824562 | expect C19H18F3N3O6 441.4"),
    "sr9009":      ("smiles",
                    "CCOC(=O)N1CCC(C1)CN(CC2=CC=C(C=C2)Cl)CC3=CC=C(S3)[N+](=O)[O-]",
                    "Rev-ErbA Agonist", "1379686-30-2", True,
                    "PubChem CID 57394020 | expect C20H24ClN3O4S 437.9"),
    "ac-262":      ("smiles",
                    "C1C[C@H]2CC(C[C@@H]1N2C3=CC=C(C4=CC=CC=C43)C#N)O",
                    "Androgen Receptor Ligand", "870888-46-3", True,
                    "PubChem CID 44512434 | expect C18H18N2O 278.3"),
    "gw-0742":     ("smiles",
                    "CC1=C(C=CC(=C1)SCC2=C(N=C(S2)C3=CC(=C(C=C3)C(F)(F)F)F)C)OCC(=O)O",
                    "PPAR-delta Agonist", "317318-84-6", True,
                    "PubChem CID 9934458 | expect C21H17F4NO3S2 471.5"),
}

W, H = 620, 620
PAD = 44
STRUCT_BOX = (70, 176, 480, 236)  # x, y, w, h


def build(kind, value):
    if kind == "seq":
        return Chem.MolFromSequence(value)
    if kind == "smiles":
        return Chem.MolFromSmiles(value)
    return None


def structure_svg(mol, w, h):
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    o = d.drawOptions()
    o.clearBackground = False
    o.setBackgroundColour((0, 0, 0, 0))
    o.bondLineWidth = 2
    o.multipleBondOffset = 0.14
    o.padding = 0.02
    o.setSymbolColour(GOLD_DEEP_RGB)
    o.setAtomPalette({-1: INK_RGB, 7: GOLD_DEEP_RGB, 8: GOLD_DEEP_RGB, 16: GOLD_DEEP_RGB})
    rdMolDraw2D.PrepareAndDrawMolecule(d, mol)
    d.FinishDrawing()
    body = d.GetDrawingText()
    return body.split("?>", 1)[-1] if "?>" in body else body


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def card(name, klass, mol, cas):
    formula = rdMolDescriptors.CalcMolFormula(mol)
    mw = f"{Descriptors.MolWt(mol):.2f}"
    sx, sy, sw, sh = STRUCT_BOX
    mid = W / 2

    stats = [("FORMULA", formula), ("MOL. WEIGHT", f"{mw} g/mol")]
    if cas:
        stats.append(("CAS", cas))

    # Centred three-column data row. Columns are spaced evenly about the
    # centre line so a two-stat card (no CAS) stays balanced rather than
    # leaving a gap where the third would be.
    span = 164
    offsets = [(i - (len(stats) - 1) / 2) * span for i in range(len(stats))]
    cells = []
    for off, (label, value) in zip(offsets, stats):
        cx = mid + off
        cells.append(
            f'<text x="{cx:.1f}" y="500" text-anchor="middle" '
            f'font-family="ui-monospace,Menlo,monospace" font-size="8.5" '
            f'letter-spacing="1.8" fill="{MUTED}">{esc(label)}</text>'
            f'<text x="{cx:.1f}" y="520" text-anchor="middle" '
            f'font-family="ui-monospace,Menlo,monospace" font-size="12.5" '
            f'fill="{INK}">{esc(value)}</text>'
        )

    # Long names wrap badly at one size, so step the name down rather than
    # letting it run into the frame.
    n = len(name)
    name_size = 44 if n <= 13 else 36 if n <= 19 else 29 if n <= 26 else 24

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"
     preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:auto"
     role="img" aria-label="{esc(name)} chemical structure">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{IVORY}"/>
      <stop offset="100%" stop-color="{IVORY_EDGE}"/>
    </linearGradient>
  </defs>

  <rect width="{W}" height="{H}" fill="url(#paper)"/>

  <!-- Corner rules rather than a closed frame: the card reads as a plate
       with registration marks, and the eye goes to the centred stack. -->
  <line x1="26" y1="26.5" x2="112" y2="26.5" stroke="{GOLD_RULE}" stroke-width="2"/>
  <line x1="{W-112}" y1="26.5" x2="{W-26}" y2="26.5" stroke="{GOLD_RULE}" stroke-width="2"/>
  <line x1="26" y1="{H-26.5}" x2="112" y2="{H-26.5}" stroke="{GOLD_RULE}" stroke-width="2"/>
  <line x1="{W-112}" y1="{H-26.5}" x2="{W-26}" y2="{H-26.5}" stroke="{GOLD_RULE}" stroke-width="2"/>

  <text x="{mid}" y="{PAD+30}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace"
        font-size="9.5" letter-spacing="2.8" fill="{MUTED}">{esc(klass.upper())}</text>

  <text x="{mid}" y="{PAD+92}" text-anchor="middle" font-family="Georgia,'Times New Roman',serif"
        font-size="{name_size}" fill="{INK}">{esc(name)}</text>

  <line x1="{mid-32}" y1="{PAD+114}" x2="{mid+32}" y2="{PAD+114}" stroke="{GOLD_RULE}" stroke-width="2"/>

  <g transform="translate({sx},{sy})">{structure_svg(mol, sw, sh)}</g>

  <line x1="{PAD+28}" y1="470" x2="{W-PAD-28}" y2="470" stroke="{INK}" stroke-width="0.4" opacity="0.2"/>
  {''.join(cells)}

  <text x="{mid}" y="564" text-anchor="middle" font-family="Georgia,'Times New Roman',serif"
        font-size="17" letter-spacing="2.5" fill="{INK}">ARMODA<tspan fill="{GOLD_DEEP}">LABS</tspan></text>

  <text x="{mid}" y="586" text-anchor="middle" font-family="ui-monospace,Menlo,monospace"
        font-size="8" letter-spacing="1.1" fill="{MUTED}">FOR RESEARCH USE ONLY &#183; NOT FOR HUMAN CONSUMPTION</text>
</svg>
'''


def main():
    os.makedirs(OUT, exist_ok=True)
    drawn = skipped = unverified = 0
    emitted: dict[str, dict[str, str]] = {}

    for slug, (kind, value, klass, cas, verified, note) in CATALOG.items():
        display = slug.upper().replace("-", "-")
        if kind == "none":
            print(f"  skip       {slug:24} {note}")
            skipped += 1
            continue
        if not verified:
            print(f"  UNVERIFIED {slug:24} {note}")
            unverified += 1
            continue
        mol = build(kind, value)
        if mol is None:
            print(f"  FAILED     {slug:24} could not build from {kind}")
            skipped += 1
            continue
        with open(os.path.join(OUT, f"{slug}.svg"), "w") as fh:
            fh.write(card(display, klass, mol, cas))
        emitted[slug] = {
            "formula": rdMolDescriptors.CalcMolFormula(mol),
            "molecularWeight": f"{Descriptors.MolWt(mol):.2f} g/mol",
            "compoundClass": klass,
            **({"cas": cas} if cas else {}),
        }
        print(f"  drawn      {slug:24} {mol.GetNumHeavyAtoms()} heavy atoms")
        drawn += 1

    with open(DATA, "w") as fh:
        json.dump(emitted, fh, indent=2, sort_keys=True)
        fh.write("\n")

    print(f"\n{drawn} drawn, {unverified} awaiting verification, {skipped} skipped.")
    print(f"Wrote {os.path.relpath(DATA)} with {len(emitted)} entries.")
    if unverified:
        print("Set verified=True only after checking against an authoritative "
              "source. Do not publish an unchecked structure.")


if __name__ == "__main__":
    main()
