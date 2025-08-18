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
- Component tests in __tests__/
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

This workflow ensures consistent, high-quality development that aligns with project standards and AI assistance capabilities.