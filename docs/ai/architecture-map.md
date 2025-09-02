# Architecture Map - AI Visual Reference

## System Overview

```
Quran App Architecture (Clean Architecture + DDD)
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Next.js App   │ │ React Components│ │   UI Hooks      ││
│  │   (app/)        │ │ (src/presentation)│ │                ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Use Cases     │ │      DTOs       │ │     Ports       ││
│  │ (src/application)│ │                 │ │                 ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Domain Layer                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │    Entities     │ │    Services     │ │  Repositories   ││
│  │ (src/domain/)   │ │                 │ │  (interfaces)   ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  API Clients    │ │  Repositories   │ │     Cache       ││
│  │(src/infrastructure)│ │ (implementations)│ │               ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure Map

```
quran-app/
├── app/                          # Next.js App Router (Presentation)
│   ├── (features)/              # Feature-based routing
│   │   ├── surah/               # Surah reading feature
│   │   ├── bookmarks/           # Bookmark management
│   │   ├── search/              # Verse search
│   │   └── tafsir/              # Commentary viewing
│   ├── shared/                  # Non-routing shared components
│   │   └── player/              # Audio player component
│   └── providers/               # React context providers
│
├── src/                         # Clean Architecture Implementation
│   ├── domain/                  # Business Logic (Core)
│   │   ├── entities/            # Business objects
│   │   ├── value-objects/       # Immutable values
│   │   ├── repositories/        # Data access contracts
│   │   ├── services/            # Business coordination
│   │   └── errors/              # Domain-specific exceptions
│   │
│   ├── application/             # Use Cases (App Logic)
│   │   ├── use-cases/           # Application operations
│   │   ├── dto/                 # Data transfer objects
│   │   └── ports/               # External service contracts
│   │
│   ├── infrastructure/          # External Concerns
│   │   ├── api/                 # HTTP clients
│   │   ├── repositories/        # Repository implementations
│   │   ├── cache/               # Caching implementations
│   │   └── external/            # Third-party integrations
│   │
│   ├── presentation/            # UI Layer
│   │   ├── components/          # React components (Atomic Design)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── stores/              # State management (Zustand)
│   │   └── utils/               # UI utilities
│   │
│   └── shared/                  # Cross-cutting Concerns
│       ├── constants/           # Application constants
│       ├── types/               # Shared TypeScript types
│       ├── utils/               # Utility functions
│       └── config/              # Configuration objects
│
├── lib/                         # Legacy Utilities (being phased out)
├── types/                       # Centralized type definitions
├── tests/                       # Test infrastructure
├── docs/                        # Documentation
└── tools/                       # Development tools
```

## Data Flow Patterns

### Read Operation Flow

```
User Request → Next.js Route → React Component → Custom Hook → Use Case
                                                                   ↓
Domain Service ← Domain Entity ← Repository Interface ← Use Case
       ↓
Infrastructure Repository → API Client → External API
       ↓
Cache Layer → Domain Entity → Use Case → Hook → Component → UI
```

### Write Operation Flow

```
User Action → Component → Hook → Use Case → Domain Service
                                                ↓
Domain Entity (validation) → Repository Interface
                                   ↓
Infrastructure Repository → API Client → External API
                                   ↓
Cache Update → State Update → Component Re-render
```

## Dependency Flow (Clean Architecture)

```
┌─────────────────┐    depends on    ┌─────────────────┐
│  Presentation   │ ───────────────→ │  Application    │
└─────────────────┘                  └─────────────────┘
                                             │
                                             ▼ depends on
                                     ┌─────────────────┐
                    ┌──────────────→ │     Domain      │ ←─────────────┐
                    │                └─────────────────┘               │
                    │                                                  │
                    │ implements interfaces                implements   │
                    │                                     interfaces   │
            ┌─────────────────┐                                ┌─────────────────┐
            │Infrastructure   │                                │   Application   │
            │  (Repositories) │                                │   (Use Cases)   │
            └─────────────────┘                                └─────────────────┘
```

## Feature Architecture Pattern

Each feature follows this structure:

```
app/(features)/[feature-name]/
├── page.tsx                     # Next.js route entry point
├── layout.tsx                   # Feature-specific layout (optional)
├── components/                  # Feature-specific UI components
│   ├── atoms/                   # Basic elements
│   ├── molecules/               # Composed elements
│   └── organisms/               # Complex components
├── hooks/                       # Feature-specific React hooks
└── __tests__/                   # Feature tests

src/domain/entities/[Feature].ts         # Business logic
src/application/use-cases/[Feature]*.ts  # Application operations
src/infrastructure/repositories/[Feature]Repository.ts # Data access
```

## Service Layer Integration

### DI Container Resolution

```
React Component
       ↓ useContainer()
DI Container (InversifyJS)
       ↓ resolve()
Service Instance
       ↓ method call
Business Logic Execution
```

### Available Services

- **BookmarkService**: Domain operations for bookmarks
- **SearchService**: Verse search and filtering
- **ReadingProgressService**: User progress tracking
- **QuranApiClient**: External API communication
- **ICache**: Caching abstraction (LocalStorage impl)

## State Management Strategy

### Global State (Providers)

```
App
├── DIProvider (Dependency Injection)
├── ThemeProvider (Design System)
├── SettingsProvider (User Preferences)
├── BookmarkProvider (Bookmark Management)
└── SidebarProvider (Navigation State)
```

### Local State (Hooks)

- **useState**: Simple component state
- **useReducer**: Complex state with actions
- **SWR**: Server state with caching
- **Zustand**: Feature-specific global state

## API Integration Points

### External Services

1. **Quran.com API**: Verse data, translations, audio URLs
2. **CDN Services**: Audio files, images
3. **Tafsir APIs**: Commentary content
4. **Translation APIs**: Multi-language support

### Caching Strategy

```
Request → Local Cache Check → API Call (if cache miss) → Cache Update → Response
              ↓ (cache hit)
           Cached Response
```

## AI Development Paths

### Adding New Feature

1. **Domain**: Create entity, repository interface, service
2. **Application**: Create use cases for feature operations
3. **Infrastructure**: Implement repository, API integration
4. **Presentation**: Create components, hooks, tests
5. **Integration**: Wire up DI, add to providers

### Modifying Existing Feature

1. **Identify layer**: Determine if change is domain, app, or UI
2. **Follow dependencies**: Update dependent layers
3. **Maintain interfaces**: Keep contracts stable
4. **Update tests**: Ensure coverage remains high
