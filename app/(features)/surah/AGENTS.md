# Surah Feature - AI Development Guidelines

This file contains specific guidance for AI developers working on the Surah reading feature. Follow these patterns exactly to maintain consistency with the existing codebase.

## Feature Overview

The Surah feature is the core reading interface of the Quran app, handling:

- Verse listing with infinite scrolling
- Audio playbook integration
- Settings panels (translations, tafsir, fonts)
- Responsive verse display
- Reading progress tracking

**File Location:** `app/(features)/surah/`

## Architecture Patterns

### Key Components Structure

```
surah/
├── [surahId]/                   # Dynamic route for specific Surah
│   ├── components/
│   │   ├── Verse.tsx           # Individual verse component (CRITICAL)
│   │   ├── SurahVerseList.tsx  # Main verse listing
│   │   ├── SettingsPanels.tsx  # Settings interface
│   │   ├── tafsir-panel/       # Tafsir selection components
│   │   ├── translation-panel/  # Translation selection components
│   │   └── arabic-font-panel/  # Font selection components
│   └── page.tsx                # Route page component
├── hooks/                      # Surah-specific hooks
│   ├── useVerseListing.ts     # Main verse data hook (CRITICAL)
│   ├── useSurahPanels.ts      # Panel state management
│   ├── useInfiniteVerseLoader.ts
│   └── useFontSize.ts
└── lib/
    └── surahImageMap.ts
```

## Critical Components

### 1. Verse Component (`[surahId]/components/Verse.tsx`)

**This is the most important component in the feature.** Any changes must follow this exact pattern:

```typescript
import { memo, useCallback, useEffect, useRef } from 'react';
import { Verse as VerseType, Translation } from '@/types';
import { useAudio } from '@/app/shared/player/context/AudioContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';

interface VerseProps {
  verse: VerseType;
}

export const Verse = memo(function Verse({ verse }: VerseProps) {
  const { playingId, setActiveVerse, openPlayer } = useAudio();
  const { settings } = useSettings();
  const { isBookmarked, setLastRead } = useBookmarks();

  // Intersection observer for reading progress
  useEffect(() => {
    const observer = new IntersectionObserver(/* ... */);
    // Implementation
  }, []);

  // Audio playback handler
  const handlePlayPause = useCallback(() => {
    // Audio integration logic
  }, [/* dependencies */]);

  return (
    <div id={`verse-${verse.id}`} className="mb-8 pb-8 border-b border-border">
      {/* Mobile-first responsive layout */}
      <div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
        <ResponsiveVerseActions /* props */ />
        <div className="space-y-6 md:flex-grow">
          <VerseArabic verse={verse} />
          {/* Translation rendering */}
        </div>
      </div>
    </div>
  );
});
```

**Key Requirements:**

- Must be memoized with `memo()`
- Must include intersection observer for reading progress
- Must integrate with audio player context
- Must use responsive layout pattern
- Must handle bookmarks and last read tracking

### 2. useVerseListing Hook (`hooks/useVerseListing.ts`)

**This hook orchestrates all verse-related data and actions.** Follow this pattern:

```typescript
export interface LookupFn {
  (
    id: string,
    translationIds: number | number[],
    page: number,
    perPage: number,
    wordLang: string
  ): Promise<{ verses: Verse[]; totalPages: number }>;
}

export function useVerseListing({ id, lookup }: UseVerseListingParams) {
  const [error, setError] = useState<string | null>(null);
  const { settings, setSettings } = useSettings();
  const { activeVerse, setActiveVerse, reciter, openPlayer } = useAudio();

  // Stable translation IDs to prevent SWR thrashing
  const stableTranslationIds = useMemo(() => {
    const ids = settings.translationIds || [settings.translationId];
    const validIds = ids.filter((id) => id && typeof id === 'number');
    return validIds.length > 0 ? validIds.sort((a, b) => a - b).join(',') : '20';
  }, [settings.translationIds, settings.translationId]);

  // Infinite loading integration
  const { verses, isLoading, isValidating, isReachingEnd } = useInfiniteVerseLoader({
    // Configuration
  });

  // Navigation handlers
  const handleNext = useCallback(
    () => {
      // Next verse logic with audio integration
    },
    [
      /* dependencies */
    ]
  );

  const handlePrev = useCallback(
    () => {
      // Previous verse logic with audio integration
    },
    [
      /* dependencies */
    ]
  );

  return {
    // All necessary data and actions
  } as const;
}
```

**Key Requirements:**

- Must stabilize translation IDs to prevent unnecessary SWR re-fetches
- Must integrate with infinite scrolling
- Must provide verse navigation for audio player
- Must expose all necessary data and actions
- Must use `as const` for return type inference

## Audio Integration Patterns

### Required Audio Context Usage

```typescript
// ✅ Correct: Always destructure needed values
const {
  playingId,
  setPlayingId,
  loadingId,
  setLoadingId,
  setActiveVerse,
  audioRef,
  setIsPlaying,
  openPlayer,
} = useAudio();

// ✅ Correct: Check playing state
const isPlaying = playingId === verse.id;

// ✅ Correct: Handle play/pause
const handlePlayPause = useCallback(() => {
  if (playingId === verse.id) {
    audioRef.current?.pause();
    setPlayingId(null);
    setActiveVerse(null);
    setIsPlaying(false);
  } else {
    setActiveVerse(verse);
    setPlayingId(verse.id);
    setIsPlaying(true);
    openPlayer();
  }
}, [playingId, verse, audioRef, setActiveVerse, setPlayingId, setIsPlaying, openPlayer]);
```

## Settings Panel Patterns

### Panel State Management

```typescript
// File: hooks/useSurahPanels.ts
export function useSurahPanels() {
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  const togglePanel = useCallback((panelId: string) => {
    setOpenPanels((prev) => ({
      ...prev,
      [panelId]: !prev[panelId],
    }));
  }, []);

  const closeAllPanels = useCallback(() => {
    setOpenPanels({});
  }, []);

  return {
    openPanels,
    togglePanel,
    closeAllPanels,
  } as const;
}
```

### Panel Component Pattern

All settings panels must follow this structure:

```typescript
// Example: tafsir-panel/TafsirPanel.tsx
import { memo } from 'react';
import { useSelectableResources } from '@/lib/hooks/useSelectableResources';

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirPanel = memo(function TafsirPanel({
  isOpen,
  onClose,
}: TafsirPanelProps) {
  const { resources, selectedIds, handleToggle } = useSelectableResources({
    /* config */
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 md:relative md:inset-auto md:bg-transparent">
      <div className="absolute bottom-0 left-0 right-0 bg-background md:relative">
        {/* Panel content */}
      </div>
    </div>
  );
});
```

## Responsive Design Patterns

### Required Mobile-First Layouts

```typescript
// ✅ Verse layout: Mobile stacked, Desktop side-by-side
<div className="space-y-4 md:space-y-0 md:flex md:items-start md:gap-x-6">
  <div className="md:w-16 md:pt-1">{/* Actions */}</div>
  <div className="space-y-6 md:flex-grow">{/* Content */}</div>
</div>

// ✅ Settings panels: Mobile drawer, Desktop sidebar
<div className="fixed inset-0 bg-black/50 z-50 md:relative md:inset-auto md:bg-transparent">
  <div className="absolute bottom-0 left-0 right-0 bg-background md:relative">
    {/* Panel content */}
  </div>
</div>

// ✅ Content spacing: Different for mobile vs desktop
<div className="space-y-4 p-4 md:space-y-6 md:p-6">
```

## API Integration Patterns

### Verse Fetching

```typescript
// Always use the standardized lookup function signature
const lookup: LookupFn = async (
  id: string,
  translationIds: number | number[],
  page: number,
  perPage: number,
  wordLang: string
) => {
  // API call implementation
  return { verses, totalPages };
};
```

### SWR Integration

```typescript
// Use stable keys to prevent unnecessary re-fetches
const swrKey = useMemo(
  () => `verses-${id}-${stableTranslationIds}-${wordLang}`,
  [id, stableTranslationIds, wordLang]
);
```

## Performance Patterns

### Required Optimizations

```typescript
// ✅ Memoize expensive computations
const processedVerses = useMemo(() => {
  return verses.map((verse) => ({
    ...verse,
    // transformations
  }));
}, [verses]);

// ✅ Virtualization for long lists
import { FixedSizeList as List } from 'react-window';

// ✅ Intersection observer for reading tracking
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        // Track reading progress
      }
    },
    { threshold: 0.5 }
  );
}, []);
```

## Testing Patterns

### Required Test Structure

```typescript
// File: __tests__/Verse.test.tsx
import { render, screen } from '@testing-library/react';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { Verse } from '@/app/(features)/Verse';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>
    <BookmarkProvider>
      <AudioProvider>
        {children}
      </AudioProvider>
    </BookmarkProvider>
  </SettingsProvider>
);

describe('Verse Component', () => {
  it('integrates with audio player', () => {
    // Test audio integration
  });

  it('tracks reading progress', () => {
    // Test intersection observer
  });

  it('handles responsive layout', () => {
    // Test mobile/desktop layouts
  });
});
```

## Common Mistakes to Avoid

### ❌ Don't Do This

```typescript
// Don't skip memoization
export function Verse({ verse }) { }

// Don't hardcode responsive breakpoints
<div style={{ display: window.innerWidth > 768 ? 'flex' : 'block' }}>

// Don't directly manipulate audio without context
audioElement.play();

// Don't skip intersection observer cleanup
useEffect(() => {
  const observer = new IntersectionObserver(/* ... */);
  // Missing: return () => observer.disconnect();
});

// Don't mutate settings directly
settings.fontSize = 18;
```

### ✅ Always Do This

```typescript
// Always memoize components
export const Verse = memo(function Verse({ verse }) { });

// Use Tailwind responsive classes
<div className="block md:flex">

// Use audio context methods
const { setActiveVerse, openPlayer } = useAudio();

// Clean up observers
useEffect(() => {
  const observer = new IntersectionObserver(/* ... */);
  return () => observer.disconnect();
}, []);

// Use settings context actions
const { setSettings } = useSettings();
setSettings(prev => ({ ...prev, fontSize: 18 }));
```

## Integration Points

### Required Context Integrations

1. **AudioContext** - For playback control and active verse tracking
2. **SettingsContext** - For font sizes, translations, display preferences
3. **BookmarkContext** - For bookmark status and reading progress

### Required Component Integrations

1. **ResponsiveVerseActions** - Verse action buttons
2. **VerseArabic** - Arabic text display with font settings
3. **ResourcePanels** - Translation/Tafsir selection interfaces

### Required Hook Integrations

1. **useInfiniteVerseLoader** - For pagination and loading states
2. **useSelectableResources** - For panel selection management
3. **useScrollCentering** - For verse navigation scrolling

## AI Development Checklist

For any Surah feature changes, verify:

- [ ] **Verse Component**: Is it memoized and follows the exact pattern?
- [ ] **Audio Integration**: Does it properly use AudioContext methods?
- [ ] **Settings Integration**: Does it respect all font/display settings?
- [ ] **Responsive Layout**: Mobile-first with proper breakpoints?
- [ ] **Reading Progress**: Intersection observer implemented correctly?
- [ ] **Performance**: Memoized computations and callbacks?
- [ ] **Accessibility**: Touch targets are 44px minimum?
- [ ] **Testing**: All context providers included in test wrappers?

**The Surah feature is critical to the app's functionality. Any deviations from these patterns will break existing functionality.**
