# Quran App Architecture Guidelines

This document outlines the specific architectural patterns, conventions, and best practices for the Quran App v1 codebase. **AI developers must follow these patterns exactly** to ensure consistency and maintainability.

## Table of Contents

- [Project Structure](#project-structure)
- [Component Patterns](#component-patterns)
- [Custom Hook Patterns](#custom-hook-patterns)
- [Context & State Management](#context--state-management)
- [Import/Export Conventions](#importexport-conventions)
- [Responsive Design Patterns](#responsive-design-patterns)
- [Testing Patterns](#testing-patterns)
- [File Naming Conventions](#file-naming-conventions)
- [Code Style Requirements](#code-style-requirements)

## Project Structure

### Feature-Based Architecture

```
app/
├── (features)/                    # Feature modules
│   ├── bookmarks/
│   │   ├── components/           # Feature-specific components
│   │   ├── hooks/               # Feature-specific hooks
│   │   ├── __tests__/           # Co-located tests
│   │   └── [subfeatures]/       # Nested features (last-read, pinned, etc.)
│   ├── surah/
│   │   ├── [surahId]/           # Dynamic route components
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/                 # Feature utilities
│   └── tafsir/
├── shared/                       # Reusable components & utilities
│   ├── components/
│   ├── hooks/
│   ├── player/
│   ├── ui/
│   └── verse-actions/
├── providers/                    # Global context providers
│   ├── BookmarkContext.tsx
│   ├── SettingsContext.tsx
│   └── settingsReducer.ts
└── layout.tsx
```

### Shared Utilities Structure

```
lib/
├── api/                         # API layer
├── audio/                       # Audio utilities
├── hooks/                       # Global hooks
├── styles/                      # Style utilities
├── tafsir/                      # Tafsir processing
└── text/                        # Text processing
```

## Component Patterns

### Standard Component Structure

**Required:** All components must follow this exact structure:

```typescript
// File: app/(features)/example/components/ExampleComponent.tsx
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { SomeType, AnotherType } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';
import { someUtility } from '@/lib/utils/example';

interface ExampleComponentProps {
  id: string;
  data: SomeType;
  onAction?: (id: string) => void;
}

/**
 * Brief description of what this component does.
 * Include any important behavior notes.
 */
export const ExampleComponent = memo(function ExampleComponent({
  id,
  data,
  onAction,
}: ExampleComponentProps) {
  const [localState, setLocalState] = useState<string>('');
  const { settings } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAction = useCallback(() => {
    onAction?.(id);
  }, [id, onAction]);

  useEffect(() => {
    // Side effect logic
  }, [/* dependencies */]);

  return (
    <div ref={containerRef} className="space-y-4 md:space-y-0">
      {/* Responsive mobile-first design */}
      <div className="block md:flex md:items-center md:gap-4">
        {/* Content */}
      </div>
    </div>
  );
});

export default ExampleComponent;
```

**Key Requirements:**

- Always use `memo()` for performance optimization
- Define proper TypeScript interfaces for props
- Use JSDoc comments for component description
- Include proper responsive design patterns
- Use `useCallback` and `useMemo` for performance
- Always include default export

### Responsive Design Patterns

**Mobile-First Approach:**

```typescript
// ✅ Correct: Mobile-first responsive classes
<div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
  <div className="md:w-16 md:pt-1">
    {/* Mobile: full width, Desktop: fixed width */}
  </div>
  <div className="space-y-6 md:flex-grow">
    {/* Content area */}
  </div>
</div>

// ❌ Wrong: Desktop-first or non-responsive
<div className="flex items-center gap-6">
  <div className="w-16">...</div>
</div>
```

**Required Breakpoints:**

- Default: Mobile (320px+)
- `sm:`: Small devices (640px+)
- `md:`: Medium devices (768px+) - **Primary desktop breakpoint**
- `lg:`: Large devices (1024px+)
- `xl:`: Extra large (1280px+)

## Custom Hook Patterns

### Standard Hook Structure

**Required:** All custom hooks must follow this pattern:

```typescript
// File: app/(features)/example/hooks/useExampleData.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import type { ExampleType, LookupFunction } from '@/types';

interface UseExampleDataParams {
  id?: string;
  lookup: LookupFunction;
  options?: ExampleOptions;
}

export function useExampleData({ id, lookup, options }: UseExampleDataParams) {
  const [data, setData] = useState<ExampleType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize derived values
  const processedData = useMemo(() => {
    return data.map((item) => transformItem(item, settings));
  }, [data, settings]);

  // Memoize callbacks
  const refetch = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await lookup(id, options);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [id, lookup, options]);

  // Effects
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data: processedData,
    error,
    isLoading,
    refetch,
  } as const;
}

export default useExampleData;
```

**Key Requirements:**

- Always include proper TypeScript interfaces
- Use `useCallback` for all functions returned
- Use `useMemo` for derived data
- Include proper cleanup in `useEffect`
- Return objects with `as const` for better type inference
- Include both named and default exports

## Context & State Management

### Context Provider Pattern

**Required:** All contexts must follow this exact pattern:

```typescript
// File: app/providers/ExampleContext.tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { ExampleSettings } from '@/types';
import { defaultSettings, loadSettings, saveSettings } from './exampleStorage';
import { reducer } from './exampleReducer';

interface ExampleContextType {
  settings: ExampleSettings;
  setSettings: (settings: ExampleSettings) => void;
  // Specific action methods
  updateSetting: (key: string, value: any) => void;
}

const ExampleContext = createContext<ExampleContextType | undefined>(undefined);

/**
 * Provides global access to example settings.
 * Settings are persisted to localStorage with debouncing.
 */
export const ExampleProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings, loadSettings);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveSettings(settings);
      timeoutRef.current = null;
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [settings]);

  // Memoized actions
  const setSettings = useCallback(
    (s: ExampleSettings) => dispatch({ type: 'SET_SETTINGS', value: s }),
    []
  );

  const updateSetting = useCallback(
    (key: string, value: any) => dispatch({ type: 'UPDATE_SETTING', key, value }),
    []
  );

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      updateSetting,
    }),
    [settings, setSettings, updateSetting]
  );

  return <ExampleContext.Provider value={value}>{children}</ExampleContext.Provider>;
};

export const useExample = () => {
  const ctx = useContext(ExampleContext);
  if (!ctx) throw new Error('useExample must be used within ExampleProvider');
  return ctx;
};
```

### Reducer Pattern

```typescript
// File: app/providers/exampleReducer.ts
import { ExampleSettings } from '@/types';

type ExampleAction =
  | { type: 'SET_SETTINGS'; value: ExampleSettings }
  | { type: 'UPDATE_SETTING'; key: string; value: any }
  | { type: 'RESET_SETTINGS' };

export function reducer(state: ExampleSettings, action: ExampleAction): ExampleSettings {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...action.value };

    case 'UPDATE_SETTING':
      return {
        ...state,
        [action.key]: action.value,
      };

    case 'RESET_SETTINGS':
      return { ...defaultSettings };

    default:
      return state;
  }
}
```

## Import/Export Conventions

### Required Import Order

```typescript
// 1. React imports
import { memo, useCallback, useEffect, useState } from 'react';

// 2. Third-party imports
import { SWRConfig } from 'swr';

// 3. Internal type imports
import type { Verse, Translation } from '@/types';

// 4. Internal component/utility imports
import { useSettings } from '@/app/providers/SettingsContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import ResponsiveVerseActions from '@/app/shared/ResponsiveVerseActions';
```

### Required Export Pattern

```typescript
// At the end of each file:
export { ExampleComponent }; // Named export
export default ExampleComponent; // Default export

// For hooks:
export { useExampleData };
export default useExampleData;

// For utilities:
export { utilityFunction };
export default { utilityFunction, anotherUtility };
```

## Responsive Design Patterns

### Touch-Friendly Design

**Required:** All interactive elements must be touch-friendly:

```typescript
// ✅ Correct: 44px minimum touch target
<button className="h-11 px-4 touch-manipulation">
  Action
</button>

// ✅ Correct: Adequate spacing for mobile
<div className="space-y-4 p-4 md:space-y-6 md:p-6">
  {/* Content */}
</div>

// ❌ Wrong: Too small for touch
<button className="h-8 px-2">Action</button>
```

### Layout Patterns

**Required:** Use these responsive patterns consistently:

```typescript
// Mobile: Stacked, Desktop: Side-by-side
<div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
  <div className="md:w-16 md:pt-1">{/* Actions */}</div>
  <div className="space-y-6 md:flex-grow">{/* Content */}</div>
</div>

// Mobile: Full-width, Desktop: Constrained
<div className="w-full max-w-none md:max-w-4xl md:mx-auto">
  {/* Content */}
</div>

// Mobile drawer, Desktop sidebar
<div className="fixed inset-0 md:relative md:inset-auto">
  <div className="absolute bottom-0 left-0 right-0 md:relative">
    {/* Panel content */}
  </div>
</div>
```

## Testing Patterns

### Required Test Structure

```typescript
// File: app/(features)/example/components/__tests__/ExampleComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { ExampleComponent } from '../ExampleComponent';

// Test wrapper for context providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>
    {children}
  </SettingsProvider>
);

describe('ExampleComponent', () => {
  const defaultProps = {
    id: 'test-id',
    data: mockData,
  };

  it('renders correctly', () => {
    render(<ExampleComponent {...defaultProps} />, { wrapper: TestWrapper });

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const mockAction = jest.fn();

    render(
      <ExampleComponent {...defaultProps} onAction={mockAction} />,
      { wrapper: TestWrapper }
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalledWith('test-id');
  });

  it('respects responsive design', () => {
    render(<ExampleComponent {...defaultProps} />, { wrapper: TestWrapper });

    const container = screen.getByTestId('example-container');
    expect(container).toHaveClass('space-y-4', 'md:space-y-0');
  });
});
```

## File Naming Conventions

### Component Files

- `PascalCase.tsx` for components
- `camelCase.ts` for utilities
- `kebab-case.test.tsx` for test files

### Directory Structure

- `components/` - React components
- `hooks/` - Custom hooks
- `lib/` - Utilities and helpers
- `__tests__/` - Test files (co-located)
- `types/` - TypeScript definitions

### File Organization

```
feature/
├── components/
│   ├── FeatureMain.tsx
│   ├── FeatureDetail.tsx
│   └── __tests__/
├── hooks/
│   ├── useFeatureData.ts
│   ├── useFeatureActions.ts
│   └── __tests__/
├── lib/
│   ├── featureUtils.ts
│   └── __tests__/
└── index.ts                    # Barrel exports
```

## Code Style Requirements

### TypeScript Requirements

```typescript
// ✅ Always use strict typing
interface ComponentProps {
  id: string;
  count: number;
  optional?: boolean;
}

// ✅ Use proper generic constraints
function useGenericHook<T extends Record<string, any>>(data: T): T {
  return data;
}

// ❌ Avoid any types
// const data: any = getValue();

// ✅ Use const assertions for better inference
return {
  data,
  isLoading,
  refetch,
} as const;
```

### Performance Requirements

```typescript
// ✅ Required: Use memo for all components
export const Component = memo(function Component({ data }) {
  // ...
});

// ✅ Required: Use callbacks for functions passed as props
const handleClick = useCallback(() => {
  onAction(id);
}, [onAction, id]);

// ✅ Required: Memoize expensive computations
const processedData = useMemo(() => {
  return data.map(transform);
}, [data]);
```

### Error Handling Patterns

```typescript
// ✅ Proper error handling in hooks
const [error, setError] = useState<string | null>(null);

try {
  const result = await apiCall();
  setData(result);
  setError(null);
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error');
  console.error('API Error:', err);
}
```

## Common Anti-Patterns to Avoid

### ❌ Wrong Patterns

```typescript
// Don't use generic component names
export default function Component() { }

// Don't skip memoization
export function ExpensiveComponent({ data }) { }

// Don't use inline objects in JSX
<Component style={{ margin: 10 }} />

// Don't hardcode responsive values
<div className="hidden lg:block">

// Don't skip TypeScript interfaces
function component(props) { }

// Don't use direct DOM manipulation
document.getElementById('element').style.display = 'none';
```

### ✅ Correct Patterns

```typescript
// Use descriptive, memoized components
export const VerseListComponent = memo(function VerseListComponent({ verses }) { });

// Always memoize expensive computations
const processedVerses = useMemo(() =>
  verses.map(verse => transformVerse(verse)),
  [verses]
);

// Use CSS variables or Tailwind classes
<Component className="m-2.5" />

// Use proper responsive patterns
<div className="block md:hidden">

// Always use TypeScript interfaces
interface ComponentProps {
  verses: Verse[];
}

// Use React patterns for DOM updates
const [isVisible, setIsVisible] = useState(true);
```

## AI Development Checklist

Before implementing any feature, AI must verify:

- [ ] **Structure**: Does it follow the feature-based architecture?
- [ ] **Components**: Are they memoized with proper interfaces?
- [ ] **Hooks**: Do they use proper memoization patterns?
- [ ] **Context**: Does it follow the reducer + storage pattern?
- [ ] **Imports**: Are they properly ordered and using `@/` aliases?
- [ ] **Responsive**: Is it mobile-first with proper breakpoints?
- [ ] **Tests**: Are tests co-located and using proper wrappers?
- [ ] **TypeScript**: Is everything properly typed?
- [ ] **Performance**: Are callbacks and computations memoized?
- [ ] **Accessibility**: Are touch targets 44px minimum?

**Failure to follow these patterns will result in inconsistent code that doesn't match the existing codebase.**
