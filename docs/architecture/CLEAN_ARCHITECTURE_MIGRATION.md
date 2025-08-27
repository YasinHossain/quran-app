# Clean Architecture Migration Plan

## Executive Summary

This document outlines a strategic migration from the current Next.js feature-based architecture to a clean architecture pattern, designed to support a **multi-app Quran ecosystem** including:

- **Current App**: Main Quran reading application (60-70% complete)
- **Future Mobile Apps**: Android/iOS versions sharing core logic
- **Specialized Apps**: Memorization-centric app, habit tracker, grammar research tools
- **Custom API Integration**: Own backend replacing Quran.com API dependency

**Approach:** Gradual domain-first implementation focusing on **component reusability** across multiple Quran applications.

## Current State Analysis

### Mixed Concerns Identified

**BookmarkProvider.tsx (Lines 32-268)**
```typescript
// ❌ Mixed concerns: React state + business logic + API calls + storage
const fetchBookmarkMetadata = useCallback(async (verseId: string) => {
  try {
    const verse = await getVerseByKey(verseId, translationId); // API call
    setFolders((prev) => updateBookmarkInFolders(prev, verseId, metadata)); // React state
  } catch { /* error handling */ }
}, [settings.translationIds]);
```

**useBookmarksPage.ts (Lines 13-18)**
```typescript
// ❌ Mixed concerns: DOM manipulation + business logic + routing
React.useEffect(() => {
  document.body.style.overflow = 'hidden';  // DOM manipulation
  return () => {
    document.body.style.overflow = '';
  };
}, []);
```

### What's Working Well

- ✅ Feature-based organization under `app/(features)/`
- ✅ Clean API layer in `lib/api/verses.ts` with proper data transformation
- ✅ Centralized type definitions in `types/`
- ✅ Some utility separation in `lib/`

## Architecture Options Comparison

### Option 1: Feature-Level Clean Architecture

**Structure:**
```
app/(features)/bookmarks/
├── components/          # Pure UI components
├── hooks/              # UI-specific hooks only
├── domain/             # Business entities & rules
│   ├── entities/       # Bookmark, Folder types
│   ├── usecases/       # AddBookmark, CreateFolder
│   └── repositories/   # Abstract data access
├── infrastructure/     # Storage & API implementations
└── services/          # Application services
```

**Benefits:**
- ✅ Minimal disruption to Next.js App Router structure
- ✅ Gradual adoption with immediate ROI
- ✅ Lower risk and faster implementation
- ✅ Maintains existing conventions

**Limitations:**
- ⚠️ Cross-feature dependencies may cause duplication
- ⚠️ Inconsistent architecture across features
- ⚠️ Potential refactoring debt

### Option 2: Full Clean Architecture

**Structure:**
```
src/
├── domain/        # Business entities & rules (cross-cutting)
├── infrastructure/ # External services & storage
├── application/   # Use cases & application services
└── presentation/  # UI layer (current app/ moved here)
```

**Benefits:**
- ✅ Complete separation of concerns
- ✅ Enterprise-ready scalability
- ✅ Technology independence
- ✅ Cross-feature domain logic reuse

**Limitations:**
- ❌ High upfront migration cost
- ❌ Complexity overhead for current scope
- ❌ Framework friction with Next.js patterns

## Strategic Assessment

### Your Future Goals Impact

Given your roadmap:
- **60-70% project completion**
- **Custom API/backend development**
- **Android/iOS mobile applications**
- **Grammar research features (+30% complexity)**

**Conclusion:** Option 2 becomes strategically justified due to:

1. **API Independence:** Repository pattern enables seamless API swapping
2. **Multi-Platform Support:** Domain/application layers shared across platforms
3. **Complex Feature Support:** Grammar analysis fits domain-driven design naturally

## Recommended Migration Strategy

### Multi-App Ecosystem Approach

Implement clean architecture with **component reusability** as primary design goal, enabling shared logic across multiple Quran applications.

## ✅ Phase 1: Domain Foundation (COMPLETED)

**Status:** Complete and ready for multi-app ecosystem

### Core Domain Entities (Reusable Across All Apps):
```
src/domain/entities/
├── Bookmark.ts              # ✅ Verse bookmarking with rich metadata
├── Folder.ts               # ✅ Collection organization with statistics
├── Verse.ts                # ✅ Core Quranic text with translations
├── Word.ts                 # ✅ Word-level translation data
└── MemorizationPlan.ts     # ✅ Progress tracking (perfect for memorization app)
```

### Repository Interfaces (API-Independent):
```
src/domain/repositories/
├── IBookmarkRepository.ts   # ✅ Bookmark persistence abstraction
└── IVerseRepository.ts      # ✅ Verse data with caching support
```

### Use Cases (Business Logic):
```
src/domain/usecases/bookmark/
├── AddBookmark.ts          # ✅ Bookmark creation with validation
├── RemoveBookmark.ts       # ✅ Clean bookmark removal
└── CreateFolder.ts         # ✅ Folder management
```

### Future Features (Archived):
```
src/domain/_future/
├── entities/Grammar.ts     # 📦 Grammar analysis (ready when needed)
└── repositories/IGrammarRepository.ts  # 📦 Grammar data access
```

### Multi-App Reusability Benefits Achieved:

✅ **Memorization-Centric App**: `MemorizationPlan` entity ready to use  
✅ **Habit Tracker App**: Progress tracking patterns established  
✅ **Mobile Apps**: Domain layer has zero React dependencies  
✅ **Custom API**: Repository interfaces abstract all data access  
✅ **Grammar Research**: Architecture ready, features archived for later  

---

## Phase 2: Current App Infrastructure (Next Priority)

**Goal:** Complete current 60-70% app while building reusable infrastructure

### Week 1-2: Infrastructure Layer
```
src/infrastructure/
├── api/
│   ├── QuranComApiClient.ts     # Current API implementation
│   └── CustomApiClient.ts       # Future custom API (stub)
├── storage/
│   ├── LocalStorageBookmarks.ts # Current storage
│   └── DatabaseBookmarks.ts     # Future database (stub)
└── repositories/
    ├── BookmarkRepository.ts    # Implements IBookmarkRepository
    └── VerseRepository.ts       # Implements IVerseRepository
```

### Week 3-4: Application Services
```
src/application/
├── services/
│   ├── BookmarkService.ts      # Orchestrates bookmark operations
│   ├── SurahReadingService.ts  # Reading experience coordination
│   └── MemorizationService.ts  # Progress management
└── queries/
    ├── GetBookmarksByFolder.ts
    └── SearchVerses.ts
```

### Week 5-6: React Integration
- Update existing React components to use application services
- Migrate `BookmarkProvider` to use domain services
- Transform hooks to consume clean application layer

### Week 7-8: Testing & Validation
- Unit tests for domain entities and use cases
- Integration tests for application services
- Validation that React components work with new architecture

---

## Phase 3: Multi-App Expansion (Future)

**Timeline:** After current app reaches 100% completion

### Mobile App Development
- **React Native App**: Reuse entire `src/domain/` and `src/application/` layers
- **Flutter App**: Port domain entities to Dart, keep same business logic
- **Native iOS/Android**: Shared API contracts via repository interfaces

### Specialized Quran Apps

**Memorization-Centric App:**
```typescript
// Reuse existing domain entities
import { MemorizationPlan, Verse } from '@quran-core/domain';
import { MemorizationService } from '@quran-core/application';

// App focuses on memorization features
const memorizationApp = new MemorizationService(verseRepo, progressRepo);
```

**Habit Tracker App:**
```typescript
// Extend existing patterns
import { MemorizationPlan } from '@quran-core/domain';

class HabitPlan extends MemorizationPlan {
  // Add habit-specific logic
  trackDailyRecitation(minutes: number) { ... }
  getStreakAnalysis() { ... }
}
```

### Custom API Integration
```typescript
// Simply swap repository implementations
const customApiClient = new CustomQuranApiClient(apiKey);
const verseRepo = new VerseRepository(customApiClient);
// All business logic continues working unchanged
```

### Grammar Research Integration (When Ready)
```typescript
// Move archived features back to main domain
mv src/domain/_future/entities/Grammar.ts src/domain/entities/
mv src/domain/_future/repositories/IGrammarRepository.ts src/domain/repositories/

// Update exports and implement infrastructure
const grammarService = new GrammarAnalysisService(grammarRepo, aiService);
```

## Implementation Guidelines

### Code Organization Principles

**Domain Layer (src/domain/)**
- Contains business entities and rules
- No dependencies on external frameworks
- Pure TypeScript classes and functions
- Comprehensive unit tests

**Application Layer (src/application/)**
- Orchestrates domain objects
- Contains use cases and application services
- Depends only on domain layer interfaces
- Handles cross-cutting concerns (logging, validation)

**Infrastructure Layer (src/infrastructure/)**
- Implements domain repository interfaces
- Handles external service integration
- Database, API, file system access
- Framework-specific implementations

**Presentation Layer (src/presentation/ or keep app/)**
- React components and hooks
- Next.js routing and pages
- UI state management
- Depends on application services

### Migration Best Practices

1. **Start Small:** Begin with one feature (bookmarks) to validate approach
2. **Test-Driven:** Write tests for domain logic before migration
3. **Incremental:** Keep existing code working during transition
4. **Interface-First:** Define abstractions before implementations
5. **Documentation:** Update architecture docs as you progress

### Risk Mitigation Strategies

**Technical Risks:**
- **Import Chaos:** Use path mapping in tsconfig.json for clean imports
- **Circular Dependencies:** Strict layer boundaries prevent circular refs
- **Performance Impact:** Lazy load services and optimize bundle splitting

**Team Risks:**
- **Learning Curve:** Gradual introduction of clean architecture concepts
- **Consistency:** Code review guidelines for architectural compliance
- **Momentum:** Visible progress through working features in each phase

## Expected Benefits

### ✅ Immediate (Phase 1 - ACHIEVED)
- **Multi-app foundation**: Domain entities ready for memorization app, habit tracker
- **Future-proof architecture**: Grammar features archived, not lost
- **API independence**: Repository interfaces enable seamless API swapping
- **Mobile-ready**: Zero React dependencies in business logic

### Medium-term (Phase 2)
- **Current app completion**: Clean architecture supporting remaining 30% features
- **Testing foundation**: Isolated domain logic enables comprehensive testing
- **Component reusability**: Shared services across different app features

### Long-term (Phase 3+)
- **Multi-platform ecosystem**: Same business logic across web/mobile/desktop
- **Specialized app development**: Quick creation of memorization/habit tracker apps
- **Research capabilities**: Grammar analysis ready when needed
- **Technology independence**: Could migrate from Next.js/React if needed

## Success Metrics

**Technical Metrics:**
- [ ] 90%+ test coverage for domain layer
- [ ] Zero circular dependencies between layers
- [ ] API response times maintained during migration
- [ ] Bundle size impact < 10% increase

**Business Metrics:**
- [ ] Feature development velocity maintained during migration
- [ ] Zero user-facing bugs during transition
- [ ] Mobile app development timeline reduced by 40%
- [ ] Custom API integration completed in < 2 weeks

## Conclusion

**✅ Phase 1 Complete:** Domain foundation ready for multi-app Quran ecosystem

This strategic clean architecture migration positions your project for:

1. **Current Success**: Clean completion of remaining 30% features  
2. **Multi-App Expansion**: Reusable components for memorization/habit tracker apps
3. **Mobile Development**: Shared business logic across platforms
4. **API Independence**: Easy transition to custom backend
5. **Research Features**: Grammar analysis ready when needed

The domain-first approach ensures **maximum component reusability** while maintaining current app functionality.

---

## ✅ Current Status: Ready for Phase 2

**Phase 1 Achievements:**
- Domain entities built with multi-app reusability
- Repository interfaces abstract all data dependencies  
- Use cases contain pure business logic
- Grammar features safely archived for future integration
- Zero technical debt from architectural migration

**Immediate Next Steps:**
1. **Continue with current app development** using existing React components
2. **When ready for Phase 2**: Implement infrastructure layer
3. **Future apps**: Import and extend existing domain entities

The foundation is solid, reusable, and ready for your multi-app Quran ecosystem vision! 🎯