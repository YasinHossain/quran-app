# Multi-Platform AI Development Guide

## Overview

This guide provides AI with comprehensive context for developing across multiple platforms while maintaining code reuse and architectural consistency.

## Platform Architecture Strategy

### Code Sharing Matrix

```
┌─────────────────────┬─────────┬─────────┬─────────┬─────────┐
│ Layer               │ Web     │ Mobile  │ Desktop │ Future  │
├─────────────────────┼─────────┼─────────┼─────────┼─────────┤
│ Domain Entities     │ 100%    │ 100%    │ 100%    │ 100%    │
│ Domain Services     │ 100%    │ 100%    │ 100%    │ 100%    │
│ Use Cases          │ 100%    │ 100%    │ 100%    │ 100%    │
│ Repository Intfs   │ 100%    │ 100%    │ 100%    │ 100%    │
│ Repository Impls   │ 80%     │ 90%     │ 85%     │ 80%     │
│ API Clients        │ 90%     │ 95%     │ 90%     │ 85%     │
│ UI Components      │ 0%      │ 0%      │ 20%     │ 10%     │
│ Navigation         │ 0%      │ 0%      │ 30%     │ 15%     │
└─────────────────────┴─────────┴─────────┴─────────┴─────────┘
```

## Platform-Specific Implementation

### Web (Next.js)

- **Current Implementation**: Full-featured Quran reading app
- **Unique Features**: SEO optimization, server-side rendering, PWA
- **State Management**: React Context + Zustand
- **Navigation**: Next.js App Router
- **Storage**: LocalStorage + IndexedDB
- **Audio**: Web Audio API + HTML5 Audio

### Mobile (React Native) - Future

- **Target Platforms**: iOS 13+ / Android 8+
- **Unique Features**: Offline-first, push notifications, background audio
- **State Management**: Redux Toolkit + React Query
- **Navigation**: React Navigation v6
- **Storage**: AsyncStorage + SQLite
- **Audio**: React Native Track Player

### Desktop (Electron) - Future

- **Target Platforms**: Windows 10+, macOS 10.15+, Ubuntu 18+
- **Unique Features**: Multi-window, system tray, keyboard shortcuts
- **State Management**: Shared with web implementation
- **Navigation**: React Router
- **Storage**: Electron Store + file system
- **Audio**: Electron main process audio handling

## Shared Architecture Components

### Domain Layer (100% Shared)

```typescript
// Completely platform-agnostic business logic
export class Verse {
  // Business methods work everywhere
  isFirstVerse(): boolean { ... }
  isSajdahVerse(): boolean { ... }
  getMemorizationSegments(): string[] { ... }
}

export interface IVerseRepository {
  // Contract works on all platforms
  findById(id: string): Promise<Verse>;
  findBySurah(surahId: number): Promise<Verse[]>;
}
```

### Application Layer (100% Shared)

```typescript
// Use cases work across all platforms
export class ReadVerseUseCase {
  async execute(params: ReadVerseParams): Promise<ReadVerseResult> {
    // Platform-independent business workflows
  }
}
```

### Infrastructure Layer (80-95% Shared)

```typescript
// Platform-specific implementations of shared interfaces
export class WebVerseRepository implements IVerseRepository {
  // Web-specific: fetch API, localStorage
}

export class MobileVerseRepository implements IVerseRepository {
  // Mobile-specific: AsyncStorage, SQLite
}

export class DesktopVerseRepository implements IVerseRepository {
  // Desktop-specific: file system, electron APIs
}
```

## Platform Detection & Adaptation

### Runtime Platform Detection

```typescript
// Shared utility for platform detection
export enum Platform {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  UNKNOWN = 'unknown',
}

export const detectPlatform = (): Platform => {
  if (typeof window !== 'undefined') {
    if (window.electron) return Platform.DESKTOP;
    if (window.ReactNativeWebView) return Platform.MOBILE;
    return Platform.WEB;
  }
  return Platform.UNKNOWN;
};
```

### Platform-Specific Services

```typescript
// Service factory based on platform
export class ServiceFactory {
  static createVerseRepository(): IVerseRepository {
    const platform = detectPlatform();

    switch (platform) {
      case Platform.WEB:
        return new WebVerseRepository(/* web deps */);
      case Platform.MOBILE:
        return new MobileVerseRepository(/* mobile deps */);
      case Platform.DESKTOP:
        return new DesktopVerseRepository(/* desktop deps */);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
```

## AI Development Patterns by Platform

### Web Development (Current)

```bash
# Component creation
Grep "export.*React.FC" app/ --glob "*.tsx"
Glob "app/(features)/*/components/**/*.tsx"

# Hook patterns
Grep "export.*use[A-Z]" app/ --glob "*.ts*"

# Next.js specific
Glob "app/**/page.tsx"
Glob "app/**/layout.tsx"
```

### Mobile Development (Future)

```bash
# Component patterns
Grep "export.*React.FC" src/mobile/components/ --glob "*.tsx"

# Native modules
Grep "NativeModules" src/mobile/ --glob "*.ts*"

# Navigation
Grep "navigation\." src/mobile/ --glob "*.tsx"

# Platform specific
Grep "Platform.OS" src/mobile/ --glob "*.ts*"
```

### Desktop Development (Future)

```bash
# Electron specific
Grep "electron" src/desktop/ --glob "*.ts*"

# IPC patterns
Grep "ipcRenderer\|ipcMain" src/desktop/ --glob "*.ts*"

# Window management
Grep "BrowserWindow" src/desktop/ --glob "*.ts*"
```

## Shared Component Libraries

### Design System Tokens

```typescript
// Platform-agnostic design tokens
export const tokens = {
  colors: {
    primary: '#1B4332',
    secondary: '#52B69A',
    accent: '#D63384',
    // Color values work across platforms
  },
  spacing: {
    xs: 4,
    md: 16,
    xl: 32,
    // Numeric values adapt to platform density
  },
  typography: {
    // Font families per platform
    fontFamily: {
      web: 'Inter, system-ui, sans-serif',
      mobile: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
      desktop: 'system-ui, -apple-system, sans-serif',
    },
  },
};
```

### Responsive Utilities

```typescript
// Platform-aware responsive utilities
export const responsive = {
  breakpoints: {
    web: { sm: 640, md: 768, lg: 1024, xl: 1280 },
    mobile: { sm: 360, md: 768, lg: 1024 }, // device sizes
    desktop: { sm: 1024, md: 1440, lg: 1920 }, // window sizes
  },

  isTablet: () => {
    const platform = detectPlatform();
    if (platform === Platform.MOBILE) {
      return Dimensions.get('window').width >= 768;
    }
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },
};
```

## Data Layer Strategies

### Offline-First Architecture

```typescript
// Shared caching interface
export interface IPlatformCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Platform implementations
export class WebCache implements IPlatformCache {
  // Uses IndexedDB + localStorage
}

export class MobileCache implements IPlatformCache {
  // Uses AsyncStorage + SQLite
}

export class DesktopCache implements IPlatformCache {
  // Uses electron-store + file system
}
```

### Synchronization Strategy

```typescript
// Shared sync service
export class SyncService {
  async syncBookmarks(): Promise<void> {
    // Platform-agnostic sync logic
    const local = await this.localRepo.findAll();
    const remote = await this.remoteRepo.findAll();

    // Conflict resolution logic
    const merged = this.mergeChanges(local, remote);

    // Save to both local and remote
    await Promise.all([this.localRepo.saveAll(merged), this.remoteRepo.saveAll(merged)]);
  }
}
```

## Navigation Patterns

### Web Navigation (Next.js)

```typescript
// App Router navigation
export const useQuranNavigation = () => {
  const router = useRouter();

  return {
    navigateToSurah: (id: number) => router.push(`/surah/${id}`),
    navigateToBookmarks: () => router.push('/bookmarks'),
    goBack: () => router.back(),
  };
};
```

### Mobile Navigation (React Navigation)

```typescript
// Stack navigation
export const useQuranNavigation = () => {
  const navigation = useNavigation();

  return {
    navigateToSurah: (id: number) => navigation.navigate('Surah', { id }),
    navigateToBookmarks: () => navigation.navigate('Bookmarks'),
    goBack: () => navigation.goBack(),
  };
};
```

### Desktop Navigation (React Router)

```typescript
// Browser routing in Electron
export const useQuranNavigation = () => {
  const navigate = useNavigate();

  return {
    navigateToSurah: (id: number) => navigate(`/surah/${id}`),
    navigateToBookmarks: () => navigate('/bookmarks'),
    goBack: () => navigate(-1),
  };
};
```

## Testing Across Platforms

### Shared Domain Tests

```typescript
// Tests run on all platforms
describe('Verse Entity', () => {
  it('should work on web', () => { ... });
  it('should work on mobile', () => { ... });
  it('should work on desktop', () => { ... });
});
```

### Platform-Specific Tests

```typescript
// Web-specific tests
describe('WebVerseRepository', () => {
  it('should cache in localStorage', () => { ... });
});

// Mobile-specific tests
describe('MobileVerseRepository', () => {
  it('should persist in AsyncStorage', () => { ... });
});

// Desktop-specific tests
describe('DesktopVerseRepository', () => {
  it('should save to file system', () => { ... });
});
```

## Performance Considerations

### Bundle Splitting by Platform

```javascript
// webpack.config.js - Platform-specific bundles
module.exports = {
  entry: {
    web: './src/platforms/web/index.ts',
    mobile: './src/platforms/mobile/index.ts',
    desktop: './src/platforms/desktop/index.ts',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        shared: {
          name: 'shared',
          test: /[\\/]src[\\/]shared[\\/]/,
          priority: 10,
        },
        domain: {
          name: 'domain',
          test: /[\\/]src[\\/]domain[\\/]/,
          priority: 20,
        },
      },
    },
  },
};
```

### Memory Management

```typescript
// Platform-aware memory management
export class MemoryManager {
  static cleanup(): void {
    const platform = detectPlatform();

    switch (platform) {
      case Platform.MOBILE:
        // Mobile: aggressive cleanup
        this.clearImageCaches();
        this.reduceCacheSize();
        break;
      case Platform.DESKTOP:
        // Desktop: moderate cleanup
        this.cleanupOldCaches();
        break;
      case Platform.WEB:
        // Web: browser-dependent cleanup
        this.requestIdleCallback(() => this.cleanup());
        break;
    }
  }
}
```

## AI Development Workflows

### Cross-Platform Feature Development

1. **Start with Domain**: Create shared business logic
2. **Define Use Cases**: Platform-agnostic application operations
3. **Create Interfaces**: Repository and service contracts
4. **Implement Per Platform**: Platform-specific infrastructure
5. **Build UI Components**: Platform-native presentation layers
6. **Test Everywhere**: Shared domain tests + platform-specific tests

### AI Tools for Multi-Platform

```bash
# Find shared code opportunities
Grep "platform" --glob "*.ts*" -i

# Check platform-specific implementations
Grep "Platform\\.OS\\|window\\." --glob "*.ts*"

# Analyze bundle sharing
Grep "import.*from.*shared" --glob "*.ts*"

# Find platform coupling
Grep "react-native\\|next\\/" src/domain/ --glob "*.ts*"
```

## Migration Strategies

### Web to Mobile Migration

1. **Extract Shared Logic**: Move business logic to domain/application layers
2. **Create Mobile Infrastructure**: Implement mobile-specific repositories
3. **Build Mobile UI**: Create React Native components
4. **Port Navigation**: Adapt routing to React Navigation
5. **Test Integration**: Ensure shared code works on mobile

### Progressive Enhancement

```typescript
// Feature detection for progressive enhancement
export const FeatureDetection = {
  hasCamera: () => {
    if (Platform.MOBILE) return true;
    if (Platform.WEB) return navigator.mediaDevices?.getUserMedia;
    return false;
  },

  hasFileSystem: () => {
    if (Platform.DESKTOP) return true;
    if (Platform.WEB) return 'showSaveFilePicker' in window;
    return false;
  },

  supportsBackgroundSync: () => {
    return Platform.MOBILE || 'serviceWorker' in navigator;
  },
};
```

## AI Efficiency Tips for Multi-Platform

### Context Switching

- Use platform-specific `.ai` files for context
- Search within platform directories: `Glob "src/platforms/web/**/*.ts*"`
- Check shared dependencies: `Grep "shared" --glob "*.ts*"`

### Architecture Validation

- Ensure domain layer purity: No platform imports in domain/
- Validate interface compliance: All platforms implement same interfaces
- Check bundle sizes: Monitor shared vs. platform-specific code ratios

### Development Workflow

1. **Domain First**: Always start with business logic
2. **Interface Definition**: Define contracts before implementation
3. **Platform Implementation**: Implement per platform after interfaces are stable
4. **Testing Strategy**: Shared tests for business logic, specific tests for platforms
5. **Performance Monitoring**: Track bundle sizes and runtime performance per platform
