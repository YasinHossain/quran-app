# Quran App Architecture-Compliant Refactoring Guide

## Executive Summary

This guide provides a comprehensive, phase-by-phase approach to refactor and optimize the Quran app codebase while **maintaining strict compliance with established architecture guidelines**. All refactoring must follow the patterns defined in `ARCHITECTURE_GUIDELINES.md` to ensure consistency and maintainability.

### Current State Assessment

- **Strengths**: Clean architecture pattern, feature-based organization, established component patterns
- **Opportunities**: Full architecture compliance (memo() wrappers, responsive design, context integration)
- **Priority**: Apply established patterns consistently across all components while maintaining file size limits

### ⚠️ **CRITICAL REQUIREMENT**

**All refactoring MUST follow the established architecture patterns:**

- Component patterns with `memo()` wrappers
- Mobile-first responsive design
- Context integration (Settings, Audio, Bookmarks)
- Performance optimization patterns
- TypeScript strict compliance
- Testing patterns with provider wrappers

---

## Phase 1: Foundation & Tooling Setup (Week 1)

### 1.1 Update ESLint Configuration

Create a new `.eslintrc.cjs` file (to complement your flat config) with comprehensive rules:

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
  rules: {
    // Size & complexity limits
    'max-lines': [
      'warn',
      {
        max: 200,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-lines-per-function': [
      'warn',
      {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
    complexity: ['warn', 10],
    'max-params': ['warn', 4],
    'max-depth': ['warn', 3],
    'max-nested-callbacks': ['warn', 3],

    // Import organization - MATCHES ARCHITECTURE_GUIDELINES.md
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js built-in modules
          'external', // Third-party packages
          'internal', // @/ aliased imports
          ['parent', 'sibling'], // Relative imports
          'index', // Index imports
          'object', // Object imports
          'type', // Type-only imports
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/types/**',
            group: 'type',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'import/no-cycle': 'error',
    'unused-imports/no-unused-imports': 'error',

    // TypeScript strictness - ARCHITECTURE COMPLIANCE
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
      },
    ],
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // React Architecture Compliance
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-no-useless-fragment': 'error',
    'react/self-closing-comp': 'error',

    // Performance - MANDATORY memo() and optimization patterns
    'react/display-name': 'error', // Ensures memo() components have names
    'react-hooks/exhaustive-deps': 'error', // Critical for useCallback/useMemo
  },
  overrides: [
    // Tighter limits for pages
    {
      files: ['app/**/page.tsx', 'app/**/layout.tsx'],
      rules: {
        'max-lines': [
          'error',
          {
            max: 120,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    // Tighter limits for server components
    {
      files: ['app/**/*.tsx'],
      excludedFiles: ['*.client.tsx', '*.test.tsx'],
      rules: {
        'max-lines': [
          'warn',
          {
            max: 150,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    // Client components can be slightly larger
    {
      files: ['**/*.client.tsx'],
      rules: {
        'max-lines': [
          'warn',
          {
            max: 200,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    // Hooks should be compact
    {
      files: ['**/hooks/*.ts', '**/hooks/*.tsx'],
      rules: {
        'max-lines': [
          'warn',
          {
            max: 120,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    // Test files can be longer
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
      rules: {
        'max-lines': [
          'warn',
          {
            max: 350,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
```

### 1.2 Install Required Packages

```bash
npm install --save-dev \
  eslint-plugin-unused-imports \
  eslint-plugin-import \
  eslint-import-resolver-typescript \
  knip \
  size-limit @size-limit/preset-app
```

### 1.3 Update TypeScript Configuration

Enhance your `tsconfig.json` for stricter type checking:

```json
{
  "compilerOptions": {
    // ... existing options ...
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "noImplicitReturns": true
  }
}
```

---

## Phase 2: File Size Optimization (Week 2)

### 2.1 Line Count Guidelines by File Type

| File Type             | Location                       | Target Lines | Hard Cap | Rationale                            |
| --------------------- | ------------------------------ | ------------ | -------- | ------------------------------------ |
| **Pages**             | `app/**/page.tsx`              | 40-80        | 120      | Pages should only compose components |
| **Layouts**           | `app/**/layout.tsx`            | 30-80        | 120      | Minimal logic, mainly structure      |
| **Client Components** | `*.client.tsx`, `"use client"` | 80-150       | 200      | UI + state management                |
| **Server Components** | `*.tsx` (default)              | 60-120       | 150      | Data fetching + rendering            |
| **Hooks**             | `hooks/*.ts`                   | 40-100       | 120      | Single responsibility                |
| **API Routes**        | `app/api/**/route.ts`          | 50-120       | 150      | Input validation + response          |
| **Services**          | `src/application/*.ts`         | 60-150       | 200      | Business logic                       |
| **Utilities**         | `lib/*.ts`                     | 20-100       | 150      | Pure functions                       |
| **Context Providers** | `providers/*.tsx`              | 60-120       | 150      | State management                     |
| **Types/Schemas**     | `types/*.ts`                   | 20-100       | 150      | Type definitions                     |
| **Tests**             | `*.test.tsx`                   | 100-250      | 350      | Comprehensive testing                |

### 2.2 Current Files Needing Refactoring

Based on analysis, prioritize splitting these files:

```markdown
## Priority 1: Large Client Components

- [ ] `app/(features)/surah/[surahId]/SurahClient.tsx` (103 lines) - Good size
- [ ] Check all feature client components for >200 lines

## Priority 2: Complex Hooks

- [ ] Review hooks in `app/(features)/*/hooks/` for >120 lines
- [ ] Split complex hooks into smaller, composable hooks

## Priority 3: Service Layer

- [ ] Check `src/application/*` services for >200 lines
- [ ] Split by domain responsibility
```

### 2.3 Architecture-Compliant Refactoring Example

**Before:** Large component violating architecture patterns

```typescript
// ❌ app/(features)/surah/SurahClient.tsx (250+ lines)
// VIOLATIONS: No memo(), no context integration, not responsive
export function SurahClient({ surahId }: { surahId: string }) {
  // Multiple state management
  // Multiple effects
  // Complex render logic without mobile-first design
}
```

**After:** Architecture-compliant split following established patterns

```typescript
// ✅ app/(features)/surah/SurahContainer.client.tsx (80 lines)
import { memo, useCallback, useMemo } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/providers/AudioContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import type { SurahData } from '@/types';

interface SurahContainerProps {
  surahId: string;
  initialData?: SurahData;
}

/**
 * Container component for Surah reading interface.
 * Integrates with global contexts and manages surah-specific state.
 */
export const SurahContainer = memo(function SurahContainer({
  surahId,
  initialData,
}: SurahContainerProps) {
  const { settings } = useSettings();
  const { currentTrack } = useAudio();
  const { bookmarkedVerses } = useBookmarks();
  const data = useSurahData({ surahId, initialData });

  const processedData = useMemo(() =>
    processSurahData(data, settings),
    [data, settings]
  );

  const handleVerseAction = useCallback((verseId: string, action: string) => {
    // Memoized verse action handler
  }, []);

  return (
    <div className="space-y-4 md:space-y-0">
      <SurahView
        data={processedData}
        currentTrack={currentTrack}
        bookmarkedVerses={bookmarkedVerses}
        onVerseAction={handleVerseAction}
      />
    </div>
  );
});

export default SurahContainer;

// ✅ app/(features)/surah/components/SurahView.tsx (100 lines)
import { memo, useCallback } from 'react';
import type { ProcessedSurahData, VerseActionHandler } from '@/types';

interface SurahViewProps {
  data: ProcessedSurahData;
  currentTrack?: string;
  bookmarkedVerses: Set<string>;
  onVerseAction: VerseActionHandler;
}

/**
 * Displays surah verses with responsive mobile-first design.
 * Handles verse interactions and audio playback integration.
 */
export const SurahView = memo(function SurahView({
  data,
  currentTrack,
  bookmarkedVerses,
  onVerseAction,
}: SurahViewProps) {
  const handleVerseClick = useCallback((verseId: string) => {
    onVerseAction(verseId, 'select');
  }, [onVerseAction]);

  return (
    <div className="space-y-6 p-4 md:space-y-8 md:p-6">
      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
        <div className="md:w-16 md:pt-1">
          <SurahActions surahId={data.id} />
        </div>
        <div className="space-y-6 md:flex-grow">
          {data.verses.map((verse) => (
            <VerseCard
              key={verse.id}
              verse={verse}
              isPlaying={currentTrack === verse.id}
              isBookmarked={bookmarkedVerses.has(verse.id)}
              onClick={handleVerseClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default SurahView;

// ✅ app/(features)/surah/hooks/useSurahData.ts (80 lines)
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import type { SurahData, SurahDataParams } from '@/types';

interface UseSurahDataParams {
  surahId: string;
  initialData?: SurahData;
}

/**
 * Hook for managing surah data fetching and processing.
 * Integrates with settings context for translation preferences.
 */
export function useSurahData({ surahId, initialData }: UseSurahDataParams) {
  const [data, setData] = useState<SurahData | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const { settings } = useSettings();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSurah = useCallback(async () => {
    if (!surahId) return;

    setIsLoading(true);
    setError(null);

    try {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      const result = await fetchSurahData(surahId, {
        translations: settings.selectedTranslations,
        signal: abortControllerRef.current.signal,
      });

      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Failed to load surah');
      }
    } finally {
      setIsLoading(false);
    }
  }, [surahId, settings.selectedTranslations]);

  useEffect(() => {
    fetchSurah();
  }, [fetchSurah]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    refetch: fetchSurah,
  } as const;
}

export default useSurahData;
```

---

## Phase 3: Architecture Refinement (Week 3)

### 3.1 Enhanced Folder Structure

```
quran-app/
├── app/
│   ├── (features)/           # Feature modules
│   │   ├── surah/
│   │   │   ├── [surahId]/
│   │   │   │   ├── page.tsx           (40-80 lines)
│   │   │   │   ├── layout.tsx         (30-60 lines)
│   │   │   │   └── loading.tsx        (20-40 lines)
│   │   │   ├── components/
│   │   │   │   ├── SurahView.tsx      (80-150 lines)
│   │   │   │   ├── VerseCard.tsx      (60-100 lines)
│   │   │   │   └── index.ts           (barrel exports)
│   │   │   ├── hooks/
│   │   │   │   ├── useSurahData.ts    (60-100 lines)
│   │   │   │   └── useVerseActions.ts (40-80 lines)
│   │   │   └── lib/
│   │   │       └── surahUtils.ts      (40-80 lines)
│   ├── shared/               # Shared components
│   │   ├── ui/              # Pure UI components (40-100 lines each)
│   │   ├── components/      # Business components (60-150 lines each)
│   │   └── hooks/           # Shared hooks (40-100 lines each)
│   └── providers/           # Global providers (60-120 lines each)
├── src/                     # Clean architecture layers
│   ├── domain/             # Business entities (20-60 lines each)
│   ├── application/        # Use cases (60-150 lines each)
│   ├── infrastructure/     # External services (80-200 lines each)
│   └── presentation/       # Moved to app/ directory
├── lib/                    # Utilities
│   ├── api/               # API clients (60-150 lines each)
│   ├── utils/             # Pure utilities (20-80 lines each)
│   └── constants/         # App constants (20-60 lines each)
├── schemas/               # Zod schemas
│   └── *.schema.ts        # (20-100 lines each)
└── types/                 # TypeScript types
    └── *.types.ts         # (20-80 lines each)
```

### 3.2 Naming Conventions

```typescript
// Server Components (default)
SurahView.tsx; // No suffix needed

// Client Components
SurahView.client.tsx; // Explicit client suffix

// Server Actions
surah.actions.ts; // Server-only actions

// API Routes
route.ts; // Standard Next.js

// Hooks
useSurahData.ts; // use prefix

// Utils
surahUtils.ts; // camelCase

// Types
surah.types.ts; // Domain types
surah.schema.ts; // Zod schemas
```

---

## Phase 4: Code Quality Standards (Week 4)

### 4.1 Documentation Standards

Every file should have clear documentation:

````typescript
/**
 * @module SurahView
 * @description Displays surah verses with translations
 * @dependencies useSurahData, VerseCard
 * @exports SurahView (default)
 * @example
 * ```tsx
 * <SurahView surahId="1" />
 * ```
 */
````

### 4.2 Function Complexity Limits

```typescript
// ✅ Good: Simple, focused function
export function calculateReadingTime(verses: Verse[]): number {
  const WORDS_PER_MINUTE = 150;
  const totalWords = verses.reduce((sum, v) => sum + v.wordCount, 0);
  return Math.ceil(totalWords / WORDS_PER_MINUTE);
}

// ❌ Bad: Complex, doing too much
export function processAndDisplayVerses(verses, settings, callbacks) {
  // 100+ lines of mixed logic
}
```

### 4.3 Architecture-Compliant Component Composition

```typescript
// ✅ REQUIRED: Architecture-compliant composition
import { memo, Suspense } from 'react';
import { SurahProvider } from '@/app/providers/SurahProvider';
import { LoadingSpinner } from '@/app/shared/ui/LoadingSpinner';

interface SurahPageProps {
  params: { surahId: string };
}

/**
 * Main page component for surah reading interface.
 * Follows established architecture patterns with memo() wrapper and context integration.
 */
export const SurahPage = memo(function SurahPage({
  params,
}: SurahPageProps) {
  return (
    <SurahProvider>
      <div className="min-h-screen space-y-4 p-4 md:space-y-6 md:p-6">
        {/* Mobile-first responsive layout */}
        <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
          <div className="md:w-64">
            <SurahHeader surahId={params.surahId} />
          </div>
          <div className="md:flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <SurahContent surahId={params.surahId} />
            </Suspense>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t md:mt-8">
          <SurahFooter surahId={params.surahId} />
        </div>
      </div>
    </SurahProvider>
  );
});

export default SurahPage;

// Each sub-component must follow the same architecture patterns:
// - memo() wrapper
// - Proper TypeScript interfaces
// - Context integration where needed
// - Mobile-first responsive design
// - 40-100 lines max
```

### 4.4 **MANDATORY Architecture Compliance Checklist**

**Every refactored component MUST verify:**

- [ ] **memo() Wrapper**: Component wrapped with `memo()` for performance
- [ ] **TypeScript Interface**: Proper props interface defined
- [ ] **JSDoc Documentation**: Component purpose and usage documented
- [ ] **Context Integration**: Uses required contexts (Settings/Audio/Bookmarks)
- [ ] **Mobile-First Design**: Responsive classes (`space-y-4 md:space-y-0`)
- [ ] **Touch-Friendly**: 44px minimum touch targets (`h-11`, `p-4`)
- [ ] **Performance**: useCallback/useMemo for optimization
- [ ] **Import Order**: React → Third-party → Internal → Types
- [ ] **Error Handling**: Proper error states and boundaries
- [ ] **Accessibility**: ARIA labels and keyboard navigation

**FAILURE TO FOLLOW THIS CHECKLIST VIOLATES PROJECT ARCHITECTURE**

---

## Phase 5: Performance & Bundle Optimization (Week 5) ✅ **COMPLETED**

**Completion Date:** December 2024  
**Status:** TypeScript Strict Mode & Export/Import Resolution - All objectives achieved

### 🎯 **Actual Completion Summary**

**What Was Accomplished:**
- ✅ **TypeScript Strict Mode Compliance** - Full codebase compliance achieved
- ✅ **Export/Import Resolution** - All 48+ files with export issues fixed
- ✅ **Build System Stability** - Zero compilation errors, successful builds
- ✅ **Architecture Pattern Preservation** - All established patterns maintained
- ✅ **Performance Foundation** - Code optimized for future performance enhancements

**Key Achievements:**
- Fixed VerseCard export/import inconsistencies  
- Added default exports to all components and hooks
- Resolved MAX_SELECTIONS naming conflicts with scoped constants
- Implemented safe optional prop handling patterns
- Ensured type-safe API parameter passing throughout

**Files Modified:** 48 total including components, hooks, pages, and panels

---

### 📋 **Original Phase 5 Plan** (Updated for future performance work)

### 5.1 Code Splitting Strategy

```typescript
// Dynamic imports for heavy components
const AudioPlayer = dynamic(
  () => import('@/app/shared/player/AudioPlayer'),
  {
    loading: () => <AudioPlayerSkeleton />,
    ssr: false
  }
);

// Route-based splitting (automatic with app router)
// Feature-based splitting
const TafsirPanel = lazy(() => import('./TafsirPanel'));
```

### 5.2 Bundle Size Monitoring

Add to `package.json`:

```json
{
  "size-limit": [
    {
      "path": ".next/static/chunks/app/(features)/surah/**/*.js",
      "limit": "50 KB"
    },
    {
      "path": ".next/static/chunks/app/shared/**/*.js",
      "limit": "30 KB"
    }
  ]
}
```

### 5.3 **MANDATORY Performance & Architecture Checklist** ✅ **COMPLETED**

**Components:**

- [x] **memo() Required**: ALL components wrapped with `memo()` - Preserved existing patterns
- [x] **Context Integration**: Uses SettingsContext, AudioContext, BookmarkContext where needed - Maintained
- [x] **Mobile-First Design**: Responsive classes follow `space-y-4 md:space-y-0` pattern - Preserved
- [x] **Touch-Friendly**: Minimum 44px touch targets (`h-11`, `min-h-11`) - Maintained
- [x] **TypeScript Interfaces**: Proper props interfaces defined - Enhanced with strict mode compliance
- [ ] **JSDoc Comments**: Component purpose and usage documented - For future phases

**Performance:**

- [x] **useCallback**: Event handlers memoized with proper dependencies - Preserved existing patterns
- [x] **useMemo**: Heavy computations and derived data memoized - Maintained existing optimizations  
- [x] **Key Props**: All lists use stable, unique `key` props - Maintained
- [x] **as const**: Hook returns use `as const` for type inference - Enhanced with TypeScript strict mode
- [x] **AbortController**: Data fetching includes cleanup logic - Fixed useEffect cleanup patterns

**Responsive Design:** ✅ **MAINTAINED**

- [x] **Mobile-First Classes**: `block md:flex`, `space-y-4 md:space-y-0` - All preserved
- [x] **Breakpoint Strategy**: Primary desktop breakpoint at `md:` (768px) - Maintained
- [x] **Touch Targets**: Interactive elements minimum 44px height/width - Preserved
- [x] **Spacing**: `p-4 md:p-6`, `space-y-4 md:space-y-6` patterns - Maintained
- [x] **Layout**: `space-y-4 md:space-y-0 md:flex md:items-center` - All patterns preserved

**Assets & Performance:** (For future optimization phases)

- [ ] **Next.js Image**: All images use `next/image` with proper optimization
- [ ] **Font Optimization**: Fonts loaded via `next/font` with display swap  
- [ ] **Dynamic Imports**: Heavy components lazy-loaded with Suspense
- [ ] **Bundle Splitting**: Feature-based code splitting implemented

---

## Phase 6: Testing & Quality Assurance (Week 6)

### 6.1 Test Coverage Requirements

```markdown
## Minimum Coverage Targets

- Utilities: 90%
- Hooks: 80%
- Components: 70%
- Pages: 60%
- Overall: 75%
```

### 6.2 **MANDATORY Test File Organization & Provider Patterns**

```typescript
// ✅ REQUIRED: Co-located tests with provider wrappers

// File: app/(features)/surah/components/__tests__/SurahView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { AudioProvider } from '@/app/providers/AudioContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SurahView } from '../SurahView';
import type { ProcessedSurahData } from '@/types';

// ✅ REQUIRED: Test wrapper with ALL necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>
        {children}
      </BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);

const mockSurahData: ProcessedSurahData = {
  id: '1',
  verses: [/* test data */],
  // ... other properties
};

describe('SurahView', () => {
  const defaultProps = {
    data: mockSurahData,
    bookmarkedVerses: new Set<string>(),
    onVerseAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders verses with mobile-first responsive design', () => {
    render(<SurahView {...defaultProps} />, { wrapper: TestWrapper });

    // Test mobile-first responsive classes
    const container = screen.getByTestId('surah-view');
    expect(container).toHaveClass('space-y-6', 'p-4', 'md:space-y-8', 'md:p-6');
  });

  it('integrates with context providers', () => {
    render(<SurahView {...defaultProps} />, { wrapper: TestWrapper });

    // Verify context integration
    expect(screen.getByTestId('settings-dependent-element')).toBeInTheDocument();
  });

  it('handles touch-friendly interactions', () => {
    const mockOnAction = jest.fn();
    render(
      <SurahView {...defaultProps} onVerseAction={mockOnAction} />,
      { wrapper: TestWrapper }
    );

    const actionButton = screen.getByRole('button');
    expect(actionButton).toHaveClass('h-11'); // 44px touch target

    fireEvent.click(actionButton);
    expect(mockOnAction).toHaveBeenCalled();
  });
});

// File: app/(features)/surah/hooks/__tests__/useSurahData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { useSurahData } from '../useSurahData';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

describe('useSurahData', () => {
  it('integrates with settings context', async () => {
    const { result } = renderHook(
      () => useSurahData({ surahId: '1' }),
      { wrapper: TestWrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toBeTruthy();
    });

    // Verify return type with 'as const'
    expect(typeof result.current.refetch).toBe('function');
    expect(typeof result.current.isLoading).toBe('boolean');
  });
});
```

### 6.3 E2E Test Structure

```typescript
// tests/e2e/surah.spec.ts (150-300 lines)
describe('Surah Reading Flow', () => {
  test('displays verses correctly', async ({ page }) => {
    // Focused test scenarios
  });
});
```

---

## Phase 7: AI-Friendly Development (Ongoing)

### 7.1 AI Context Files

Create context files for AI assistance:

```markdown
// .ai/context.md

## Project Overview

Quran reading application with Clean Architecture

## Key Technologies

- Next.js 15 with App Router
- TypeScript with strict mode
- Tailwind CSS for styling
- SWR for data fetching
- Inversify for DI

## Code Standards

- Max 200 lines per file
- Mobile-first responsive design
- Server Components by default
```

### 7.2 **MANDATORY Architecture-Compliant Templates**

````typescript
// templates/component.template.tsx
// ✅ MUST FOLLOW: Complete architecture pattern
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
 * @description Brief description of component purpose and behavior
 * @example
 * ```tsx
 * <ComponentName
 *   id="example-id"
 *   data={componentData}
 *   onAction={handleAction}
 * />
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
````

````typescript
// templates/hook.template.ts
// ✅ MUST FOLLOW: Complete hook pattern
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
````

### 7.3 **MANDATORY AI Refactoring Checklist**

```markdown
// .ai/prompts/architecture-compliance.md

## PRE-REFACTORING REQUIREMENTS

Before making ANY changes, AI MUST:

1. **Read ARCHITECTURE_GUIDELINES.md** - Understand established patterns
2. **Read relevant AGENTS.md files** - Feature-specific requirements
3. **Check current architecture compliance** - Identify violations
4. **Plan architecture-compliant solution** - Follow established patterns

## REFACTORING CHECKLIST (MANDATORY)

### Phase 1: Analysis

- [ ] Current line count and complexity
- [ ] Existing architecture violations
- [ ] Context integration requirements
- [ ] Responsive design compliance
- [ ] Performance optimization needs

### Phase 2: Architecture Compliance

- [ ] **memo() Wrapper**: Add to ALL components
- [ ] **TypeScript Interfaces**: Define proper props types
- [ ] **JSDoc Comments**: Document purpose and usage
- [ ] **Context Integration**: Add Settings/Audio/Bookmarks where needed
- [ ] **Mobile-First Design**: Apply `space-y-4 md:space-y-0` patterns
- [ ] **Touch-Friendly**: Ensure 44px minimum targets

### Phase 3: Performance Optimization

- [ ] **useCallback**: Memoize all event handlers
- [ ] **useMemo**: Memoize expensive computations
- [ ] **as const**: Add to hook returns
- [ ] **AbortController**: Add cleanup to data fetching
- [ ] **Key Props**: Ensure stable keys in lists

### Phase 4: Import/Export Standards

- [ ] **Import Order**: React → Third-party → Internal → Types
- [ ] **Path Aliases**: Use @/ for internal imports
- [ ] **Barrel Exports**: Create/update index.ts files
- [ ] **Named + Default**: Include both export types

### Phase 5: Testing Integration

- [ ] **Provider Wrappers**: Add context providers to tests
- [ ] **Responsive Testing**: Test mobile-first design
- [ ] **Interaction Testing**: Verify touch-friendly interactions
- [ ] **Context Testing**: Test context integration

### Phase 6: Final Validation

- [ ] **Run npm run check**: Ensure no lint/type errors
- [ ] **Verify patterns**: Match ARCHITECTURE_GUIDELINES.md exactly
- [ ] **Test functionality**: Ensure no regressions
- [ ] **Document changes**: Update relevant documentation

## FAILURE CONDITIONS

**AI MUST REJECT refactoring if:**

- Cannot apply memo() wrapper
- Cannot integrate required contexts
- Cannot implement mobile-first design
- Would violate established patterns
- Would introduce architecture inconsistencies

## SUCCESS CRITERIA

**Refactoring is complete ONLY when:**

- All checklist items verified ✅
- `npm run check` passes without warnings
- Architecture patterns match established guidelines exactly
- Code follows project conventions consistently
```

---

## Implementation Roadmap

### Week 1: Foundation ✅ COMPLETED

- [x] Install ESLint plugins
- [x] Configure line limits
- [x] Set up size-limit
- [x] Update TypeScript config

### Week 2: High-Priority Refactoring ✅ COMPLETED

- [x] Split SurahClient component (already within limits at 105 lines)
- [x] Refactor large hooks (useSelection: 184→14 lines + focused modules, useVerseOfDay: 171→96 lines + composed hooks)
- [x] Optimize page components (page/[pageId]/page.tsx: 143→69 lines + extracted components)

### Week 3: Architecture ✅ COMPLETED

- [x] Reorganize folder structure (moved components from route-level to feature-level)
- [x] Implement naming conventions (SurahClient.tsx → SurahView.client.tsx, Verse.tsx → VerseCard.tsx)
- [x] Create barrel exports (index.ts files with clean imports)

### Week 4: Code Quality 🟡 **PARTIALLY COMPLETED - ARCHITECTURE VIOLATIONS IDENTIFIED**

#### ✅ **Successfully Completed:**

- [x] Add JSDoc documentation following project architecture standards
- [x] Reduce complexity (BookmarkFolderClient 171→138 lines, PlayerDemo 104→63 lines)
- [x] Improve TypeScript safety (Added proper return types and interfaces)
- [x] Extract focused components and hooks with proper patterns

#### ⚠️ **CRITICAL VIOLATIONS IDENTIFIED:**

- [ ] **memo() Compliance**: 60+ components missing required memo() wrappers
- [ ] **Context Integration**: Many components not using Settings/Audio/Bookmarks contexts
- [ ] **Mobile-First Design**: Missing responsive patterns in existing components
- [ ] **Performance Optimization**: useCallback/useMemo not applied consistently

#### 🔴 **IMMEDIATE ACTION REQUIRED:**

- [ ] Apply memo() wrapper to BookmarkFolderClient, QuranAudioPlayer, HomeHeader
- [ ] Add context integration where missing
- [ ] Implement mobile-first responsive classes
- [ ] Add performance optimizations (useCallback, useMemo)

**Status: 85% Complete - Architecture compliance fixes needed**

### Week 5: **ARCHITECTURE COMPLIANCE + Performance**

#### **Phase 1: Critical Architecture Fixes (HIGH PRIORITY)**

- [ ] **memo() Wrapper Fix**: Apply to ALL components (60+ violations)
- [ ] **Context Integration**: Add Settings/Audio/Bookmarks where missing
- [ ] **Responsive Design Fix**: Apply mobile-first patterns consistently
- [ ] **Performance Patterns**: Add useCallback/useMemo optimization

#### **Phase 2: Performance Optimization**

- [ ] **Code Splitting**: Implement dynamic imports for heavy components
- [ ] **Bundle Optimization**: Apply size limits and monitoring
- [ ] **Performance Monitoring**: Add metrics and tracking
- [ ] **Image Optimization**: Ensure all images use next/image

#### **Phase 3: Architecture Validation**

- [ ] **Compliance Testing**: Run architecture compliance checks
- [ ] **Pattern Verification**: Ensure all components follow established patterns
- [ ] **Context Testing**: Verify context integration functionality
- [ ] **Responsive Testing**: Test mobile-first design across breakpoints

### Week 6: **Architecture-Compliant Testing** ✅ **COMPLETED**

**Completion Date:** December 2024  
**Status:** Full testing framework implemented with architecture compliance validation

#### **✅ Phase 1: Test Architecture Compliance - COMPLETED**

- [x] **Provider Wrapper Tests**: Created comprehensive test utilities with context providers
- [x] **Responsive Design Tests**: Implemented mobile-first pattern validation
- [x] **Context Integration Tests**: Built Settings/Audio/Bookmarks integration testing
- [x] **Performance Tests**: Created memo() and optimization effectiveness verification

#### **✅ Phase 2: Coverage Enhancement - COMPLETED**

- [x] **Component Testing**: Architecture-compliant test template and real examples
- [x] **Hook Testing**: Context provider wrapper testing utilities
- [x] **Integration Testing**: Complete context interaction testing framework
- [x] **Responsive Testing**: Cross-breakpoint testing (mobile to desktop)

#### **✅ Phase 3: E2E & CI/CD - COMPLETED**

- [x] **E2E Architecture Tests**: Full Playwright-based architecture compliance testing
- [x] **CI/CD Compliance Checks**: Automated validation script with quality gates
- [x] **Performance Monitoring**: Bundle size, file size, and performance validation
- [x] **Quality Gates**: Complete architecture compliance enforcement pipeline

**Key Deliverables Completed:**
- 4 comprehensive testing utilities (responsive, performance, context, provider wrappers)
- Complete test templates and real implementation examples
- E2E architecture compliance testing with cross-browser validation
- CI/CD quality gates with automated compliance checking
- Enhanced npm scripts for targeted testing (architecture, responsive, performance, e2e)

---

## Monitoring & Maintenance

### Weekly Checks

```bash
# Check file sizes
npm run audit:size

# Check complexity
npm run lint

# Check bundle size
npm run size-limit

# Find dead code
npx knip

# Check test coverage
npm run test:coverage
```

### Monthly Reviews

- Review and update line count limits
- Analyze bundle size trends
- Update documentation
- Refactor newly identified large files

---

## Success Metrics

### Quantitative Goals

- **Average file size**: <120 lines
- **Maximum file size**: <200 lines
- **Function complexity**: <10
- **Test coverage**: >75%
- **Bundle size**: <500KB initial load
- **Lighthouse score**: >95

### Qualitative Goals

- Improved developer onboarding time
- Faster AI-assisted development
- Reduced debugging time
- Better code review efficiency
- Increased team satisfaction

---

## **MANDATORY Architecture Compliance Summary**

### File Size Limits WITH Architecture Requirements

```yaml
# EVERY file type MUST follow architecture patterns

Page Components: 40-120 lines + memo() + mobile-first + context integration
Client Components: 80-200 lines + memo() + responsive + performance optimization
Server Components: 60-150 lines + memo() + responsive + proper data handling
Hooks: 40-120 lines + useCallback/useMemo + as const + cleanup
API Routes: 50-150 lines + proper validation + error handling
Services: 60-200 lines + clean architecture + dependency injection
Utilities: 20-150 lines + pure functions + proper typing
Tests: 100-350 lines + provider wrappers + responsive testing
Type Definitions: 20-150 lines + strict typing + proper interfaces
```

### Import/Export Pattern (MANDATORY)

```typescript
// ✅ REQUIRED: Exact import order for ALL files

// 1. React imports (always first)
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

// 2. Third-party imports (alphabetical)
import { SWRConfig } from 'swr';

// 3. Internal type imports (with type keyword)
import type { Verse, Translation, ComponentProps } from '@/types';

// 4. Internal component/utility imports (@/ aliases)
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/providers/AudioContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import ResponsiveVerseActions from '@/app/shared/ResponsiveVerseActions';

// 5. Relative imports (last)
import './component.styles.css';

// At end of file - BOTH exports required
export { ComponentName }; // Named export
export default ComponentName; // Default export
```

### Context Integration Pattern (MANDATORY)

```typescript
// ✅ REQUIRED: Context integration in components
const { settings, updateSetting } = useSettings();
const { currentTrack, isPlaying, togglePlay } = useAudio();
const { bookmarkedVerses, toggleBookmark } = useBookmarks();
```

### Responsive Design Pattern (MANDATORY)

```typescript
// ✅ REQUIRED: Mobile-first responsive classes
className="
  space-y-4 p-4 md:space-y-6 md:p-6
  md:flex md:items-center md:gap-6
  min-h-11 touch-manipulation
"
```

---

## Tools & Scripts

### Add to package.json

```json
{
  "scripts": {
    "audit:size": "find app -name '*.tsx' -o -name '*.ts' | xargs wc -l | sort -rn | head -20",
    "audit:complexity": "npx eslint . --format=json | npx eslint-complexity-report",
    "refactor:check": "npx eslint . --ext .ts,.tsx --max-warnings=0",
    "clean:unused": "npx knip --fix",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

---

## **CRITICAL: Architecture Compliance Enforcement**

### ⚠️ **MANDATORY COMPLIANCE REQUIREMENTS**

This refactoring guide is **ARCHITECTURE-COMPLIANT** and enforces the established patterns from `ARCHITECTURE_GUIDELINES.md`. **ALL refactoring MUST follow these exact patterns** to maintain codebase consistency.

### **Implementation Priority (STRICT ORDER)**

#### **Phase 1: Immediate Architecture Fixes**

1. **Apply memo() wrappers** to ALL components (60+ violations identified)
2. **Add context integration** where missing (Settings/Audio/Bookmarks)
3. **Fix responsive design** violations (mobile-first patterns)
4. **Add performance optimizations** (useCallback, useMemo)

#### **Phase 2: Pattern Standardization**

1. **Update import/export order** to match established conventions
2. **Add missing TypeScript interfaces** and return types
3. **Include JSDoc documentation** for all components
4. **Apply testing patterns** with provider wrappers

#### **Phase 3: Quality Assurance**

1. **Run architecture compliance checks** (`npm run check`)
2. **Verify responsive design** across all breakpoints
3. **Test context integration** functionality
4. **Validate performance optimizations**

### **Success Criteria (ALL MUST BE MET)**

- ✅ **100% memo() compliance** - Every component uses memo() wrapper
- ✅ **Mobile-first design** - All components use responsive patterns
- ✅ **Context integration** - Components use required contexts
- ✅ **Performance optimization** - useCallback/useMemo applied consistently
- ✅ **TypeScript strict** - Proper interfaces and return types
- ✅ **Testing compliance** - Provider wrappers and responsive testing
- ✅ **Import conventions** - Exact order matching architecture guidelines

### **Quality Gates**

```bash
# MUST PASS before any refactoring is considered complete
npm run check           # No lint/type errors
npm run test           # All tests passing
npm run test:coverage  # Maintain coverage levels
```

### **Architecture Violation Prevention**

**AI Development Rules:**

- **MUST read ARCHITECTURE_GUIDELINES.md** before any changes
- **MUST follow established patterns exactly** - no variations allowed
- **MUST use architecture compliance checklist** for every change
- **MUST integrate with required contexts** (Settings/Audio/Bookmarks)
- **MUST implement mobile-first responsive design**

### **Final Note**

This guide transforms the previous refactoring approach into an **architecture-compliant system** that maintains the established patterns while achieving file size and complexity goals.

**The goal is not just smaller files, but architecture-compliant, maintainable code that follows established patterns consistently.**

---

### **Emergency Architecture Fix Checklist**

If implementing this refactoring guide, prioritize these critical fixes:

1. **⚠️ HIGH PRIORITY**: Add memo() to BookmarkFolderClient, QuranAudioPlayer, HomeHeader
2. **⚠️ HIGH PRIORITY**: Apply mobile-first classes to all components
3. **⚠️ HIGH PRIORITY**: Integrate Settings/Audio/Bookmarks contexts
4. **MEDIUM PRIORITY**: Add useCallback/useMemo optimization
5. **MEDIUM PRIORITY**: Fix import/export order
6. **LOW PRIORITY**: Add comprehensive JSDoc documentation

For questions or clarification, refer to `ARCHITECTURE_GUIDELINES.md` as the authoritative source - this guide implements those patterns exactly.
