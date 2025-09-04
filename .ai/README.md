# AI Development System - Week 7

## 🎯 Overview

This directory contains the comprehensive AI development system implemented as part of Week 7: AI-Friendly Development. It provides AI assistants with precise context, mandatory patterns, and validation tools to ensure 100% architecture compliance.

## 📁 Directory Structure

```
.ai/
├── README.md                          # This file - AI system overview
├── context.md                         # Primary AI development context
├── workflows.md                       # Enhanced AI development workflows
└── prompts/                           # AI-specific prompts and checklists
    ├── architecture-compliance.md     # Mandatory refactoring checklist
    └── development-workflow.md        # Task-specific AI prompts
```

## 🚫 CRITICAL: Architecture Compliance is MANDATORY

**Every AI assistant MUST follow these requirements exactly:**

### Pre-Development Requirements

1. **Read Documentation First** - ARCHITECTURE_GUIDELINES.md + relevant AGENTS.md files
2. **Understand Patterns** - Study established architecture patterns
3. **Plan Compliance** - Design architecture-compliant solutions
4. **Use Templates** - Follow templates/ai-compliant/ exactly

### Implementation Requirements

- **memo() Wrapper**: ALL components must use React.memo()
- **Mobile-First Design**: Apply space-y-4 md:space-y-0 md:flex patterns
- **Context Integration**: Use Settings/Audio/Bookmarks where needed
- **Performance Optimization**: useCallback, useMemo, as const patterns
- **TypeScript Compliance**: Proper interfaces and strict typing
- **Touch-Friendly**: 44px minimum touch targets (h-11 class)

### Testing Requirements

- **Provider Wrappers**: ALL tests must include context providers
- **Responsive Testing**: Validate mobile-first design patterns
- **Architecture Testing**: Test memo(), context integration, touch targets
- **Comprehensive Coverage**: Test functionality + architecture compliance

## 📚 Usage Guide for AI Assistants

### Step 1: Read Context

```bash
# AI must read these files before ANY development task
1. .ai/context.md                    # Primary development context
2. ARCHITECTURE_GUIDELINES.md       # Project architecture patterns
3. app/(features)/[relevant]/AGENTS.md  # Feature-specific guidance
```

### Step 2: Choose Template

```bash
# AI must use appropriate template for task type
templates/ai-compliant/component.template.tsx  # For React components
templates/ai-compliant/hook.template.ts        # For custom hooks
templates/ai-compliant/page.template.tsx       # For page components
templates/ai-compliant/test.template.test.tsx  # For tests
```

### Step 3: Apply Patterns

```typescript
// AI must follow these exact patterns:

// 1. Component Pattern (MANDATORY)
export const MyComponent = memo(function MyComponent(props) {
  const { settings } = useSettings();
  const memoizedValue = useMemo(() => compute(props), [props]);
  const memoizedCallback = useCallback(() => {}, []);

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

// 2. Hook Pattern (MANDATORY)
export function useMyHook({ id }: { id: string }) {
  const [data, setData] = useState(null);
  const { settings } = useSettings();

  const processedData = useMemo(() => {
    return transformData(data, settings);
  }, [data, settings]);

  return { data: processedData, refetch } as const;
}

// 3. Test Pattern (MANDATORY)
const TestWrapper = ({ children }) => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>
        {children}
      </BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);

describe('MyComponent', () => {
  it('renders with architecture compliance', () => {
    render(<MyComponent />, { wrapper: TestWrapper });
    expect(screen.getByTestId('component')).toHaveClass('space-y-4', 'md:space-y-0');
  });
});
```

### Step 4: Validate Implementation

```bash
# AI must run these commands after implementation
npm run check:architecture    # Architecture compliance validation
npm run test:architecture     # Architecture-specific tests
npm run test:responsive       # Mobile-first design validation
npm run check                 # Full quality check
```

## 🔍 Quick Reference

### Essential Patterns

- **Components**: memo() + mobile-first + context integration + performance
- **Hooks**: useCallback/useMemo + cleanup + as const + context integration
- **Tests**: Provider wrappers + responsive testing + architecture validation
- **Pages**: Composition-only + Suspense + error boundaries + mobile-first

### File Size Limits (WITH Architecture Compliance)

```yaml
Page Components: 40-120 lines + all patterns
Client Components: 80-200 lines + all patterns
Server Components: 60-150 lines + all patterns
Hooks: 40-120 lines + all patterns
Tests: 100-350 lines + provider wrappers
```

### Import Order (MANDATORY)

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

### Context Integration

```typescript
// Use these contexts where applicable
const { settings } = useSettings();
const { currentTrack, isPlaying } = useAudio();
const { bookmarkedVerses, toggleBookmark } = useBookmarks();
```

### Responsive Classes

```typescript
// Mobile-first responsive patterns
className="
  space-y-4 p-4 md:space-y-6 md:p-6
  md:flex md:items-center md:gap-6
  h-11 touch-manipulation
"
```

## ⚠️ Common AI Violations to Avoid

### Critical Violations (NEVER)

- Creating components without memo() wrapper
- Skipping responsive design patterns
- Ignoring context integration requirements
- Missing performance optimizations
- Creating tests without provider wrappers
- Violating import/export order

### Architecture Compliance Failures

- Using hardcoded breakpoints instead of Tailwind classes
- Skipping TypeScript interfaces
- Missing JSDoc documentation
- Creating components larger than size limits
- Not including both named and default exports

## 🎯 Success Criteria

### Every AI Implementation Must Achieve

- ✅ **100% memo() compliance** - Every component uses memo() wrapper
- ✅ **100% mobile-first design** - All responsive patterns applied
- ✅ **100% context integration** - Required contexts used where applicable
- ✅ **100% performance optimization** - useCallback/useMemo applied
- ✅ **100% TypeScript compliance** - Proper interfaces and strict typing
- ✅ **100% testing compliance** - Provider wrappers and architecture validation
- ✅ **100% quality gates** - npm run check passes without warnings

## 📞 Support

If AI assistants encounter issues:

1. **Read .ai/prompts/architecture-compliance.md** - Detailed refactoring checklist
2. **Read .ai/prompts/development-workflow.md** - Task-specific guidance
3. **Check templates/ai-compliant/** - Reference implementations
4. **Validate with quality commands** - Automated compliance checking

This system ensures consistent, architecture-compliant development across all AI-assisted tasks.
