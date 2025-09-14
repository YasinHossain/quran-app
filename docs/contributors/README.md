# Contributor Guide

Welcome to the Quran App project! This guide will help you get started with contributing to our modern, accessible Quran reading application.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Development Guidelines](#development-guidelines)
- [Testing Strategy](#testing-strategy)
- [Component Development](#component-development)
- [Provider Pattern](#provider-pattern)
- [Code Quality](#code-quality)
- [Deployment](#deployment)

## Quick Start

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd quran-app

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run all quality checks
npm run check
```

### Essential Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Production build
npm run start           # Start production server

# Code Quality (AI runs these automatically)
npm run check           # Run all checks (format, lint, typecheck, test)
npm run format          # Format with Prettier
npm run lint            # ESLint
npm run type-check      # TypeScript check
npm run test            # Jest tests
npm run test:coverage   # Test with coverage

# Testing
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests only
npm run test:ui         # UI component tests only
npm run test:e2e        # End-to-end tests with Playwright

# Storybook
npm run storybook       # Start Storybook dev server
npm run build-storybook # Build Storybook for production
```

## Architecture Overview

The Quran App follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/           # Business logic and entities
│   ├── entities/     # Core domain models
│   ├── interfaces/   # Repository and service contracts
│   └── services/     # Domain services
├── application/      # Use cases and application logic
│   └── use-cases/    # Application-specific business rules
└── infrastructure/   # External concerns (API, storage, etc.)
    ├── repositories/ # Data access implementations
    └── monitoring/   # Logging and observability

app/                  # Next.js App Router structure
├── (features)/       # Feature-based routing
│   ├── surah/        # Surah reading feature
│   ├── bookmarks/    # Bookmarks management
│   ├── search/       # Search functionality
│   └── tafsir/       # Commentary feature
├── providers/        # React Context providers
├── shared/           # Shared UI components and utilities
└── globals.css       # Global styles

lib/                  # Utility libraries
├── api/              # API client wrappers
├── audio/            # Audio playback utilities
├── tafsir/           # Tafsir processing
└── text/             # Text processing utilities
```

### Key Principles

1. **Domain-Driven Design**: Business logic lives in the domain layer
2. **Dependency Inversion**: Infrastructure depends on domain interfaces
3. **Feature Isolation**: Each feature is self-contained
4. **Component Composition**: Reusable UI components with clear interfaces
5. **Type Safety**: Comprehensive TypeScript coverage

## Development Guidelines

### File Organization

```bash
# Feature structure example
app/(features)/surah/
├── components/           # Feature-specific components
├── hooks/               # Custom hooks
├── utils/               # Feature utilities
├── __tests__/           # Feature tests
├── page.tsx             # Main page component
└── layout.tsx           # Feature layout

# Shared component structure
app/shared/components/modal/
├── ModalContent.tsx     # Main component
├── ModalActions.tsx     # Sub-components
├── ModalBackdrop.tsx    
├── Modal.stories.tsx    # Storybook stories
├── Modal.test.tsx       # Component tests
└── index.ts             # Exports
```

### Naming Conventions

- **Components**: PascalCase (`ModalContent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAudioPlayer.ts`)
- **Utilities**: camelCase (`textUtils.ts`)
- **Types**: PascalCase with descriptive names (`AudioPlayerState`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Import Organization

```typescript
// 1. External libraries
import React from 'react';
import { NextPage } from 'next';

// 2. Internal absolute imports (domain, application, infrastructure)
import { ILogger } from '@/src/domain/interfaces/ILogger';
import { AudioUseCase } from '@/src/application/use-cases/AudioUseCase';

// 3. Relative imports (same feature/directory)
import { AudioPlayer } from '../components/AudioPlayer';
import { useAudioState } from '../hooks/useAudioState';
```

## Testing Strategy

Our testing approach follows the **Testing Trophy** pattern:

### Test Types

1. **Unit Tests**: Test individual functions and hooks
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user journeys
4. **Visual Tests**: Test UI appearance with Storybook

### Test Structure

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { AudioPlayer } from '../AudioPlayer';

describe('AudioPlayer', () => {
  it('should display play button when paused', () => {
    renderWithProviders(
      <AudioPlayer src="/test-audio.mp3" />,
      { initialAudioState: { isPlaying: false } }
    );
    
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });
});
```

### Testing Utilities

- **`renderWithProviders`**: Wraps components with necessary context providers
- **`setMatchMedia`**: Controls responsive behavior in tests
- **HTMLMediaElement stubs**: Comprehensive audio element mocking
- **MSW**: Mock Service Worker for API testing

### Writing Tests

1. **Use descriptive test names**: `should display error message when audio fails to load`
2. **Test user interactions**: Focus on what users do, not implementation details
3. **Mock external dependencies**: Use MSW for APIs, stubs for DOM APIs
4. **Test accessibility**: Include screen reader and keyboard navigation tests

## Component Development

### Component Patterns

#### 1. Atomic Design Structure

```typescript
// Atom: Basic button
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size, 
  children, 
  onClick 
}) => {
  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### 2. Compound Components

```typescript
// Modal compound component
const Modal = {
  Root: ModalRoot,
  Content: ModalContent,
  Header: ModalHeader,
  Actions: ModalActions,
  Backdrop: ModalBackdrop,
};

// Usage
<Modal.Root>
  <Modal.Backdrop />
  <Modal.Content>
    <Modal.Header title="Delete Bookmark" />
    <p>Are you sure?</p>
    <Modal.Actions
      primaryAction={{ label: 'Delete', onClick: handleDelete }}
      secondaryAction={{ label: 'Cancel', onClick: handleCancel }}
    />
  </Modal.Content>
</Modal.Root>
```

#### 3. Hook Patterns

```typescript
// Custom hook with proper typing
export function useAudioPlayer(src: string): {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
} {
  const [state, setState] = useState<AudioState>(initialState);
  
  // Implementation...
  
  return {
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    play: handlePlay,
    pause: handlePause,
    seek: handleSeek,
  };
}
```

### Responsive Design

All components must be mobile-first and responsive:

```typescript
// Responsive component example
export const ResponsiveCard: React.FC<CardProps> = ({ children }) => {
  return (
    <div className={cn(
      // Mobile-first base styles
      'p-4 rounded-lg bg-white shadow-sm',
      // Tablet styles
      'md:p-6 md:rounded-xl',
      // Desktop styles
      'lg:p-8 lg:shadow-lg'
    )}>
      {children}
    </div>
  );
};
```

### Accessibility Requirements

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA labels**: Provide screen reader descriptions
3. **Keyboard navigation**: Support Tab, Enter, Escape keys
4. **Focus management**: Visible focus indicators
5. **Color contrast**: WCAG AA compliance

```typescript
// Accessible component example
export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder 
}) => {
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search Quran verses
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
        aria-describedby="search-help"
      />
      <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <div id="search-help" className="sr-only">
        Search through Quran verses and translations
      </div>
    </div>
  );
};
```

## Provider Pattern

### Context Setup

```typescript
// Provider interface
interface AudioContextValue {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  play: (track: AudioTrack) => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
}

// Provider component
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  
  const contextValue: AudioContextValue = {
    ...state,
    play: handlePlay,
    pause: handlePause,
    setVolume: handleSetVolume,
  };
  
  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

// Hook for consuming context
export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
```

### Testing with Providers

```typescript
// Test utility for provider wrapping
export const renderWithProviders = (
  ui: React.ReactElement,
  options: {
    initialAudioState?: Partial<AudioState>;
    initialTheme?: Theme;
  } = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider initialTheme={options.initialTheme}>
      <AudioProvider initialState={options.initialAudioState}>
        {children}
      </AudioProvider>
    </ThemeProvider>
  );
  
  return render(ui, { wrapper: Wrapper });
};
```

## Code Quality

### ESLint Rules

Key rules we enforce:

```json
{
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "react-hooks/exhaustive-deps": "error",
  "jsx-a11y/alt-text": "error"
}
```

### TypeScript Standards

1. **Strict mode enabled**: No implicit any types
2. **Interface over type**: Use interfaces for object shapes
3. **Explicit return types**: All functions must declare return types
4. **Proper generics**: Use generic types for reusable components

```typescript
// Good: Explicit and type-safe
interface AudioPlayerProps {
  src: string;
  autoplay?: boolean;
  onPlay?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  autoplay = false, 
  onPlay 
}): React.JSX.Element => {
  // Implementation...
};
```

### Performance Guidelines

1. **Memoization**: Use `React.memo`, `useMemo`, `useCallback` appropriately
2. **Lazy loading**: Code split features and components
3. **Image optimization**: Use Next.js Image component
4. **Bundle analysis**: Monitor bundle sizes

## Deployment

### CI/CD Pipeline

Our GitHub Actions workflow:

1. **Code Quality**: ESLint, Prettier, TypeScript checking
2. **Testing**: Unit, integration, and E2E tests
3. **Security**: Dependency audit and secrets scanning
4. **Performance**: Bundle size analysis and Lighthouse checks
5. **Accessibility**: Automated a11y testing

### Environment Setup

```bash
# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.production.com
NODE_ENV=production
```

### Monitoring

- **Error tracking**: Comprehensive error boundaries
- **Performance monitoring**: Web Vitals instrumentation  
- **User analytics**: Privacy-focused usage tracking
- **Security monitoring**: Automated vulnerability scanning

## Contributing Process

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add audio playback controls
fix: resolve mobile navigation issue
docs: update component documentation
test: add accessibility tests
chore: update dependencies
```

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Accessibility tested
- [ ] Mobile responsiveness verified

## Getting Help

- **Issues**: Report bugs and feature requests
- **Discussions**: Ask questions and share ideas
- **Documentation**: Check existing docs first
- **Code Review**: All PRs get reviewed by maintainers

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Storybook](https://storybook.js.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

Thank you for contributing to the Quran App! 🎉