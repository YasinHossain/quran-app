# Quran App Refactoring & Code Organization Guide

## Executive Summary

This guide provides a comprehensive, phase-by-phase approach to refactor and optimize the Quran app codebase for improved developer experience and AI-assisted development workflow. Based on analysis of your current project structure and industry best practices for Next.js 15 with TypeScript.

### Current State Assessment

- **Strengths**: Clean architecture pattern, feature-based organization, good TypeScript usage
- **Opportunities**: File size optimization, enhanced linting rules, improved code splitting, standardized line counts
- **Priority**: Implement line count limits and enhance ESLint configuration for better AI parsing

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

    // Import organization
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-cycle': 'error',
    'unused-imports/no-unused-imports': 'error',

    // TypeScript strictness
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],

    // React best practices
    'react/display-name': 'off', // You're using memo properly
    'react-hooks/exhaustive-deps': 'warn',
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

### 2.3 Refactoring Example: Splitting Large Components

**Before:** Large component with multiple responsibilities

```typescript
// ❌ app/(features)/example/LargeComponent.tsx (250+ lines)
export function LargeComponent() {
  // Multiple state management
  // Multiple effects
  // Complex render logic
}
```

**After:** Split into smaller, focused components

```typescript
// ✅ app/(features)/example/ExampleContainer.tsx (80 lines)
export function ExampleContainer() {
  const data = useExampleData();
  return <ExampleView data={data} />;
}

// ✅ app/(features)/example/components/ExampleView.tsx (100 lines)
export function ExampleView({ data }: Props) {
  return (
    <>
      <ExampleHeader />
      <ExampleContent data={data} />
      <ExampleActions />
    </>
  );
}

// ✅ app/(features)/example/hooks/useExampleData.ts (60 lines)
export function useExampleData() {
  // Focused data fetching logic
}
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

### 4.3 Component Composition Pattern

```typescript
// ✅ Preferred: Composition with small components
export function SurahPage() {
  return (
    <SurahProvider>
      <SurahHeader />
      <SurahContent />
      <SurahFooter />
    </SurahProvider>
  );
}

// Each sub-component: 40-100 lines max
```

---

## Phase 5: Performance & Bundle Optimization (Week 5)

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

### 5.3 Performance Checklist

- [ ] All lists use `key` prop correctly
- [ ] Heavy computations use `useMemo`
- [ ] Event handlers use `useCallback`
- [ ] Components are wrapped in `memo()` where appropriate
- [ ] Images use Next.js `Image` component
- [ ] Fonts are optimized with `next/font`

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

### 6.2 Test File Organization

```typescript
// Co-located tests
app / features / surah / components / SurahView.tsx;
SurahView.test.tsx; // 100-250 lines
hooks / useSurahData.ts;
useSurahData.test.ts; // 80-200 lines
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

### 7.2 Template Files

```typescript
// templates/component.template.tsx
import { memo } from 'react';

interface ComponentNameProps {
  // Props
}

/**
 * @description Component description
 */
export const ComponentName = memo(function ComponentName({
  // props
}: ComponentNameProps) {
  return <div>Component</div>;
});

export default ComponentName;
```

### 7.3 AI Prompt Templates

```markdown
// .ai/prompts/refactor.md
When refactoring a component:

1. Check current line count
2. Identify responsibilities
3. Split if >150 lines
4. Ensure each part <100 lines
5. Update imports and exports
6. Add proper TypeScript types
7. Include JSDoc comments
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

### Week 3: Architecture

- [ ] Reorganize folder structure
- [ ] Implement naming conventions
- [ ] Create barrel exports

### Week 4: Code Quality

- [ ] Add documentation
- [ ] Reduce complexity
- [ ] Improve type safety

### Week 5: Performance

- [ ] Implement code splitting
- [ ] Optimize bundle size
- [ ] Add performance monitoring

### Week 6: Testing

- [ ] Increase test coverage
- [ ] Add E2E tests
- [ ] Set up CI/CD checks

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

## Quick Reference: File Size Limits

```yaml
Page Components: 40-120 lines
Client Components: 80-200 lines
Server Components: 60-150 lines
Hooks: 40-120 lines
API Routes: 50-150 lines
Services: 60-200 lines
Utilities: 20-150 lines
Tests: 100-350 lines
Type Definitions: 20-150 lines
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

## Conclusion

This refactoring guide provides a structured approach to optimize your Quran app for better maintainability and AI-assisted development. Focus on implementing phases progressively, starting with the foundation and moving through each phase systematically.

Remember: The goal is not just smaller files, but better-organized, more maintainable code that both humans and AI can work with efficiently.

### Next Steps

1. Start with Phase 1 (ESLint configuration)
2. Run initial audits to identify problem areas
3. Begin refactoring largest files first
4. Document changes in CHANGELOG.md
5. Update team on new standards

For questions or clarification, refer to the existing ARCHITECTURE_GUIDELINES.md and this refactoring guide together.
