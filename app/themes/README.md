# Themes

The whole palette lives in one file. `app/globals.css` imports exactly one:

```css
@import "./themes/blue-coral.css";
```

Change that line and rebuild. Nothing else moves, because every surface in
the app is written against tokens rather than hex values.

| File | Ground | Primary | Contrast |
|---|---|---|---|
| `green-gold.css` | deep green `#0a1a12` | gold `#d4af37` | none |
| `blue-coral.css` | ink navy `#080e18` | blue `#5aa6f0` | coral `#ff8f6b` |

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

Hue matters separately from luminance, and the two are easy to confuse. A
previous pass hit the right luminance for gold at 40 degrees and produced
orange. Metallic gold is 44 to 52. Below that is orange, above is
yellow-green.
