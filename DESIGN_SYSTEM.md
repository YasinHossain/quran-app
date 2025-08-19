# Design System

A comprehensive design system for the Quran App with semantic design tokens, consistent components, and AI-friendly patterns.

## 🎨 Design Tokens

Our design system uses CSS custom properties for theming and consistency. All tokens are semantic and adapt automatically to light/dark modes.

### Color Tokens

```css
/* Primary colors */
--color-background    /* Page background */
--color-surface       /* Card/panel backgrounds */
--color-foreground    /* Primary text */
--color-muted         /* Secondary text */

/* Interactive colors */
--color-accent        /* Primary accent (emerald/teal) */
--color-accent-hover  /* Accent hover state */
--color-interactive   /* Interactive element background */
--color-interactive-hover /* Interactive hover state */

/* System colors */
--color-border        /* Border colors */
--color-error         /* Error states */
--color-on-accent     /* Text on accent backgrounds */
```

### Usage in Components

```tsx
// ✅ Good - Using design tokens
<div className="bg-surface text-foreground border-border">
  <p className="text-muted">Secondary text</p>
  <button className="bg-accent text-on-accent">Action</button>
</div>

// ❌ Avoid - Hardcoded colors
<div className="bg-white text-slate-900 border-slate-200">
  <p className="text-slate-600">Secondary text</p>
  <button className="bg-emerald-600 text-white">Action</button>
</div>
```

### Shadow & Spacing Tokens

```css
/* Shadows */
--shadow-card         /* Default card shadow */
--shadow-card-hover   /* Card hover shadow */
--shadow-modal        /* Modal/dropdown shadow */

/* Border Radius */
--radius-sm           /* Small radius (buttons) */
--radius-md           /* Medium radius (cards) */
--radius-lg           /* Large radius (modals) */
--radius-xl           /* Extra large radius */
--radius-2xl          /* Hero elements */
```

### Z-Index Scale

```css
--z-dropdown: 10; /* Dropdowns */
--z-sticky: 20; /* Sticky elements */
--z-fixed: 30; /* Fixed positioned */
--z-modal: 40; /* Modals */
--z-popover: 50; /* Popovers */
--z-tooltip: 60; /* Tooltips */
```

## 🧩 Component Patterns

### Standard Component Interface

All components should follow this interface pattern:

```tsx
interface ComponentProps {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost';

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Additional CSS classes for composition */
  className?: string;

  /** Design tokens used by this component */
  designTokens?: string[];

  /** Whether component adapts to theme automatically */
  themeAware?: boolean;
}

/**
 * Component description
 *
 * @designTokens surface, foreground, accent
 * @themeAware true
 * @accessibility WCAG AA compliant
 */
export const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Base styles using tokens
        'bg-surface text-foreground border-border',
        // Variant styles
        variantStyles[variant],
        // Size styles
        sizeStyles[size],
        // Composition
        className
      )}
      {...props}
    />
  );
};
```

### Theme Detection

Use the standardized theme context:

```tsx
import { useTheme } from '@/app/providers/ThemeContext';

// ✅ Good - Use for complex logic only
const { theme, setTheme } = useTheme();

// ✅ Better - Use CSS classes for styling
<div className="bg-surface dark:bg-slate-800">
  Content adapts automatically
</div>

// ❌ Avoid - Theme conditionals in JSX
<div className={theme === 'light' ? 'bg-white' : 'bg-slate-800'}>
```

## 🔧 Development Workflow

### 1. Token Migration

Use the migration script to convert hardcoded classes:

```bash
node scripts/migrate-tokens.mjs
```

### 2. Component Creation

1. **Define the interface** with standard props
2. **Use design tokens** for all styling
3. **Add theme variants** with CSS classes
4. **Document tokens used** in JSDoc
5. **Add to Storybook** for visual testing

### 3. ESLint Integration

The project includes custom ESLint rules to enforce token usage:

```javascript
// Prevents theme conditionals in className
"custom/no-theme-conditionals": "error"
```

### 4. Testing Components

Test components with both themes:

```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/app/providers/ThemeContext';

test('renders in both themes', () => {
  // Test light theme
  render(
    <ThemeProvider defaultTheme="light">
      <Component />
    </ThemeProvider>
  );

  // Test dark theme
  render(
    <ThemeProvider defaultTheme="dark">
      <Component />
    </ThemeProvider>
  );
});
```

## 🎯 Best Practices

### For AI Development

1. **Predictable Structure**: Use consistent naming and patterns
2. **Self-Documenting**: Use semantic token names
3. **Composition Over Conditionals**: Prefer CSS classes over JS logic
4. **Single Responsibility**: Each component does one thing well

### For Human Development

1. **Design Tokens First**: Always use tokens over hardcoded values
2. **Mobile First**: Design for mobile, enhance for desktop
3. **Accessibility**: WCAG AA compliance by default
4. **Performance**: Use content-visibility and lazy loading

## 🚀 Migration Guide

### From Hardcoded to Tokens

1. **Run migration script**: `node scripts/migrate-tokens.mjs`
2. **Review changes**: Check git diff for accuracy
3. **Test thoroughly**: Ensure visual consistency
4. **Update tests**: Verify component behavior

### Common Replacements

```tsx
// Before
bg-white → bg-surface
text-slate-900 → text-foreground
text-slate-400 → text-muted
border-slate-200 → border-border
shadow-lg → shadow-card
text-emerald-600 → text-accent

// After - automatic theme adaptation
<div className="bg-surface text-foreground border-border shadow-card">
```

## 📚 Resources

- **Tailwind Config**: `tailwind.config.mjs` - Token definitions
- **Global Styles**: `app/globals.css` - CSS custom properties
- **Theme Provider**: `app/providers/ThemeContext.tsx` - Theme management
- **Component Library**: `app/shared/ui/` - Reusable components
- **Migration Script**: `scripts/migrate-tokens.mjs` - Automated conversion

---

**Note**: This design system prioritizes consistency, accessibility, and maintainability. When in doubt, choose semantic tokens over hardcoded values, and composition over complex conditionals.
