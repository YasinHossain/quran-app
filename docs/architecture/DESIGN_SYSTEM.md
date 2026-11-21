# Design System

## Design freedom (read this first)

Whoever works on the UI, a person or an AI agent, has full creative freedom over its visual design.

- Existing screens, components and older docs record what was built. They are not templates, and many are outdated. Don't copy a pattern just because it exists, and don't keep a weak design for the sake of consistency.
- Design new pages properly. Pick the layout, type scale, spacing, color use, decoration, motion and components that make the page look modern and considered. A page may have its own visual identity. Example: the surah overview page, `app/(features)/surah/[surahId]/about/`.
- When you work on existing UI, you may redesign it if that improves the result. You may add CSS variables, utilities and components, and update these docs.
- Prefer one strong, intentional direction over a safe average of what is already there.

## What still applies

These rules are about quality, not style:

- **Light and dark themes.** Every color must work in both. Use the theme variables (`bg-surface`, `text-accent`, `bg-accent/10`, or `rgb(var(--color-accent) / 0.2)` in raw CSS), or add new variables to `app/globals.css` for both themes. Raw palette classes (`bg-slate-100`, `text-emerald-600`) and `theme === 'dark'` conditionals fail lint (`npm run audit-styles`) because they ignore the active theme.
- **Accessibility.**
  - WCAG AA contrast
  - visible keyboard focus
  - real headings and landmarks
  - 44px touch targets (`min-h-touch`)
  - respect `prefers-reduced-motion` for anything beyond simple transitions
- **Languages.**
  - Arabic and Urdu are right-to-left: use logical utilities (`ms-`, `pe-`, `start-`, `text-start`) and flip directional icons (`rtl:rotate-180`).
  - Don't add letter spacing to Arabic, Urdu, Bengali or Devanagari text; it breaks letter joining.
  - Numbers follow the page language (`localizeDigits`).
- **Quran text.**
  - Use the Uthmanic Hafs font (`'UthmanicHafs1Ver18'`) with `lang="ar" dir="rtl"`.
  - Styling must never change, cut or reorder the text.
  - Facts about the Quran come from data, never hand-written per page.
- **Performance and SEO.**
  - Indexable content is server-rendered.
  - Ship client JavaScript only for parts that are actually interactive.

## Theme variables (reference)

Defined in `app/globals.css` (`:root` for light, `.dark` for dark) and mapped to Tailwind colors in `tailwind.config.mjs`. Every color supports alpha modifiers (`bg-accent/10`, `border-accent/30`).

| Utility | Use |
|---|---|
| `background` | page background |
| `surface` | cards, panels |
| `foreground` | main text |
| `muted` | secondary text |
| `accent`, `accent-hover` | brand / primary action |
| `on-accent` | text on accent backgrounds |
| `interactive`, `interactive-hover` | neutral controls and their hover state |
| `border` | borders and dividers |
| `error` | errors |

Also defined:
- shadows: `shadow-card`, `shadow-card-hover`, `shadow-modal`
- radius: `rounded-sm` … `rounded-2xl`
- layout variables for the fixed header: `--reader-header-height`, `--reader-safe-area-top`

Other utilities in the Tailwind config (`content-*`, `status-*`, `button-*`, …) exist for older components. Use them, replace them or add better ones as needed.

## Adding to the system

- **New color or effect:** add the variable to both `:root` and `.dark` in `app/globals.css`, map it in `tailwind.config.mjs` if you want a utility, and list it in the table above.
- **New shared component:** put it in `app/shared/ui/` once a second screen needs it. Page-specific pieces can live next to the page.
- **New or changed design direction:** update this file so the next person or agent builds on it.
