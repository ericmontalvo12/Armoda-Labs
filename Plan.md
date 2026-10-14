# Rock Mountain Performance - Website Implementation Plan

## Page Structure (Mapped to Root Labs Layout)

| Section | Purpose | Components |
|---------|---------|------------|
| 1. Header | Fixed navigation with logo, nav links, cart | `components/Header.tsx` |
| 2. Hero | Primary headline, subheadline, CTA, product image | `components/sections/Hero.tsx` |
| 3. Features | Three-column benefit cards | `components/sections/Features.tsx` |
| 4. Ingredients | Full ingredient breakdown with descriptions | `components/sections/Ingredients.tsx` |
| 5. Product | Product showcase with key details | `components/sections/Product.tsx` |
| 6. CTA | Final call-to-action section | `components/sections/CTA.tsx` |
| 7. Footer | Brand info, links, legal | `components/Footer.tsx` |

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (dark theme)
- Framer Motion (micro-interactions)
- Magic UI components where appropriate

## File Structure

```
Rock v1/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ui/
│   │   └── button.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Ingredients.tsx
│       ├── Product.tsx
│       └── CTA.tsx
├── lib/
│   └── utils.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Color Palette

Based on rockmountainperformance.com visual direction:
- Background: `#0a0a0a` (near black)
- Surface: `#141414` (dark gray)
- Border: `#262626` (subtle gray)
- Primary: `#22c55e` (mountain green accent)
- Text Primary: `#fafafa` (white)
- Text Secondary: `#a1a1aa` (muted gray)

## TODO Markers

All placeholder items are marked with `{/* TODO: ... */}` comments for:
- Logo insertion
- Product images
- Lifestyle images
- Brand color adjustments
