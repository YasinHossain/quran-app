# 📖 Quran App v1

A modern, performant Quran reading application built with enterprise-grade architecture and AI-enhanced development workflow.

## ✨ Features

- 📱 **Progressive Web App (PWA)** with offline support
- 🎧 **Audio recitation** with multiple reciters and repeat modes
- 📚 **Multiple translations and tafsir** with persistent selections
- 🔖 **Bookmarking system** for saved verses
- 🔍 **Advanced search** functionality across verses
- 🌙 **Dark/Light theme** support with semantic design tokens
- 📱 **Mobile-first responsive design** with touch-friendly interactions
- 🤖 **AI-enhanced development** workflow with context-aware assistance
- 🎯 **Word-by-word study** in multiple languages (English, Bangla, Urdu, Hindi, Indonesian, Persian, Turkish, Tamil)
- 🎨 **Custom Arabic fonts** with proper licensing

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm (use `.nvmrc`: run `nvm use` after cloning)
- Modern web browser with service worker support
- Optional: [Dev Container](https://containers.dev/) support with ESLint and Prettier extensions

### Installation

```bash
# Clone the repository
git clone https://github.com/YasinHossain/quran-app.git
cd quran-app

# Install dependencies
npm install

# Setup environment (copy and adjust if necessary)
cp .env.example .env

# Format code (ensures consistent style)
npm run format

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Development Commands

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

# AI-Enhanced Development
npm run ai:quality      # Comprehensive quality analysis with AI insights
npm run ai:feature <name>    # Generate complete features following clean architecture
npm run ai:analyze <file>    # Analyze code for refactoring opportunities
```

## 🏗️ Architecture

This project implements **Clean Architecture** with **Domain-Driven Design (DDD)** principles:

```
src/
├── domain/             # Business logic & entities
│   ├── entities/       # Core business objects
│   ├── services/       # Domain services
│   └── repositories/   # Repository interfaces
├── application/        # Use cases & application services
│   ├── use-cases/      # Business use cases
│   └── services/       # Application services
├── infrastructure/     # External services & implementations
│   ├── api/           # API clients and data sources
│   ├── repositories/  # Repository implementations
│   └── services/      # External service integrations
└── presentation/       # UI components (Atomic Design)
    ├── atoms/         # Basic UI elements
    ├── molecules/     # Compound components
    ├── organisms/     # Complex UI sections
    └── templates/     # Page layouts
```

### Key Architectural Principles

- **Separation of Concerns**: Clear layer boundaries with dependency inversion
- **Feature-based Organization**: Modular structure under `app/(features)/`
- **Atomic Design**: Systematic component hierarchy for UI consistency
- **Type Safety**: Strict TypeScript configuration throughout
- **Test-Driven Development**: Comprehensive testing strategy per layer

[Read detailed architecture documentation →](./docs/ARCHITECTURE.md)

## 🤖 AI-Enhanced Development

This project features an advanced **AI-assisted development workflow** that sets it apart:

### Context-Aware AI System

- **Directory-specific `.ai` context files** provide precise development guidance
- **CLAUDE.md** comprehensive project documentation for AI assistants
- **AI workflow scripts** for automated feature generation and quality analysis

### Quick AI Workflow Helper

```bash
./ai-workflow.sh help       # Show all available AI workflow commands
./ai-workflow.sh quality    # Run quality analysis
./ai-workflow.sh feature <name> # Generate complete feature
./ai-workflow.sh analyze <file> # Analyze file for improvements
```

[Learn more about AI workflows →](./docs/development/AI_DEVELOPMENT_GUIDE.md)

## 📚 Documentation

### Architecture & Development

- [Architecture Overview](./docs/ARCHITECTURE.md) - Clean Architecture and DDD implementation
- [Design System Guide](./docs/DESIGN_SYSTEM_GUIDE.md) - Semantic tokens and component patterns
- [AI Development Guide](./docs/development/AI_DEVELOPMENT_GUIDE.md) - AI-enhanced workflows
- [Testing Guide](./docs/TESTING.md) - Layer-specific testing strategies

### API & Integration

- [API Documentation](./docs/API.md) - Quran.com API integration patterns
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment strategies

### Analysis & Optimization

- [Architecture Optimization](./docs/architecture/Architecture%20Optimization.md) - Comprehensive improvement roadmap

## 🧪 Testing

Our testing strategy follows **layer-specific approaches** for comprehensive coverage:

```bash
# Run all tests
npm run test

# Run with coverage (target: 80%+)
npm run test:coverage

# Run E2E tests (via Storybook)
npm run storybook

# Run specific test file
npm run test -- path/to/test
```

### Testing Patterns

- **Domain Layer**: Unit tests for entities and services (isolated business logic)
- **Application Layer**: Integration tests for use cases with mocked repositories
- **Infrastructure Layer**: Integration tests with API mocking
- **Presentation Layer**: Component tests with React Testing Library and provider wrapping

## 📦 Tech Stack

### Core Framework

- **Next.js 15** with App Router and Turbopack
- **TypeScript 5.7** with strict mode configuration
- **React 19** with concurrent features

### Styling & UI

- **Tailwind CSS** with semantic design tokens
- **Mobile-first responsive design** with breakpoint strategy
- **Atomic design components** for systematic UI development

### State & Data

- **React Context + Custom Hooks** for state management
- **SWR** for data fetching and caching
- **Clean Architecture** with repository pattern

### Development & Quality

- **Jest + React Testing Library** for comprehensive testing
- **ESLint + Prettier** with strict code quality rules
- **AI-enhanced development** with Claude integration
- **PWA** capabilities with next-pwa

### Architecture

- **Clean Architecture + DDD** implementation
- **Dependency Injection** with InversifyJS
- **Feature-based organization** following Next.js conventions

## 🔧 Configuration

### Environment Variables

Required for production:

```bash
NEXT_PUBLIC_API_URL=https://api.quran.com/api/v4  # Quran API endpoint
NEXT_PUBLIC_APP_NAME="Quran App"                  # App display name
NODE_ENV=production                               # Environment
NEXT_DISABLE_PWA=false                           # PWA toggle
```

### Data Management

Update Quran metadata:

```bash
npx ts-node scripts/fetchData.ts  # Downloads latest juz data to data/juz.json
```

### Development Pages

Experimental pages under `app/(dev)` for local testing:

```bash
npm run dev
# Navigate to http://localhost:3000/dev/player
```

### Custom Arabic Fonts

Add custom fonts to `public/fonts/` and configure in `app/providers/settingsStorage.ts`:

```ts
// Example font configuration
{ name: "My Font", value: '"My Font", serif', category: "Uthmani" }
```

- `name`: UI display label
- `value`: CSS `font-family` property
- `category`: Font tab grouping

⚠️ **Important**: Only include fonts you're licensed to distribute. All font licenses are documented in [public/fonts/LICENSES.md](public/fonts/LICENSES.md).

### Progressive Web App (PWA)

Built with [`next-pwa`](https://github.com/shadowwalker/next-pwa) for offline Quran reading:

- **Automatic caching**: API responses, fonts, and static assets
- **Offline support**: Continue reading without internet connection
- **Service worker**: Active in production builds by default

```bash
# Disable PWA during build if needed
NEXT_DISABLE_PWA=true npm run build
```

### Development Tools

Built-in tooling for efficient development:

```bash
# Fast text search (works without system ripgrep)
npm run rg -- "use client" app lib

# List tracked files
npm run -s rg -- --files | head -n 20

# Component isolation with Storybook
npm run storybook  # Interactive component workbench
```

Optional system tools installation:

- macOS/Linux: `scripts/install-cli-tools.sh`
- Windows: `scripts/install-cli-tools.ps1`

Installs: `ripgrep`, `fd`, `jq`, `tree`

## 🚀 Deployment

### Vercel (Recommended)

Deploy instantly with the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

```bash
npm run build    # Production build
npm run start    # Test locally
```

### Production Checklist

- ✅ Environment variables configured
- ✅ PWA service worker enabled
- ✅ All tests passing (`npm run check`)
- ✅ Bundle analysis completed (`npm run analyze`)

[See complete deployment guide →](./docs/DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Please read our guidelines:

### Development Workflow

1. **Follow Clean Architecture principles** - Maintain layer separation
2. **Use AI development tools** - Leverage our AI workflow for consistency
3. **Write comprehensive tests** - Follow layer-specific testing patterns
4. **Maintain TypeScript strict mode** - Ensure type safety throughout
5. **Update documentation** - Keep AI context files and docs current

### Getting Started

```bash
# 1. Create feature branch from master
git checkout -b feature/my-feature

# 2. Use AI tools for feature generation
./ai-workflow.sh feature my-feature

# 3. Run quality checks
npm run check

# 4. Submit pull request with comprehensive tests
```

**Resources:**

- [Contributing Guide](docs/guides/CONTRIBUTING.md) - Detailed contribution workflow
- [Code of Conduct](docs/guides/CODE_OF_CONDUCT.md) - Community guidelines
- [Debugging Guide](docs/DEBUGGING.md) - Troubleshooting tips

## 📊 Project Status

- **Architecture Score**: 8/10 (Enterprise-grade with Clean Architecture + DDD)
- **AI Integration**: 10/10 (Industry-leading workflow automation)
- **Code Quality**: 8/10 (Strict TypeScript, comprehensive testing)
- **Documentation**: 9/10 (Extensive guides and AI context system)
- **Overall Maturity**: **Production-ready** with continuous improvements

[View comprehensive analysis →](./docs/architecture/Architecture%20Optimization.md)

## 📄 License

**MIT License** - see [LICENSE](./LICENSE) for details.

**Font Licensing**: All bundled fonts are licensed separately - see [public/fonts/LICENSES.md](public/fonts/LICENSES.md) for complete attribution.

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for recent updates and version history.

---

## 🌟 What Makes This Project Special

### Enterprise-Grade Architecture

This isn't just another React app - it implements **Fortune 500-level architectural patterns** with Clean Architecture, Domain-Driven Design, and comprehensive testing strategies that scale with your team.

### AI-First Development Experience

Our **context-aware AI system** provides unprecedented development assistance, making complex architecture decisions simple and maintaining consistency across the entire codebase.

### Production-Ready from Day One

Built with **performance, security, and maintainability** as first-class concerns, not afterthoughts. Every component is tested, typed, and documented.

---

_Built with ❤️ using Next.js, TypeScript, and AI-enhanced development workflows_
