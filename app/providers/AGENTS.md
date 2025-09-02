# Providers - AI Development Guidelines

This file contains specific guidance for AI developers working with React Context providers and global state management. These patterns are critical to the app's architecture.

## Overview

The `app/providers/` directory contains all global state management through React Context. **These providers control the entire app's state** - any changes must follow the established patterns exactly.

**File Location:** `app/providers/`

## Directory Structure

```
providers/
├── SettingsContext.tsx        # User settings (fonts, translations, etc.)
├── settingsReducer.ts         # Settings state reducer
├── settingsStorage.ts         # Persistent storage utilities
├── BookmarkContext.tsx        # Bookmark management
├── bookmarks/                 # Bookmark utilities
│   ├── index.ts
│   ├── types.ts
│   ├── constants.ts
│   ├── storage-utils.ts
│   └── bookmark-utils.ts
└── __tests__/                 # Context tests
```

## Critical Provider Patterns

### 1. SettingsContext (`SettingsContext.tsx`)

**The most important provider - controls all user preferences.** Must follow this exact pattern:

```typescript
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Settings } from '@/types';
import { ARABIC_FONTS, defaultSettings, loadSettings, saveSettings } from './settingsStorage';
import { reducer } from './settingsReducer';

// Debounce interval for localStorage persistence
const PERSIST_DEBOUNCE_MS = 300;

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  arabicFonts: { name: string; value: string; category: string }[];
  // Specific action methods for common operations
  setShowByWords: (val: boolean) => void;
  setTajweed: (val: boolean) => void;
  setWordLang: (lang: string) => void;
  setWordTranslationId: (id: number) => void;
  setTafsirIds: (ids: number[]) => void;
  setTranslationIds: (ids: number[]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Provides global access to user-configurable settings.
 * Settings are persisted to localStorage with debouncing.
 */
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings, loadSettings);

  const settingsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSettings = useRef(settings);

  // Debounced persistence to localStorage
  useEffect(() => {
    latestSettings.current = settings;
    if (typeof window === 'undefined') return;

    if (settingsTimeoutRef.current) {
      clearTimeout(settingsTimeoutRef.current);
    }

    settingsTimeoutRef.current = setTimeout(() => {
      saveSettings(settings);
      settingsTimeoutRef.current = null;
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current);
    };
  }, [settings]);

  // Flush pending writes on unmount
  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      if (settingsTimeoutRef.current) {
        clearTimeout(settingsTimeoutRef.current);
        saveSettings(latestSettings.current);
      }
    };
  }, []);

  // Memoized action methods
  const setSettings = useCallback(
    (s: Settings) => dispatch({ type: 'SET_SETTINGS', value: s }),
    []
  );

  const setShowByWords = useCallback(
    (val: boolean) => dispatch({ type: 'SET_SHOW_BY_WORDS', value: val }),
    []
  );

  // ... other action methods

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      arabicFonts: ARABIC_FONTS,
      setShowByWords,
      setTajweed,
      setWordLang,
      setWordTranslationId,
      setTafsirIds,
      setTranslationIds,
    }),
    [
      settings,
      setSettings,
      setShowByWords,
      setTajweed,
      setWordLang,
      setWordTranslationId,
      setTafsirIds,
      setTranslationIds,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
```

**Key Requirements:**

- Must use `useReducer` with separate reducer file
- Must implement debounced localStorage persistence
- Must flush pending saves on unmount
- Must include specific action methods for common operations
- Must memoize all callbacks and the context value
- Must throw error if hook used outside provider

### 2. Reducer Pattern (`settingsReducer.ts`)

**All state updates must go through typed reducers:**

```typescript
import { Settings } from '@/types';

type SettingsAction =
  | { type: 'SET_SETTINGS'; value: Settings }
  | { type: 'SET_SHOW_BY_WORDS'; value: boolean }
  | { type: 'SET_TAJWEED'; value: boolean }
  | { type: 'SET_WORD_LANG'; value: string }
  | { type: 'SET_WORD_TRANSLATION_ID'; value: number }
  | { type: 'SET_TAFSIR_IDS'; value: number[] }
  | { type: 'SET_TRANSLATION_IDS'; value: number[] }
  | { type: 'RESET_SETTINGS' };

export function reducer(state: Settings, action: SettingsAction): Settings {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...action.value };

    case 'SET_SHOW_BY_WORDS':
      return {
        ...state,
        showByWords: action.value,
      };

    case 'SET_TAJWEED':
      return {
        ...state,
        showTajweed: action.value,
      };

    case 'SET_WORD_LANG':
      return {
        ...state,
        wordLang: action.value,
      };

    case 'SET_WORD_TRANSLATION_ID':
      return {
        ...state,
        wordTranslationId: action.value,
      };

    case 'SET_TAFSIR_IDS':
      return {
        ...state,
        tafsirIds: action.value,
      };

    case 'SET_TRANSLATION_IDS':
      return {
        ...state,
        translationIds: action.value,
      };

    case 'RESET_SETTINGS':
      return { ...defaultSettings };

    default:
      return state;
  }
}
```

**Key Requirements:**

- Use discriminated union types for all actions
- Always return new state objects (immutable updates)
- Include reset action for testing/debugging
- Handle all possible state transitions

### 3. Storage Pattern (`settingsStorage.ts`)

**Persistent storage with proper error handling:**

```typescript
import { Settings } from '@/types';

export const ARABIC_FONTS = [
  { name: 'Uthmani', value: 'uthmani', category: 'Traditional' },
  { name: 'Indo-Pak', value: 'indo-pak', category: 'Traditional' },
  { name: 'Modern', value: 'modern', category: 'Contemporary' },
  // ... more fonts
] as const;

export const defaultSettings: Settings = {
  arabicFontFamily: 'uthmani',
  arabicFontSize: 28,
  translationFontSize: 16,
  translationId: 20, // Sahih International
  translationIds: [20],
  tafsirIds: [169], // Ibn Kathir
  wordLang: 'en',
  wordTranslationId: 20,
  showByWords: false,
  showTajweed: true,
};

const STORAGE_KEY = 'quran-app-settings';

export function loadSettings(): Settings {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    const parsed = JSON.parse(stored);

    // Validate and merge with defaults to handle new settings
    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
}

export function clearSettings(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear settings from localStorage:', error);
  }
}
```

**Key Requirements:**

- Always check `typeof window` for SSR compatibility
- Merge with defaults to handle new settings in updates
- Include proper error handling with console warnings
- Export constants for UI components to use

## BookmarkContext Pattern

### Context Structure

```typescript
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Bookmark, BookmarkWithVerse, Folder } from '@/types';
import {
  loadBookmarks,
  saveBookmarks,
  loadFolders,
  saveFolders,
  getLastRead,
  setLastRead as setLastReadStorage,
} from './bookmarks/storage-utils';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  folders: Folder[];
  isBookmarked: (verseId: string) => boolean;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (verseId: string) => void;
  createFolder: (name: string, description?: string) => Folder;
  deleteFolder: (folderId: string) => void;
  getLastRead: (surahId: string) => number | null;
  setLastRead: (surahId: string, verseId: number) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  // Load data on mount
  useEffect(() => {
    setBookmarks(loadBookmarks());
    setFolders(loadFolders());
  }, []);

  // Save bookmarks when changed
  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  // Save folders when changed
  useEffect(() => {
    saveFolders(folders);
  }, [folders]);

  const isBookmarked = useCallback((verseId: string) => {
    return bookmarks.some(bookmark => bookmark.verseId === verseId);
  }, [bookmarks]);

  const addBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks(prev => [...prev, bookmark]);
  }, []);

  const removeBookmark = useCallback((verseId: string) => {
    setBookmarks(prev => prev.filter(b => b.verseId !== verseId));
  }, []);

  // ... other methods

  const value = React.useMemo(
    () => ({
      bookmarks,
      folders,
      isBookmarked,
      addBookmark,
      removeBookmark,
      createFolder,
      deleteFolder,
      getLastRead,
      setLastRead,
    }),
    [
      bookmarks,
      folders,
      isBookmarked,
      addBookmark,
      removeBookmark,
      createFolder,
      deleteFolder,
    ]
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return context;
};
```

## Audio Context Pattern

**For complex state like audio player, use reducer pattern:**

```typescript
// File: app/shared/player/context/AudioContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Verse } from '@/types';
import { audioReducer, initialState, AudioState, AudioAction } from './audioReducer';

interface AudioContextType extends AudioState {
  setActiveVerse: (verse: Verse | null) => void;
  setPlayingId: (id: number | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setReciter: (reciter: string) => void;
  openPlayer: () => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);

  const setActiveVerse = useCallback((verse: Verse | null) => {
    dispatch({ type: 'SET_ACTIVE_VERSE', verse });
  }, []);

  const setPlayingId = useCallback((id: number | null) => {
    dispatch({ type: 'SET_PLAYING_ID', id });
  }, []);

  // ... other actions

  const value = React.useMemo(
    () => ({
      ...state,
      setActiveVerse,
      setPlayingId,
      setIsPlaying,
      setReciter,
      openPlayer,
      closePlayer,
    }),
    [
      state,
      setActiveVerse,
      setPlayingId,
      setIsPlaying,
      setReciter,
      openPlayer,
      closePlayer,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
```

## Provider Composition

### Root Provider Setup

**All providers must be composed at the app level:**

```typescript
// File: app/providers/index.tsx
'use client';

import { ReactNode } from 'react';
import { SettingsProvider } from './SettingsContext';
import { BookmarkProvider } from './BookmarkContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SettingsProvider>
      <BookmarkProvider>
        <AudioProvider>
          {children}
        </AudioProvider>
      </BookmarkProvider>
    </SettingsProvider>
  );
}

export default Providers;
```

**Provider Order Matters:**

1. `SettingsProvider` - Base configuration
2. `BookmarkProvider` - May depend on settings
3. `AudioProvider` - May depend on both settings and bookmarks

## Testing Provider Patterns

### Test Wrapper

```typescript
// File: __tests__/test-utils.tsx
import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { BookmarkProvider } from '@/app/providers/BookmarkContext';

interface AllTheProvidersProps {
  children: ReactNode;
}

export const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <SettingsProvider>
      <BookmarkProvider>
        {children}
      </BookmarkProvider>
    </SettingsProvider>
  );
};

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';
```

### Context Testing

```typescript
// File: __tests__/SettingsContext.test.tsx
import { renderHook, act } from '@testing-library/react';
import { SettingsProvider, useSettings } from '../SettingsContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

describe('SettingsContext', () => {
  it('provides default settings', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings.arabicFontFamily).toBe('uthmani');
    expect(result.current.settings.translationId).toBe(20);
  });

  it('updates settings through actions', () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setShowByWords(true);
    });

    expect(result.current.settings.showByWords).toBe(true);
  });

  it('persists settings to localStorage', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    act(() => {
      result.current.setTajweed(false);
    });

    // Wait for debounced save
    await new Promise(resolve => setTimeout(resolve, 400));

    const stored = localStorage.getItem('quran-app-settings');
    expect(JSON.parse(stored!).showTajweed).toBe(false);
  });
});
```

## Performance Patterns

### Memoization Requirements

```typescript
// ✅ Always memoize context values
const value = useMemo(
  () => ({
    state,
    actions,
  }),
  [state, actions]
);

// ✅ Memoize action callbacks
const updateSetting = useCallback(
  (key: string, value: any) => dispatch({ type: 'UPDATE_SETTING', key, value }),
  []
);

// ✅ Use refs for values that don't trigger re-renders
const latestSettings = useRef(settings);
useEffect(() => {
  latestSettings.current = settings;
}, [settings]);
```

### Preventing Unnecessary Re-renders

```typescript
// ✅ Split contexts by concern
// Instead of one large context:
interface AppContextType {
  settings: Settings;
  bookmarks: Bookmark[];
  audio: AudioState;
}

// Use separate contexts:
// SettingsContext, BookmarkContext, AudioContext

// ✅ Use selector pattern for complex state
const useSettingsSelector = <T>(selector: (settings: Settings) => T) => {
  const { settings } = useSettings();
  return useMemo(() => selector(settings), [settings, selector]);
};

// Usage:
const fontSize = useSettingsSelector((settings) => settings.arabicFontSize);
```

## Error Handling

### Required Error Boundaries

```typescript
// File: providers/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ProviderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Provider Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center">
            <p>Something went wrong with app state.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Reload App
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

## Common Anti-Patterns

### ❌ Avoid These Patterns

```typescript
// Don't use direct state mutations
state.fontSize = 20;

// Don't skip memoization for context values
return (
  <Context.Provider value={{
    state,
    actions, // Creates new object every render
  }}>
);

// Don't create providers without error boundaries
<MyProvider>
  <App /> {/* Can crash entire app */}
</MyProvider>

// Don't put everything in one large context
interface AppContextType {
  settings: Settings;
  bookmarks: Bookmark[];
  audio: AudioState;
  ui: UIState;
  // Too many concerns in one context
}

// Don't skip cleanup
useEffect(() => {
  const interval = setInterval(/* ... */);
  // Missing cleanup
}, []);
```

### ✅ Follow These Patterns

```typescript
// Use reducer for state updates
dispatch({ type: 'SET_FONT_SIZE', value: 20 });

// Always memoize context values
const value = useMemo(() => ({
  state,
  actions,
}), [state, actions]);

// Wrap providers with error boundaries
<ProviderErrorBoundary>
  <MyProvider>
    <App />
  </MyProvider>
</ProviderErrorBoundary>

// Split contexts by concern
<SettingsProvider>
  <BookmarkProvider>
    <AudioProvider>
      <App />
    </AudioProvider>
  </BookmarkProvider>
</SettingsProvider>

// Always include cleanup
useEffect(() => {
  const interval = setInterval(/* ... */);
  return () => clearInterval(interval);
}, []);
```

## AI Development Checklist

For any provider changes, verify:

- [ ] **Context Structure**: Does it follow the reducer + storage pattern?
- [ ] **Type Safety**: Are all actions and state properly typed?
- [ ] **Memoization**: Are context values and callbacks memoized?
- [ ] **Persistence**: Is state properly saved/loaded from storage?
- [ ] **Error Handling**: Are storage operations wrapped in try/catch?
- [ ] **SSR Compatibility**: Are window checks included where needed?
- [ ] **Testing**: Are providers tested with proper wrappers?
- [ ] **Performance**: Is the context split appropriately by concern?
- [ ] **Cleanup**: Are all effects properly cleaned up?
- [ ] **Error Boundaries**: Is the provider wrapped in error handling?

**Providers control the entire app's state. Any breaking changes will affect all features.**
