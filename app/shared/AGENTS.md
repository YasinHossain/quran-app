# Shared Components - AI Development Guidelines

Reusable components, hooks, and utilities used throughout the app. **Changes to shared components affect the entire app** - follow patterns exactly.

## Directory Structure

```
shared/
├── components/              # Reusable UI components
├── hooks/                  # Global custom hooks
├── player/                 # Audio player system
├── ui/                     # Base UI components (Button, Panel, etc.)
├── verse-actions/          # Verse interaction components
└── VerseArabic.tsx        # Arabic text rendering
```

## Critical Components

### 1. ResponsiveVerseActions

Handles all verse interactions across the app:

```typescript
import { memo, useCallback } from 'react';
import { useBreakpoint } from '@/lib/responsive';

export const ResponsiveVerseActions = memo(function ResponsiveVerseActions({
  verseKey, verseId, isPlaying, isLoadingAudio, isBookmarked, onPlayPause, className
}: ResponsiveVerseActionsProps) {
  const isMobile = useBreakpoint('md', 'below');
  const handleShare = useCallback(async () => { /* Share logic */ }, [verseKey]);

  return isMobile ? (
    <MobileVerseActions {...props} onShare={handleShare} />
  ) : (
    <DesktopVerseActions {...props} onShare={handleShare} />
  );
});
```

**Requirements:** Use `useBreakpoint`, handle all verse actions, be memoized, support mobile/desktop variants.

### 2. VerseArabic

Arabic text rendering with font settings:

```typescript
import { memo } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { applyArabicFont } from '@/lib/tafsir/applyArabicFont';

export const VerseArabic = memo(function VerseArabic({ verse, className }) {
  const { settings } = useSettings();
  
  const arabicText = applyArabicFont(verse.text_uthmani || verse.text_simple, {
    fontFamily: settings.arabicFontFamily,
    showTajweed: settings.showTajweed,
  });

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
      <span className="verse-number-badge">
        {verse.verse_number}
      </span>
    </div>
  );
});
```

**Requirements:** Apply settings context, handle RTL direction, include verse number badge, support Tajweed.

### 3. BaseSidebar

Base layout for all sidebars:

```typescript
export const BaseSidebar = memo(function BaseSidebar({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="mobile-overlay md:hidden" onClick={onClose} />
      <div className={`sidebar-container ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${className}`}>
        {title && (
          <div className="sidebar-header">
            <h2>{title}</h2>
            <button onClick={onClose} className="close-btn md:hidden">×</button>
          </div>
        )}
        <div className="sidebar-content">{children}</div>
      </div>
    </>
  );
});
```

## UI Components

### Button

```typescript
export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'default', size = 'default', className, ...props }, ref) {
    return (
      <button
        className={cn(
          'base-button',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
));
```

### Panel

```typescript
export const Panel = memo(function Panel({ children, className, title, description }) {
  return (
    <div className={cn('panel-base', className)}>
      {(title || description) && (
        <div className="panel-header">
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
});
```

## Shared Hooks

### useModal

```typescript
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle } as const;
}
```

### useSelection

```typescript
export function useSelection<T>(initialSelection: T[] = []) {
  const [selected, setSelected] = useState(new Set(initialSelection));

  const isSelected = useCallback((item: T) => selected.has(item), [selected]);
  const select = useCallback((item: T) => setSelected(prev => new Set(prev).add(item)), []);
  const deselect = useCallback((item: T) => setSelected(prev => {
    const newSet = new Set(prev);
    newSet.delete(item);
    return newSet;
  }), []);
  const toggle = useCallback((item: T) => setSelected(prev => {
    const newSet = new Set(prev);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    return newSet;
  }), []);
  const clear = useCallback(() => setSelected(new Set()), []);
  const selectAll = useCallback((items: T[]) => setSelected(new Set(items)), []);

  return { selected, isSelected, select, deselect, toggle, clear, selectAll } as const;
}
```

## Key Patterns

### Responsive Design
- Use `useBreakpoint('md', 'below')` for mobile detection
- Minimum 44px touch targets
- Import icons from `@/app/shared/icons`

### Performance
- Memoize all shared components with `memo()`
- Use `useCallback` for event handlers
- Proper dependency arrays for hooks

### Testing
- Mock `@/lib/responsive` for responsive tests
- Test both mobile and desktop variants
- Include accessibility testing

### Development Checklist
- [ ] Component memoized with `memo()`
- [ ] Responsive (mobile/desktop handling)
- [ ] Performance optimized (callbacks memoized)
- [ ] Accessibility attributes included
- [ ] Touch-friendly (44px+ targets)
- [ ] TypeScript typed properly
- [ ] Both variants tested

**Shared components affect the entire app - breaking changes impact multiple features.**
