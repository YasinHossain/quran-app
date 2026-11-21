# Styling Guide

Design direction and freedom: see [`docs/architecture/DESIGN_SYSTEM.md`](../architecture/DESIGN_SYSTEM.md). This file covers only the mechanics.

## Where styles live

- Theme variables: `app/globals.css`. `:root` holds light values and `.dark` holds dark values. They are stored as RGB channels (`13 148 136`) so alpha works.
- Tailwind mapping: `tailwind.config.mjs` (`colors`, `boxShadow`, `borderRadius`, layout spacing).
- Fonts: `app/fonts.css` and `public/fonts/`.

## Using theme colors

```tsx
// Utilities, with any alpha
<section className="rounded-3xl border border-border bg-gradient-to-br from-accent/10 via-surface to-surface">

// Raw CSS or arbitrary values
.glow { box-shadow: 0 6px 16px -6px rgb(var(--color-accent) / 0.7); }
<div className="shadow-[0_6px_16px_-6px_rgb(var(--color-accent)/0.7)]" />

// SVG
<polygon className="fill-accent/10 stroke-accent/40" />
```

Gradients, blur, masks, patterns, arbitrary values and new variables are all fine. What fails lint is anything that ignores the theme:

- raw palette classes (`bg-gray-100`, `text-slate-600`)
- hex colors written into components
- `theme === 'dark' ? … : …` in a className

If a color you need doesn't exist yet, add a variable for both themes.

## Checks

```bash
npm run audit-styles   # raw color classes and theme conditionals (ESLint)
npm run lint
```

Look at every UI change in both light and dark themes, at phone and desktop widths, and in an RTL language (`/ar/...` or `/ur/...`).
