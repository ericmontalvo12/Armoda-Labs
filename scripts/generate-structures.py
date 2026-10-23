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

# Light tile, deliberately. The site is dark, so an ivory card reads as a
# framed object on the page rather than another dark panel — and it is the
# clearest separation from the reference, which is near-black with violet.
#
# Gold has to change value on a light ground. #d4af37 measures 1.98:1 on
# ivory and cannot carry text or an atom symbol; #8a6a14 is 4.76:1 and can.
# The bright gold survives only as a decorative hairline, where nothing has
# to be read.
IVORY = "#faf8f3"
IVORY_EDGE = "#f3efe6"
INK = "#14110e"
MUTED = "#6b6459"          # 5.51:1 on ivory
GOLD_RULE = "#c9a227"      # hairlines only
GOLD_DEEP = "#8a6a14"      # 4.76:1 — anything that must be read

INK_RGB = (0.078, 0.067, 0.055)
GOLD_DEEP_RGB = (0.541, 0.416, 0.078)

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

    stats = [("FORMULA", formula), ("MOL. WEIGHT", f"{mw} g/mol")]
    if cas:
        stats.append(("CAS", cas))

    # Left-aligned columns rather than the reference's centred row — the
    # whole layout is set left, which is the plainest way to read as
    # editorial rather than as a HUD.
    cells = []
    for i, (label, value) in enumerate(stats):
        cx = PAD + i * 168
        cells.append(
            f'<text x="{cx}" y="492" font-family="ui-monospace,Menlo,monospace" font-size="8.5" '
            f'letter-spacing="1.8" fill="{MUTED}">{esc(label)}</text>'
            f'<text x="{cx}" y="512" font-family="ui-monospace,Menlo,monospace" font-size="12.5" '
            f'fill="{INK}">{esc(value)}</text>'
        )

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

  <!-- Double inset rule: a bookplate device, not a bracket. The outer is
       hairline gold, the inner a fine ink line a few px in. -->
  <rect x="18.5" y="18.5" width="{W-37}" height="{H-37}" fill="none" stroke="{GOLD_RULE}" stroke-width="1"/>
  <rect x="24.5" y="24.5" width="{W-49}" height="{H-49}" fill="none" stroke="{INK}" stroke-width="0.4" opacity="0.28"/>

  <text x="{PAD}" y="{PAD+36}" font-family="ui-monospace,Menlo,monospace"
        font-size="9.5" letter-spacing="2.8" fill="{MUTED}">{esc(klass.upper())}</text>

  <text x="{PAD}" y="{PAD+94}" font-family="Georgia,'Times New Roman',serif"
        font-size="46" fill="{INK}">{esc(name)}</text>

  <line x1="{PAD}" y1="{PAD+112}" x2="{PAD+70}" y2="{PAD+112}" stroke="{GOLD_RULE}" stroke-width="2"/>

  <g transform="translate({sx},{sy})">{structure_svg(mol, sw, sh)}</g>

  <line x1="{PAD}" y1="462" x2="{W-PAD}" y2="462" stroke="{INK}" stroke-width="0.4" opacity="0.2"/>
  {''.join(cells)}

  <line x1="{PAD}" y1="548" x2="{W-PAD}" y2="548" stroke="{GOLD_RULE}" stroke-width="1"/>

  <text x="{PAD}" y="578" font-family="Georgia,'Times New Roman',serif"
        font-size="17" letter-spacing="2.5" fill="{INK}">ARMODA<tspan fill="{GOLD_DEEP}">LABS</tspan></text>

  <text x="{W-PAD}" y="578" text-anchor="end" font-family="ui-monospace,Menlo,monospace"
        font-size="8" letter-spacing="1.1" fill="{MUTED}">RESEARCH USE ONLY &#183; NOT FOR HUMAN CONSUMPTION</text>
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
