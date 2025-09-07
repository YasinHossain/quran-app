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

# Available AI Tools (Direct Script Execution)
node tools/ai/feature-generator.js <name>    # Generate complete features (future mobile app support)
node tools/ai/platform-generator/index.ts <type>   # Generate platform-specific code (mobile/desktop)
# Note: Other AI tools are integrated into GitHub Actions and run automatically
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
# Complete Feature Generation (follows clean architecture, prepares for mobile)
node tools/ai/feature-generator.js prayer-times
# Creates: Domain entities, Use cases, Repositories, Components, Tests

# Platform-Specific Code Generation (for future mobile apps)
node tools/ai/platform-generator/index.ts mobile
# Creates: React Native mobile app structure with shared business logic
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

- **Automated Test Generation**: Tests are created automatically during feature generation
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
- **Quality Checks**: AI runs comprehensive analysis with `npm run check`
- **Minimal Output**: Concise responses focused on the specific task

**Terminal-Friendly Practices:**

- **Batch Operations**: Group related operations to minimize output
- **Progress Tracking**: Clear task completion indicators
- **Error Handling**: Environment-agnostic fallback strategies
- **Documentation**: Self-maintaining project context in this file

## Core Development Patterns

**Components:** Use `memo()` wrapper, responsive classes, TypeScript interfaces
**Hooks:** Apply `useCallback`/`useMemo` for performance  
**Tests:** Wrap with required providers
**Quality:** Run `npm run check` after changes

## Recent Updates

- **Streamlined AI Context**: Simplified documentation for better token efficiency
- **Mobile-Responsive Architecture**: Mobile-first design with responsive breakpoints
- **Tafsir System**: Enhanced with persistent selections and multiple tafsir support
- **Settings Management**: Streamlined panels with better state management and storage
