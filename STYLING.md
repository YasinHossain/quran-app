Styling Guide - Quran App
Overview
This project uses a token-based theming system with CSS custom properties for consistent theming across light and dark modes. All styling should use semantic tokens defined in the design system.

design-system.json is the single source of truth for these tokens. After editing it, run npm run generate:tokens to regenerate app/theme.css; tailwind.config.mjs consumes the same tokens automatically.

When writing raw CSS, reference tokens with `rgb(var(--color-*)))` so they remain theme aware. For example:

```css
button {
  color: rgb(var(--color-foreground));
}
```

Use `text-foreground` for standard body text. Accent tokens (`bg-accent`, `text-on-accent`, etc.) handle interactive highlights while `text-primary` is a static brand color.

Theme System Architecture
CSS Custom Properties
Semantic tokens are defined in `app/theme.css`:

```css
:root {
  --color-background: 247 249 249;
  --color-foreground: 55 65 81;
  --color-accent: 13 148 136;
  --color-accent-hover: 15 118 110;
  --color-border: 229 231 235;
  --color-on-accent: 255 255 255;
}

[data-theme='dark'],
.dark {
  --color-background: 26 32 44;
  --color-foreground: 209 213 219;
  --color-accent: 13 148 136;
  --color-accent-hover: 15 118 110;
  --color-border: 75 85 99;
  --color-on-accent: 255 255 255;
}
```

Tailwind Integration
Tokens are mapped to Tailwind utilities in `tailwind.config.mjs`:

```js
colors: {
  background: 'rgb(var(--color-background) / <alpha-value>)',
  foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
  accent: 'rgb(var(--color-accent) / <alpha-value>)',
  'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
  border: 'rgb(var(--color-border) / <alpha-value>)',
  'on-accent': 'rgb(var(--color-on-accent) / <alpha-value>)',
  primary: '#009688',
  // ... other mappings
}
```

Available Semantic Tokens

Core Colors

background - Page background

foreground - Main text color

accent - Accent color for interactive elements

accent-hover - Hover state for accent

on-accent - Text color on accent backgrounds

border - Border color

primary - Static brand color

Usage Examples
✅ Correct Usage
// Use semantic tokens

<div className="bg-background text-foreground border-border">
  <h1 className="text-primary">Title</h1>
  <button className="bg-accent text-on-accent hover:bg-accent-hover">Action</button>
</div>

❌ Anti-patterns to Avoid
Theme Conditionals in JSX:

// DON'T: Theme conditionals in className

<div className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>

// DO: Use semantic tokens

<div className="bg-background">

Hardcoded Colors:

// DON'T: Hardcoded hex values

<div style={{ color: '#64748b' }}>

// DO: Use semantic tokens

<div className="text-foreground/80">

Raw Utility Classes:

// DON'T: Raw Tailwind utilities

<div className="bg-slate-100 text-gray-700">

// DO: Semantic tokens

<div className="bg-background text-foreground">

Component Patterns
Cards and Panels

<div className="bg-background border border-border rounded-lg p-4">
  <h2 className="text-foreground font-semibold">Card Title</h2>
  <p className="text-foreground/80">Card content</p>
</div>

Interactive Elements
<button className="bg-accent text-on-accent hover:bg-accent-hover focus:ring-2 focus:ring-accent/20">
Primary Button
</button>

<button className="bg-background text-foreground hover:bg-accent/10 border border-border">
  Secondary Button
</button>

Form Inputs
<input className="bg-background border border-border text-foreground placeholder:text-foreground/50 focus:ring-2 focus:ring-accent/20" />

Development Workflow
Before Making Changes
Always run the style audit to ensure no violations:

npm run audit-styles

Available Audit Commands
npm run audit:theme - Check for theme conditionals in JSX

npm run audit:colors - Check for hardcoded color values

npm run audit:classes - Check for raw gray/slate/zinc utility classes

npm run audit-styles - Run all audits

Regenerating Theme Tokens
Update the generated CSS variables and Tailwind mappings after editing design-system.json:

npm run generate:tokens

Testing Theme Changes
Test both light and dark themes

Verify semantic meaning of colors remains consistent

Ensure sufficient contrast ratios

Run audit scripts before committing

Migration Guidelines
From Theme Conditionals
Before:

<div className={theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-black'}>

After:

<div className="bg-background text-foreground">

From Hardcoded Colors
Before:

<div style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>

After:

<div className="bg-background text-foreground">

From Raw Utilities
Before:

<div className="bg-gray-100 text-gray-800 border-gray-300">

After:

<div className="bg-background text-foreground border-border">

Extending the System
Adding New Tokens
Add values to design-system.json

Run npm run generate:tokens

Document usage patterns here

Update audit scripts if needed

Token Naming Convention
Use semantic names (not color names)

Follow the pattern: purpose-variant (e.g., background-secondary)

Ensure names work across all themes

Common Issues
Theme Flickering
Ensure CSS custom properties are defined before React renders

Use data-theme attribute on <html> element

Apply theme class in layout component

Contrast Problems
Always test both light and dark themes

Use semantic tokens that maintain proper contrast

Avoid pure white text on colored backgrounds in dark mode

Performance
CSS custom properties are efficiently handled by browsers

Prefer Tailwind classes over inline styles

Group related utilities for better compression

ESLint Rules
The following ESLint rules help enforce the styling system:

// Prevents theme conditionals in JSX className
"no-raw-color-classes": "error"

Resources
CSS Custom Properties (MDN)

Tailwind CSS Configuration

Design Tokens Specification
