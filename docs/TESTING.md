# Testing Guide

Comprehensive testing strategy using Jest, React Testing Library, and custom testing utilities.

## Testing Philosophy

1. **Test Behavior, Not Implementation**: Focus on user interactions
2. **Pyramid Strategy**: More unit tests, fewer integration tests, minimal E2E tests
3. **Provider Wrapping**: All component tests use `renderWithProviders`
4. **Accessibility First**: Test with screen readers and keyboard navigation

## Test Types

- **Unit**: Utilities, hooks, components (isolated), API helpers
- **Integration**: Component interactions, feature workflows, context behavior
- **E2E**: Critical user journeys, cross-browser compatibility

## Configuration

### jest.config.mjs

```javascript
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapping: { '^@/(.*)$': '<rootDir>/$1' },
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### tests/setup/setupTests.ts

```typescript
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import 'whatwg-fetch';
import '@tests/envPolyfills';

import { jest, beforeAll, afterEach, afterAll } from '@jest/globals';
import { server } from '@tests/setup/msw/server';
import { logger } from '@/src/infrastructure/monitoring/Logger';

// Start MSW for tests unless network access is explicitly allowed
if (!process.env.JEST_ALLOW_NETWORK) {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

// matchMedia polyfill
const createMatchMedia =
  (matches = false) =>
  (query: string): MediaQueryList => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: createMatchMedia(false),
});

// IntersectionObserver mock
class IntersectionObserverMock {
  constructor(private cb: IntersectionObserverCallback) {}
  observe = (el: Element): void => {
    if (this.cb) {
      this.cb([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], this);
    }
  };
  unobserve = (): void => {};
  disconnect = (): void => {};
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

// ResizeObserver mock
class ResizeObserverMock {
  constructor(cb: ResizeObserverCallback) {
    void cb;
  }
  observe = (): void => {};
  unobserve = (): void => {};
  disconnect = (): void => {};
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

// HTMLMediaElement stubs
if (typeof window !== 'undefined') {
  HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
  HTMLMediaElement.prototype.pause = jest.fn();
  HTMLMediaElement.prototype.load = jest.fn();
  HTMLMediaElement.prototype.canPlayType = jest.fn(() => 'probably');
}

// Make logger.error spy-able so tests can call mockRestore()
jest.spyOn(logger, 'error');
```

## Test Utilities

### Provider Wrapper

```typescript
// __tests__/test-utils.tsx
import { render } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';

export const AllTheProviders = ({ children }) => (
  <SettingsProvider>
    <BookmarkProvider>
      {children}
    </BookmarkProvider>
  </SettingsProvider>
);

export const renderWithProviders = (ui, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
```

## Component Testing Patterns

### Basic Component Test

```typescript
import { renderWithProviders, screen, fireEvent } from '@/__tests__/test-utils';
import Component from '../Component';

describe('Component', () => {
  const defaultProps = { id: 'test', onAction: jest.fn() };

  it('renders and handles interaction', () => {
    renderWithProviders(<Component {...defaultProps} />);

    expect(screen.getByText('Expected Text')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onAction).toHaveBeenCalled();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { AllTheProviders } from '@/__tests__/test-utils';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  it('manages state correctly', () => {
    const { result } = renderHook(() => useCustomHook('initial'), {
      wrapper: AllTheProviders,
    });

    expect(result.current.state).toBe('initial');

    act(() => {
      result.current.updateState('new');
    });

    expect(result.current.state).toBe('new');
  });
});
```

### Async Testing

```typescript
import { waitFor } from '@testing-library/react';

it('handles async operations', async () => {
  const mockFetch = jest.fn().mockResolvedValue({ json: () => mockData });
  global.fetch = mockFetch;

  renderWithProviders(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### Context Testing

```typescript
import { renderHook } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../SettingsContext';

describe('SettingsContext', () => {
  const wrapper = ({ children }) => <SettingsProvider>{children}</SettingsProvider>;

  it('provides default settings', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });
    expect(result.current.settings.fontSize).toBe(16);
  });
});
```

## Mocking Strategies

### API Mocking

Tests use [MSW](https://mswjs.io/) to intercept network requests and prevent
external calls. Real network access is disabled unless explicitly re-enabled.

#### Allowing real network requests

Set `JEST_ALLOW_NETWORK=1` before running tests to opt out and allow raw
network requests.

```typescript
// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: mockData, error: null, isLoading: false })),
}));

// Example of manual fetch mocking if needed
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockData),
  })
);
```

### Navigation Mocking

When testing components that use the App Router, mock `next/navigation`:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));
```

### Component Mocking

```typescript
// Mock complex components
jest.mock('@/app/shared/player/QuranAudioPlayer', () => {
  return function MockAudioPlayer(props) {
    return <div data-testid="audio-player" {...props} />;
  };
});
```

## Best Practices

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = renderWithProviders(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### User Event Testing

```typescript
import userEvent from '@testing-library/user-event';

it('handles user interactions', async () => {
  const user = userEvent.setup();
  renderWithProviders(<Component />);

  await user.click(screen.getByRole('button'));
  await user.type(screen.getByRole('textbox'), 'test input');
});
```

### Error Boundary Testing

```typescript
it('handles errors gracefully', () => {
  const ThrowError = () => { throw new Error('Test error'); };

  renderWithProviders(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

## Commands

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test -- Component.test.tsx

# Debug mode
npm test -- --detectOpenHandles --forceExit
```

## Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Testing Checklist

- [ ] Component renders without crashing
- [ ] User interactions work correctly
- [ ] Props are handled properly
- [ ] Loading and error states tested
- [ ] Accessibility attributes present
- [ ] Mobile responsive behavior tested
- [ ] Context providers wrapped
- [ ] Async operations use `waitFor`
- [ ] Coverage thresholds met
