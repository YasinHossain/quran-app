Styling Guide - Quran App
Overview
This project uses a token-based theming system with CSS custom properties for consistent theming across light and dark modes. All styling should use semantic tokens defined in the design system.

design-system.json is the single source of truth for these tokens. After editing it, run npm run generate:tokens to regenerate app/theme.css; tailwind.config.mjs consumes the same tokens automatically.

Use text-foreground for standard body text and reserve text-primary for brand accents.

Theme System Architecture
CSS Custom Properties
Semantic tokens are defined in app/globals.css and app/theme.css:

:root {
  /* Light theme tokens */
  --color-primary: #10b981;
  --color-foreground: #0f172a;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-muted: #64748b;
  /* ... other tokens */
}

[data-theme='dark'],
.dark {
  /* Dark theme overrides */
  --color-foreground: #f1f5f9;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  /* ... other tokens */
}

Tailwind Integration
Tokens are mapped to Tailwind utilities in tailwind.config.mjs:

colors: {
  primary: 'var(--color-primary)',
  foreground: 'var(--color-foreground)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  muted: 'var(--color-muted)',
  // ... other mappings
}

Available Semantic Tokens
Core Colors
primary - Primary brand color (emerald-500)

accent - Accent color (emerald-400 in dark mode)

foreground - Main text color

background - Page background

surface - Card/panel backgrounds

muted - Secondary text and subdued elements

border - Border colors

interactive - Interactive element backgrounds

error - Error/danger states

Usage Examples
✅ Correct Usage
// Use semantic tokens
<div className="bg-surface text-foreground border-border">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted">Subtitle</p>
  <button className="bg-primary text-white hover:bg-primary/90">Action</button>
</div>

❌ Anti-patterns to Avoid
Theme Conditionals in JSX:

// DON'T: Theme conditionals in className
<div className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>

// DO: Use semantic tokens
<div className="bg-surface">

Hardcoded Colors:

// DON'T: Hardcoded hex values
<div style={{ color: '#64748b' }}>

// DO: Use semantic tokens
<div className="text-muted">

Raw Utility Classes:

// DON'T: Raw Tailwind utilities
<div className="bg-slate-100 text-gray-700">

// DO: Semantic tokens
<div className="bg-surface text-foreground">

Component Patterns
Cards and Panels
<div className="bg-surface border border-border rounded-lg p-4">
  <h2 className="text-foreground font-semibold">Card Title</h2>
  <p className="text-muted">Card content</p>
</div>

Interactive Elements
<button className="bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/20">
  Primary Button
</button>

<button className="bg-surface text-foreground hover:bg-interactive border border-border">
  Secondary Button
</button>

Form Inputs
<input className="bg-surface border border-border text-foreground placeholder:text-muted focus:ring-2 focus:ring-primary/20" />

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

<div className="bg-surface text-foreground">

From Hardcoded Colors
Before:

<div style={{ backgroundColor: '#1e293b', color: '#f1f5f9' }}>

After:

<div className="bg-surface text-foreground">

From Raw Utilities
Before:

<div className="bg-gray-100 text-gray-800 border-gray-300">

After:

<div className="bg-surface text-foreground border-border">

Extending the System
Adding New Tokens
Add values to design-system.json

Run npm run generate:tokens

Document usage patterns here

Update audit scripts if needed

Token Naming Convention
Use semantic names (not color names)

Follow the pattern: purpose-variant (e.g., surface-elevated)

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