# Quran Ecosystem - Complete Architecture & Implementation Guide

## 📌 Executive Summary

This guide provides a complete, phase-by-phase roadmap to transform your current Quran web app into a multi-platform ecosystem supporting:

- ✅ Current Next.js web application
- 📱 Future Android & iOS applications
- 🧠 Future Quran Memorization app
- 📊 Future Quran Habit Tracker app

**Timeline**: 8 weeks for foundation, then ready for multi-platform development

---

## 🎯 Goals & Vision

### Immediate Goals (Next 2 months)

1. Fix all 10 critical issues in current codebase
2. Implement Domain-Driven Design architecture
3. Prepare for code sharing across platforms
4. Maintain working app throughout refactoring

### Long-term Goals (3-12 months)

1. Launch Android & iOS apps with 70% code reuse
2. Build Quran Memorization app using shared core
3. Build Quran Habit Tracker app using shared core
4. Maintain single source of truth for business logic

### Success Metrics

- ✅ Zero business logic in UI components
- ✅ 80% test coverage on domain logic
- ✅ New app development time < 2 months
- ✅ Single command to run all apps
- ✅ 70%+ code sharing between platforms

---

## 🚨 Current Issues Analysis

| #   | Issue                                          | Impact                       | Priority |
| --- | ---------------------------------------------- | ---------------------------- | -------- |
| 1   | **No `src` directory** - everything in root    | Can't organize code properly | Critical |
| 2   | **20+ documentation files** in root            | Confusing, hard to navigate  | High     |
| 3   | **No domain separation** - logic mixed with UI | Can't share code             | Critical |
| 4   | **Components scattered** across directories    | Inconsistent, hard to find   | High     |
| 5   | **No repository pattern** - direct API calls   | Can't test, can't mock       | Critical |
| 6   | **No state management** strategy               | State scattered everywhere   | High     |
| 7   | **Config files** cluttering root               | Messy project root           | Medium   |
| 8   | **Tests scattered** in `__tests__` folders     | Hard to run test suites      | Medium   |
| 9   | **Dev tools** (mcp-server) in root             | Cluttered structure          | Low      |
| 10  | **Unclear `/data`** directory purpose          | Ambiguous organization       | Low      |

---

## 🏗️ Target Architecture

### Final Structure Overview

```
quran-ecosystem/                          # Monorepo root
├── packages/                             # Shared NPM packages
│   ├── @quran/core/                    # Core business logic
│   │   └── src/
│   │       ├── domain/                 # Entities, repositories, services
│   │       ├── application/            # Use cases, DTOs
│   │       └── infrastructure/         # Shared implementations
│   │
│   ├── @quran/api-client/              # API communication
│   ├── @quran/audio-engine/            # Audio playback logic
│   ├── @quran/ui-tokens/               # Design system
│   ├── @quran/memorization-engine/     # Memorization algorithms
│   └── @quran/habit-engine/            # Habit tracking logic
│
├── apps/
│   ├── web/                            # Current Next.js app
│   │   └── src/
│   │       ├── domain/                 # Web-specific domain
│   │       ├── application/            # Web-specific use cases
│   │       ├── infrastructure/         # Web implementations
│   │       └── presentation/           # React components
│   │
│   ├── mobile/                         # React Native app
│   ├── memorization/                   # Future memorization app
│   └── habit-tracker/                  # Future habit app
│
├── tools/                               # Development tools
├── docs/                                # Documentation
└── config/                              # Shared configuration
```

---

## 📅 Implementation Phases

## Phase 1: Emergency Cleanup & Foundation (Week 1) ✅ COMPLETED

_Goal: Clean up the mess without breaking anything_

### 🎉 Phase 1 Completion Summary (Completed: August 30, 2025)

**✅ Successfully Completed Tasks:**

1. **Branch Management**
   - Created new branch: `refactor/complete-architecture`
   - Maintained master branch as stable backup
   - No backup commit needed (branch isolation sufficient)

2. **Directory Structure Creation**

   ```
   ✅ Created complete organized structure:
   src/
   ├── domain/ (entities, value-objects, repositories, services, errors)
   ├── application/ (use-cases, dto, mappers, ports)
   ├── infrastructure/ (api, cache, database, repositories, external)
   ├── presentation/ (components, hooks, stores, contexts, styles, utils)
   └── shared/ (constants, types, utils, config, design-system)

   ✅ Supporting directories:
   docs/{api,architecture,development,guides,deployment,analysis}
   config/{env,jest,storybook,webpack,build}
   tests/{unit,integration,e2e,fixtures,mocks}
   tools/{mcp,scripts,generators,migrations}
   backup/{css,docs,old-components}
   ```

3. **File Organization & Cleanup**
   - ✅ **Project Goal.md** moved to `docs/architecture/`
   - ✅ **Configuration files** moved to `config/build/` and `config/jest/`
   - ✅ **Development tools** moved to `tools/mcp/` and `tools/scripts/`
   - ✅ **Data directory** kept in original location (for Next.js compatibility)
   - ✅ **Root directory cleaned** - removed clutter files

4. **Compatibility & Testing**
   - ✅ **Import paths maintained** - no breaking changes to existing imports
   - ✅ **Development server verified** - app starts and runs successfully
   - ✅ **TypeScript compilation** - only pre-existing errors remain
   - ✅ **Zero regression** - all existing functionality preserved

**📊 Issues Resolved:**

- ✅ Issue #2: 20+ documentation files in root → Organized in `docs/`
- ✅ Issue #7: Config files cluttering root → Organized in `config/`
- ✅ Issue #9: Dev tools in root → Moved to `tools/`
- ✅ Issue #10: Unclear data directory → Kept in place for stability

**🚀 Foundation Ready For:**

- Phase 2: Domain-Driven Design implementation
- Clean separation of concerns
- Multi-platform architecture
- Shared package extraction

**⚠️ Key Lessons Learned:**

- Symlinks don't work well with Next.js config - use direct paths
- Data imports should stay in original location for Next.js compatibility
- Gradual approach prevented memory leaks and breaking changes
- Branch isolation eliminated need for additional backup commits

---

### Day 1-2: Backup & Prepare

```bash
#!/bin/bash
# STEP 1: Create backup
git checkout -b refactor/complete-architecture
git add .
git commit -m "backup: Before major refactoring"

# STEP 2: Create new directory structure (don't move anything yet)
mkdir -p src/{domain,application,infrastructure,presentation,shared}
mkdir -p src/domain/{entities,value-objects,repositories,services,errors}
mkdir -p src/application/{use-cases,dto,mappers,ports}
mkdir -p src/infrastructure/{api,cache,database,repositories,external}
mkdir -p src/presentation/{components,hooks,stores,contexts,styles,utils}
mkdir -p src/shared/{constants,types,utils,config,design-system}

# STEP 3: Create organized structure for everything
mkdir -p docs/{api,architecture,development,guides,deployment,analysis}
mkdir -p config/{env,jest,storybook,webpack,build}
mkdir -p tests/{unit,integration,e2e,fixtures,mocks}
mkdir -p tools/{mcp,scripts,generators,migrations}
mkdir -p backup/{css,docs,old-components}
mkdir -p public/data/{quran,translations,audio}
```

### Day 3-4: Documentation Cleanup

```bash
# Move documentation (ISSUE #2)
mv AI_DEVELOPMENT_GUIDE.md docs/development/
mv RESPONSIVE_*.md docs/architecture/
mv DESIGN_*.md docs/architecture/
mv SEMANTIC_*.md docs/architecture/
mv MCP_*.md docs/development/
mv SECURITY.md docs/guides/
mv CONTRIBUTING.md docs/guides/
mv CODE_OF_CONDUCT.md docs/guides/
mv STYLING.md docs/development/
mv BOOKMARK_PAGE_ANALYSIS.md docs/analysis/
mv *-analysis.md docs/analysis/
mv *-planning.md docs/architecture/

# Keep in root: README.md, LICENSE, CHANGELOG.md, .gitignore
```

### Day 5: Configuration Cleanup

```bash
# Move config files (ISSUE #7)
mv jest.config.js config/jest/
mv jest.setup.js config/jest/
mv .storybook/* config/storybook/
mv next.config.ts config/build/
mv next-pwa.config.mjs config/build/
mv tailwind.config.mjs config/build/
mv postcss.config.mjs config/build/
mv eslint.config.mjs config/build/

# Move dev tools (ISSUE #9)
mv mcp-server tools/mcp/
mv mcp-browser-console tools/mcp/
mv scripts/* tools/scripts/

# Clean up data directory (ISSUE #10)
mv data/* public/data/

# Move backup files (ISSUE #2 - redundant files)
mv app/globals.original.css backup/css/
mv design-tokens-analysis.md backup/docs/

# Clean up root
rm npm_output.log
rm start-chrome-debug.bat  # or move to tools/scripts/
```

### Day 6-7: Update Configuration Files

```javascript
// config/build/next.config.ts
import { join } from 'path';

export default {
  // Update paths to use new structure
  webpack: (config) => {
    config.resolve.alias = {
      '@': join(__dirname, '../../src'),
      '@domain': join(__dirname, '../../src/domain'),
      '@app': join(__dirname, '../../src/application'),
      '@infra': join(__dirname, '../../src/infrastructure'),
      '@ui': join(__dirname, '../../src/presentation'),
      '@shared': join(__dirname, '../../src/shared'),
    };
    return config;
  },
};
```

---

## Phase 2: Domain-Driven Design Implementation (Week 2-3)

_Goal: Separate business logic from UI (ISSUES #3, #5)_

### Week 2: Domain Layer

#### Domain Entities

```typescript
// src/domain/entities/Verse.ts
export class Verse {
  constructor(
    private readonly id: string,
    private readonly surahId: number,
    private readonly ayahNumber: number,
    private readonly arabicText: string,
    private readonly uthmaniText: string,
    private readonly translation?: Translation
  ) {}

  // Core business logic
  isFirstVerse(): boolean {
    return this.ayahNumber === 1;
  }

  isSajdahVerse(): boolean {
    const sajdahVerses = [
      { surah: 7, ayah: 206 },
      { surah: 13, ayah: 15 },
      // ... other sajdah verses
    ];
    return sajdahVerses.some((v) => v.surah === this.surahId && v.ayah === this.ayahNumber);
  }

  // For memorization app
  getMemorizationSegments(): string[] {
    return this.arabicText.split(' ');
  }

  // For habit tracker app
  getEstimatedReadingTime(): number {
    const wordsPerMinute = 150;
    const wordCount = this.arabicText.split(' ').length;
    return Math.ceil((wordCount / wordsPerMinute) * 60);
  }
}

// src/domain/entities/Surah.ts
export class Surah {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly englishName: string,
    private readonly englishTranslation: string,
    private readonly numberOfAyahs: number,
    private readonly revelationType: RevelationType
  ) {}

  isMakki(): boolean {
    return this.revelationType === RevelationType.MAKKI;
  }

  // Business rules
  canBeReadInPrayer(): boolean {
    return this.id !== 9; // At-Tawbah doesn't start with Bismillah
  }
}

// src/domain/value-objects/BookmarkPosition.ts
export class BookmarkPosition {
  constructor(
    private readonly surahId: number,
    private readonly ayahNumber: number,
    private readonly timestamp: Date
  ) {}

  toString(): string {
    return `${this.surahId}:${this.ayahNumber}`;
  }

  equals(other: BookmarkPosition): boolean {
    return this.surahId === other.surahId && this.ayahNumber === other.ayahNumber;
  }
}
```

#### Repository Interfaces

```typescript
// src/domain/repositories/IVerseRepository.ts
export interface IVerseRepository {
  findById(id: string): Promise<Verse>;
  findBySurahAndAyah(surahId: number, ayahNumber: number): Promise<Verse>;
  findBySurah(surahId: number): Promise<Verse[]>;
  findByJuz(juzNumber: number): Promise<Verse[]>;
  findByPage(pageNumber: number): Promise<Verse[]>;
  search(query: string, options?: SearchOptions): Promise<Verse[]>;
}

// src/domain/repositories/IBookmarkRepository.ts
export interface IBookmarkRepository {
  save(bookmark: Bookmark): Promise<void>;
  remove(bookmarkId: string): Promise<void>;
  findByUser(userId: string): Promise<Bookmark[]>;
  findRecent(userId: string, limit: number): Promise<Bookmark[]>;
  exists(userId: string, verseId: string): Promise<boolean>;
}
```

#### Domain Services

```typescript
// src/domain/services/BookmarkService.ts
export class BookmarkService {
  constructor(
    private readonly bookmarkRepo: IBookmarkRepository,
    private readonly verseRepo: IVerseRepository
  ) {}

  async bookmarkVerse(userId: string, surahId: number, ayahNumber: number): Promise<Bookmark> {
    const verse = await this.verseRepo.findBySurahAndAyah(surahId, ayahNumber);
    if (!verse) {
      throw new VerseNotFoundError(surahId, ayahNumber);
    }

    const exists = await this.bookmarkRepo.exists(userId, verse.id);
    if (exists) {
      throw new BookmarkAlreadyExistsError(verse.id);
    }

    const bookmark = new Bookmark(
      generateId(),
      userId,
      verse.id,
      new BookmarkPosition(surahId, ayahNumber, new Date())
    );

    await this.bookmarkRepo.save(bookmark);
    return bookmark;
  }
}
```

### Week 3: Application & Infrastructure Layers

#### Application Layer (Use Cases)

```typescript
// src/application/use-cases/ReadVerseUseCase.ts
export interface ReadVerseParams {
  surahId: number;
  ayahNumber: number;
  translationId?: string;
  reciterId?: string;
}

export class ReadVerseUseCase {
  constructor(
    private readonly verseRepo: IVerseRepository,
    private readonly translationRepo: ITranslationRepository,
    private readonly audioService: IAudioService
  ) {}

  async execute(params: ReadVerseParams): Promise<ReadVerseResult> {
    // Get verse
    const verse = await this.verseRepo.findBySurahAndAyah(params.surahId, params.ayahNumber);

    // Get translation if requested
    let translation = null;
    if (params.translationId) {
      translation = await this.translationRepo.findForVerse(verse.id, params.translationId);
    }

    // Get audio URL if reciter specified
    let audioUrl = null;
    if (params.reciterId) {
      audioUrl = await this.audioService.getAudioUrl(verse.id, params.reciterId);
    }

    return {
      verse,
      translation,
      audioUrl,
      readingTime: verse.getEstimatedReadingTime(),
    };
  }
}
```

#### Infrastructure Layer

```typescript
// src/infrastructure/api/QuranApiClient.ts
export class QuranApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly httpClient: IHttpClient
  ) {}

  async getVerse(surahId: number, ayahNumber: number): Promise<ApiVerse> {
    return this.httpClient.get<ApiVerse>(`${this.baseUrl}/surah/${surahId}/verse/${ayahNumber}`);
  }

  async getTranslation(verseId: string, translationId: string): Promise<ApiTranslation> {
    return this.httpClient.get<ApiTranslation>(
      `${this.baseUrl}/translations/${translationId}/verse/${verseId}`
    );
  }
}

// src/infrastructure/repositories/VerseRepository.ts
export class VerseRepository implements IVerseRepository {
  constructor(
    private readonly apiClient: QuranApiClient,
    private readonly cache: ICache,
    private readonly mapper: VerseMapper
  ) {}

  async findBySurahAndAyah(surahId: number, ayahNumber: number): Promise<Verse> {
    const cacheKey = `verse:${surahId}:${ayahNumber}`;

    // Check cache
    const cached = await this.cache.get<ApiVerse>(cacheKey);
    if (cached) {
      return this.mapper.toDomain(cached);
    }

    // Fetch from API
    const apiVerse = await this.apiClient.getVerse(surahId, ayahNumber);

    // Cache for 1 hour
    await this.cache.set(cacheKey, apiVerse, 3600);

    return this.mapper.toDomain(apiVerse);
  }
}
```

---

## Phase 3: Presentation Layer Refactoring (Week 4)

_Goal: Clean up components and implement proper state management (ISSUES #4, #6)_

### Component Organization (Atomic Design)

```typescript
// src/presentation/components/atoms/ArabicText.tsx
export const ArabicText: React.FC<{ text: string; size?: 'sm' | 'md' | 'lg' }> = ({
  text,
  size = 'md'
}) => {
  return (
    <span className={cn('font-arabic', {
      'text-2xl': size === 'sm',
      'text-3xl': size === 'md',
      'text-4xl': size === 'lg'
    })}>
      {text}
    </span>
  );
};

// src/presentation/components/molecules/VerseCard.tsx
export const VerseCard: React.FC<{ verse: Verse }> = ({ verse }) => {
  const { bookmarkVerse } = useBookmarks();

  return (
    <div className="verse-card p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <VerseNumber number={verse.ayahNumber} />
        <BookmarkButton
          onClick={() => bookmarkVerse(verse)}
        />
      </div>
      <ArabicText text={verse.arabicText} size="lg" />
      {verse.translation && (
        <TranslationText text={verse.translation.text} />
      )}
    </div>
  );
};

// src/presentation/components/organisms/VerseList.tsx
export const VerseList: React.FC<{ surahId: number }> = ({ surahId }) => {
  const { verses, loading, error } = useVerses(surahId);

  if (loading) return <VerseListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <VirtualList
      items={verses}
      renderItem={(verse) => <VerseCard key={verse.id} verse={verse} />}
      itemHeight={200}
    />
  );
};

// src/presentation/components/templates/SurahPageTemplate.tsx
export const SurahPageTemplate: React.FC<{ surahId: number }> = ({ surahId }) => {
  const { surah } = useSurah(surahId);

  return (
    <MainLayout>
      <SurahHeader surah={surah} />
      <VerseList surahId={surahId} />
      <AudioPlayer surahId={surahId} />
    </MainLayout>
  );
};
```

### State Management (Zustand)

```typescript
// src/presentation/stores/QuranStore.ts
interface QuranState {
  currentSurah: Surah | null;
  currentVerse: Verse | null;
  verses: Verse[];
  loading: boolean;
  error: Error | null;

  // Actions
  setCurrentSurah: (surah: Surah) => void;
  setCurrentVerse: (verse: Verse) => void;
  loadVerses: (surahId: number) => Promise<void>;
}

export const useQuranStore = create<QuranState>((set, get) => ({
  currentSurah: null,
  currentVerse: null,
  verses: [],
  loading: false,
  error: null,

  setCurrentSurah: (surah) => set({ currentSurah: surah }),
  setCurrentVerse: (verse) => set({ currentVerse: verse }),

  loadVerses: async (surahId) => {
    set({ loading: true, error: null });
    try {
      const verseRepo = container.resolve<IVerseRepository>('IVerseRepository');
      const verses = await verseRepo.findBySurah(surahId);
      set({ verses, loading: false });
    } catch (error) {
      set({ error: error as Error, loading: false });
    }
  },
}));

// src/presentation/stores/AudioStore.ts
interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  reciterId: string;
  playbackRate: number;

  // Actions
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setReciter: (reciterId: string) => void;
  setPlaybackRate: (rate: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  reciterId: 'ar.alafasy',
  playbackRate: 1,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  seek: (time) => set({ currentTime: time }),
  setReciter: (reciterId) => set({ reciterId }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
}));

// src/presentation/stores/BookmarkStore.ts
interface BookmarkState {
  bookmarks: Bookmark[];
  recentBookmarks: Bookmark[];

  // Actions
  loadBookmarks: (userId: string) => Promise<void>;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (bookmarkId: string) => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  recentBookmarks: [],

  loadBookmarks: async (userId) => {
    const bookmarkRepo = container.resolve<IBookmarkRepository>('IBookmarkRepository');
    const bookmarks = await bookmarkRepo.findByUser(userId);
    const recentBookmarks = await bookmarkRepo.findRecent(userId, 5);
    set({ bookmarks, recentBookmarks });
  },

  addBookmark: (bookmark) =>
    set((state) => ({
      bookmarks: [...state.bookmarks, bookmark],
      recentBookmarks: [bookmark, ...state.recentBookmarks.slice(0, 4)],
    })),

  removeBookmark: (bookmarkId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
      recentBookmarks: state.recentBookmarks.filter((b) => b.id !== bookmarkId),
    })),
}));
```

---

## Phase 4: Testing Structure (Week 5)

_Goal: Implement comprehensive testing (ISSUE #8)_

### Test Organization

```typescript
// tests/unit/domain/entities/Verse.test.ts
describe('Verse Entity', () => {
  describe('isFirstVerse', () => {
    it('should return true for ayah number 1', () => {
      const verse = new Verse('1', 1, 1, 'بِسْمِ اللَّهِ', 'bismillah');
      expect(verse.isFirstVerse()).toBe(true);
    });

    it('should return false for other ayah numbers', () => {
      const verse = new Verse('2', 1, 2, 'الْحَمْدُ لِلَّهِ', 'alhamdulillah');
      expect(verse.isFirstVerse()).toBe(false);
    });
  });

  describe('getMemorizationSegments', () => {
    it('should split Arabic text into segments', () => {
      const verse = new Verse('1', 1, 1, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '');
      const segments = verse.getMemorizationSegments();
      expect(segments).toHaveLength(4);
    });
  });
});

// tests/integration/repositories/VerseRepository.test.ts
describe('VerseRepository', () => {
  let repository: VerseRepository;
  let mockApiClient: jest.Mocked<QuranApiClient>;
  let mockCache: jest.Mocked<ICache>;

  beforeEach(() => {
    mockApiClient = createMockApiClient();
    mockCache = createMockCache();
    repository = new VerseRepository(mockApiClient, mockCache, new VerseMapper());
  });

  describe('findBySurahAndAyah', () => {
    it('should return cached verse if available', async () => {
      mockCache.get.mockResolvedValue(mockApiVerse);

      const verse = await repository.findBySurahAndAyah(1, 1);

      expect(mockApiClient.getVerse).not.toHaveBeenCalled();
      expect(verse.id).toBe('1');
    });

    it('should fetch from API if not cached', async () => {
      mockCache.get.mockResolvedValue(null);
      mockApiClient.getVerse.mockResolvedValue(mockApiVerse);

      const verse = await repository.findBySurahAndAyah(1, 1);

      expect(mockApiClient.getVerse).toHaveBeenCalledWith(1, 1);
      expect(mockCache.set).toHaveBeenCalled();
    });
  });
});

// tests/e2e/reading-quran.test.ts
describe('Reading Quran E2E', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('should navigate to surah and display verses', async () => {
    // Click on Al-Fatiha
    await page.click('[data-testid="surah-1"]');

    // Wait for navigation
    await page.waitForURL('**/surah/1');

    // Check that 7 verses are displayed
    const verses = await page.locator('[data-testid="verse-card"]').count();
    expect(verses).toBe(7);

    // Check first verse contains Bismillah
    const firstVerse = await page.locator('[data-testid="verse-1-1"]').textContent();
    expect(firstVerse).toContain('بِسْمِ اللَّهِ');
  });

  it('should bookmark a verse', async () => {
    await page.goto('http://localhost:3000/surah/1');

    // Click bookmark on first verse
    await page.click('[data-testid="bookmark-1-1"]');

    // Check bookmark appears in sidebar
    await page.click('[data-testid="bookmarks-sidebar"]');
    const bookmarkItem = await page.locator('[data-testid="bookmark-item-1-1"]');
    expect(bookmarkItem).toBeVisible();
  });
});
```

---

## Phase 5: Dependency Injection & Configuration (Week 6)

_Goal: Wire everything together with proper DI_

### Dependency Injection Container

```typescript
// src/shared/config/container.ts
import { Container } from 'inversify';
import 'reflect-metadata';

const container = new Container();

// Domain Services
container.bind<BookmarkService>(BookmarkService).toSelf().inSingletonScope();
container.bind<SearchService>(SearchService).toSelf().inSingletonScope();

// Repositories
container.bind<IVerseRepository>('IVerseRepository')
  .to(VerseRepository)
  .inSingletonScope();

container.bind<ISurahRepository>('ISurahRepository')
  .to(SurahRepository)
  .inSingletonScope();

container.bind<IBookmarkRepository>('IBookmarkRepository')
  .to(BookmarkRepository)
  .inSingletonScope();

// Use Cases
container.bind<ReadVerseUseCase>(ReadVerseUseCase).toSelf();
container.bind<BookmarkVerseUseCase>(BookmarkVerseUseCase).toSelf();
container.bind<SearchVersesUseCase>(SearchVersesUseCase).toSelf();

// Infrastructure
container.bind<QuranApiClient>(QuranApiClient)
  .toConstantValue(new QuranApiClient(
    process.env.NEXT_PUBLIC_API_URL!,
    new FetchHttpClient()
  ));

container.bind<ICache>('ICache')
  .to(LocalStorageCache)
  .inSingletonScope();

export { container };

// src/presentation/providers/DIProvider.tsx
import { container } from '@/shared/config/container';

const DIContext = React.createContext(container);

export const DIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
};

export const useContainer = () => {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useContainer must be used within DIProvider');
  }
  return context;
};
```

### Environment Configuration

```typescript
// config/env/config.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_AUDIO_CDN_URL: z.string().url(),
  NEXT_PUBLIC_IMAGE_CDN_URL: z.string().url(),
  CACHE_TTL: z.string().transform(Number).default('3600'),
  ENABLE_OFFLINE_MODE: z.string().transform(v => v === 'true').default('false'),
});

export const config = envSchema.parse(process.env);

// config/env/.env.development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AUDIO_CDN_URL=https://cdn.quran.com/audio
NEXT_PUBLIC_IMAGE_CDN_URL=https://cdn.quran.com/images
CACHE_TTL=3600
ENABLE_OFFLINE_MODE=true

// config/env/.env.production
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.quran.com
NEXT_PUBLIC_AUDIO_CDN_URL=https://cdn.quran.com/audio
NEXT_PUBLIC_IMAGE_CDN_URL=https://cdn.quran.com/images
CACHE_TTL=86400
ENABLE_OFFLINE_MODE=true
```

---

## Phase 6: Monorepo Setup (Week 7)

_Goal: Prepare for multi-platform development_

### Initialize Monorepo

```bash
#!/bin/bash
# Create monorepo structure
mkdir quran-ecosystem
cd quran-ecosystem

# Initialize workspace
npm init -y
npm install -D turbo lerna nx

# Create workspace configuration
cat > package.json << 'EOF'
{
  "name": "quran-ecosystem",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "latest",
    "lerna": "latest"
  }
}
EOF

# Create turbo configuration
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
EOF

# Create package directories
mkdir -p packages/@quran/{core,api-client,audio-engine,ui-tokens}
mkdir -p apps/{web,mobile}

# Move current app to monorepo
mv ~/quran-app apps/web
```

### Extract First Package

```typescript
// packages/@quran/core/package.json
{
  "name": "@quran/core",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest"
  }
}

// packages/@quran/core/src/index.ts
// Export all domain entities
export * from './domain/entities/Verse';
export * from './domain/entities/Surah';
export * from './domain/entities/Juz';

// Export repository interfaces
export * from './domain/repositories/IVerseRepository';
export * from './domain/repositories/ISurahRepository';

// Export domain services
export * from './domain/services/BookmarkService';
export * from './domain/services/SearchService';

// Export use cases
export * from './application/use-cases/ReadVerseUseCase';
export * from './application/use-cases/BookmarkVerseUseCase';
```

---

## Phase 7: Mobile App Foundation (Week 8)

_Goal: Setup React Native with shared packages_

### React Native Setup

```bash
# Create React Native app
cd apps
npx react-native init QuranMobile --template react-native-template-typescript
mv QuranMobile mobile

# Install shared packages
cd mobile
npm install @quran/core@file:../../packages/@quran/core
npm install @quran/api-client@file:../../packages/@quran/api-client
```

### Mobile Implementation

```typescript
// apps/mobile/src/infrastructure/MobileVerseRepository.ts
import { IVerseRepository, Verse } from '@quran/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class MobileVerseRepository implements IVerseRepository {
  async findBySurahAndAyah(surahId: number, ayahNumber: number): Promise<Verse> {
    // Mobile-specific implementation using AsyncStorage
    const cached = await AsyncStorage.getItem(`verse:${surahId}:${ayahNumber}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from API
    const response = await fetch(`${API_URL}/verses/${surahId}/${ayahNumber}`);
    const data = await response.json();

    // Cache for offline
    await AsyncStorage.setItem(
      `verse:${surahId}:${ayahNumber}`,
      JSON.stringify(data)
    );

    return new Verse(data);
  }
}

// apps/mobile/src/screens/VerseScreen.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReadVerseUseCase } from '@quran/core';
import { MobileVerseRepository } from '../infrastructure/MobileVerseRepository';

export const VerseScreen: React.FC<{ surahId: number; ayahNumber: number }> = ({
  surahId,
  ayahNumber
}) => {
  const [verse, setVerse] = useState(null);

  useEffect(() => {
    const useCase = new ReadVerseUseCase(new MobileVerseRepository());
    useCase.execute({ surahId, ayahNumber }).then(setVerse);
  }, [surahId, ayahNumber]);

  return (
    <ScrollView>
      <View>
        <Text style={styles.arabicText}>{verse?.arabicText}</Text>
        <Text style={styles.translation}>{verse?.translation}</Text>
      </View>
    </ScrollView>
  );
};
```

---

## Phase 8: Future Apps Preparation (Optional - After Week 8)

### Memorization Engine Package

```typescript
// packages/@quran/memorization-engine/src/services/MemorizationService.ts
import { Verse } from '@quran/core';

export class MemorizationService {
  private readonly spacedRepetitionIntervals = [1, 3, 7, 14, 30, 90]; // days

  calculateNextReview(lastReview: Date, correctCount: number): Date {
    const interval =
      this.spacedRepetitionIntervals[
        Math.min(correctCount, this.spacedRepetitionIntervals.length - 1)
      ];

    const nextReview = new Date(lastReview);
    nextReview.setDate(nextReview.getDate() + interval);
    return nextReview;
  }

  testMemorization(verse: Verse, userInput: string): MemorizationResult {
    const segments = verse.getMemorizationSegments();
    const inputSegments = userInput.split(' ');

    const correctSegments = segments.filter((seg, i) => seg === inputSegments[i]);

    const accuracy = correctSegments.length / segments.length;

    return {
      accuracy,
      correctSegments: correctSegments.length,
      totalSegments: segments.length,
      passed: accuracy >= 0.8,
    };
  }
}
```

### Habit Tracker Engine Package

```typescript
// packages/@quran/habit-engine/src/services/HabitService.ts
import { Verse } from '@quran/core';

export class HabitService {
  calculateStreak(sessions: ReadingSession[]): number {
    if (sessions.length === 0) return 0;

    let streak = 1;
    const sortedSessions = sessions.sort((a, b) => b.date.getTime() - a.date.getTime());

    for (let i = 1; i < sortedSessions.length; i++) {
      const dayDiff = this.getDaysDifference(sortedSessions[i - 1].date, sortedSessions[i].date);

      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  generateInsights(sessions: ReadingSession[]): HabitInsights {
    const totalVerses = sessions.reduce((sum, s) => sum + s.versesRead, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const averageVersesPerDay = totalVerses / sessions.length;

    return {
      totalVerses,
      totalTime,
      averageVersesPerDay,
      currentStreak: this.calculateStreak(sessions),
      bestTime: this.findBestReadingTime(sessions),
    };
  }
}
```

---

## 📊 Migration Checklist

### Week 1 Checklist ✅ COMPLETED

- [x] Create backup branch
- [x] Create directory structure
- [x] Move documentation files
- [x] Clean up configuration
- [x] Update import paths
- [x] Verify app still runs

### Week 2-3 Checklist ✅ COMPLETED

- [x] Create domain entities
- [x] Define repository interfaces
- [x] Implement domain services
- [x] Add value objects
- [x] Write domain tests

### Week 4 Checklist ✅ COMPLETED

- [x] Reorganize components (atomic design)
- [x] Implement state management  
- [x] Create custom hooks
- [x] Add loading states
- [x] Add error boundaries

### Week 5 Checklist

- [ ] Setup unit tests
- [ ] Add integration tests
- [ ] Create E2E tests
- [ ] Add test fixtures
- [ ] Setup CI pipeline

### Week 6 Checklist

- [ ] Setup DI container
- [ ] Configure environments
- [ ] Add logging
- [ ] Setup monitoring
- [ ] Add error tracking

### Week 7 Checklist

- [ ] Initialize monorepo
- [ ] Extract first package
- [ ] Update imports
- [ ] Test package linking
- [ ] Document packages

### Week 8 Checklist

- [ ] Setup React Native
- [ ] Implement mobile repository
- [ ] Create first mobile screen
- [ ] Test on iOS/Android
- [ ] Plan deployment

---

## 🎯 Success Metrics

### Code Quality Metrics

- [ ] Test coverage > 80%
- [ ] Zero business logic in UI components
- [ ] All external dependencies behind interfaces
- [ ] No circular dependencies
- [ ] TypeScript strict mode enabled

### Performance Metrics

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 200KB (initial)
- [ ] 100% offline capable

### Developer Experience

- [ ] New feature development < 1 day
- [ ] New developer onboarding < 2 hours
- [ ] Build time < 2 minutes
- [ ] Test execution < 1 minute
- [ ] Hot reload working

### Business Metrics

- [ ] 70% code reuse between platforms
- [ ] New app development < 2 months
- [ ] Bug resolution < 24 hours
- [ ] Feature parity across platforms
- [ ] User satisfaction > 4.5 stars

---

## 🚨 Risk Mitigation

### Technical Risks

1. **Breaking changes during refactor**
   - Mitigation: Keep old code until new code tested
   - Use feature flags for gradual rollout

2. **Performance degradation**
   - Mitigation: Benchmark before/after each phase
   - Use performance monitoring

3. **Package versioning issues**
   - Mitigation: Use exact versions
   - Automated dependency updates

### Process Risks

1. **Scope creep**
   - Mitigation: Strict phase boundaries
   - Weekly reviews

2. **Timeline delays**
   - Mitigation: Buffer time in each phase
   - Parallel work streams

---

## 📚 Resources & Documentation

### Learning Resources

- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [Monorepo Tools Comparison](https://monorepo.tools/)

### Documentation to Create

1. **Architecture Decision Records (ADRs)**
2. **API Documentation (OpenAPI/Swagger)**
3. **Component Library (Storybook)**
4. **Developer Onboarding Guide**
5. **Deployment Guide**

### Tools & Technologies

- **Monorepo**: Turbo, Lerna, Nx
- **Testing**: Jest, React Testing Library, Playwright
- **State**: Zustand, React Query
- **DI**: InversifyJS, tsyringe
- **Documentation**: Storybook, Docusaurus

---

## 🎉 Final Notes

This comprehensive guide provides:

1. **Complete solution** for all 10 identified issues
2. **Domain-driven architecture** for clean code
3. **Monorepo setup** for multi-platform support
4. **Phase-by-phase implementation** with clear timelines
5. **Future-proof design** for upcoming apps

Remember:

- **Don't rush** - Better done right than fast
- **Test everything** - Each phase should be stable
- **Document as you go** - Future you will thank you
- **Keep app running** - No big bang rewrites

**Success = Clean Architecture + Shared Packages + Gradual Migration**

---

_This document is your single source of truth. Update it as you progress through each phase._
