# AI Development Workflow Prompts

## 🚀 QUICK START PROMPT

**Use this prompt for any development task:**

```
I need to [describe task]. Please:

1. First read ARCHITECTURE_GUIDELINES.md and relevant AGENTS.md files
2. Check current architecture compliance in the target files
3. Plan an architecture-compliant solution following established patterns
4. Implement using mandatory templates and patterns
5. Include comprehensive tests with provider wrappers
6. Run quality checks to ensure compliance

Requirements:
- ALL components must have memo() wrapper
- Mobile-first responsive design (space-y-4 md:space-y-0 md:flex)
- Context integration where needed (Settings/Audio/Bookmarks)
- Performance optimization (useCallback, useMemo, as const)
- Touch-friendly interactions (44px minimum)
- Proper TypeScript interfaces and JSDoc
- Architecture-compliant testing with provider wrappers
```

## 📋 TASK-SPECIFIC PROMPTS

### Component Creation/Refactoring

```
Create/refactor [ComponentName] following these requirements:

Architecture Compliance (MANDATORY):
- Use templates/ai-compliant/component.template.tsx as base
- Wrap with memo() for performance optimization
- Implement mobile-first responsive design patterns
- Integrate required contexts (Settings/Audio/Bookmarks where applicable)
- Use useCallback for event handlers, useMemo for computations
- Ensure 44px touch targets (h-11 class)
- Follow exact import order: React → Third-party → Internal → Types
- Include both named and default exports

Testing Requirements:
- Use templates/ai-compliant/test.template.test.tsx as base
- Include provider wrappers for all context dependencies
- Test responsive design patterns
- Validate touch-friendly interactions
- Test architecture compliance (memo effectiveness, context integration)

File Size: Keep under [X] lines while maintaining all architecture patterns.
```

### Hook Creation/Refactoring

```
Create/refactor [useHookName] hook following these requirements:

Architecture Compliance (MANDATORY):
- Use templates/ai-compliant/hook.template.ts as base
- Implement proper cleanup with AbortController for async operations
- Use useCallback for all returned functions
- Use useMemo for expensive computations
- Return object with 'as const' for better type inference
- Context integration where needed (useSettings, etc.)
- Proper error handling and loading states

Testing Requirements:
- Test with proper provider wrappers
- Test cleanup functionality
- Test error handling and edge cases
- Validate return type inference

Performance: Optimize for minimal re-renders and proper dependency arrays.
```

### Page Creation/Refactoring

```
Create/refactor [PageName] page following these requirements:

Architecture Compliance (MANDATORY):
- Use templates/ai-compliant/page.template.tsx as base
- Pages should be composition-only (40-120 lines max)
- Extract complex logic to separate components
- Implement proper loading states with Suspense
- Include error boundaries for robust error handling
- Mobile-first responsive layout patterns
- Proper SEO and accessibility considerations

Structure Requirements:
- PageHeader with responsive title and actions
- PageContainer with proper layout (sidebar + main content)
- PageContent with loading states
- PageFooter with relevant information
- All sub-components must follow architecture patterns

Performance: Use Suspense for code splitting and loading states.
```

### Feature Development

```
Implement [FeatureName] feature following these requirements:

Architecture Planning:
1. Read app/(features)/[similar-feature]/AGENTS.md for patterns
2. Plan component hierarchy following atomic design
3. Design hook composition for state management
4. Plan context integration requirements

Implementation Requirements:
- Follow feature folder structure: components/, hooks/, __tests__/
- All components must use architecture-compliant patterns
- Implement responsive design from mobile-first
- Context integration for Settings/Audio/Bookmarks
- Comprehensive testing with provider wrappers
- Error boundaries and loading states

Quality Assurance:
- Run npm run check after implementation
- Test architecture compliance
- Validate responsive design across breakpoints
- Performance optimization verification
```

## 🔧 TROUBLESHOOTING PROMPTS

### Architecture Violations

```
I have architecture violations in [file/component]. Please:

1. Analyze current violations against ARCHITECTURE_GUIDELINES.md
2. Create step-by-step fix plan maintaining functionality
3. Apply memo() wrapper if missing
4. Fix responsive design patterns (space-y-4 md:space-y-0 md:flex)
5. Add missing context integrations
6. Implement performance optimizations (useCallback, useMemo)
7. Update tests with provider wrappers
8. Validate fixes with npm run check

Critical: Ensure no functionality regressions while fixing compliance.
```

### Performance Issues

```
Performance optimization needed for [component/hook]. Please:

1. Analyze current performance bottlenecks
2. Apply memo() wrapper if missing
3. Identify unnecessary re-renders
4. Implement useCallback for event handlers
5. Add useMemo for expensive computations
6. Optimize dependency arrays
7. Add performance tests to validate improvements
8. Document optimization decisions

Focus: Maintain architecture compliance while improving performance.
```

### Responsive Design Issues

```
Fix responsive design in [component] following these requirements:

1. Implement mobile-first approach (design for mobile, enhance for desktop)
2. Use established patterns: space-y-4 p-4 md:space-y-6 md:p-6
3. Layout patterns: space-y-4 md:space-y-0 md:flex md:items-center
4. Touch targets: minimum 44px height/width (h-11, min-h-11)
5. Breakpoint strategy: primary desktop breakpoint at md: (768px)
6. Test across device sizes: mobile (375px), tablet (768px), desktop (1024px+)
7. Validate with responsive testing utilities

Ensure: Architecture compliance maintained while fixing responsive issues.
```

### Testing Issues

```
Fix/improve tests for [component] following these requirements:

1. Use proper provider wrappers for all context dependencies
2. Test architecture compliance (memo effectiveness, responsive design)
3. Test touch-friendly interactions (44px targets)
4. Test context integration functionality
5. Test error states and edge cases
6. Use testing utilities from app/testUtils/
7. Follow test template patterns exactly
8. Ensure tests validate architecture patterns

Goal: Comprehensive test coverage that validates both functionality and architecture compliance.
```

## 🎯 QUALITY ASSURANCE PROMPTS

### Pre-Implementation Check

```
Before starting [task], please verify:

1. Have you read ARCHITECTURE_GUIDELINES.md?
2. Have you read relevant AGENTS.md files for the feature area?
3. Do you understand the established patterns that must be followed?
4. Have you identified which contexts need integration?
5. Do you have the right templates for this type of component/hook?
6. Do you understand the mobile-first responsive requirements?
7. Are you prepared to include comprehensive tests?

Only proceed if you can answer YES to all questions above.
```

### Post-Implementation Validation

```
After completing [implementation], please verify:

Architecture Compliance:
- [ ] Component wrapped with memo()
- [ ] Mobile-first responsive patterns applied
- [ ] Required contexts integrated
- [ ] Performance optimizations in place
- [ ] TypeScript interfaces defined
- [ ] Touch-friendly interactions (44px targets)
- [ ] Proper import/export order

Quality Checks:
- [ ] npm run check passes without warnings
- [ ] Tests include provider wrappers
- [ ] Responsive design validated
- [ ] Context integration tested
- [ ] No functionality regressions
- [ ] File size within limits

Only mark complete if ALL items are checked.
```

## 🚨 EMERGENCY FIXES

### Critical Architecture Violations

```
URGENT: Fix critical architecture violations:

Priority 1 (High Impact):
1. Add memo() wrapper to ALL components missing it
2. Fix mobile-first responsive patterns
3. Add missing context integrations

Priority 2 (Medium Impact):
4. Implement performance optimizations
5. Fix import/export order
6. Add proper TypeScript interfaces

Priority 3 (Low Impact):
7. Add JSDoc documentation
8. Improve test coverage
9. Update component index files

Execute in priority order, testing after each fix.
```

This workflow ensures consistent, architecture-compliant development while providing clear guidance for AI assistants.
