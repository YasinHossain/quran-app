# AI Development Workflows

## Feature Development Workflow

### 1. Feature Planning

```markdown
1. Understand requirements
2. Check existing similar features
3. Identify reusable components
4. Plan component hierarchy
5. Consider state management needs
```

### 2. Implementation Steps

```markdown
1. Create feature folder structure
2. Implement core components
3. Add custom hooks for logic
4. Integrate with existing state management
5. Add styling with semantic tokens
6. Write tests
7. Update documentation
```

### 3. Quality Checklist

```bash
# Before committing
npm run format -- --check
npm run lint
npm run type-check
npm run test
npm run build
npm run audit-styles
```

## Component Development Workflow

### 1. Component Discovery

```markdown
1. Check app/shared/ui/ for existing components
2. Review similar features for patterns
3. Identify if extending existing component is possible
4. Check design system tokens in design-system.json
```

### 2. Component Creation

```typescript
// 1. Define interface
export interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// 2. Implement component
export const Component = ({ variant = 'primary', size = 'md', children }: ComponentProps) => {
  return (
    <div className={cn(
      'base-classes',
      VARIANT_STYLES[variant],
      SIZE_STYLES[size]
    )}>
      {children}
    </div>
  );
};

// 3. Define style variants
const VARIANT_STYLES = {
  primary: 'bg-accent text-on-accent',
  secondary: 'bg-surface text-foreground border border-border',
} as const;
```

### 3. Component Testing

```typescript
// ComponentName.test.tsx
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

describe('ComponentName', () => {
  it('renders with correct variant', () => {
    renderWithProviders(<ComponentName variant="primary" />);
    // Test implementation
  });
});
```

## Debugging Workflow

### 1. Common Issues & Solutions

#### Theme/Styling Issues

```bash
# Check for style violations
npm run audit-styles

# Common fixes:
# ❌ <div className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
# ✅ <div className="bg-surface">
```

#### Component Not Updating

```typescript
// Check if using semantic tokens
// ❌ className="bg-white text-black"
// ✅ className="bg-surface text-foreground"

// Check if component is memoized properly
const MemoizedComponent = memo(Component);
```

#### State Management Issues

```typescript
// Use correct context hooks
const { openPanel } = useUIState(); // Not useState
const { settings } = useSettings(); // Not localStorage directly
```

### 2. Performance Debugging

```typescript
// Check for unnecessary re-renders
import { memo, useCallback, useMemo } from 'react';

// Memoize expensive calculations
const expensiveValue = useMemo(() => expensiveFunction(data), [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);
```

## Testing Workflow

### 1. Test Strategy

```markdown
- Unit tests for utilities and hooks
- Component tests for UI behavior
- Integration tests for feature workflows
- E2E tests for critical user paths
```

### 2. Test Setup

```typescript
// Always use renderWithProviders for components
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

// Mock external dependencies
jest.mock('@/lib/api', () => ({
  fetchVerses: jest.fn(),
}));
```

### 3. Test Patterns

```typescript
// Test user interactions
const button = screen.getByRole('button', { name: /save/i });
fireEvent.click(button);

// Test accessibility
expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();

// Test async behavior
waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Documentation Workflow

### 1. Component Documentation

```typescript
/**
 * Button component with multiple variants and sizes.
 *
 * @example
 * <Button variant="primary" size="lg">Save</Button>
 */
export const Button = ({ variant, size, children }: ButtonProps) => {
```

### 2. Feature Documentation

```markdown
# Feature Name

## Overview

Brief description of the feature.

## Components

- ComponentA: Purpose and usage
- ComponentB: Purpose and usage

## Hooks

- useFeatureLogic: State and logic management

## Testing

- Component tests in **tests**/
- Integration tests for workflows

## API Integration

- API endpoints used
- Data flow
```

## AI Assistant Best Practices

### 1. Before Coding

```markdown
1. Read existing similar components
2. Check available UI components
3. Review feature-specific AGENTS.md
4. Understand current patterns
5. Identify reusable elements
```

### 2. During Implementation

```markdown
1. Follow established patterns
2. Use semantic design tokens
3. Leverage existing state management
4. Write tests alongside components
5. Document complex logic
```

### 3. Code Review Checklist

```markdown
- [ ] Uses semantic tokens (no hardcoded colors)
- [ ] Follows component patterns
- [ ] Has proper TypeScript types
- [ ] Includes tests
- [ ] Accessibility considered
- [ ] Performance optimized
- [ ] Documentation updated
```

### 4. Common AI Mistakes to Avoid

```markdown
❌ Creating new global contexts
❌ Using theme conditionals in JSX
❌ Hardcoding colors or spacing
❌ Duplicating existing components
❌ Forgetting to add tests
❌ Not using existing patterns
```

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Production build
npm run start                  # Start production server

# Quality Checks
npm run check                  # Run all checks
npm run format                 # Format code
npm run lint                   # ESLint
npm run type-check            # TypeScript check
npm run test                   # Run tests
npm run test:coverage         # Test with coverage

# Style Audits
npm run audit-styles          # Check style violations
npm run audit:theme           # Check theme conditionals
npm run audit:colors          # Check hardcoded colors
npm run audit:classes         # Check raw utility classes

# Feature Generation
npm run generate-feature <name>  # Scaffold new feature
```

---

## 🤖 Week 7: AI-Enhanced Development Workflows

### Architecture-Compliant AI Development Pattern

**MANDATORY: AI must follow this exact sequence for ANY change:**

```bash
# 1. AI reads documentation first (REQUIRED)
# Read ARCHITECTURE_GUIDELINES.md
# Read relevant AGENTS.md files  
# Read .ai/context.md

# 2. AI analyzes current state
# Check architecture compliance
# Validate existing patterns
# Identify context requirements

# 3. AI implements using templates
# Use templates/ai-compliant/ templates exactly
# Apply established patterns consistently
# Maintain architecture compliance

# 4. AI validates implementation
npm run check:architecture    # Architecture compliance
npm run test:architecture    # Architecture-specific tests
npm run test:responsive      # Mobile-first design validation
```

### 🎯 AI Task Categories

#### Component Development (Architecture-Compliant)
```typescript
// AI MUST follow this exact pattern for ALL components
import { memo, useCallback, useMemo } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import { useAudio } from '@/app/providers/AudioContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import type { ComponentProps } from '@/types';

interface NewComponentProps {
  id: string;
  // Proper TypeScript interface
}

/**
 * @description Component purpose and behavior
 * @example
 * ```tsx
 * <NewComponent id="example" />
 * ```
 */
export const NewComponent = memo(function NewComponent({
  id,
  // ... props
}: NewComponentProps) {
  const { settings } = useSettings();
  
  // ✅ REQUIRED: Memoize computations
  const processedData = useMemo(() => {
    return transformData(data, settings);
  }, [data, settings]);
  
  // ✅ REQUIRED: Memoize callbacks
  const handleAction = useCallback(() => {
    // Event handler logic
  }, [dependencies]);

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      {/* ✅ REQUIRED: Mobile-first responsive layout */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:gap-6">
        <button 
          className="h-11 px-4 touch-manipulation"
          onClick={handleAction}
        >
          Action
        </button>
      </div>
    </div>
  );
});

export { NewComponent };
export default NewComponent;
```

#### Hook Development (Architecture-Compliant)
```typescript
// AI MUST follow this exact pattern for ALL hooks
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import type { HookResult } from '@/types';

export function useNewHook({ id }: { id: string }): HookResult {
  const [data, setData] = useState(null);
  const { settings } = useSettings();
  const abortControllerRef = useRef<AbortController | null>(null);

  const processedData = useMemo(() => {
    return data ? transformData(data, settings) : null;
  }, [data, settings]);

  const fetchData = useCallback(async () => {
    // Implementation with proper cleanup
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data: processedData,
    isLoading,
    refetch: fetchData,
  } as const;
}
```

#### Testing (Architecture-Compliant)
```typescript
// AI MUST follow this pattern for ALL tests
import { render, screen } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { AudioProvider } from '@/app/providers/AudioContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { NewComponent } from '../NewComponent';

// ✅ REQUIRED: Provider wrapper for ALL tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>
    <AudioProvider>
      <BookmarkProvider>
        {children}
      </BookmarkProvider>
    </AudioProvider>
  </SettingsProvider>
);

describe('NewComponent', () => {
  it('renders with architecture compliance', () => {
    render(<NewComponent id="test" />, { wrapper: TestWrapper });
    
    // Test mobile-first responsive design
    const container = screen.getByTestId('component-test');
    expect(container).toHaveClass('space-y-4', 'md:space-y-0');
    
    // Test touch-friendly interactions
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11'); // 44px touch target
  });
});
```

### 🔧 AI Quality Gates

#### Pre-Development Validation (MANDATORY)
```markdown
AI MUST verify before ANY changes:
- [ ] Read ARCHITECTURE_GUIDELINES.md
- [ ] Read relevant AGENTS.md files
- [ ] Understand established patterns
- [ ] Plan architecture-compliant solution
- [ ] Identify context integration needs
```

#### Post-Development Validation (MANDATORY)
```markdown
AI MUST verify after implementation:
- [ ] All components have memo() wrapper
- [ ] Mobile-first responsive design applied
- [ ] Required contexts integrated
- [ ] Performance optimizations in place
- [ ] Tests include provider wrappers
- [ ] npm run check passes
- [ ] Architecture compliance validated
```

### 🚨 AI Architecture Violation Prevention

#### Critical Violations AI Must NEVER Make
```markdown
❌ NEVER:
- Create components without memo() wrapper
- Skip responsive design patterns (space-y-4 md:space-y-0 md:flex)
- Ignore context integration requirements
- Skip performance optimizations (useCallback, useMemo)
- Create tests without provider wrappers
- Violate import/export order
- Skip TypeScript interfaces

✅ ALWAYS:
- Follow templates/ai-compliant/ exactly
- Apply mobile-first responsive design
- Integrate required contexts where applicable
- Optimize with useCallback/useMemo
- Include comprehensive tests
- Validate architecture compliance
- Run quality checks
```

### 📊 AI Success Metrics

#### Every AI Implementation Must Achieve
```yaml
Architecture Compliance: 100%
  - memo() wrapper: Required on ALL components
  - Mobile-first design: Required patterns applied
  - Context integration: Where applicable
  - Performance optimization: useCallback/useMemo applied
  - TypeScript compliance: Proper interfaces
  - Touch-friendly: 44px minimum targets

Quality Assurance: 100%
  - Tests with provider wrappers: Required
  - Responsive design validation: Tested
  - Context integration testing: Verified
  - npm run check: Must pass
  - Architecture compliance: Validated
  - No functionality regressions: Verified
```

### 🎯 AI Development Commands

#### Enhanced Quality Commands
```bash
# AI uses these commands for validation
npm run check:architecture     # Full architecture compliance check
npm run test:architecture      # Architecture-specific test suite
npm run test:responsive        # Mobile-first design validation
npm run test:performance       # Performance optimization tests
npm run analyze:patterns       # Pattern compliance analysis
```

#### AI Context System
```bash
# AI reads these files before any development
.ai/context.md                                   # Primary development context
.ai/prompts/architecture-compliance.md          # Refactoring checklist
.ai/prompts/development-workflow.md             # Task-specific prompts
app/(features)/*/AGENTS.md                      # Feature-specific guidance
```

#### AI Template System
```bash
# AI uses these templates for consistency
templates/ai-compliant/component.template.tsx   # Component pattern
templates/ai-compliant/hook.template.ts         # Hook pattern
templates/ai-compliant/page.template.tsx        # Page pattern
templates/ai-compliant/test.template.test.tsx   # Test pattern
```

This enhanced workflow ensures AI assistants maintain strict architecture compliance while maximizing development efficiency and code quality.
