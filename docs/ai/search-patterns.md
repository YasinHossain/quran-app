# AI Search Patterns - Efficient Code Discovery

## Quick Reference Commands

### Component Discovery
```bash
# Find all React components
Grep "export.*React.FC" --glob "**/*.tsx"

# Find components by type (atoms, molecules, organisms)
Glob "**/atoms/**/*.tsx"
Glob "**/molecules/**/*.tsx"
Glob "**/organisms/**/*.tsx"
Glob "**/templates/**/*.tsx"

# Find feature components
Glob "app/(features)/*/components/**/*.tsx"

# Find shared components
Glob "app/shared/**/*.tsx"
```

### Domain Layer Search
```bash
# Find all domain entities
Glob "src/domain/entities/**/*.ts"
Grep "export class.*{" src/domain/entities/

# Find domain services
Grep "export class.*Service" src/domain/services/

# Find repository interfaces
Grep "export interface.*Repository" src/domain/repositories/

# Find value objects
Glob "src/domain/value-objects/**/*.ts"
```

### Business Logic Discovery
```bash
# Find all use cases
Glob "src/application/use-cases/**/*.ts"
Grep "export class.*UseCase" src/application/

# Find business methods
Grep "public.*\(" src/domain/entities/ --glob "*.ts"

# Find validation logic
Grep "validate.*\(" src/ --glob "*.ts"

# Find error handling
Grep "throw.*Error" src/domain/ --glob "*.ts"
```

### Infrastructure Search
```bash
# Find API clients
Glob "src/infrastructure/api/**/*.ts"
Grep "export class.*Client" src/infrastructure/

# Find repository implementations
Glob "src/infrastructure/repositories/**/*.ts"
Grep "implements.*Repository" src/infrastructure/

# Find external integrations
Glob "src/infrastructure/external/**/*.ts"
```

### Hook and State Search
```bash
# Find custom hooks
Grep "export.*use[A-Z]" --glob "**/*.ts" --glob "**/*.tsx"

# Find state management
Grep "useState\|useReducer\|create.*store" --glob "**/*.tsx"

# Find context providers
Grep "Provider.*=\|createContext" --glob "**/*.tsx"

# Find SWR usage
Grep "useSWR\|mutate" --glob "**/*.tsx"
```

### Testing Discovery
```bash
# Find all test files
Glob "**/*.test.ts*"
Glob "tests/**/*.ts"

# Find test fixtures
Glob "tests/fixtures/**/*.ts"
Grep "Fixtures.*create" tests/

# Find mocks
Glob "tests/mocks/**/*.ts"
Grep "Mock.*class\|jest.mock" tests/

# Find E2E tests
Glob "tests/e2e/**/*.test.ts"
```

## Advanced Search Patterns

### Feature-Specific Searches
```bash
# All files related to bookmarks feature
Grep -i "bookmark" --glob "**/*.ts*" app/
Glob "**/*bookmark*/**"
Glob "**/*Bookmark*.*"

# Audio player related code
Grep -i "audio\|player" --glob "**/*.ts*"
Grep "play\|pause\|seek" app/shared/player/

# Surah reading functionality
Grep -i "surah\|verse" --glob "**/*.ts*" app/(features)/
```

### Type and Interface Discovery
```bash
# Find type definitions
Grep "type.*=" types/ --glob "*.ts"
Grep "interface.*{" types/ --glob "*.ts"

# Find generic types
Grep "interface.*<.*>" --glob "**/*.ts"

# Find discriminated unions
Grep "type.*=.*\|" types/ --glob "*.ts"
```

### Configuration and Setup
```bash
# Find configuration files
Glob "**/config/**/*"
Glob "**/*.config.*"

# Find environment variables
Grep "process\.env\|NEXT_PUBLIC" --glob "**/*.ts*"

# Find dependency injection setup
Grep "container\|inject\|bind" src/shared/config/
```

## Search by Functionality

### Data Fetching Patterns
```bash
# API calls and data fetching
Grep "fetch\|axios\|useSWR" --glob "**/*.ts*"

# Repository pattern usage
Grep "Repository.*\." --glob "**/*.ts*"

# Cache usage
Grep "cache\|Cache" --glob "**/*.ts*"
```

### Error Handling Patterns
```bash
# Error definitions
Grep "extends.*Error\|Error.*class" --glob "**/*.ts"

# Error throwing
Grep "throw.*Error" --glob "**/*.ts"

# Error boundaries
Grep "ErrorBoundary\|componentDidCatch" --glob "**/*.tsx"
```

### Performance Patterns
```bash
# Memoization usage
Grep "useMemo\|useCallback\|React\.memo" --glob "**/*.tsx"

# Virtualization
Grep -i "virtual\|WindowedList" --glob "**/*.tsx"

# Lazy loading
Grep "lazy\|Suspense" --glob "**/*.tsx"
```

### Accessibility Patterns
```bash
# ARIA attributes
Grep "aria-\|role=" --glob "**/*.tsx"

# Semantic HTML
Grep "semantic\|heading\|landmark" --glob "**/*.tsx"

# Focus management
Grep "focus\|tabindex" --glob "**/*.tsx"
```

## Problem-Specific Search Strategies

### Debugging Component Issues
```bash
# 1. Find the component
Glob "**/*ComponentName*.*"

# 2. Find its usage
Grep "ComponentName" --glob "**/*.tsx"

# 3. Find related hooks
Grep "use.*ComponentName\|ComponentName.*hook" --glob "**/*.ts*"

# 4. Find tests
Glob "**/*ComponentName*.test.*"
```

### Understanding Data Flow
```bash
# 1. Start with the entity
Grep "class.*EntityName" src/domain/entities/

# 2. Find the repository
Grep "EntityName.*Repository" --glob "**/*.ts"

# 3. Find use cases
Grep "EntityName" src/application/use-cases/

# 4. Find UI usage
Grep "EntityName" --glob "**/*.tsx"
```

### Performance Investigation
```bash
# 1. Find expensive operations
Grep "map\|filter\|reduce.*\(" --glob "**/*.tsx" -A 3

# 2. Find large lists
Grep "length.*>\|\.length" --glob "**/*.tsx" -B 2 -A 2

# 3. Find re-renders
Grep "useEffect.*\[\]" --glob "**/*.tsx"
```

## Context-Aware Search Tips

### Before Making Changes
1. **Search existing patterns**: Look for similar implementations
2. **Check dependencies**: Find what uses the code you're changing
3. **Review tests**: Understand expected behavior
4. **Check types**: Ensure TypeScript compatibility

### Search Workflow for New Features
1. **Find similar features**: `Grep -i "similar-feature" --glob "**/*.ts*"`
2. **Check domain layer**: `Glob "src/domain/**/*Similar*.*"`
3. **Review architecture**: `Grep "Similar.*Service\|Similar.*UseCase"`
4. **Study UI patterns**: `Grep "Similar" app/ --glob "*.tsx"`

### Multi-Step Discovery Process
```bash
# Step 1: Broad search for concept
Grep -i "concept" --glob "**/*.ts*" | head -20

# Step 2: Narrow to specific layer
Grep -i "concept" src/domain/ --glob "*.ts"

# Step 3: Find implementations
Grep "implements.*Concept\|extends.*Concept" --glob "**/*.ts"

# Step 4: Check usage in UI
Grep "concept" --glob "**/*.tsx" -B 2 -A 2
```

## AI Efficiency Guidelines

### Search Before Creating
- Always search for existing implementations before building new ones
- Use multiple search patterns to ensure comprehensive discovery
- Check both current and legacy code paths

### Understand Context
- Search for usage patterns to understand how code should integrate
- Find tests to understand expected behavior
- Check dependencies to avoid breaking changes

### Follow Architecture
- Start searches in the appropriate layer (domain, application, presentation)
- Follow dependency direction (presentation → application → domain → infrastructure)
- Respect clean architecture boundaries in implementations