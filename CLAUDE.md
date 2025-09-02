# Quran App v1 - AI Development Context

## Project Overview

A modern Quran reading application built with Next.js 15, featuring audio playback, translations, tafsir (commentary), bookmarks, and progressive web app capabilities.

**Tech Stack:**

- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- React 19
- SWR for data fetching
- Jest + React Testing Library
- PWA with next-pwa

## Architecture

- **Clean Architecture (DDD)** with `src/` containing domain, application, infrastructure, and presentation layers
- **Feature-based structure** under `app/(features)/` for Next.js routing
- **Domain-driven design** in `src/domain/` with entities, services, and repository interfaces
- **Atomic design components** in `src/presentation/components/` (atoms → molecules → organisms → templates)
- **Shared utilities** in `lib/` with API wrappers, audio, tafsir, and text processing
- **Type definitions** centralized in `types/`
- **Context providers** in `app/providers/` for global state
- **Comprehensive testing** with layer-specific test strategies

## Development Commands

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

# AI-Enhanced Development Workflow
npm run ai:quality      # Comprehensive quality analysis with AI insights
npm run ai:feature      # Generate complete features following clean architecture
npm run ai:tests        # Generate test templates for files
npm run ai:analyze      # Analyze code for refactoring opportunities
npm run ai:refactor     # Apply architecture-compliant refactorings
npm run ai:docs         # Update AI documentation and component registry
npm run ai:platform     # Generate platform-specific implementations
npm run ai:check        # Pre-commit AI analysis and validation

# Quick AI Workflow Helper
./ai-workflow.sh help   # Show all available AI workflow commands
./ai-workflow.sh quality # Run quality analysis
./ai-workflow.sh feature <name> # Generate complete feature
./ai-workflow.sh analyze <file> # Analyze file for improvements
```

## AI-Enhanced Development Workflow

**Comprehensive AI Integration:**

1. **Context-Aware Development**: AI uses directory-specific `.ai` context files for precise guidance
2. **Architecture-Compliant Generation**: Complete feature generation following clean architecture
3. **Intelligent Code Discovery**: Optimized search patterns with component registry integration
4. **Automated Quality Assurance**: Continuous monitoring with AI insights and recommendations
5. **Multi-Platform Support**: Platform-specific code generation with shared business logic

**AI Context System:**

```bash
# AI Context Files (provide specific guidance for each area)
app/.ai          # Next.js App Router patterns and component guidelines
src/.ai          # Clean architecture and domain-driven design patterns
lib/.ai          # Utility development and shared library patterns
types/.ai        # TypeScript type organization and naming conventions
tests/.ai        # Testing strategies and provider wrapping patterns
```

**Enhanced Search & Discovery:**

```bash
# Component Discovery
Grep "export.*React.FC" --glob "**/*.tsx"     # Find all React components
Glob "**/atoms/**/*.tsx"                       # Find atomic design atoms
Glob "src/domain/entities/**/*.ts"             # Find domain entities

# Architecture-Specific Searches
Grep "class.*Service" src/domain/services/     # Find domain services
Grep "UseCase" src/application/use-cases/      # Find application use cases
Grep "Repository" src/infrastructure/          # Find repository implementations

# Pattern-Based Discovery
Grep "use[A-Z].*=" --glob "**/*.ts*"          # Find custom hooks
Grep "interface.*Props" --glob "**/*.tsx"      # Find component prop interfaces
```

**AI-Assisted Feature Development:**

```bash
# Complete Feature Generation (follows clean architecture)
./ai-workflow.sh feature prayer-times
# Creates: Domain entities, Use cases, Repositories, Components, Tests

# Intelligent Analysis & Refactoring
./ai-workflow.sh analyze src/components/LargeComponent.tsx
# Provides: Complexity analysis, Refactoring suggestions, Performance tips

# Automated Test Generation
./ai-workflow.sh test src/domain/entities/User.ts
# Creates: Unit tests, Integration tests, Mocks, Fixtures
```

## Key Features & Areas

1. **Audio Player** (`app/shared/player/`) - Quran recitation with repeat modes
2. **Surah Reading** (`app/(features)/surah/`) - Main reading interface with settings
3. **Tafsir** (`app/(features)/tafsir/`) - Commentary viewing with persistent selections
4. **Search** (`app/(features)/search/`) - Verse search functionality
5. **Bookmarks** (`app/(features)/bookmarks/`) - Saved verses
6. **Navigation** - Juz, Page, and Surah-based browsing

## Data Sources

- **Quran.com API** for verses, translations, and tafsir
- **Local JSON data** for chapters and juz metadata (`data/`)
- **Audio files** from various reciters

## Testing Strategy

**Layer-Specific Testing Approach:**

- **Domain Layer**: Unit tests for entities and services (isolated business logic)
- **Application Layer**: Integration tests for use cases with mocked repositories
- **Infrastructure Layer**: Integration tests for repositories with API mocking
- **Presentation Layer**: Component tests with React Testing Library and provider wrapping
- **E2E Testing**: Complete user journey validation with Playwright

**AI-Enhanced Testing:**

- **Automated Test Generation**: `./ai-workflow.sh test <file>` creates appropriate test templates
- **Provider Wrapping**: Tests automatically include required context providers
- **Coverage Monitoring**: AI quality monitor tracks and suggests coverage improvements
- **Test Strategy Guidance**: Each layer has specific testing patterns in `tests/.ai`

## Common Patterns

- **Custom hooks** for feature logic (e.g., `useVerseListing`, `useAudioPlayer`)
- **Context + reducer** pattern for complex state
- **Resource panels** for translations/tafsir selection
- **Responsive design** with mobile-first approach

## Development Notes

**Architecture Guidelines:**

- Follow **Clean Architecture** principles: Domain → Application → Infrastructure → Presentation
- Use **Atomic Design** for components: atoms → molecules → organisms → templates
- Implement **Domain-Driven Design** patterns in `src/domain/`
- Maintain **TypeScript strict mode** compliance throughout

**AI-Assisted Development:**

- Use `.ai` context files in each directory for AI guidance
- Reference `docs/ai/component-registry.md` for existing component patterns
- Follow `docs/ai/architecture-map.md` for system structure understanding
- Use `docs/ai/search-patterns.md` for efficient code discovery

**Quality Assurance:**

- AI runs `npm run check` automatically after significant changes
- Pre-commit hooks provide automated code analysis
- Quality monitor tracks metrics and provides AI-driven insights
- Use conventional commit messages with `feat:`, `fix:` prefixes

## Environment-Agnostic Practices

**Cross-Platform Development:**

- **Path Handling**: All file operations use absolute paths, work across Windows/WSL/Linux/macOS
- **No CLI Dependencies**: Built-in AI tools eliminate issues with missing system commands
- **Universal Scripts**: npm scripts work consistently across environments
- **WSL Compatibility**: Full support for Windows Subsystem for Linux development

**AI-Human Collaboration Best Practices:**

- **Clear Task Definition**: Specify what you want accomplished, AI handles implementation details
- **Minimal Manual Commands**: Let AI use optimized built-in tools instead of manual CLI
- **Environment Resilience**: Workflows continue working even when system tools change
- **Consistent Results**: Same outcomes regardless of development environment

## Mobile-First Development Guidelines

**Responsive Design Principles:**

- **Mobile-first approach**: Design for mobile, enhance for desktop
- **Touch-friendly interactions**: 44px minimum touch targets (WCAG guidelines)
- **Breakpoint strategy**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- **Semantic design tokens**: Use design system tokens instead of hardcoded values
- **Performance-first**: Virtual scrolling, lazy loading, content-visibility

**Component Requirements:**

- All components must be responsive across breakpoints
- Use drawer pattern for mobile sidebars, desktop sidebar for larger screens
- Implement proper focus management for mobile accessibility
- Test on multiple device sizes: iPhone SE (375px), iPhone 12 Pro (390px), iPad (768px), Desktop (1024px+)

**Testing Mobile Responsiveness:**

- Use responsive testing utilities in Jest
- Test touch interactions and gesture support
- Verify keyboard navigation and screen reader compatibility
- Maintain WCAG AA compliance standards

## AI-Terminal Development Guidelines

**Environment-Agnostic Best Practices:**

- **Built-in Tool Priority**: AI uses built-in tools (Grep, Glob, Task) instead of system commands for reliability
- **Cross-Platform Compatibility**: All workflows work on Windows/WSL, Linux, and macOS
- **No System Dependencies**: Avoid relying on specific CLI tools that may not be available
- **Structured Communication**: AI provides concise, direct responses optimized for terminal display

**AI Search & Analysis Tools:**

```bash
# AI Built-in Tools (Recommended)
Grep tool    # Code searching with regex support, no system dependencies
Glob tool    # File pattern matching, works on any codebase size
Task tool    # Multi-step complex searches and analysis
Read tool    # Direct file reading with line numbers
Edit tool    # Precise code modifications with context preservation
```

**AI Workflow Optimization:**

- **Context-Aware Development**: AI uses `.ai` files for precise, area-specific guidance
- **Architecture Compliance**: Automated validation of clean architecture principles
- **Task Planning**: AI uses TodoWrite for complex multi-step tasks
- **Parallel Operations**: Multiple tool calls in single responses for performance
- **Context Management**: AI references code locations as `file_path:line_number`
- **Quality Checks**: AI runs comprehensive analysis with `npm run ai:quality`
- **Minimal Output**: Concise responses focused on the specific task

**Terminal-Friendly Practices:**

- **Batch Operations**: Group related operations to minimize output
- **Progress Tracking**: Clear task completion indicators
- **Error Handling**: Environment-agnostic fallback strategies
- **Documentation**: Self-maintaining project context in this file

## AI Architecture Compliance System

**CRITICAL: AI must follow established patterns exactly to maintain codebase consistency.**

### 📋 Architecture Documentation

- **`ARCHITECTURE_GUIDELINES.md`** - Comprehensive patterns and requirements for all development
- **`app/(features)/*/AGENTS.md`** - Feature-specific patterns and integration points
- **`app/shared/AGENTS.md`** - Shared component patterns and responsive design rules
- **`app/providers/AGENTS.md`** - Context and state management patterns

### 🚫 AI Development Restrictions

**Before making ANY changes, AI must:**

1. **Read relevant `AGENTS.md` files** for the area being modified
2. **Follow exact patterns** shown in the architecture documentation
3. **Use established component structures** (memo, interfaces, responsive design)
4. **Integrate properly with contexts** (Settings, Audio, Bookmarks)
5. **Follow mobile-first responsive patterns** with proper breakpoints
6. **Include proper TypeScript typing** and error handling
7. **Use memoization patterns** for performance optimization

### 🔍 AI Code Review Checklist

**Every AI implementation must verify:**

- [ ] **Pattern Compliance**: Does it match existing component/hook patterns?
- [ ] **Context Integration**: Properly uses SettingsContext, AudioContext, BookmarkContext?
- [ ] **Responsive Design**: Mobile-first with `md:` breakpoints?
- [ ] **Performance**: Memoized with `memo()`, `useCallback()`, `useMemo()`?
- [ ] **TypeScript**: Proper interfaces, no `any` types?
- [ ] **Testing**: Includes tests with proper provider wrappers?
- [ ] **Accessibility**: 44px touch targets, proper ARIA labels?
- [ ] **Import Conventions**: Uses `@/` aliases, proper import order?

### ⚠️ Common AI Violations to Avoid

**Do NOT:**

- Create components without `memo()` wrapper
- Skip responsive design patterns (`space-y-4 md:space-y-0 md:flex`)
- Ignore context integration requirements
- Create inline styles instead of Tailwind classes
- Skip memoization of callbacks and computations
- Use generic names like `Component` or `Hook`
- Create hardcoded breakpoint logic instead of CSS classes
- Skip TypeScript interfaces for props

### 🎯 AI Success Pattern

```typescript
// ✅ CORRECT: Follow this exact pattern
import { memo, useCallback, useMemo } from 'react';
import { SomeType } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';

interface ComponentProps {
  data: SomeType;
  onAction: (id: string) => void;
}

export const FeatureComponent = memo(function FeatureComponent({
  data,
  onAction,
}: ComponentProps) {
  const { settings } = useSettings();

  const processedData = useMemo(() =>
    transformData(data, settings),
    [data, settings]
  );

  const handleClick = useCallback(() => {
    onAction(data.id);
  }, [onAction, data.id]);

  return (
    <div className="space-y-4 md:space-y-0 md:flex md:items-center">
      {/* Mobile-first responsive content */}
    </div>
  );
});

export default FeatureComponent;
```

### 🔧 AI Quality Assurance

**After any changes, AI automatically runs:**

```bash
npm run check  # Format, lint, typecheck, test
```

**If checks fail, AI must fix issues before completing the task.**

## Recent Updates

- **AI Architecture Compliance System**: Added comprehensive AI development restrictions and patterns
- **Architecture Documentation**: Created detailed guidelines and feature-specific patterns
- **AI Code Review Process**: Implemented mandatory compliance checklist for all changes
- **Mobile-Responsive Architecture**: Implementing mobile-first design system with responsive breakpoints
- **Tafsir System**: Enhanced with persistent selections, improved UI, and multiple tafsir support
- **Settings Management**: Streamlined panels with better state management and storage
