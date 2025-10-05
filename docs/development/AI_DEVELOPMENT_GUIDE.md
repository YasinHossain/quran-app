# AI Development Guide - Quran App

## Overview

This guide provides clear patterns and rules for AI assistants working on the Quran app. Following these patterns ensures consistent, maintainable, and extensible code.

## Core Principles

1. **Use Semantic Tokens**: Always prefer semantic design tokens over raw colors/utilities
2. **Component-First**: Use established UI primitives before creating new ones
3. **Predictable Patterns**: Follow established patterns for state management and UI
4. **Extension Points**: Leverage built-in extension mechanisms for new designs

## UI Component Library

### Button Component

```typescript
import { Button } from '@/app/shared/ui';

// Standard usage
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>

// Custom variants (for new designs)
<Button variant="bg-gradient-to-r from-purple-500 to-pink-500">Custom</Button>

// Available variants: primary, secondary, ghost, outline, destructive
// Available sizes: sm, md, lg, xl, icon
```

### Panel Component

```typescript
import { Panel } from '@/app/shared/ui';

<Panel
  isOpen={isOpen}
  onClose={onClose}
  variant="sidebar" // sidebar, modal, overlay, fullscreen
  title="Settings"
  showCloseButton={true}
  closeOnOverlayClick={true}
>
  {content}
</Panel>
```

### Theme Components

```typescript
import { ThemeToggle, ThemeSelector, TabToggle } from '@/app/shared/ui';

// Simple theme toggle button
<ThemeToggle variant="ghost" size="icon" />

// Theme selector (light/dark tabs)
<ThemeSelector />

// Generic tab toggle
<TabToggle
  options={[
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
```

## State Management

### UI State (Panels, Modals, Sidebars)

```typescript
import { useUIState } from '@/app/providers/UIStateContext';

const { openPanel, closePanel, isPanelOpen, togglePanel, closeAllPanels } = useUIState();

// Open a panel
openPanel('translation-settings');

// Check if panel is open
if (isPanelOpen('translation-settings')) {
  // Panel is open
}

// Legacy compatibility (still works)
const { isSurahListOpen, setSurahListOpen } = useUIState();
```

### Settings State

```typescript
import { useSettings } from '@/app/providers/SettingsContext';

const { settings, setTranslationIds, setTafsirIds, setShowByWords } = useSettings();
```

## Design System & Styling

### Semantic Tokens (ALWAYS USE THESE)

```css
/* Core tokens */
bg-background        /* Page background */
bg-surface          /* Card/panel background */
text-foreground     /* Main text */
text-muted          /* Secondary text */
bg-accent           /* Primary action color */
bg-accent-hover     /* Accent hover state */
text-on-accent      /* Text on accent backgrounds */
border-border       /* Border color */
bg-interactive      /* Neutral interactive background */
bg-interactive-hover /* Interactive hover state */
```

### Extension Points for New Designs

```typescript
// Method 1: Custom variants in existing components
<Button variant="bg-gradient-to-r from-blue-500 to-purple-600">
  New Design
</Button>

// Method 2: Extend design system
// Add to design-system.json
{
  "extensionPoints": {
    "colors": {
      "newFeature": "#your-color",
      "newFeatureHover": "#your-hover-color"
    }
  }
}

// Method 3: Use className override
<Panel
  variant="sidebar"
  className="bg-gradient-to-br from-indigo-50 to-blue-100"
>
  Custom styled panel
</Panel>
```

### Adding New Color Schemes

1. Update `design-system.json` with new variant:

```json
{
  "extensionPoints": {
    "variants": {
      "yourNewTheme": {
        "description": "Your new theme description",
        "colors": {
          "accent": "#newcolor",
          "surface": "#newsurface"
        }
      }
    }
  }
}
```

2. Run `npm run generate:tokens` to update CSS variables

3. Use the new tokens:

```typescript
<Button className="bg-your-new-theme-accent">
  New Theme Button
</Button>
```

## Common Patterns

### Creating New Features

1. **Check existing components first**

   ```typescript
   // Don't recreate - use existing
   import { Button, Panel, TabToggle } from '@/app/shared/ui';
   ```

2. **Follow naming conventions**

   ```typescript
   // Feature components
   app / features / your - feature / components / YourComponent.tsx;

   // Shared utilities
   app / shared / ui / YourUtility.tsx;
   ```

3. **Use hooks for logic**
   ```typescript
   // app/(features)/your-feature/hooks/useYourFeature.ts
   export const useYourFeature = () => {
     // Feature logic here
     return {
       /* your API */
     };
   };
   ```

### State Management Patterns

```typescript
// For UI state (panels, modals)
const { openPanel, closePanel, isPanelOpen } = useUIState();

// For app settings
const { settings, setTranslationIds } = useSettings();

// For local component state
const [localState, setLocalState] = useState(defaultValue);

// For persistent state
const [value, setValue] = useState(() => {
  const stored = localStorage.getItem('key');
  return stored ? JSON.parse(stored) : defaultValue;
});
```

## Rules & Restrictions

### ❌ DON'T DO

```typescript
// DON'T: Theme conditionals in JSX
<div className={theme === 'dark' ? 'bg-slate-800' : 'bg-white'}>

// DON'T: Hardcoded colors
<div style={{ backgroundColor: '#1a202c' }}>

// DON'T: Raw utility classes for theming
<div className="bg-gray-100 text-gray-800">

// DON'T: Inline styles for theming
<div style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
```

### ✅ DO THIS INSTEAD

```typescript
// DO: Use semantic tokens
<div className="bg-background text-foreground">

// DO: Use CSS classes for theme-aware styling
<div className="bg-surface dark:bg-surface-dark">

// DO: Use component variants
<Button variant="primary">Action</Button>

// DO: Extend with custom classes when needed
<Button variant="primary" className="bg-gradient-to-r from-purple-500 to-pink-500">
  Custom Design
</Button>
```

## Testing & Validation

### Before Committing

```bash
# Run all checks
npm run check

# Individual checks
npm run lint              # ESLint (includes new rules)
npm run type-check        # TypeScript
npm run test              # Jest tests
npm run audit-styles      # Style violations
```

### Visual Testing

1. Test both light and dark themes
2. Test responsive behavior
3. Test with different design variants
4. Verify accessibility (screen readers, keyboard navigation)

## Examples

### Adding a New Feature Panel

```typescript
// 1. Use UI state management
const { openPanel, closePanel, isPanelOpen } = useUIState();

// 2. Use Panel component
<Panel
  isOpen={isPanelOpen('my-new-feature')}
  onClose={() => closePanel('my-new-feature')}
  title="My New Feature"
  variant="sidebar"
>
  <div className="p-4 space-y-4">
    <Button
      variant="primary"
      onClick={handleAction}
    >
      Primary Action
    </Button>
    <Button
      variant="secondary"
      onClick={handleSecondary}
    >
      Secondary Action
    </Button>
  </div>
</Panel>

// 3. Trigger from anywhere
<Button onClick={() => openPanel('my-new-feature')}>
  Open Feature
</Button>
```

### Creating Custom Design Variants

```typescript
// Method 1: Extend existing components
<Button
  variant="primary"
  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
>
  Gradient Button
</Button>

// Method 2: Create new variant in BUTTON_VARIANTS
// In Button.tsx, add:
export const BUTTON_VARIANTS = {
  // ... existing variants
  gradient: 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white',
} as const;

// Then use:
<Button variant="gradient">Gradient Button</Button>
```

## Troubleshooting

### Common Issues

1. **"Theme conditional detected"**
   - Use CSS classes: `className="dark:bg-surface-dark bg-surface"`
   - Use semantic tokens: `className="bg-background"`

2. **"Raw color class detected"**
   - Use semantic tokens: `bg-accent` instead of `bg-blue-500`
   - For custom designs, use className override with custom values

3. **"Component not updating theme"**
   - Ensure component uses semantic tokens
   - Check if CSS variables are properly defined

4. **"Panel not opening"**
   - Use `useUIState()` instead of local state
   - Check panel ID consistency

### Getting Help

1. Check existing components in `app/shared/ui/`
2. Look at similar features in `app/(features)/`
3. Run `npm run audit-styles` to catch violations
4. Test with both themes before committing

## Summary

- **Use semantic tokens** for all styling
- **Use UI components** (Button, Panel, TabToggle, etc.)
- **Use UIState** for panel management
- **Extend through variants** and className overrides
- **Follow testing checklist** before committing
- **Avoid theme conditionals** in JSX

This system enables consistent, maintainable code while providing flexibility for new designs and features.
