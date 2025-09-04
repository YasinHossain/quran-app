# AI Architecture Compliance Checklist

## PRE-REFACTORING REQUIREMENTS (MANDATORY)

**Before making ANY changes, AI MUST:**

1. **Read ARCHITECTURE_GUIDELINES.md** - Understand established patterns
2. **Read relevant AGENTS.md files** - Feature-specific requirements
3. **Check current architecture compliance** - Identify violations
4. **Plan architecture-compliant solution** - Follow established patterns exactly

## REFACTORING CHECKLIST (MANDATORY)

### Phase 1: Analysis ✅ REQUIRED

- [ ] **Current State Assessment**
  - [ ] Line count and complexity analysis
  - [ ] Existing architecture violations identification
  - [ ] Context integration requirements check
  - [ ] Responsive design compliance audit
  - [ ] Performance optimization needs evaluation

- [ ] **Dependencies Review**
  - [ ] External dependencies analysis
  - [ ] Internal imports and exports check
  - [ ] Context provider requirements
  - [ ] Testing utilities needed

### Phase 2: Architecture Compliance ✅ MANDATORY

- [ ] **memo() Wrapper**: Add to ALL components

  ```typescript
  export const ComponentName = memo(function ComponentName(props) {
    // Component logic
  });
  ```

- [ ] **TypeScript Interfaces**: Define proper props types

  ```typescript
  interface ComponentNameProps {
    id: string;
    // ... other props
  }
  ```

- [ ] **JSDoc Comments**: Document purpose and usage

  ````typescript
  /**
   * @description Component purpose and behavior
   * @example
   * ```tsx
   * <ComponentName id="example" />
   * ```
   */
  ````

- [ ] **Context Integration**: Add Settings/Audio/Bookmarks where needed

  ```typescript
  const { settings } = useSettings();
  const { currentTrack, isPlaying } = useAudio();
  const { bookmarkedVerses, toggleBookmark } = useBookmarks();
  ```

- [ ] **Mobile-First Design**: Apply `space-y-4 md:space-y-0` patterns

  ```typescript
  className = 'space-y-4 p-4 md:space-y-6 md:p-6 md:flex md:items-center';
  ```

- [ ] **Touch-Friendly**: Ensure 44px minimum targets
  ```typescript
  className = 'h-11 px-4 touch-manipulation';
  ```

### Phase 3: Performance Optimization ✅ REQUIRED

- [ ] **useCallback**: Memoize all event handlers

  ```typescript
  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependencies]);
  ```

- [ ] **useMemo**: Memoize expensive computations

  ```typescript
  const processedData = useMemo(() => {
    return transformData(data, settings);
  }, [data, settings]);
  ```

- [ ] **as const**: Add to hook returns

  ```typescript
  return {
    data,
    isLoading,
    refetch,
  } as const;
  ```

- [ ] **AbortController**: Add cleanup to data fetching

  ```typescript
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);
  ```

- [ ] **Key Props**: Ensure stable keys in lists
  ```typescript
  {items.map((item) => (
    <div key={item.id}>
      {item.content}
    </div>
  ))}
  ```

### Phase 4: Import/Export Standards ✅ MANDATORY

- [ ] **Import Order**: React → Third-party → Internal → Types

  ```typescript
  // 1. React imports (always first)
  import { memo, useCallback, useMemo } from 'react';

  // 2. Third-party imports (alphabetical)
  import { SWRConfig } from 'swr';

  // 3. Internal imports with @/ aliases
  import { useSettings } from '@/app/providers/SettingsContext';

  // 4. Type imports with 'type' keyword
  import type { ComponentProps } from '@/types';
  ```

- [ ] **Path Aliases**: Use @/ for internal imports

  ```typescript
  import { Component } from '@/app/shared/ui/Component';
  ```

- [ ] **Barrel Exports**: Create/update index.ts files

  ```typescript
  export { ComponentName } from './ComponentName';
  export { default as ComponentName } from './ComponentName';
  ```

- [ ] **Named + Default**: Include both export types
  ```typescript
  export { ComponentName };
  export default ComponentName;
  ```

### Phase 5: Testing Integration ✅ REQUIRED

- [ ] **Provider Wrappers**: Add context providers to tests

  ```typescript
  const TestWrapper = ({ children }) => (
    <SettingsProvider>
      <AudioProvider>
        <BookmarkProvider>
          {children}
        </BookmarkProvider>
      </AudioProvider>
    </SettingsProvider>
  );
  ```

- [ ] **Responsive Testing**: Test mobile-first design

  ```typescript
  expect(container).toHaveClass('space-y-4', 'md:space-y-0');
  ```

- [ ] **Interaction Testing**: Verify touch-friendly interactions

  ```typescript
  const button = screen.getByRole('button');
  expect(button).toHaveClass('h-11'); // 44px touch target
  ```

- [ ] **Context Testing**: Test context integration
  ```typescript
  render(<Component />, { wrapper: TestWrapper });
  ```

### Phase 6: Final Validation ✅ MANDATORY

- [ ] **Run npm run check**: Ensure no lint/type errors

  ```bash
  npm run check
  ```

- [ ] **Verify patterns**: Match ARCHITECTURE_GUIDELINES.md exactly
  - [ ] All components have memo() wrapper
  - [ ] All responsive patterns applied
  - [ ] All context integrations working
  - [ ] All performance optimizations in place

- [ ] **Test functionality**: Ensure no regressions

  ```bash
  npm run test:architecture
  npm run test:responsive
  ```

- [ ] **Document changes**: Update relevant documentation

## FAILURE CONDITIONS 🚫

**AI MUST REJECT refactoring if:**

- Cannot apply memo() wrapper to component
- Cannot integrate required contexts (Settings/Audio/Bookmarks)
- Cannot implement mobile-first responsive design
- Would violate established architecture patterns
- Would introduce architecture inconsistencies
- Cannot meet file size requirements with pattern compliance

## SUCCESS CRITERIA ✅

**Refactoring is complete ONLY when:**

- All checklist items verified ✅
- `npm run check` passes without warnings
- Architecture patterns match established guidelines exactly
- Code follows project conventions consistently
- Tests pass with provider wrappers
- Mobile-first responsive design validated
- Context integration functionality verified

## ARCHITECTURE PATTERN VALIDATION

### Component Pattern Verification

```typescript
// ✅ CORRECT: Complete architecture pattern
import { memo, useCallback, useMemo } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import type { ComponentProps } from '@/types';

interface MyComponentProps {
  id: string;
  // ... other props
}

export const MyComponent = memo(function MyComponent({
  id,
  // ... other props
}: MyComponentProps) {
  const { settings } = useSettings();

  const processedData = useMemo(() => {
    // Expensive calculations
  }, [dependencies]);

  const handleAction = useCallback(() => {
    // Event handlers
  }, [dependencies]);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <div className="space-y-4 md:space-y-0 md:flex md:items-center">
        <button className="h-11 px-4 touch-manipulation">
          Action
        </button>
      </div>
    </div>
  );
});

export { MyComponent };
export default MyComponent;
```

### Hook Pattern Verification

```typescript
// ✅ CORRECT: Complete hook pattern
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import type { HookResult } from '@/types';

export function useMyHook({ id }: { id: string }): HookResult {
  const [data, setData] = useState(null);
  const { settings } = useSettings();
  const abortControllerRef = useRef<AbortController | null>(null);

  const processedData = useMemo(() => {
    return data ? transformData(data, settings) : null;
  }, [data, settings]);

  const fetchData = useCallback(async () => {
    // Implementation with AbortController
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data: processedData,
    isLoading,
    refetch: fetchData,
  } as const;
}
```

This checklist ensures 100% architecture compliance and prevents violations of established patterns.
