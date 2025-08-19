# Testing Guide

## Overview

Comprehensive testing strategy for the Quran App using Jest, React Testing Library, and custom testing utilities.

## Testing Philosophy

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Pyramid Strategy**: More unit tests, fewer integration tests, minimal E2E tests
3. **Provider Wrapping**: All component tests use `renderWithProviders`
4. **Accessibility First**: Test with screen readers and keyboard navigation

## Test Types

### 1. Unit Tests

- Utility functions
- Custom hooks
- Individual components (isolated)
- API helpers

### 2. Integration Tests

- Component interactions
- Feature workflows
- Context provider behavior
- API integration

### 3. E2E Tests (Future)

- Critical user journeys
- Cross-browser compatibility
- Performance testing

## Test Setup

### Configuration Files

#### `jest.config.js`

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### `jest.setup.js`

```javascript
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
```

### Test Utilities

#### `app/testUtils/renderWithProviders.tsx`

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ClientProviders } from '@/app/providers/ClientProviders';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialSettings?: Partial<Settings>;
  initialUIState?: Partial<UIState>;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialSettings, initialUIState, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ClientProviders
      initialSettings={initialSettings}
      initialUIState={initialUIState}
    >
      {children}
    </ClientProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
```

## Testing Patterns

### 1. Component Testing

#### Basic Component Test

```typescript
// Button.test.tsx
import { renderWithProviders, screen, fireEvent } from '@/app/testUtils/renderWithProviders';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    renderWithProviders(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    renderWithProviders(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent');
  });
});
```

#### Component with Context

```typescript
// SettingsPanel.test.tsx
import { renderWithProviders, screen, fireEvent } from '@/app/testUtils/renderWithProviders';
import { SettingsPanel } from './SettingsPanel';

describe('SettingsPanel', () => {
  it('updates translation settings', () => {
    const initialSettings = {
      translationIds: ['translation-1'],
    };

    renderWithProviders(<SettingsPanel />, { initialSettings });

    const checkbox = screen.getByLabelText(/english translation/i);
    fireEvent.click(checkbox);

    // Assert setting was updated
    expect(checkbox).toBeChecked();
  });
});
```

### 2. Hook Testing

```typescript
// useVerseListing.test.ts
import { renderHook, act } from '@testing-library/react';
import { useVerseListing } from './useVerseListing';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

describe('useVerseListing', () => {
  it('loads verses on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVerseListing({ surahId: 1 }), {
      wrapper: ({ children }) => renderWithProviders(children),
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.verses).toHaveLength(7); // Al-Fatiha has 7 verses
  });

  it('handles pagination correctly', async () => {
    const { result } = renderHook(() => useVerseListing({ surahId: 2 }));

    await act(async () => {
      result.current.loadNextPage();
    });

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.verses.length).toBeGreaterThan(10);
  });
});
```

### 3. API Testing

```typescript
// api/verses.test.ts
import { fetchVerses } from './verses';
import { client } from './client';

// Mock the API client
jest.mock('./client');
const mockedClient = client as jest.Mocked<typeof client>;

describe('fetchVerses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches verses successfully', async () => {
    const mockVerses = [{ id: 1, text: 'In the name of Allah', surahId: 1 }];

    mockedClient.get.mockResolvedValueOnce({ data: { verses: mockVerses } });

    const result = await fetchVerses(1);

    expect(result).toEqual(mockVerses);
    expect(mockedClient.get).toHaveBeenCalledWith('/verses', {
      params: { surah_id: 1 },
    });
  });

  it('handles API errors gracefully', async () => {
    mockedClient.get.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchVerses(1)).rejects.toThrow('Network error');
  });
});
```

### 4. Accessibility Testing

```typescript
// accessibility.test.tsx
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import { axe, toHaveNoViolations } from 'jest-axe';
import { HomePage } from './HomePage';

expect.extend(toHaveNoViolations);

describe('HomePage Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = renderWithProviders(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    renderWithProviders(<HomePage />);

    const firstButton = screen.getAllByRole('button')[0];
    firstButton.focus();

    expect(firstButton).toHaveFocus();

    // Test Tab navigation
    fireEvent.keyDown(firstButton, { key: 'Tab' });
    // Assert next focusable element is focused
  });

  it('has proper ARIA labels', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByLabelText(/search quran/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

## Mock Strategies

### 1. API Mocks

```typescript
// __mocks__/api.ts
export const mockAPI = {
  fetchVerses: jest.fn(),
  fetchTranslations: jest.fn(),
  fetchTafsir: jest.fn(),
};

// Setup in test files
beforeEach(() => {
  mockAPI.fetchVerses.mockResolvedValue(mockVersesData);
});
```

### 2. Component Mocks

```typescript
// Mock heavy components
jest.mock('./AudioPlayer', () => {
  return function MockAudioPlayer({ onPlay, onPause }: any) {
    return (
      <div data-testid="audio-player">
        <button onClick={onPlay}>Play</button>
        <button onClick={onPause}>Pause</button>
      </div>
    );
  };
});
```

### 3. Context Mocks

```typescript
// Mock specific context values
const mockContextValue = {
  settings: { translationIds: ['en-sahih'] },
  setTranslationIds: jest.fn(),
};

jest.mock('@/app/providers/SettingsContext', () => ({
  useSettings: () => mockContextValue,
}));
```

## Test Data Management

### Test Fixtures

```typescript
// __fixtures__/verses.ts
export const mockVerses = [
  {
    id: 1,
    verse_key: '1:1',
    text_uthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    translations: [
      {
        id: 1,
        text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        resource_id: 131,
      },
    ],
  },
];

// __fixtures__/index.ts
export * from './verses';
export * from './chapters';
export * from './translations';
```

### Factory Functions

```typescript
// __fixtures__/factories.ts
export const createMockVerse = (overrides = {}) => ({
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'Arabic text',
  translations: [],
  ...overrides,
});

export const createMockChapter = (overrides = {}) => ({
  id: 1,
  name_simple: 'Al-Fatihah',
  verses_count: 7,
  ...overrides,
});
```

## Performance Testing

### Component Performance

```typescript
// performance.test.tsx
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { VerseList } from './VerseList';
import { createMockVerse } from '@/__fixtures__';

describe('VerseList Performance', () => {
  it('renders large lists efficiently', () => {
    const manyVerses = Array.from({ length: 1000 }, (_, i) =>
      createMockVerse({ id: i, verse_key: `1:${i}` })
    );

    const start = performance.now();
    renderWithProviders(<VerseList verses={manyVerses} />);
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // Should render in <100ms
  });
});
```

### Memory Leak Testing

```typescript
// memory.test.tsx
describe('Memory Management', () => {
  it('cleans up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderWithProviders(<ComponentWithListeners />);

    expect(addEventListenerSpy).toHaveBeenCalled();

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(
      addEventListenerSpy.mock.calls.length
    );
  });
});
```

## Test Commands

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Debug tests
npm test -- --detectOpenHandles --forceExit
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## Best Practices

### 1. Test Structure

- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Group related tests with `describe`
- Use `it.each` for parameterized tests

### 2. Test Isolation

- Each test should be independent
- Clean up after tests (unmount components)
- Reset mocks between tests
- Avoid shared state

### 3. Async Testing

```typescript
// Wait for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Wait for element to disappear
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
```

### 4. Error Testing

```typescript
// Test error boundaries
it('handles errors gracefully', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation();

  expect(() => {
    renderWithProviders(<ComponentThatThrows />);
  }).not.toThrow();

  spy.mockRestore();
});
```

## Debugging Tests

### 1. Debug Render Output

```typescript
// See what's rendered
const { debug } = renderWithProviders(<Component />);
debug(); // Prints DOM to console
```

### 2. Query Debugging

```typescript
// Find why queries fail
screen.getByRole('button'); // Throws if not found
screen.debug(); // Show current DOM
screen.logTestingPlaygroundURL(); // Interactive playground
```

### 3. Test Environment

```typescript
// Check test environment
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Test environment:', expect.getState());
```

This testing guide ensures comprehensive coverage and reliable test suites for the Quran App.
