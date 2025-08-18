# Code Patterns & Conventions

## Component Patterns

### Standard Component Structure
```typescript
// ComponentName.tsx
import { ComponentProps } from './types'; // if needed
import { useComponentLogic } from './hooks/useComponentLogic'; // if needed

export interface ComponentNameProps {
  // Props interface
}

export const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  // Component logic
  
  return (
    <div className="semantic-classes">
      {/* JSX */}
    </div>
  );
};

// Default export only for page.tsx and layout.tsx
export default ComponentName; // Only if required by Next.js
```

### Hook Patterns
```typescript
// useFeatureLogic.ts
export const useFeatureLogic = () => {
  // Hook implementation
  
  return {
    // Public API
  };
};
```

### Test Patterns
```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    renderWithProviders(<ComponentName />);
    // Assertions
  });
});
```

## State Management Patterns

### UI State (Panels, Modals)
```typescript
const { openPanel, closePanel, isPanelOpen } = useUIState();

// Open panel
openPanel('feature-settings');

// Check if open
const isOpen = isPanelOpen('feature-settings');

// Close panel
closePanel('feature-settings');
```

### Settings State
```typescript
const { settings, setTranslationIds, setTafsirIds } = useSettings();

// Update settings
setTranslationIds(['translation-1', 'translation-2']);
```

### Local Component State
```typescript
const [state, setState] = useState(initialValue);

// With localStorage persistence
const [persistedState, setPersistedState] = useState(() => {
  const stored = localStorage.getItem('key');
  return stored ? JSON.parse(stored) : defaultValue;
});
```

## Styling Patterns

### Semantic Token Usage
```typescript
// Base styling
const baseClasses = "bg-surface text-foreground border border-border";

// Interactive elements
const interactiveClasses = "bg-interactive hover:bg-interactive-hover";

// Accent elements
const accentClasses = "bg-accent text-on-accent";
```

### Component Variants
```typescript
// Button usage
<Button variant="primary" size="md">Primary Action</Button>
<Button variant="secondary" size="sm">Secondary</Button>
<Button variant="ghost" size="icon"><Icon /></Button>

// Panel usage
<Panel
  variant="sidebar"     // sidebar | modal | overlay | fullscreen
  isOpen={isOpen}
  onClose={onClose}
  title="Panel Title"
>
```

### Custom Styling Extensions
```typescript
// Method 1: className override
<Button 
  variant="primary" 
  className="bg-gradient-to-r from-purple-500 to-pink-500"
>

// Method 2: Conditional styling
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "special" && "special-classes"
)}>
```

## API Patterns

### SWR Data Fetching
```typescript
import useSWR from 'swr';
import { fetchVerses } from '@/lib/api';

const { data, error, isLoading } = useSWR(
  `/api/verses/${surahId}`,
  () => fetchVerses(surahId)
);
```

### API Client Usage
```typescript
import { client } from '@/lib/api';

// Fetch data
const verses = await client.verses.getBySurah(surahId);
const translations = await client.translations.getAll();
```

## File Organization Patterns

### Feature Folder Structure
```
app/(features)/feature-name/
├── components/
│   ├── FeatureComponent.tsx
│   ├── SubComponent.tsx
│   └── index.ts              # Re-exports
├── hooks/
│   ├── useFeatureLogic.ts
│   └── useFeatureState.ts
├── __tests__/
│   ├── FeatureComponent.test.tsx
│   └── useFeatureLogic.test.ts
├── page.tsx
├── layout.tsx            # Optional
└── README.md             # Feature documentation
```

### Import/Export Patterns
```typescript
// Named exports (preferred)
export const ComponentName = () => {};
export const utilityFunction = () => {};

// Index file re-exports
export { ComponentA } from './ComponentA';
export { ComponentB } from './ComponentB';

// Import patterns
import { Button, Panel } from '@/app/shared/ui';
import { useSettings } from '@/app/providers/SettingsContext';
import { ComponentA, ComponentB } from './components';
```

## Error Handling Patterns

### Component Error Boundaries
```typescript
if (error) {
  return (
    <div className="p-4 text-center text-muted">
      <p>Failed to load data</p>
      <Button variant="outline" onClick={retry}>
        Retry
      </Button>
    </div>
  );
}
```

### Loading States
```typescript
if (isLoading) {
  return (
    <div className="flex justify-center p-8">
      <Spinner size="lg" />
    </div>
  );
}
```

## Accessibility Patterns

### Keyboard Navigation
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    onClose();
  }
  if (event.key === 'Enter' || event.key === ' ') {
    onSelect();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={onClick}
>
```

### ARIA Labels
```typescript
<button
  aria-label="Close panel"
  aria-expanded={isOpen}
  aria-controls="panel-content"
>
  <CloseIcon aria-hidden="true" />
</button>
```

## Performance Patterns

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

// Component memoization
export const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    expensiveProcessing(data), [data]
  );
  
  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependency]);
  
  return <div onClick={handleClick}>{processedData}</div>;
});
```

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>
```

These patterns ensure consistent, maintainable, and performant code across the application.