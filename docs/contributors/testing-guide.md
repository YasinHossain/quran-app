# Testing Guide

Comprehensive testing guide for the Quran App covering unit, integration, E2E, and accessibility testing.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Testing Setup](#testing-setup)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Debugging Tests](#debugging-tests)

## Testing Philosophy

We follow the **Testing Trophy** approach, emphasizing:

1. **More integration tests** than unit or E2E tests
2. **User-focused testing** - test behavior, not implementation
3. **Accessibility-first** - ensure all users can use the app
4. **Performance-aware** - test that the app remains fast
5. **Maintainable tests** - clear, readable, and reliable

### Test Distribution

```
        /\
       /  \
      / E2E \     <- Few, expensive, comprehensive
     /      \
    /________\
   /          \
  / Integration \ <- Most tests here
 /______________\
/                \
/      Unit       \ <- Quick, isolated tests
/________________\
```

## Test Types

### 1. Unit Tests

Test individual functions, hooks, and utilities in isolation.

```typescript
// lib/text/formatters.test.ts
import { formatVerseNumber, formatSurahName } from './formatters';

describe('formatVerseNumber', () => {
  it('should format single digit numbers with leading zero', () => {
    expect(formatVerseNumber(5)).toBe('05');
  });
  
  it('should format double digit numbers without leading zero', () => {
    expect(formatVerseNumber(15)).toBe('15');
  });
  
  it('should handle edge cases', () => {
    expect(formatVerseNumber(0)).toBe('00');
    expect(formatVerseNumber(-1)).toBe('00');
  });
});
```

### 2. Integration Tests

Test component interactions and data flow between components.

```typescript
// app/(features)/surah/__tests__/SurahPage.integration.test.tsx
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SurahPage } from '../page';

describe('SurahPage Integration', () => {
  it('should load verses and play audio when play button is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<SurahPage params={{ id: '1' }} />);
    
    // Wait for verses to load
    await waitFor(() => {
      expect(screen.getByText(/al-fatihah/i)).toBeInTheDocument();
    });
    
    // Click play button
    const playButton = screen.getByRole('button', { name: /play/i });
    await user.click(playButton);
    
    // Verify audio player state updated
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });
});
```

### 3. E2E Tests

Test complete user journeys with Playwright.

```typescript
// tests/e2e/reading-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Reading Flow', () => {
  test('user can read a surah and bookmark verses', async ({ page }) => {
    // Navigate to surah
    await page.goto('/surah/1');
    
    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Al-Fatiha');
    
    // Click bookmark on first verse
    await page.locator('[data-verse="1:1"] [data-testid="bookmark-button"]').click();
    
    // Verify bookmark was added
    await expect(page.locator('.bookmark-success')).toBeVisible();
    
    // Navigate to bookmarks
    await page.goto('/bookmarks');
    
    // Verify bookmarked verse appears
    await expect(page.locator('[data-verse="1:1"]')).toBeVisible();
  });
});
```

### 4. Accessibility Tests

Test with jest-axe and manual testing patterns.

```typescript
// app/shared/components/__tests__/Modal.accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Modal } from '../Modal';

expect.extend(toHaveNoViolations);

describe('Modal Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen onClose={jest.fn()}>
        <h2>Test Modal</h2>
        <p>Modal content</p>
      </Modal>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should trap focus within modal', async () => {
    const user = userEvent.setup();
    
    render(
      <div>
        <button>Outside button</button>
        <Modal isOpen onClose={jest.fn()}>
          <button>Modal button 1</button>
          <button>Modal button 2</button>
        </Modal>
      </div>
    );
    
    // Focus should be trapped in modal
    await user.tab();
    expect(screen.getByText('Modal button 1')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Modal button 2')).toHaveFocus();
    
    // Should cycle back to first modal element
    await user.tab();
    expect(screen.getByText('Modal button 1')).toHaveFocus();
  });
});
```

## Testing Setup

### Jest Configuration

Our Jest setup includes:

```javascript
// jest.config.mjs
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFiles: ['<rootDir>/tests/setup/matchMedia.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'src/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
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
```

### Test Environment Setup

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock HTMLMediaElement for audio tests
HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
HTMLMediaElement.prototype.pause = jest.fn();
HTMLMediaElement.prototype.load = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
```

## Writing Tests

### Test Structure

Follow the **Arrange, Act, Assert** pattern:

```typescript
describe('Component Name', () => {
  it('should do something when condition is met', () => {
    // Arrange - Set up test data and conditions
    const mockProps = {
      title: 'Test Title',
      onClose: jest.fn(),
    };
    
    // Act - Trigger the behavior being tested
    renderWithProviders(<Component {...mockProps} />);
    const button = screen.getByRole('button', { name: /close/i });
    userEvent.click(button);
    
    // Assert - Verify the expected outcome
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});
```

### Component Testing

#### Basic Component Rendering

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
  
  it('applies correct variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });
});
```

#### Testing User Interactions

```typescript
import { userEvent } from '@testing-library/user-event';

describe('SearchInput', () => {
  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<SearchInput value="" onChange={handleChange} />);
    
    const input = screen.getByRole('searchbox');
    await user.type(input, 'test query');
    
    expect(handleChange).toHaveBeenCalledWith('test query');
  });
});
```

#### Testing Async Behavior

```typescript
import { waitFor } from '@testing-library/react';

describe('VerseLoader', () => {
  it('displays loading state then verses', async () => {
    render(<VerseLoader surahId={1} />);
    
    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Should show verses after loading
    await waitFor(() => {
      expect(screen.getByText(/al-fatihah/i)).toBeInTheDocument();
    });
    
    // Should not show loading anymore
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAudioPlayer } from '../useAudioPlayer';

describe('useAudioPlayer', () => {
  it('should start paused', () => {
    const { result } = renderHook(() => useAudioPlayer('/test.mp3'));
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
  });
  
  it('should play audio when play is called', async () => {
    const { result } = renderHook(() => useAudioPlayer('/test.mp3'));
    
    await act(async () => {
      await result.current.play();
    });
    
    expect(result.current.isPlaying).toBe(true);
  });
});
```

## Test Utilities

### `renderWithProviders`

Wraps components with necessary context providers:

```typescript
// app/testUtils/renderWithProviders.tsx
interface RenderOptions {
  initialAudioState?: Partial<AudioState>;
  initialTheme?: 'light' | 'dark';
  initialBookmarks?: Bookmark[];
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClient>
      <ThemeProvider initialTheme={options.initialTheme || 'light'}>
        <AudioProvider initialState={options.initialAudioState}>
          <BookmarkProvider initialBookmarks={options.initialBookmarks}>
            {children}
          </BookmarkProvider>
        </AudioProvider>
      </ThemeProvider>
    </QueryClient>
  );
  
  return render(ui, { wrapper: Wrapper });
};
```

### `setMatchMedia`

Controls responsive behavior in tests:

```typescript
// app/testUtils/matchMedia.ts
export const setMatchMedia = (matches: boolean): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Usage in tests
beforeEach(() => {
  setMatchMedia(false); // Desktop
  // or setMatchMedia(true) for mobile
});
```

### Mock Data Factories

Create consistent test data:

```typescript
// app/testUtils/factories.ts
export const createMockVerse = (overrides?: Partial<Verse>): Verse => ({
  id: 1,
  verse_key: '1:1',
  text_uthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  text_simple: 'Bismillahir rahmanir rahim',
  translations: [
    {
      id: 131,
      text: 'In the name of Allah, the Beneficent, the Merciful.',
      resource_name: 'Dr. Mustafa Khattab',
    }
  ],
  audio_url: '/audio/001001.mp3',
  ...overrides,
});

export const createMockSurah = (overrides?: Partial<Surah>): Surah => ({
  id: 1,
  name_simple: 'Al-Fatihah',
  name_arabic: 'الفاتحة',
  verses_count: 7,
  revelation_place: 'makkah',
  ...overrides,
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation details
it('should call setState with correct parameters', () => {
  const component = shallow(<MyComponent />);
  component.instance().setState = jest.fn();
  component.instance().handleClick();
  expect(component.instance().setState).toHaveBeenCalledWith({ count: 1 });
});

// ✅ Good - Testing user-visible behavior
it('should increment counter when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
it('should work', () => { /* ... */ });
it('handles click', () => { /* ... */ });

// ✅ Good
it('should display error message when verse fails to load', () => { /* ... */ });
it('should bookmark verse when bookmark button is clicked', () => { /* ... */ });
it('should navigate to next page when next button is pressed', () => { /* ... */ });
```

### 3. Test Error States

```typescript
describe('VerseLoader error handling', () => {
  it('should display error message when API call fails', async () => {
    // Mock API failure
    server.use(
      rest.get('/api/verses', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    render(<VerseLoader surahId={1} />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load verses/i)).toBeInTheDocument();
    });
  });
  
  it('should show retry button on error', async () => {
    // Test retry functionality
  });
});
```

### 4. Test Accessibility

```typescript
describe('Modal accessibility', () => {
  it('should focus first focusable element when opened', () => {
    render(
      <Modal isOpen onClose={jest.fn()}>
        <input />
        <button>Close</button>
      </Modal>
    );
    
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
  
  it('should close when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    
    render(<Modal isOpen onClose={onClose}><div>Content</div></Modal>);
    
    await user.keyboard('{Escape}');
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

### 5. Keep Tests Independent

```typescript
// ❌ Bad - Tests depend on each other
describe('Counter', () => {
  let wrapper;
  
  beforeAll(() => {
    wrapper = render(<Counter />);
  });
  
  it('starts at 0', () => {
    expect(wrapper.getByText('Count: 0')).toBeInTheDocument();
  });
  
  it('increments to 1', () => {
    // This test depends on the previous test's DOM state
    fireEvent.click(wrapper.getByText('Increment'));
    expect(wrapper.getByText('Count: 1')).toBeInTheDocument();
  });
});

// ✅ Good - Independent tests
describe('Counter', () => {
  it('starts at 0', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
  
  it('increments from 0 to 1 when clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    await user.click(screen.getByRole('button', { name: /increment/i }));
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

## Common Patterns

### Testing Forms

```typescript
describe('ContactForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    
    render(<ContactForm onSubmit={onSubmit} />);
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
    });
  });
  
  it('should show validation errors for invalid data', async () => {
    const user = userEvent.setup();
    
    render(<ContactForm onSubmit={jest.fn()} />);
    
    // Submit without filling form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
```

### Testing API Calls with MSW

```typescript
// tests/setup/msw/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/surahs/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    if (id === '1') {
      return res(
        ctx.json({
          id: 1,
          name_simple: 'Al-Fatihah',
          verses: [
            { id: 1, text: 'In the name of Allah...' }
          ]
        })
      );
    }
    
    return res(ctx.status(404), ctx.json({ error: 'Surah not found' }));
  }),
];

// In your test
it('should load surah data', async () => {
  render(<SurahPage id={1} />);
  
  await waitFor(() => {
    expect(screen.getByText('Al-Fatihah')).toBeInTheDocument();
  });
});
```

### Testing Responsive Components

```typescript
describe('ResponsiveNavigation', () => {
  it('should show hamburger menu on mobile', () => {
    setMatchMedia(true); // Mobile
    
    render(<Navigation />);
    
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
  
  it('should show full navigation on desktop', () => {
    setMatchMedia(false); // Desktop
    
    render(<Navigation />);
    
    expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

## Debugging Tests

### Debug Utilities

```typescript
import { screen } from '@testing-library/react';

// Debug what's currently rendered
screen.debug();

// Debug specific element
screen.debug(screen.getByRole('button'));

// Get all roles in the component
screen.logTestingPlaygroundURL();
```

### Common Issues

#### 1. Element Not Found

```typescript
// ❌ This might fail if element isn't rendered yet
expect(screen.getByText('Loading...')).toBeInTheDocument();

// ✅ Use queries that don't throw
expect(screen.queryByText('Loading...')).toBeInTheDocument();

// ✅ Or wait for async rendering
await waitFor(() => {
  expect(screen.getByText('Loaded content')).toBeInTheDocument();
});
```

#### 2. Act Warnings

```typescript
// ❌ State updates outside act()
fireEvent.click(button);

// ✅ Use userEvent or wrap in act()
await user.click(button);
// or
await act(async () => {
  fireEvent.click(button);
});
```

#### 3. Timer Issues

```typescript
describe('Auto-saving feature', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  
  it('should auto-save after 2 seconds', async () => {
    render(<AutoSaveForm />);
    
    // Type in input
    await user.type(screen.getByRole('textbox'), 'content');
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });
});
```

## Running Tests

### Command Reference

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should handle click"

# Run tests for changed files only
npm test -- --onlyChanged

# Run E2E tests
npm run test:e2e

# Run accessibility tests only
npm test -- --testPathPattern="accessibility"
```

### Coverage Reports

View coverage in your browser:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

Coverage thresholds are set in `jest.config.mjs`:

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

Remember: **100% coverage doesn't guarantee bug-free code**. Focus on testing the right behaviors rather than achieving perfect coverage numbers.