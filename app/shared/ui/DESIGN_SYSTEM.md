# Design System

This document outlines the design system patterns and components for consistent UI/UX across the Quran App.

## Core Principles

1. **Theme-aware**: All components must support both light and dark modes
2. **Consistent hover states**: Use standardized patterns for interactive elements
3. **Semantic colors**: Use theme tokens instead of hardcoded colors
4. **Reusable components**: Prefer shared components over repeated patterns

## Color System

### Theme Tokens (Preferred)

```css
/* Use these theme-aware colors */
bg-surface          /* Main container backgrounds */
bg-interactive      /* Interactive element backgrounds */
bg-number-badge     /* Number badges (NEW - semantic token) */
text-foreground     /* Primary text */
text-muted          /* Secondary text */
bg-accent           /* Active/selected states */
text-on-accent      /* Text on accent backgrounds */
```

### Avoid These Hardcoded Colors

```css
/* DON'T use these - they don't adapt to dark mode */
bg-gray-100         /* Use bg-interactive instead */
bg-emerald-100      /* Use bg-interactive-hover instead */
text-gray-600       /* Use text-muted instead */
```

## Components

### GlassCard (NEW)

Standardized glassmorphism card component for consistent theming and styling.

```tsx
import { GlassCard } from '@/app/shared/ui';

<GlassCard
  variant="surface" // surface | primary | input
  size="comfortable" // compact | comfortable | spacious | large
  radius="xl" // lg | xl | 2xl
  href="/path" // Optional: renders as Link
  onClick={handleClick} // Optional: renders as button
>
  <div>Content here</div>
</GlassCard>;
```

**Features:**

- **Theme-aware backgrounds** with proper opacity
- **Glassmorphism effects** (backdrop-blur-xl)
- **Consistent hover states** (shadow-lg → hover:shadow-xl)
- **Animation support** with fade-in-up by default
- **Flexible rendering** (div, Link, or button based on props)
- **Multiple variants** for different contexts

**Variants:**

- `surface`: Uses `bg-surface-glass/60` (most common)
- `primary`: Uses `bg-surface/60` (primary content areas)
- `input`: Uses complex input background with glassmorphism

**Sizes:**

- `compact`: `p-3` (dense layouts)
- `comfortable`: `p-4` (balanced spacing)
- `spacious`: `p-4 sm:p-5` (responsive generous spacing)
- `large`: `p-4 sm:p-6 md:p-8` (hero sections)

### NumberBadge

Standardized number display for cards and lists.

```tsx
import { NumberBadge } from '@/app/shared/ui';

<NumberBadge
  number={42}
  isActive={false}
  size="md" // sm | md | lg
/>;
```

**Features:**

- Theme-aware backgrounds
- Hover states with group interaction
- Multiple sizes
- Consistent styling across all usage

### SidebarCard

Standardized card component for navigation lists.

```tsx
import { SidebarCard } from '@/app/shared/ui';

<SidebarCard href="/path" isActive={isSelected} onClick={handleClick}>
  <NumberBadge number={1} isActive={isSelected} />
  <div>Content here</div>
</SidebarCard>;
```

**Features:**

- Consistent hover effects (scale + shadow)
- Active/inactive states
- Theme-aware colors
- Built-in Link wrapper

## Styling Patterns

### Text Hierarchy

```tsx
// Primary text
<p className={isActive ? 'text-on-accent' : 'text-foreground'}>

// Secondary text
<p className={isActive ? 'text-on-accent/80' : 'text-muted'}>

// Interactive text (with hover)
<p className={isActive ? 'text-on-accent' : 'text-muted group-hover:text-accent'}>
```

### Hover States

```tsx
// Card hover - scale + shadow
className = 'transition transform hover:scale-[1.02]';

// Background hover - subtle color change
className = 'group-hover:bg-interactive-hover';

// Text hover - accent color
className = 'group-hover:text-accent';
```

## Migration Guide

### From Hardcoded Colors

```tsx
// OLD - hardcoded colors
<div className="bg-gray-100 hover:bg-emerald-100">

// NEW - theme tokens
<div className="bg-interactive hover:bg-interactive-hover">
```

### From Repeated Patterns

```tsx
// OLD - repeated card pattern
<Link className="group flex items-center p-4 gap-4 rounded-xl...">
  <div className="w-12 h-12 flex items-center justify-center...">
    {number}
  </div>
</Link>

// NEW - shared components
<SidebarCard href="/path" isActive={active}>
  <NumberBadge number={number} isActive={active} />
</SidebarCard>
```

### From Glassmorphism Patterns (NEW)

```tsx
// OLD - repeated glassmorphism patterns
<Link className="group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl bg-surface/60">
<div className="p-3 sm:p-4 rounded-xl backdrop-blur-xl shadow-lg bg-surface-glass/60">
<nav className="rounded-xl backdrop-blur-xl shadow-lg bg-surface-glass/60">

// NEW - unified GlassCard component
<GlassCard variant="primary" size="spacious" radius="2xl" href="/path">
<GlassCard variant="surface" size="comfortable">
<GlassCard variant="surface" size="comfortable" asChild>
  <nav>...</nav>
</GlassCard>
```

## Future Improvements

1. **Component Variants**: Add more semantic tokens for specific UI contexts
2. **Animation System**: Standardize transitions and animations
3. **Spacing Scale**: Define consistent spacing patterns
4. **Typography Scale**: Standardize font sizes and weights
5. **Icon System**: Create consistent icon usage patterns

## Similar UI Elements to Address

These elements could benefit from similar standardization:

- **Button variants** across forms and actions
- **Card patterns** in different contexts (verse cards, bookmark cards, etc.)
- **Panel layouts** for settings and resource panels
- **Input field styling** across search and forms
- **Modal patterns** for consistent dialog behavior
- **Navigation patterns** for consistent menu styling

When working on these elements, follow the same principles:

1. Create reusable components
2. Use theme-aware tokens
3. Implement consistent hover states
4. Document usage patterns
