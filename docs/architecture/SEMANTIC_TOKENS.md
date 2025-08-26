# Semantic Token System Documentation

## Overview

The Quran App uses a semantic token-based theming system that automatically adapts colors and styles based on the current theme (light/dark) without requiring theme conditionals in components.

## Design Principles

- **No Theme Conditionals**: Components should never contain `theme === 'light'` or `theme === 'dark'` conditionals for styling
- **Semantic Naming**: Token names describe purpose, not appearance (`text-foreground` not `text-black`)
- **Automatic Theme Switching**: CSS custom properties handle light/dark variations automatically
- **Single Source of Truth**: All theme values defined in `app/theme.css`

## Token Categories

### Core Tokens

- `text-foreground` – Main text color
- `text-on-accent` – Text on accent backgrounds
- `text-primary` – Static brand color
- `bg-background` – Page background
- `bg-accent` – Accent background
- `bg-accent-hover` – Accent hover state
- `border-border` – Standard border color

## Implementation

### CSS Variables (`app/theme.css`)

Tokens are stored as RGB channel values so they can be referenced in raw CSS with `rgb(var(--color-*)))`.

```css
:root {
  --color-background: 247 249 249;
  --color-foreground: 55 65 81;
  --color-accent: 13 148 136;
  --color-accent-hover: 15 118 110;
  --color-border: 229 231 235;
  --color-on-accent: 255 255 255;
}

.dark {
  --color-background: 26 32 44;
  --color-foreground: 209 213 219;
  --color-accent: 13 148 136;
  --color-accent-hover: 15 118 110;
  --color-border: 75 85 99;
  --color-on-accent: 255 255 255;
}
```

### Tailwind Configuration (tailwind.config.mjs)

```js
colors: {
  background: 'rgb(var(--color-background) / <alpha-value>)',
  foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
  accent: 'rgb(var(--color-accent) / <alpha-value>)',
  'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
  border: 'rgb(var(--color-border) / <alpha-value>)',
  'on-accent': 'rgb(var(--color-on-accent) / <alpha-value>)',
  primary: '#009688',
  // ... semantic mappings
}
```

## Usage Guidelines

### ✅ Correct Usage

```jsx
// Use semantic tokens
<div className="bg-background text-foreground border-border">
  <button className="bg-accent hover:bg-accent-hover text-on-accent">Click me</button>
</div>
```

### ❌ Incorrect Usage

```jsx
// Avoid theme conditionals
<div className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
  <button className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
    Click me
  </button>
</div>

// Avoid hardcoded colors
<div className="bg-gray-100 text-gray-900">
  Content
</div>
```

## Theme Toggle Components

**Exception**: Theme toggle buttons legitimately need theme conditionals to show active state:

```jsx
// This is acceptable for theme toggles only
<button
  className={`px-4 py-2 rounded-full ${theme === 'light' ? 'bg-background shadow' : 'text-foreground/80'}`}
>
  Light Mode
</button>
```

## Adding New Tokens

1. **Add CSS variable** in `app/theme.css`:

   ```css
   :root {
     --color-new-token: 123 456 789;
   }

   .dark {
     --color-new-token: 987 654 321;
   }
   ```

2. **Map in Tailwind config** (`tailwind.config.mjs`):

   ```js
   colors: {
     'new-token': 'rgb(var(--color-new-token) / <alpha-value>)',
   }
   ```

3. **Use in components**:
   ```jsx
   <div className="bg-new-token text-new-token">
   ```

## Migration Process

When updating existing components:

1. **Identify theme conditionals**:

   ```bash
   grep -r "theme ===" app/
   ```

2. **Replace with semantic tokens**:
   - `theme === 'dark' ? 'text-white' : 'text-black'` → `text-foreground`
   - `theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'` → `bg-background`

3. **Remove unused theme imports**:
   ```js
   // Remove if no longer needed
   import { useTheme } from '@/app/providers/ThemeContext';
   const { theme } = useTheme();
   ```

## Benefits

- **Consistency**: All themes use the same semantic tokens
- **Maintainability**: Single source of truth for colors
- **Performance**: No JavaScript theme conditionals
- **Flexibility**: Easy to add new themes
- **Developer Experience**: Clear, semantic naming

## ESLint Rule

The codebase includes a custom ESLint rule that prevents theme conditionals:

```js
// Will trigger ESLint error
className={theme === 'dark' ? 'bg-black' : 'bg-white'}
```

This ensures all styling uses semantic tokens consistently.
