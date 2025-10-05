# Providers - AI Development Guidelines

React Context providers for global state management. **These providers control the entire app's state** - follow established patterns exactly.

## Directory Structure

```
providers/
├── SettingsContext.tsx        # User settings (fonts, translations, etc.)
├── settingsReducer.ts         # Settings state reducer
├── settingsStorage.ts         # Persistent storage utilities
├── BookmarkContext.tsx        # Bookmark management
├── bookmarks/                 # Bookmark utilities
└── __tests__/                 # Context tests
```

## Critical Patterns

### 1. Settings Context

Required pattern for user preferences with debounced localStorage persistence:

```typescript
'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

const PERSIST_DEBOUNCE_MS = 300;

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  setShowByWords: (val: boolean) => void;
  setTajweed: (val: boolean) => void;
  // ... other actions
}

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, dispatch] = useReducer(reducer, defaultSettings, loadSettings);
  const settingsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current);

    settingsTimeoutRef.current = setTimeout(() => {
      saveSettings(settings);
      settingsTimeoutRef.current = null;
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current);
    };
  }, [settings]);

  // Memoized actions
  const setSettings = useCallback((s: Settings) => dispatch({ type: 'SET_SETTINGS', value: s }), []);

  const value = useMemo(() => ({
    settings,
    setSettings,
    // ... other actions
  }), [settings, setSettings /* ... */]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
```

**Key Requirements:**

- Use `useReducer` with separate reducer file
- Implement debounced localStorage persistence
- Memoize all callbacks and context value
- Throw error if hook used outside provider

### 2. Reducer Pattern

All state updates through typed reducers:

```typescript
type SettingsAction =
  | { type: 'SET_SETTINGS'; value: Settings }
  | { type: 'SET_SHOW_BY_WORDS'; value: boolean }
  | { type: 'RESET_SETTINGS' };

export function reducer(state: Settings, action: SettingsAction): Settings {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...action.value };
    case 'SET_SHOW_BY_WORDS':
      return { ...state, showByWords: action.value };
    case 'RESET_SETTINGS':
      return { ...defaultSettings };
    default:
      return state;
  }
}
```

### 3. Storage Pattern

```typescript
const STORAGE_KEY = 'quran-app-settings';

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    // Merge with defaults for version compatibility
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch (error) {
    console.warn('Failed to load settings:', error);
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}
```

## Provider Composition

```typescript
// File: app/providers/index.tsx
export function Providers({ children }: { children: ReactNode }) {
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
```

**Provider Order:** Settings → Bookmarks → Audio

## Testing

```typescript
// Test wrapper
export const AllTheProviders = ({ children }: { children: ReactNode }) => (
  <SettingsProvider>
    <BookmarkProvider>
      {children}
    </BookmarkProvider>
  </SettingsProvider>
);

export const renderWithProviders = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });
```

## Performance & Error Handling

```typescript
// Always memoize context values
const value = useMemo(() => ({ state, actions }), [state, actions]);

// Use error boundaries
export class ProviderErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. <button onClick={() => window.location.reload()}>Reload</button></div>;
    }
    return this.props.children;
  }
}
```

## Development Checklist

- [ ] Context follows reducer + storage pattern
- [ ] All actions and state properly typed
- [ ] Context values and callbacks memoized
- [ ] Storage operations wrapped in try/catch
- [ ] Window checks for SSR compatibility
- [ ] Providers tested with proper wrappers
- [ ] Context split by concern
- [ ] Effects properly cleaned up
- [ ] Provider wrapped in error boundaries

**Breaking changes in providers affect all features.**
