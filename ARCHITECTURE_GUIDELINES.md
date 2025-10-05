# Quran App Architecture Guidelines

Architectural patterns and conventions for Quran App v1. **AI developers must follow these patterns exactly**.

## Project Structure

### Feature-Based Architecture

```
app/
├── (features)/                    # Feature modules with components/, hooks/, __tests__/
├── shared/                       # Reusable components (ui/, player/, verse-actions/)
├── providers/                    # Global context (Settings, Bookmarks)
└── layout.tsx

lib/                              # Utilities (api/, audio/, text/, tafsir/)
types/                            # TypeScript definitions
```

## Component Patterns

### Standard Structure

```typescript
import { memo, useCallback, useEffect, useState } from 'react';
import { SomeType } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';

interface ExampleComponentProps {
  id: string;
  data: SomeType;
  onAction?: (id: string) => void;
}

/**
 * Brief description of component purpose.
 */
export const ExampleComponent = memo(function ExampleComponent({
  id, data, onAction
}: ExampleComponentProps) {
  const [state, setState] = useState('');
  const { settings } = useSettings();

  const handleAction = useCallback(() => {
    onAction?.(id);
  }, [id, onAction]);

  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-center">
      {/* Mobile-first responsive content */}
    </div>
  );
});

export default ExampleComponent;
```

**Requirements:**

- Always use `memo()` for performance
- Define proper TypeScript interfaces
- Use JSDoc comments
- Mobile-first responsive classes
- Use `useCallback`/`useMemo`
- Include default export

### Responsive Design

**Mobile-First Approach:**

```typescript
// ✅ Correct
<div className="space-y-4 md:space-y-0 md:flex md:items-center">

// ❌ Wrong
<div className="flex items-center">
```

**Breakpoints:** Mobile (default) → `md:` (768px) → `lg:` (1024px) → `xl:` (1280px)

## Custom Hook Patterns

```typescript
export function useFeatureName(initialValue?: string) {
  const [state, setState] = useState(initialValue || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const performAction = useCallback(async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      // Action logic
      setState(value);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, loading, error, performAction } as const;
}
```

**Requirements:**

- Return objects with `as const`
- Include loading/error states
- Use `useCallback` for functions
- Proper error handling

## Context & State Management

### Provider Pattern

```typescript
'use client';
import { createContext, useContext, useReducer } from 'react';

interface StateType { /* ... */ }
interface ActionType { /* ... */ }

const Context = createContext<ContextType | undefined>(undefined);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({
    state,
    dispatch,
    // memoized actions
  }), [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContextHook = () => {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Hook must be used within Provider');
  return ctx;
};
```

**Requirements:**

- Use `useReducer` for complex state
- Memoize context values
- Throw errors for missing providers
- Include `'use client'` directive

## Import/Export Conventions

```typescript
// ✅ Correct imports
import { NextPage } from 'next';                    # External
import { Component } from '@/app/shared/ui';        # Internal absolute
import { utility } from './utils';                 # Local relative

// ✅ Correct exports
export const Component = memo(function Component() {});  // Named
export default Component;                               // Default
export type { ComponentProps };                        // Types
```

## Testing Patterns

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AllTheProviders } from '@/__tests__/test-utils';
import Component from '../Component';

describe('Component', () => {
  const defaultProps = {
    id: 'test',
    data: mockData,
  };

  const renderComponent = (props = {}) =>
    render(<Component {...defaultProps} {...props} />, {
      wrapper: AllTheProviders,
    });

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles interactions', () => {
    const mockHandler = jest.fn();
    renderComponent({ onAction: mockHandler });

    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalledWith('test');
  });
});
```

## File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `VerseActions.tsx`)
- **Hooks**: `camelCase.ts` (e.g., `useVerseListing.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatVerse.ts`)
- **Types**: `PascalCase.ts` (e.g., `ApiTypes.ts`)
- **Tests**: `*.test.tsx` or `*.test.ts`

## Code Style Requirements

### TypeScript

- Use interfaces for props and public APIs
- Use types for unions and computations
- Always specify return types for functions
- Use strict null checks

### React

- Always memoize components and expensive calculations
- Use proper dependency arrays
- Handle loading and error states
- Include accessibility attributes

### Performance

- Use `React.memo()` for all components
- Use `useCallback()` for event handlers
- Use `useMemo()` for expensive computations
- Avoid inline objects and functions in JSX

**Critical:** Any deviation from these patterns will break consistency and maintainability.
