#!/usr/bin/env python3
"""
Renders 2D skeletal structures for the catalog as brand-styled SVGs.

    pip install rdkit && python3 -I scripts/generate-structures.py

WHY GENERATE RATHER THAN DOWNLOAD: a rendered-here structure is ours to use
with no attribution question, it comes out in the brand palette, and every
SKU is drawn by the same code so the grid looks like one system.

ACCURACY IS THE WHOLE POINT. This brand sells documentation. A wrong
structure on the product page is worse than no structure at all — it is a
visible, checkable error in the one domain we claim competence in. So every
entry carries `verified`, and nothing renders until a human has checked the
sequence or SMILES against an authoritative source (PubChem CID, the
supplier's CoA, or the original literature) and flipped it to True.

Entries that are blends, or that contain non-standard residues RDKit cannot
build from a one-letter sequence (Aib, D-amino acids, C-terminal amides),
are listed with notes rather than guessed at.
"""

import os
from rdkit import Chem
from rdkit.Chem.Draw import rdMolDraw2D

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "structures")

INK = (0.055, 0.047, 0.039)        # #0d0c0a
BONE = (0.925, 0.918, 0.902)       # #eceae6 — carbon skeleton
GOLD = (0.831, 0.686, 0.216)       # #d4af37 — heteroatoms

# slug: (kind, value, verified, note)
#   kind "seq"    -> one-letter amino acid sequence
#   kind "smiles" -> explicit SMILES, for anything a sequence cannot express
#   kind "none"   -> no single structure (blends), or needs manual artwork
CATALOG = {
    "kpv":                  ("seq", "KPV", False, "Lys-Pro-Val"),
    "ghk-cu":               ("seq", "GHK", False, "Renders the GHK tripeptide; the Cu(II) complex is not drawn"),
    "epitalon":             ("seq", "AEDG", False, "Ala-Glu-Asp-Gly"),
    "semax":                ("seq", "MEHFPGP", False, "Met-Glu-His-Phe-Pro-Gly-Pro"),
    "selank":               ("seq", "TKPRPGP", False, "Thr-Lys-Pro-Arg-Pro-Gly-Pro"),
    "tb-500":               ("seq", "LKKTETQ", False, "Commonly supplied Tb4 fragment; confirm against the CoA"),
    "bpc-157":              ("seq", "GEPPPGKPADDAGLV", False, "Dense at card size — PDP only"),
    "mots-c":               ("seq", "MRWQEMGYIFYPRKLR", False, "Too dense for a card; PDP only"),
    "glutathione":          ("smiles", "NC(CCC(=O)NC(CS)C(=O)NCC(=O)O)C(=O)O", False,
                             "Gamma-glutamyl linkage cannot be expressed as a plain sequence"),

    # Not rendered. Each needs a verified source before it can be drawn.
    "retatrutide":          ("none", "", False, "39+ residues with non-standard modifications — verify against PubChem, and too complex for a card"),
    "tirzepatide":          ("none", "", False, "39 residues with non-standard residues and a fatty-acid chain — verify against PubChem"),
    "cjc-1295-ipamorelin":  ("none", "", False, "Blend. Ipamorelin contains Aib and D-residues RDKit cannot build from sequence"),
    "semax-selank-complex": ("none", "", False, "Blend — no single structure"),
    "bpc-157-tb-500-blend": ("none", "", False, "Blend — no single structure"),
    "glow-blend":           ("none", "", False, "Blend — no single structure"),
    "klow-blend":           ("none", "", False, "Blend — no single structure"),
}

# Card renders are small; PDP renders are large. Same molecule, two canvases,
# because a structure legible at 900px is noise at 294px.
SIZES = {"card": (560, 460), "detail": (1100, 900)}


def build(kind: str, value: str):
    if kind == "seq":
        return Chem.MolFromSequence(value)
    if kind == "smiles":
        return Chem.MolFromSmiles(value)
    return None


def render(mol, width: int, height: int) -> str:
    drawer = rdMolDraw2D.MolDraw2DSVG(width, height)
    opts = drawer.drawOptions()
    opts.clearBackground = False          # transparent, sits on any surface
    opts.setBackgroundColour((0, 0, 0, 0))
    opts.bondLineWidth = 2
    opts.multipleBondOffset = 0.14
    opts.padding = 0.08
    opts.setSymbolColour(GOLD)
    opts.setAtomPalette({-1: BONE, 7: GOLD, 8: GOLD, 16: GOLD})
    rdMolDraw2D.PrepareAndDrawMolecule(drawer, mol)
    drawer.FinishDrawing()
    return drawer.GetDrawingText()


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    drawn = skipped = unverified = 0

    for slug, (kind, value, verified, note) in CATALOG.items():
        if kind == "none":
            print(f"  skip      {slug:24} {note}")
            skipped += 1
            continue
        if not verified:
            print(f"  UNVERIFIED {slug:24} {note}")
            unverified += 1
            continue
        mol = build(kind, value)
        if mol is None:
            print(f"  FAILED    {slug:24} could not build from {kind}")
            skipped += 1
            continue
        for label, (w, h) in SIZES.items():
            path = os.path.join(OUT, f"{slug}-{label}.svg")
            with open(path, "w") as fh:
                fh.write(render(mol, w, h))
        print(f"  drawn     {slug:24} {mol.GetNumHeavyAtoms()} heavy atoms")
        drawn += 1

    print(f"\n{drawn} drawn, {unverified} awaiting verification, {skipped} skipped.")
    if unverified:
        print("Set verified=True only after checking the sequence against an "
              "authoritative source. Do not publish an unchecked structure.")


if __name__ == "__main__":
    main()
