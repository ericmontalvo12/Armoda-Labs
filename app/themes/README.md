# Themes

The whole palette lives in one file. `app/globals.css` imports exactly one:

```css
@import "./themes/blue-coral.css";
```

**`slate-sky.css` is the chosen brand palette** (picked 2026-10-29). The
others are kept for reference, not for rotation: change the import only when
asked.

Note that `blue-coral.css` is nearly the same colour. Its background is
1.027:1 from slate-sky's, which is to say indistinguishable, and its primary
differs by 12 degrees of hue. The real difference is that it carries a coral
second accent. Keep that in mind before offering it as an alternative.

Change that line and rebuild. Nothing else moves, because every surface in
the app is written against tokens rather than hex values.

| File | Ground | Primary | Contrast | |
|---|---|---|---|---|
| `green-gold.css` | deep green `#0a1a12` | gold `#d4af37` | none |
| `blue-coral.css` | ink navy `#080e18` | blue `#5aa6f0` | coral `#ff8f6b` |
| `red-teal.css` | warm black `#0f0a0b` | red `#f0645f` | teal `#4fd1c5` |
| **`slate-sky.css`** | slate `#0b1120` | sky `#38bdf8` | none (single accent) | **CHOSEN** |
| `white-gold.css` | ivory `#faf8f3` | gold fill `#d4af37` / bronze type `#8a6a14` | none | the only LIGHT theme |
| `graphite-violet.css` | graphite `#101014` | violet `#a78bfa` | none | the only NEUTRAL ground |
| `ink-emerald.css` | ink `#0a0f0d` | emerald `#10b981` | none | clinical green |

## Writing another one

Copy a file and keep every token name. The names are load-bearing: `gold-*`
is referenced across the components, so under the blue theme those tokens
hold blues. Renaming them would be a large diff for no visual change.

Three numbers decide whether a palette works, and the third is the one
people get wrong.

1. **Text on the ground.** 4.5:1 is the floor. `--color-text-muted` sits
   closest to it, so check that one first.
2. **Ink on the primary fill.** A button's label against its own background.
   White on a mid-tone fill usually fails, which is why
   `--color-on-primary` exists.
3. **Accent against BODY TEXT, not the background.** Aim for roughly
   1.7 to 2.0. Push an accent lighter to "make it pop" and it converges with
   the body text and reads as tinted white. The gold sits at 1.75, the blue
   at 2.20, the coral at 1.90.

A red palette has two constraints the others do not. Luminance is mostly
green in the contrast formula (red's coefficient is 0.2126 against green's
0.7152), so a true red cannot reach the ratios gold and blue hit: forcing one
past 7:1 turns it salmon. And a red brand cannot use red for errors, so
`--color-danger` moves to amber.

Hue matters separately from luminance, and the two are easy to confuse. A
previous pass hit the right luminance for gold at 40 degrees and produced
orange. Metallic gold is 44 to 52. Below that is orange, above is
yellow-green.
