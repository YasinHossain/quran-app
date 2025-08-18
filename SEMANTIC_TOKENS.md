# Semantic Token System Documentation

## Overview

The Quran App uses a semantic token-based theming system that automatically adapts colors and styles based on the current theme (light/dark) without requiring theme conditionals in components.

## Design Principles

- **No Theme Conditionals**: Components should never contain `theme === 'light'` or `theme === 'dark'` conditionals for styling
- **Semantic Naming**: Token names describe purpose, not appearance (`text-foreground` not `text-black`)
- **Automatic Theme Switching**: CSS custom properties handle light/dark variations automatically
- **Single Source of Truth**: All theme values defined in `app/theme.css`

## Token Categories

### Core Text Colors

- `text-foreground` - Main text color
- `text-muted` - Secondary/muted text
- `text-primary` - Brand color highlight

### Background Colors

- `bg-surface` - Main surface/background color
- `bg-background` - Alternative background color

### Interactive States

- `bg-hover` - Hover state background
- `bg-interactive` - Interactive element background
- `bg-active` - Active state background
- `bg-focus` - Focus state background
- `bg-disabled` - Disabled state background

### Accent Colors

- `text-accent` - Accent text color
- `text-on-accent` - Text on accent backgrounds
- `bg-accent` - Accent background
- `bg-accent-hover` - Accent hover state

### Borders

- `border-border` - Standard border color

### Feedback Colors

- `text-success` / `bg-success` - Success states
- `text-warning` / `bg-warning` - Warning states
- `text-error` / `bg-error` - Error states
- `text-info` / `bg-info` - Info states

### Component-Specific

- `bg-card` - Card background
- `bg-card-hover` - Card hover state
- `bg-modal-overlay` - Modal overlay
- `bg-input-bg` - Input backgrounds
- `bg-button-primary` / `bg-button-secondary` - Button variants

## Implementation

### CSS Variables (app/theme.css)

```css
:root {
  --color-surface: 247 249 249;
  --color-text: 55 65 81;
  --color-text-muted: 107 114 128;
  /* ... more tokens */
}

.dark {
  --color-surface: 26 32 44;
  --color-text: 209 213 219;
  --color-text-muted: 156 163 175;
  /* ... dark variants */
}
```

### Tailwind Configuration (tailwind.config.mjs)

```js
colors: {
  surface: 'rgb(var(--color-surface) / <alpha-value>)',
  foreground: 'rgb(var(--color-text) / <alpha-value>)',
  muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
  primary: '#009688',
  // ... semantic mappings
}
```

## Usage Guidelines

### ✅ Correct Usage

```jsx
// Use semantic tokens
<div className="bg-surface text-foreground border-border">
  <button className="bg-hover hover:bg-active text-primary">Click me</button>
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
  className={`px-4 py-2 rounded-full ${theme === 'light' ? 'bg-surface shadow' : 'text-muted'}`}
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
   - `theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'` → `bg-surface`

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
