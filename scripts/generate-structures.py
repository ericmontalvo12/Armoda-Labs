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

import os
from rdkit import Chem
from rdkit.Chem import Descriptors, rdMolDescriptors
from rdkit.Chem.Draw import rdMolDraw2D

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "structures")

INK = "#0d0c0a"
SURFACE = "#141210"
BORDER = "#2a2621"
BONE = "#eceae6"
MUTED = "#8f8d87"
GOLD = "#d4af37"

BONE_RGB = (0.925, 0.918, 0.902)
GOLD_RGB = (0.831, 0.686, 0.216)

# slug: (kind, value, klass, cas, verified, note)
CATALOG = {
    "kpv":         ("seq", "KPV", "Tripeptide", "", False, "Lys-Pro-Val"),
    "ghk-cu":      ("seq", "GHK", "Copper Tripeptide Complex", "", False,
                    "Draws the GHK tripeptide; the Cu(II) complex is not depicted"),
    "epitalon":    ("seq", "AEDG", "Regulatory Tetrapeptide", "", False, "Ala-Glu-Asp-Gly"),
    "semax":       ("seq", "MEHFPGP", "ACTH-Derived Neuropeptide", "", False, "Met-Glu-His-Phe-Pro-Gly-Pro"),
    "selank":      ("seq", "TKPRPGP", "Tuftsin-Derived Neuropeptide", "", False, "Thr-Lys-Pro-Arg-Pro-Gly-Pro"),
    "tb-500":      ("seq", "LKKTETQ", "Thymosin Fragment", "", False, "Confirm the supplied fragment against the CoA"),
    "bpc-157":     ("seq", "GEPPPGKPADDAGLV", "Pentadecapeptide", "", False, "100 heavy atoms — dense but framed"),
    "mots-c":      ("seq", "MRWQEMGYIFYPRKLR", "Mitochondrial-Derived Peptide", "", False, "153 heavy atoms"),
    "glutathione": ("smiles", "NC(CCC(=O)NC(CS)C(=O)NCC(=O)O)C(=O)O", "Tripeptide", "70-18-8", False,
                    "Gamma-glutamyl linkage cannot be written as a plain sequence"),

    "retatrutide":          ("none", "", "GLP Compound", "", False, "Verify against PubChem; non-standard modifications"),
    "tirzepatide":          ("none", "", "GLP Compound", "", False, "Verify against PubChem; fatty-acid chain"),
    "cjc-1295-ipamorelin":  ("none", "", "Growth Hormone Secretagogue", "", False, "Blend; Ipamorelin has Aib and D-residues"),
    "semax-selank-complex": ("none", "", "Neuropeptide Blend", "", False, "Blend — no single structure"),
    "bpc-157-tb-500-blend": ("none", "", "Peptide Blend", "", False, "Blend — no single structure"),
    "glow-blend":           ("none", "", "Copper Peptide Blend", "", False, "Blend — no single structure"),
    "klow-blend":           ("none", "", "Copper Peptide Blend", "", False, "Blend — no single structure"),
}

W, H = 620, 620
PAD = 34
STRUCT_BOX = (90, 170, 440, 250)  # x, y, w, h


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
    o.setSymbolColour(GOLD_RGB)
    o.setAtomPalette({-1: BONE_RGB, 7: GOLD_RGB, 8: GOLD_RGB, 16: GOLD_RGB})
    rdMolDraw2D.PrepareAndDrawMolecule(d, mol)
    d.FinishDrawing()
    body = d.GetDrawingText()
    return body.split("?>", 1)[-1] if "?>" in body else body


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def card(name, klass, mol, cas):
    formula = rdMolDescriptors.CalcMolFormula(mol)
    mw = f"{Descriptors.MolWt(mol):.2f} g/mol"
    sx, sy, sw, sh = STRUCT_BOX

    stats = [("FORMULA", formula), ("MOL. WEIGHT", mw)]
    if cas:
        stats.append(("CAS", cas))
    span = W - PAD * 2
    step = span / len(stats)

    cells = []
    for i, (label, value) in enumerate(stats):
        cx = PAD + step * i + step / 2
        cells.append(
            f'<text x="{cx:.0f}" y="470" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" '
            f'font-size="9" letter-spacing="1.4" fill="{MUTED}">{esc(label)}</text>'
            f'<text x="{cx:.0f}" y="489" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" '
            f'font-size="12" fill="{BONE}">{esc(value)}</text>'
        )

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{esc(name)} structure">
  <defs>
    <radialGradient id="vig" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="{SURFACE}"/>
      <stop offset="100%" stop-color="{INK}"/>
    </radialGradient>
  </defs>
  <rect width="{W}" height="{H}" rx="18" fill="url(#vig)"/>
  <rect x="0.5" y="0.5" width="{W-1}" height="{H-1}" rx="18" fill="none" stroke="{BORDER}"/>

  <!-- corner rules -->
  <path d="M{PAD} {PAD+6} v-6 h64" fill="none" stroke="{GOLD}" stroke-width="1.5"/>
  <path d="M{W-PAD} {PAD+6} v-6 h-64" fill="none" stroke="{GOLD}" stroke-width="1.5"/>

  <text x="{W/2}" y="{PAD+42}" text-anchor="middle" font-family="ui-monospace,Menlo,monospace"
        font-size="10" letter-spacing="2.6" fill="{MUTED}">{esc(klass.upper())}</text>
  <text x="{W/2}" y="{PAD+96}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif"
        font-size="40" font-weight="700" letter-spacing="-0.5" fill="{BONE}">{esc(name)}</text>

  <g transform="translate({sx},{sy})">{structure_svg(mol, sw, sh)}</g>

  <line x1="{PAD}" y1="447" x2="{W-PAD}" y2="447" stroke="{BORDER}"/>
  {''.join(cells)}

  <text x="{W/2}" y="546" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif"
        font-size="15" font-weight="800" letter-spacing="1" fill="{BONE}">ARMODA<tspan fill="{GOLD}">LABS</tspan></text>

  <line x1="{PAD}" y1="568" x2="{W-PAD}" y2="568" stroke="{BORDER}"/>
  <text x="{W/2}" y="590" text-anchor="middle" font-family="ui-monospace,Menlo,monospace"
        font-size="8.5" letter-spacing="1.3" fill="{MUTED}">FOR LABORATORY RESEARCH USE ONLY &#8212; NOT FOR HUMAN CONSUMPTION</text>
</svg>
'''


def main():
    os.makedirs(OUT, exist_ok=True)
    drawn = skipped = unverified = 0

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
        print(f"  drawn      {slug:24} {mol.GetNumHeavyAtoms()} heavy atoms")
        drawn += 1

    print(f"\n{drawn} drawn, {unverified} awaiting verification, {skipped} skipped.")
    if unverified:
        print("Set verified=True only after checking against an authoritative "
              "source. Do not publish an unchecked structure.")


if __name__ == "__main__":
    main()
