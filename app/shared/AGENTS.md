# Shared Components - AI Development Guidelines

This file contains specific guidance for AI developers working with shared components. These components are used across multiple features and must maintain strict consistency.

## Overview

The `app/shared/` directory contains reusable components, hooks, and utilities that are used throughout the application. **Any changes to shared components affect the entire app** - follow patterns exactly.

**File Location:** `app/shared/`

## Directory Structure

```
shared/
├── components/              # Reusable UI components
│   ├── AdaptiveLayout.tsx
│   ├── ResponsiveImage.tsx
│   ├── BaseSidebar.tsx
│   └── __tests__/
├── hooks/                  # Global custom hooks
│   ├── useReaderClient.ts
│   ├── useModal.ts
│   ├── useSelection.ts
│   └── useSwipeGestures.tsx
├── player/                 # Audio player system
│   ├── context/
│   ├── components/
│   └── hooks/
├── ui/                     # Base UI components
│   ├── Button.tsx
│   ├── Panel.tsx
│   ├── cards/
│   └── __tests__/
├── verse-actions/          # Verse interaction components
│   ├── ResponsiveVerseActions.tsx
│   ├── MobileVerseActions.tsx
│   └── DesktopVerseActions.tsx
└── VerseArabic.tsx        # Arabic text rendering
```

## Critical Shared Components

### 1. ResponsiveVerseActions (`verse-actions/ResponsiveVerseActions.tsx`)

**This component handles all verse interactions across the app.** Must follow this exact pattern:

```typescript
import { memo, useCallback } from 'react';
import { useBreakpoint } from '@/lib/responsive';
import MobileVerseActions from './MobileVerseActions';
import DesktopVerseActions from './DesktopVerseActions';

interface ResponsiveVerseActionsProps {
  verseKey: string;
  verseId: string;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  className?: string;
}

export const ResponsiveVerseActions = memo(function ResponsiveVerseActions({
  verseKey,
  verseId,
  isPlaying,
  isLoadingAudio,
  isBookmarked,
  onPlayPause,
  className,
}: ResponsiveVerseActionsProps) {
  const isMobile = useBreakpoint('md', 'below');

  const handleShare = useCallback(async () => {
    // Share implementation
  }, [verseKey]);

  if (isMobile) {
    return (
      <MobileVerseActions
        verseKey={verseKey}
        verseId={verseId}
        isPlaying={isPlaying}
        isLoadingAudio={isLoadingAudio}
        isBookmarked={isBookmarked}
        onPlayPause={onPlayPause}
        onShare={handleShare}
        className={className}
      />
    );
  }

  return (
    <DesktopVerseActions
      verseKey={verseKey}
      verseId={verseId}
      isPlaying={isPlaying}
      isLoadingAudio={isLoadingAudio}
      isBookmarked={isBookmarked}
      onPlayPause={onPlayPause}
      onShare={handleShare}
      className={className}
    />
  );
});

export default ResponsiveVerseActions;
```

**Key Requirements:**

- Must use `useBreakpoint` for responsive switching
- Must handle all verse actions (play, bookmark, share)
- Must be memoized
- Must support both mobile and desktop variants

### 2. VerseArabic (`VerseArabic.tsx`)

**Handles Arabic text rendering with font settings.** Critical for text display:

```typescript
import { memo } from 'react';
import { Verse } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';

interface VerseArabicProps {
  verse: Verse;
  className?: string;
}

export const VerseArabic = memo(function VerseArabic({
  verse,
  className
}: VerseArabicProps) {
  const { settings } = useSettings();

  const arabicText = applyArabicFont(
    verse.text_uthmani || verse.text_simple,
    {
      fontFamily: settings.arabicFontFamily,
      showTajweed: settings.showTajweed,
    }
  );

  return (
    <div className={`text-right mb-4 ${className || ''}`}>
      <p
        className="leading-loose"
        style={{
          fontSize: `${settings.arabicFontSize}px`,
          fontFamily: settings.arabicFontFamily,
          direction: 'rtl',
        }}
        dangerouslySetInnerHTML={{ __html: arabicText }}
      />
      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium mt-2">
        {verse.verse_number}
      </span>
    </div>
  );
});

export default VerseArabic;
```

**Key Requirements:**

- Must apply font settings from context
- Must handle RTL text direction
- Must include verse number badge
- Must support Tajweed highlighting

### 3. BaseSidebar (`components/BaseSidebar.tsx`)

**Base layout for all sidebar components.** Follow this structure:

```typescript
import { memo, ReactNode } from 'react';
import { CloseIcon } from '@/app/shared/icons';

interface BaseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const BaseSidebar = memo(function BaseSidebar({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BaseSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-background shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:relative md:transform-none md:shadow-none
        ${className || ''}
      `}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md md:hidden"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
});

export default BaseSidebar;
```

## UI Component Patterns

### Button Component (`ui/Button.tsx`)

**Standard button component used throughout the app:**

```typescript
import { memo, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = 'default', size = 'default', ...props }, ref) {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md text-sm font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // Variants
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline': variant === 'link',
          },

          // Sizes
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
));

export default Button;
```

### Panel Component (`ui/Panel.tsx`)

**Base panel for settings and content areas:**

```typescript
import { memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Panel = memo(function Panel({
  children,
  className,
  title,
  description,
}: PanelProps) {
  return (
    <div className={cn(
      'rounded-lg border border-border bg-background p-6',
      className
    )}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
});

export default Panel;
```

## Shared Hooks Patterns

### useModal Hook (`hooks/useModal.ts`)

**Standard modal state management:**

```typescript
import { useCallback, useState } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(initialOpen = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  } as const;
}

export default useModal;
```

### useSelection Hook (`hooks/useSelection.ts`)

**Multi-select state management:**

```typescript
import { useCallback, useState } from 'react';

interface UseSelectionReturn<T> {
  selected: Set<T>;
  isSelected: (item: T) => boolean;
  select: (item: T) => void;
  deselect: (item: T) => void;
  toggle: (item: T) => void;
  clear: () => void;
  selectAll: (items: T[]) => void;
}

export function useSelection<T>(initialSelection: T[] = []): UseSelectionReturn<T> {
  const [selected, setSelected] = useState(new Set(initialSelection));

  const isSelected = useCallback(
    (item: T) => {
      return selected.has(item);
    },
    [selected]
  );

  const select = useCallback((item: T) => {
    setSelected((prev) => new Set(prev).add(item));
  }, []);

  const deselect = useCallback((item: T) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.delete(item);
      return newSet;
    });
  }, []);

  const toggle = useCallback((item: T) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelected(new Set(items));
  }, []);

  return {
    selected,
    isSelected,
    select,
    deselect,
    toggle,
    clear,
    selectAll,
  } as const;
}

export default useSelection;
```

## Responsive Design Patterns

### Required Breakpoint Usage

```typescript
// ✅ Use lib/responsive.ts utilities
import { useBreakpoint } from '@/lib/responsive';

const isMobile = useBreakpoint('md', 'below');
const isTablet = useBreakpoint('lg', 'below');

// ✅ Responsive component switching
if (isMobile) {
  return <MobileComponent />;
}
return <DesktopComponent />;

// ✅ Responsive classes
<div className="block md:flex md:items-center">
```

### Touch-Friendly Requirements

```typescript
// ✅ Minimum 44px touch targets
<button className="h-11 px-4 touch-manipulation">

// ✅ Adequate spacing for touch
<div className="space-y-4 p-4 md:space-y-6 md:p-6">

// ✅ Touch-friendly interactive areas
<div className="p-3 -m-3 hover:bg-muted rounded-md">
```

## Icon System

All icons must be imported from the shared icons directory:

```typescript
// ✅ Correct icon imports
import {
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  ShareIcon
} from '@/app/shared/icons';

// ✅ Consistent icon sizing
<PlayIcon className="w-5 h-5" />

// ✅ Accessible icon buttons
<button aria-label="Play verse" className="p-2 hover:bg-muted rounded-md">
  <PlayIcon className="w-5 h-5" />
</button>
```

## Testing Patterns for Shared Components

### Test Structure

```typescript
// File: __tests__/ResponsiveVerseActions.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsiveVerseActions } from '../ResponsiveVerseActions';

// Mock responsive hook
jest.mock('@/lib/responsive', () => ({
  useBreakpoint: jest.fn(),
}));

describe('ResponsiveVerseActions', () => {
  const defaultProps = {
    verseKey: '1:1',
    verseId: '1',
    isPlaying: false,
    isLoadingAudio: false,
    isBookmarked: false,
    onPlayPause: jest.fn(),
  };

  it('renders mobile version on mobile', () => {
    (useBreakpoint as jest.Mock).mockReturnValue(true);

    render(<ResponsiveVerseActions {...defaultProps} />);

    expect(screen.getByTestId('mobile-verse-actions')).toBeInTheDocument();
  });

  it('renders desktop version on desktop', () => {
    (useBreakpoint as jest.Mock).mockReturnValue(false);

    render(<ResponsiveVerseActions {...defaultProps} />);

    expect(screen.getByTestId('desktop-verse-actions')).toBeInTheDocument();
  });

  it('handles play/pause interaction', () => {
    const mockPlayPause = jest.fn();

    render(
      <ResponsiveVerseActions {...defaultProps} onPlayPause={mockPlayPause} />
    );

    fireEvent.click(screen.getByLabelText('Play verse'));
    expect(mockPlayPause).toHaveBeenCalled();
  });
});
```

## Performance Requirements

### Required Optimizations

```typescript
// ✅ Memoize all shared components
export const SharedComponent = memo(function SharedComponent(props) {
  // Implementation
});

// ✅ Memoize callbacks in hooks
const handleAction = useCallback(() => {
  // Action logic
}, [dependencies]);

// ✅ Optimize re-renders with proper dependencies
useEffect(() => {
  // Effect logic
}, [specificDependencies]);

// ✅ Use proper key props for lists
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

## Common Anti-Patterns

### ❌ Avoid These Patterns

```typescript
// Don't create non-responsive components
export function StaticComponent() {
  return <div style={{ width: '300px' }}>Content</div>;
}

// Don't skip memoization for shared components
export function ExpensiveSharedComponent({ data }) {
  return <div>{data.map(/* expensive operation */)}</div>;
}

// Don't hardcode sizes or spacing
<button style={{ height: '32px', padding: '8px' }}>

// Don't create one-off UI components
<div className="bg-blue-500 text-white rounded p-2">

// Don't skip accessibility
<button onClick={handleClick}>
  <PlayIcon />
</button>
```

### ✅ Follow These Patterns

```typescript
// Create responsive, reusable components
export const ResponsiveComponent = memo(function ResponsiveComponent(props) {
  const isMobile = useBreakpoint('md', 'below');
  return isMobile ? <MobileVersion /> : <DesktopVersion />;
});

// Always memoize shared components
export const OptimizedComponent = memo(function OptimizedComponent({ data }) {
  const processedData = useMemo(() =>
    data.map(transformItem),
    [data]
  );
  return <div>{processedData}</div>;
});

// Use design system components
<Button variant="default" size="default">

// Create reusable UI components
<Panel title="Settings" className="mb-4">

// Include accessibility attributes
<button
  onClick={handleClick}
  aria-label="Play verse"
  className="p-2 hover:bg-muted rounded-md"
>
  <PlayIcon className="w-5 h-5" />
</button>
```

## Integration Requirements

### Context Dependencies

Shared components may need these contexts:

```typescript
// Settings for theming and preferences
const { settings } = useSettings();

// Audio for playback state
const { isPlaying, activeVerse } = useAudio();

// Bookmarks for verse status
const { isBookmarked } = useBookmarks();
```

### Utility Dependencies

Common utility imports:

```typescript
// Styling utilities
import { cn } from '@/lib/utils';

// Responsive utilities
import { useBreakpoint } from '@/lib/responsive';

// Text processing
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
```

## AI Development Checklist

For any shared component changes, verify:

- [ ] **Memoization**: Is the component wrapped with `memo()`?
- [ ] **Responsive**: Does it handle mobile and desktop properly?
- [ ] **Performance**: Are callbacks and computations memoized?
- [ ] **Accessibility**: Are interactive elements properly labeled?
- [ ] **Touch-Friendly**: Are touch targets at least 44px?
- [ ] **Type Safety**: Are all props properly typed?
- [ ] **Testing**: Are both mobile and desktop variants tested?
- [ ] **Consistency**: Does it follow existing shared component patterns?

**Shared components are used throughout the app. Any breaking changes will affect multiple features.**
