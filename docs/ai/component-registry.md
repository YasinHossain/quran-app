# Component Registry - AI Development Reference

## Overview

This registry provides AI with comprehensive understanding of all components, their purposes, props, and usage patterns.

## Component Architecture

### Atomic Design Hierarchy

#### Atoms (Basic UI Elements)

| Component         | Location                             | Purpose                                          | Key Props                                                    | Usage Notes                      |
| ----------------- | ------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------ | -------------------------------- |
| `ArabicText`      | `src/presentation/components/atoms/` | Display Arabic Quran text with proper typography | `text: string, size?: 'sm'\|'md'\|'lg'`                      | Handles RTL text, tajweed colors |
| `TranslationText` | `src/presentation/components/atoms/` | Display verse translations                       | `text: string, language?: string`                            | Supports multiple languages      |
| `VerseNumber`     | `src/presentation/components/atoms/` | Show verse number in circle                      | `number: number, surahId?: number`                           | Responsive design, accessible    |
| `LoadingSpinner`  | `src/presentation/components/atoms/` | Loading state indicator                          | `size?: 'sm'\|'md'\|'lg', className?: string`                | Consistent loading UX            |
| `ActionButton`    | `src/presentation/components/atoms/` | Standard button component                        | `onClick: () => void, variant?: string, children: ReactNode` | Theme-aware styling              |

#### Molecules (Composed Components)

| Component      | Location                                 | Purpose                            | Key Props                                   | Dependencies                             |
| -------------- | ---------------------------------------- | ---------------------------------- | ------------------------------------------- | ---------------------------------------- |
| `VerseCard`    | `src/presentation/components/molecules/` | Display single verse with metadata | `verse: Verse, showBookmark?: boolean`      | ArabicText, TranslationText, VerseNumber |
| `ErrorCard`    | `src/presentation/components/molecules/` | Error state display with retry     | `error: Error, onRetry?: () => void`        | ActionButton                             |
| `LoadingCard`  | `src/presentation/components/molecules/` | Skeleton loading for verse cards   | `count?: number`                            | LoadingSpinner                           |
| `BookmarkItem` | `src/presentation/components/molecules/` | Bookmark list item                 | `bookmark: Bookmark, onRemove?: () => void` | VerseNumber, ActionButton                |

#### Organisms (Complex Components)

| Component            | Location                                 | Purpose                    | Key Props                                | Business Logic                         |
| -------------------- | ---------------------------------------- | -------------------------- | ---------------------------------------- | -------------------------------------- |
| `VerseList`          | `src/presentation/components/organisms/` | Virtualized list of verses | `surahId: number, verses: Verse[]`       | Infinite scroll, performance optimized |
| `SurahReadingLayout` | `src/presentation/components/organisms/` | Main reading interface     | `surahId: number`                        | Audio player integration, settings     |
| `BookmarksSidebar`   | `src/presentation/components/organisms/` | Bookmark management panel  | `bookmarks: Bookmark[], isOpen: boolean` | CRUD operations                        |
| `AudioPlayer`        | `app/shared/player/`                     | Quran recitation player    | `surahId?: number, reciterId?: string`   | Audio state management                 |

#### Templates (Page Layouts)

| Component               | Location                                 | Purpose                   | Key Props                         | Layout Structure                 |
| ----------------------- | ---------------------------------------- | ------------------------- | --------------------------------- | -------------------------------- |
| `SurahPageTemplate`     | `src/presentation/components/templates/` | Surah reading page layout | `surahId: number`                 | Header + VerseList + AudioPlayer |
| `BookmarksPageTemplate` | `src/presentation/components/templates/` | Bookmarks page layout     | `bookmarks: Bookmark[]`           | Sidebar + main content area      |
| `SearchPageTemplate`    | `src/presentation/components/templates/` | Search results layout     | `query: string, results: Verse[]` | Search bar + result list         |

## Feature Components

### Audio Player Feature

```typescript
// Location: app/shared/player/
interface AudioPlayerProps {
  surahId?: number;
  reciterId?: string;
  autoPlay?: boolean;
  showPlaylist?: boolean;
}

// Key hooks:
useAudioPlayer(); // Player state management
useReciterSelection(); // Reciter switching
usePlaybackControls(); // Play/pause/seek
```

### Bookmarks Feature

```typescript
// Location: app/(features)/bookmarks/
interface BookmarkFeatureProps {
  userId: string;
  initialBookmarks?: Bookmark[];
}

// Key hooks:
useBookmarks(); // CRUD operations
useBookmarkSync(); // Synchronization
useBookmarkFiltering(); // Search/filter
```

### Surah Reading Feature

```typescript
// Location: app/(features)/surah/
interface SurahReadingProps {
  surahId: number;
  startVerse?: number;
  translation?: string;
}

// Key hooks:
useVerses(surahId); // Verse loading
useSurahNavigation(); // Next/prev navigation
useReadingSettings(); // Font size, theme
```

## Provider Dependencies

### Required Providers for Testing

```typescript
// All components need these providers in tests:
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <SettingsProvider>
      <SidebarProvider>
        <BookmarkProvider>
          <DIProvider>
            {children}
          </DIProvider>
        </BookmarkProvider>
      </SidebarProvider>
    </SettingsProvider>
  </ThemeProvider>
);
```

### Provider Hierarchy

1. **DIProvider** - Dependency injection container
2. **ThemeProvider** - Design system and responsive breakpoints
3. **SettingsProvider** - User preferences and configuration
4. **BookmarkProvider** - Bookmark state management
5. **SidebarProvider** - Navigation and layout state

## Component Creation Patterns

### New Atom Component

```typescript
// src/presentation/components/atoms/NewAtom.tsx
import React from 'react';
import { cn } from '@/shared/utils';

interface NewAtomProps {
  required: string;
  optional?: boolean;
  className?: string;
}

export const NewAtom: React.FC<NewAtomProps> = ({
  required,
  optional = false,
  className
}) => {
  return (
    <div className={cn('base-styles', className)}>
      {/* Implementation */}
    </div>
  );
};
```

### New Feature Component

```typescript
// app/(features)/new-feature/components/FeatureMain.tsx
import React from 'react';
import { useFeatureHook } from '../hooks/useFeatureHook';

interface FeatureMainProps {
  config: FeatureConfig;
}

export const FeatureMain: React.FC<FeatureMainProps> = ({ config }) => {
  const { data, loading, error } = useFeatureHook(config);

  if (loading) return <LoadingCard />;
  if (error) return <ErrorCard error={error} />;

  return (
    <div>
      {/* Feature implementation */}
    </div>
  );
};
```

## AI Usage Instructions

### Finding Similar Components

```bash
# Search for components by type
Grep "export.*React.FC.*Props" --glob "**/*.tsx"

# Find atoms/molecules/organisms
Glob "**/atoms/**/*.tsx"
Glob "**/molecules/**/*.tsx"
Glob "**/organisms/**/*.tsx"

# Search for specific functionality
Grep "useState\|useEffect" app/ --glob "*.tsx"
```

### Component Modification Workflow

1. **Find existing component** using Glob/Grep
2. **Check dependencies** - what other components it uses
3. **Review tests** - understand expected behavior
4. **Check provider requirements** - ensure test setup is correct
5. **Follow responsive patterns** - mobile-first approach
6. **Test across breakpoints** - 375px, 768px, 1024px+

### Performance Considerations

- **Virtualization**: Use for lists > 100 items
- **Memoization**: React.memo for expensive components
- **Lazy loading**: Suspend components not immediately needed
- **Bundle splitting**: Code split by feature/route
