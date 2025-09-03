# AI Development Context - Quran App

## Project Overview

Modern Quran reading application built with Clean Architecture principles, featuring audio playback, translations, tafsir (commentary), bookmarks, and progressive web app capabilities.

**Tech Stack:**
- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- React 19
- SWR for data fetching
- Jest + React Testing Library
- Playwright for E2E testing
- PWA with next-pwa

## Architecture Pattern

**Clean Architecture (Domain-Driven Design)**
- `src/domain/` - Business entities and core logic
- `src/application/` - Use cases and business rules  
- `src/infrastructure/` - External services and repositories
- `app/(features)/` - Feature-based Next.js routing structure

**Component Architecture (Atomic Design)**
- `app/shared/ui/` - Atomic components (buttons, inputs)
- `app/shared/components/` - Molecular components (cards, forms)
- `app/(features)/*/components/` - Feature-specific organisms

## MANDATORY Architecture Requirements

### 🚫 CRITICAL: Architecture Compliance is REQUIRED

**Every component MUST follow these patterns exactly:**

1. **memo() Wrapper**: ALL components wrapped with `React.memo()`
2. **Mobile-First Design**: Responsive classes (`space-y-4 md:space-y-0 md:flex`)
3. **Context Integration**: Use Settings/Audio/Bookmarks contexts where needed
4. **Performance Optimization**: useCallback, useMemo, as const patterns
5. **TypeScript Interfaces**: Proper props interfaces and return types
6. **Touch-Friendly**: 44px minimum touch targets (`h-11`, `min-h-11`)

### File Size Limits WITH Architecture Requirements

```yaml
Page Components: 40-120 lines + memo() + mobile-first + context integration
Client Components: 80-200 lines + memo() + responsive + performance optimization
Server Components: 60-150 lines + memo() + responsive + proper data handling
Hooks: 40-120 lines + useCallback/useMemo + as const + cleanup
Tests: 100-350 lines + provider wrappers + responsive testing
```

## AI Assistant Guidelines

### ⚠️ MANDATORY Pre-Development Steps

**BEFORE making ANY changes, AI MUST:**

1. **Read ARCHITECTURE_GUIDELINES.md** - Understand established patterns
2. **Read relevant AGENTS.md files** - Feature-specific requirements  
3. **Check current architecture compliance** - Identify violations
4. **Plan architecture-compliant solution** - Follow established patterns exactly

### ✅ REQUIRED Architecture Patterns

#### MANDATORY Component Template

```typescript
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/providers/AudioContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import type { ComponentData, ComponentAction } from '@/types';

interface ComponentNameProps {
  id: string;
  data: ComponentData;
  onAction?: ComponentAction;
  className?: string;
}

/**
 * @description Component purpose and behavior
 * @example
 * ```tsx
 * <ComponentName id="example" data={data} onAction={handleAction} />
 * ```
 */
export const ComponentName = memo(function ComponentName({
  id,
  data,
  onAction,
  className,
}: ComponentNameProps) {
  const [localState, setLocalState] = useState<string>('');
  const { settings } = useSettings();
  const { isPlaying } = useAudio();
  const { isBookmarked } = useBookmarks();
  const componentRef = useRef<HTMLDivElement>(null);

  // ✅ REQUIRED: Memoize derived data
  const processedData = useMemo(() => {
    return transformData(data, settings);
  }, [data, settings]);

  // ✅ REQUIRED: Memoize callbacks
  const handleAction = useCallback(() => {
    onAction?.(id, 'action-type');
  }, [id, onAction]);

  // ✅ REQUIRED: Proper cleanup
  useEffect(() => {
    // Side effects with cleanup
    return () => {
      // Cleanup logic
    };
  }, [/* dependencies */]);

  return (
    <div
      ref={componentRef}
      className={`
        space-y-4 p-4 md:space-y-6 md:p-6
        ${className}
      `.trim()}
      data-testid={`component-${id}`}
    >
      {/* ✅ REQUIRED: Mobile-first responsive layout */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
        <div className="md:w-16 md:pt-1">
          {/* Touch-friendly actions */}
          <button
            className="h-11 px-4 touch-manipulation"
            onClick={handleAction}
            aria-label="Component action"
          >
            Action
          </button>
        </div>
        <div className="space-y-4 md:flex-grow">
          {/* Main content area */}
          {processedData.items.map((item) => (
            <div key={item.id} className="min-h-11">
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export { ComponentName };
export default ComponentName;
```

#### MANDATORY Hook Template

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import type { HookData, HookOptions, HookResult } from '@/types';

interface UseHookNameParams {
  id: string;
  options?: HookOptions;
}

/**
 * @description Hook purpose and behavior description
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useHookName({ id: 'example' });
 * ```
 */
export function useHookName({ id, options }: UseHookNameParams): HookResult {
  const [data, setData] = useState<HookData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();
  const abortControllerRef = useRef<AbortController | null>(null);

  // ✅ REQUIRED: Memoize derived values
  const processedData = useMemo(() => {
    return data ? transformHookData(data, settings) : null;
  }, [data, settings]);

  // ✅ REQUIRED: Memoize callbacks
  const fetchData = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const result = await apiCall(id, options, {
        signal: abortControllerRef.current.signal,
      });

      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, options]);

  // ✅ REQUIRED: Proper effects with cleanup
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ✅ REQUIRED: Return with 'as const'
  return {
    data: processedData,
    error,
    isLoading,
    refetch: fetchData,
  } as const;
}

export { useHookName };
export default useHookName;
```

#### MANDATORY Import Order

```typescript
// 1. React imports (always first)
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

// 2. Third-party imports (alphabetical)  
import { SWRConfig } from 'swr';

// 3. Internal imports with @/ aliases
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/providers/AudioContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';

// 4. Relative imports
import './component.styles.css';

// 5. Type imports with 'type' keyword
import type { Verse, Translation, ComponentProps } from '@/types';
```

#### State Management

- **Context Integration**: Use Settings/Audio/Bookmarks contexts where required
- **Local State**: Use `useState()` for component-specific state
- **Server State**: Use SWR for data fetching and caching

#### Responsive Design (MANDATORY)

```typescript
// ✅ REQUIRED: Mobile-first responsive classes
className="
  space-y-4 p-4 md:space-y-6 md:p-6
  md:flex md:items-center md:gap-6
  min-h-11 touch-manipulation
"
```

## 🚫 CRITICAL Architecture Violations to Avoid

❌ **NEVER Do:**

- Create components without `memo()` wrapper
- Skip responsive design patterns (`space-y-4 md:space-y-0 md:flex`)
- Ignore context integration requirements  
- Create inline styles instead of Tailwind classes
- Skip memoization of callbacks and computations
- Use generic names like `Component` or `Hook`
- Create hardcoded breakpoint logic instead of CSS classes
- Skip TypeScript interfaces for props

✅ **ALWAYS Do:**

- Wrap ALL components with `memo()`
- Use mobile-first responsive classes
- Integrate Settings/Audio/Bookmarks contexts where needed
- Memoize callbacks with `useCallback`
- Memoize computations with `useMemo`
- Return `as const` from custom hooks
- Use proper TypeScript interfaces
- Include touch-friendly interactions (44px targets)

## Development Workflow

### ⚠️ MANDATORY Steps for ANY Change

1. **Read Documentation**: ARCHITECTURE_GUIDELINES.md + relevant AGENTS.md files
2. **Check Compliance**: Verify current code follows established patterns
3. **Plan Solution**: Design architecture-compliant implementation
4. **Implement**: Follow templates and patterns exactly
5. **Test**: Include provider wrappers and responsive testing
6. **Validate**: Run `npm run check` and architecture compliance checks

### Quality Commands

```bash
npm run check              # Format, lint, typecheck, test
npm run check:architecture # Architecture compliance validation
npm run test:architecture  # Architecture-specific tests
npm run test:responsive    # Mobile-first design tests
npm run test:e2e          # Playwright architecture tests
```

### Testing Requirements (MANDATORY)

```typescript
// ✅ REQUIRED: Test with provider wrappers
import { renderWithProviders } from '@/app/testUtils/contextTestUtils';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>
        {children}
      </BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);

describe('ComponentName', () => {
  it('renders with architecture compliance', () => {
    render(<ComponentName {...props} />, { wrapper: TestWrapper });
    
    // Test mobile-first responsive design
    expect(screen.getByTestId('component')).toHaveClass('space-y-4', 'md:space-y-0');
    
    // Test touch-friendly interactions
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11'); // 44px touch target
  });
});
```

## File Structure & Locations

```
quran-app/
├── app/
│   ├── (features)/           # Feature modules
│   │   ├── surah/           # Surah reading feature
│   │   ├── tafsir/          # Commentary feature
│   │   ├── search/          # Search functionality
│   │   └── bookmarks/       # Saved verses
│   ├── shared/              # Shared components
│   │   ├── ui/             # Atomic components
│   │   ├── components/     # Molecular components
│   │   └── player/         # Audio player system
│   ├── providers/          # Global context providers
│   └── testUtils/          # Testing utilities
├── src/                    # Clean architecture layers
│   ├── domain/            # Business entities
│   ├── application/       # Use cases
│   └── infrastructure/    # External services
├── lib/                   # Utilities and API clients
├── types/                 # TypeScript type definitions
└── templates/             # Architecture-compliant templates
```

## AI Success Criteria

### Every Change Must Achieve

- [x] **memo() Compliance**: Component wrapped with `memo()`
- [x] **Mobile-First Design**: Responsive classes applied
- [x] **Context Integration**: Uses required contexts
- [x] **Performance**: useCallback/useMemo optimization
- [x] **TypeScript**: Proper interfaces and types
- [x] **Testing**: Provider wrappers and responsive validation
- [x] **Quality**: `npm run check` passes without warnings

### Failure Conditions

**AI MUST REJECT changes that:**
- Cannot apply memo() wrapper
- Cannot implement mobile-first design
- Would violate established patterns
- Would introduce architecture inconsistencies
- Skip required context integration

This context ensures strict architecture compliance and consistent AI-assisted development.
