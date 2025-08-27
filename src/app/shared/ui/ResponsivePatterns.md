# Mobile-First Responsive Patterns

## Overview

This guide defines responsive component patterns for the Quran App, following mobile-first design principles.

## Core Patterns

### 1. Touch-Friendly Components

All interactive elements should meet WCAG touch target requirements:

```tsx
// ✅ Good - Touch-friendly button
<button className="btn-touch bg-accent text-on-accent rounded-lg">
  Save
</button>

// ❌ Avoid - Too small for touch
<button className="p-1 text-sm">Save</button>
```

### 2. Responsive Layout Patterns

#### Container Pattern

```tsx
// Mobile-first responsive container
<div className="container-responsive">
  <div className="grid-mobile">{/* Content adapts to screen size */}</div>
</div>
```

#### Drawer Pattern (Mobile Sidebars)

```tsx
// Mobile drawer with overlay
<div className={`drawer-overlay ${isOpen ? 'block' : 'hidden'}`} onClick={onClose} />
<div className={`drawer-panel left-0 top-0 h-full w-80 ${isOpen ? 'open' : ''}`}>
  {/* Sidebar content */}
</div>
```

#### Responsive Flex Layouts

```tsx
// Stacks vertically on mobile, horizontal on larger screens
<div className="flex-mobile-col gap-4">
  <div>Content A</div>
  <div>Content B</div>
</div>
```

### 3. Typography Patterns

#### Mobile-Optimized Text

```tsx
// Use mobile-friendly text sizes
<h1 className="text-mobile-lg font-bold">Heading</h1>
<p className="text-mobile">Body text optimized for mobile reading</p>
<small className="text-mobile-sm text-muted">Helper text</small>
```

### 4. Interactive Patterns

#### Touch Gestures

```tsx
// Enable touch gestures
<div className="touch-pan-x touch-pinch-zoom">{/* Swipeable content */}</div>
```

#### Focus Management

```tsx
// Proper focus for keyboard navigation
<button
  className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
  ref={focusRef}
>
  Interactive Element
</button>
```

### 5. Performance Patterns

#### Content Visibility

```tsx
// Optimize rendering for long lists
<div className="content-visibility-auto">
  <VirtualizedList items={items} />
</div>
```

#### Lazy Loading

```tsx
// Load images lazily for performance
<img src={src} loading="lazy" className="w-full h-auto" alt={alt} />
```

## Breakpoint Strategy

- **Base (0px+)**: Mobile-first design
- **xs (475px+)**: Large phones
- **sm (640px+)**: Small tablets
- **md (768px+)**: Tablets
- **lg (1024px+)**: Desktop
- **xl (1280px+)**: Large desktop

## Component Checklist

When creating responsive components, ensure:

- [ ] Touch targets are minimum 44px
- [ ] Text is readable at mobile sizes
- [ ] Layouts adapt gracefully across breakpoints
- [ ] Focus states are visible and accessible
- [ ] Gestures work on touch devices
- [ ] Performance is optimized for mobile networks

## Example Implementation

```tsx
interface ResponsiveCardProps {
  title: string;
  children: React.ReactNode;
  action?: () => void;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ title, children, action }) => {
  return (
    <div className="card">
      <div className="flex-mobile-col justify-between items-start sm:items-center">
        <h3 className="text-mobile-lg font-semibold text-foreground">{title}</h3>
        {action && (
          <button
            onClick={action}
            className="btn-touch bg-accent text-on-accent rounded-md mt-2 sm:mt-0"
          >
            Action
          </button>
        )}
      </div>
      <div className="mt-4 text-mobile text-muted">{children}</div>
    </div>
  );
};
```
