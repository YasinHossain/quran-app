# Quran App Code Templates

This directory contains standardized code templates to ensure AI development follows established patterns. **AI must use these templates as the foundation for any new code.**

## Template Overview

| Template | Purpose | Usage |
|----------|---------|--------|
| `COMPONENT_TEMPLATE.tsx` | React components | Copy for all new UI components |
| `HOOK_TEMPLATE.ts` | Custom hooks | Copy for all custom React hooks |
| `CONTEXT_TEMPLATE.tsx` | Context providers | Copy for new global state providers |
| `REDUCER_TEMPLATE.ts` | State reducers | Copy for context state management |
| `STORAGE_TEMPLATE.ts` | Persistent storage | Copy for localStorage utilities |
| `TEST_TEMPLATE.test.tsx` | Test files | Copy for comprehensive test coverage |

## How to Use Templates

### 1. Copy the Appropriate Template

```bash
# Example: Creating a new component
cp templates/COMPONENT_TEMPLATE.tsx app/(features)/example/components/MyComponent.tsx
```

### 2. Replace Template Placeholders

Each template contains placeholders that must be replaced:

- `Example` → Your actual name (PascalCase)
- `example` → Your actual name (camelCase)
- `EXAMPLE` → Your actual name (CONSTANT_CASE)
- `ExampleType` → Your actual type name
- `useExampleData` → Your actual hook name

### 3. Customize for Your Use Case

Modify the template while preserving:
- Core architectural patterns
- Performance optimizations (memoization)
- TypeScript typing
- Error handling
- Responsive design patterns
- Accessibility features

## Template Features

### All Templates Include:

- ✅ **TypeScript Strict Mode** - Full type safety
- ✅ **Performance Optimization** - Memoization patterns
- ✅ **Error Handling** - Comprehensive error boundaries
- ✅ **Mobile-First Design** - Responsive breakpoints
- ✅ **Accessibility** - WCAG AA compliance
- ✅ **Testing Setup** - Complete test patterns
- ✅ **Context Integration** - Settings, Audio, Bookmarks
- ✅ **Cleanup Patterns** - Proper resource management

### Component Template Features:

- Memo wrapper for performance
- Proper prop interfaces
- Context integration (Settings, Audio, Bookmarks)
- Mobile-first responsive design
- Touch-friendly interactions (44px targets)
- Keyboard navigation support
- Loading and error states
- Intersection observer patterns

### Hook Template Features:

- Proper memoization with `useCallback` and `useMemo`
- Error handling with try/catch
- Cleanup with `useEffect` return functions
- AbortController for request cancellation
- Pagination and infinite loading support
- Integration with existing contexts
- Type-safe return objects with `as const`

### Context Template Features:

- Reducer pattern for complex state
- Debounced localStorage persistence
- Error handling for storage operations
- Memoized context values and callbacks
- Proper cleanup on unmount
- Type-safe action methods

### Test Template Features:

- Provider wrapper setup
- Mock configurations
- Comprehensive test scenarios
- Accessibility testing
- Performance testing
- Responsive design testing
- User interaction testing

## Mandatory Patterns

### 1. Component Structure

```typescript
// ✅ Required: Every component must follow this pattern
export const MyComponent = memo(function MyComponent(props) {
  // State, context, refs
  // Memoized values
  // Memoized callbacks
  // Effects
  // JSX with responsive classes
});
```

### 2. Hook Structure

```typescript
// ✅ Required: Every hook must follow this pattern
export function useMyData(params) {
  // State and refs
  // Memoized values
  // Memoized callbacks  
  // Effects with cleanup
  return { ...values } as const;
}
```

### 3. Context Structure

```typescript
// ✅ Required: Every context must follow this pattern
export const MyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initial, loader);
  // Debounced persistence
  // Memoized actions
  // Memoized context value
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
```

## AI Usage Guidelines

### Before Creating New Code:

1. **Choose the appropriate template**
2. **Copy the template file**
3. **Replace all placeholders**
4. **Customize while preserving patterns**
5. **Run `npm run check` to verify compliance**

### Template Violations (❌ Don't Do):

- Skipping memoization (`memo`, `useCallback`, `useMemo`)
- Creating components without proper TypeScript interfaces
- Ignoring responsive design patterns
- Skipping error handling
- Creating contexts without reducers for complex state
- Missing cleanup in `useEffect`
- Hardcoding breakpoints instead of using Tailwind classes
- Creating non-accessible components

### Template Compliance (✅ Always Do):

- Use `memo()` for all components
- Include proper TypeScript interfaces
- Follow mobile-first responsive patterns
- Include comprehensive error handling
- Use reducer pattern for complex state
- Clean up all subscriptions and timers
- Use Tailwind responsive classes
- Include proper ARIA attributes

## Customization Guidelines

### When Customizing Templates:

1. **Keep the core structure intact**
2. **Preserve performance optimizations**
3. **Maintain TypeScript type safety**
4. **Follow established naming conventions**
5. **Keep responsive design patterns**
6. **Maintain accessibility standards**

### Common Customizations:

- Add specific props to interfaces
- Include domain-specific state variables
- Add feature-specific effects
- Customize styling while keeping responsive patterns
- Add feature-specific context integrations
- Include domain-specific error handling

## Validation

### After Using Templates:

1. **Run type checking**: `npm run type-check`
2. **Run linting**: `npm run lint`
3. **Run tests**: `npm run test`
4. **Run full check**: `npm run check`

### Quality Checklist:

- [ ] Component is memoized
- [ ] Props are properly typed
- [ ] Responsive classes are mobile-first
- [ ] Touch targets are 44px minimum
- [ ] Context integration is correct
- [ ] Error handling is comprehensive
- [ ] Tests cover all scenarios
- [ ] Performance is optimized

## Template Updates

Templates are living documents that evolve with the codebase:

- **New patterns discovered** → Templates updated
- **Performance improvements** → Templates enhanced
- **Architecture changes** → Templates modified
- **New requirements** → Templates extended

**Always use the latest template versions for new code.**