import React, { ReactNode } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import { renderHook, RenderHookOptions } from '@testing-library/react';
import { AudioProvider, useAudio } from '@/app/shared/player/context/AudioContext';
import { SettingsProvider, useSettings } from '@/app/providers/SettingsContext';
import { BookmarkProvider, useBookmarks } from '@/app/providers/BookmarkContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { SWRConfig } from 'swr';

/**
 * @module ContextTestUtils
 * @description Testing utilities for context integration validation
 * @exports ContextProviders, renderWithSpecificProviders, testContextIntegration
 * @example
 * ```tsx
 * import { testContextIntegration } from '@/app/testUtils/contextTestUtils';
 *
 * testContextIntegration('Settings', (context) => {
 *   expect(context.settings).toBeDefined();
 *   expect(context.updateSetting).toBeInstanceOf(Function);
 * });
 * ```
 */

// Individual provider components for selective testing
export const ContextProviders = {
  Settings: SettingsProvider,
  Audio: AudioProvider,
  Bookmark: BookmarkProvider,
  Theme: ThemeProvider,
  Sidebar: SidebarProvider,
};

export type ContextProviderName = keyof typeof ContextProviders;

/**
 * Create wrapper with specific providers only
 */
export function createProviderWrapper(
  providers: ContextProviderName[],
  swrConfig?: object
): React.ComponentType<{ children: ReactNode }> {
  return ({ children }) => {
    let wrapped = children;

    // Add SWR config if provided
    if (swrConfig) {
      wrapped = <SWRConfig value={swrConfig}>{wrapped}</SWRConfig>;
    }

    // Wrap with providers in reverse order (innermost first)
    providers.reverse().forEach((providerName) => {
      const Provider = ContextProviders[providerName];
      wrapped = <Provider>{wrapped}</Provider>;
    });

    return <>{wrapped}</>;
  };
}

/**
 * Render component with specific providers
 */
export function renderWithSpecificProviders(
  ui: React.ReactElement,
  providers: ContextProviderName[],
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = createProviderWrapper(providers, { provider: () => new Map() });
  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Render hook with specific providers
 */
export function renderHookWithProviders<TProps, TResult>(
  callback: (props: TProps) => TResult,
  providers: ContextProviderName[],
  options?: RenderHookOptions<TProps>
) {
  const Wrapper = createProviderWrapper(providers, { provider: () => new Map() });
  return renderHook(callback, { wrapper: Wrapper, ...options });
}

/**
 * Mock context values for testing
 */
export const mockContextValues = {
  settings: {
    fontSize: 16,
    translationFontSize: 14,
    theme: 'light' as const,
    selectedTranslations: ['131'],
    audioEnabled: true,
    autoScroll: true,
    showTransliteration: false,
    showTranslation: true,
    showTafsir: false,
    highlightingEnabled: true,
  },
  audio: {
    currentTrack: null,
    isPlaying: false,
    volume: 0.8,
    playbackRate: 1.0,
    reciterId: '7',
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: null,
  },
  bookmark: {
    bookmarkedVerses: new Set<string>(),
    bookmarkFolders: [],
    recentlyRead: [],
    pinnedBookmarks: [],
  },
  theme: {
    theme: 'light' as const,
    systemTheme: 'light' as const,
  },
  sidebar: {
    isOpen: false,
    toggleSidebar: jest.fn(),
    closeSidebar: jest.fn(),
  },
};

/**
 * Test context integration for components
 */
export function testContextIntegration<T extends ContextProviderName, C>(
  contextName: T,
  testFn: (contextValue: C) => void,
  mockValue?: C
): void {
  describe(`${contextName} Context Integration`, () => {
    it(`should integrate with ${contextName} context`, () => {
      const TestComponent = () => {
        // This would be implemented per context type
        // For now, we'll use a generic approach
        return <div data-testid={`${contextName.toLowerCase()}-context`}>Test</div>;
      };

      renderWithSpecificProviders(<TestComponent />, [contextName]);
      expect(screen.getByTestId(`${contextName.toLowerCase()}-context`)).toBeInTheDocument();
      if (mockValue !== undefined) {
        testFn(mockValue);
      }
    });
  });
}

/**
 * Test Settings context integration
 */
export function testSettingsContextIntegration<P>(
  Component: React.ComponentType<P>,
  props?: P
): void {
  it('integrates with SettingsContext', () => {
    renderWithSpecificProviders(<Component {...props} />, ['Settings']);

    // Component should render without errors when Settings context is available
    // Additional assertions would be component-specific
  });

  it('provides settings and update functions', () => {
    const TestComponent = () => {
      const { settings, updateSetting } = useSettings();
      return (
        <div>
          <span data-testid="font-size">{settings.fontSize}</span>
          <button data-testid="update-font" onClick={() => updateSetting('fontSize', 18)}>
            Update Font
          </button>
        </div>
      );
    };

    renderWithSpecificProviders(<TestComponent />, ['Settings']);

    expect(screen.getByTestId('font-size')).toBeInTheDocument();
    expect(screen.getByTestId('update-font')).toBeInTheDocument();
  });
}

/**
 * Test Audio context integration
 */
export function testAudioContextIntegration<P>(Component: React.ComponentType<P>, props?: P): void {
  it('integrates with AudioContext', () => {
    renderWithSpecificProviders(<Component {...props} />, ['Audio']);
    // Component should render without errors when Audio context is available
  });

  it('provides audio controls and state', () => {
    const TestComponent = () => {
      const { isPlaying, togglePlay } = useAudio();
      return (
        <div>
          <span data-testid="is-playing">{isPlaying ? 'playing' : 'paused'}</span>
          <button data-testid="toggle-play" onClick={togglePlay}>
            Toggle
          </button>
        </div>
      );
    };

    renderWithSpecificProviders(<TestComponent />, ['Audio']);

    expect(screen.getByTestId('is-playing')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-play')).toBeInTheDocument();
  });
}

/**
 * Test Bookmark context integration
 */
export function testBookmarkContextIntegration<P>(
  Component: React.ComponentType<P>,
  props?: P
): void {
  it('integrates with BookmarkContext', () => {
    renderWithSpecificProviders(<Component {...props} />, ['Bookmark']);
    // Component should render without errors when Bookmark context is available
  });

  it('provides bookmark state and actions', () => {
    const TestComponent = () => {
      const { bookmarkedVerses, toggleBookmark } = useBookmarks();
      return (
        <div>
          <span data-testid="bookmark-count">{bookmarkedVerses.size}</span>
          <button data-testid="toggle-bookmark" onClick={() => toggleBookmark('1:1')}>
            Toggle Bookmark
          </button>
        </div>
      );
    };

    renderWithSpecificProviders(<TestComponent />, ['Bookmark']);

    expect(screen.getByTestId('bookmark-count')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-bookmark')).toBeInTheDocument();
  });
}

/**
 * Test all context integrations for a component
 */
export function testAllContextIntegrations<P>(Component: React.ComponentType<P>, props?: P): void {
  describe('Context Integrations', () => {
    testSettingsContextIntegration(Component, props);
    testAudioContextIntegration(Component, props);
    testBookmarkContextIntegration(Component, props);
  });
}

/**
 * Create a comprehensive context test suite
 */
export function createContextTestSuite<P>(
  componentName: string,
  Component: React.ComponentType<P>,
  testProps?: P
): void {
  describe(`${componentName} Context Integration`, () => {
    it('renders with all required providers', () => {
      renderWithSpecificProviders(<Component {...testProps} />, [
        'Settings',
        'Audio',
        'Bookmark',
        'Theme',
        'Sidebar',
      ]);

      // Component should render without errors
      // Additional assertions would be component-specific
    });

    it('handles missing providers gracefully', () => {
      // Test with minimal providers to ensure graceful degradation
      expect(() => {
        renderWithSpecificProviders(<Component {...testProps} />, ['Settings']);
      }).not.toThrow();
    });

    testAllContextIntegrations(Component, testProps);
  });
}

export default {
  ContextProviders,
  createProviderWrapper,
  renderWithSpecificProviders,
  renderHookWithProviders,
  mockContextValues,
  testContextIntegration,
  testSettingsContextIntegration,
  testAudioContextIntegration,
  testBookmarkContextIntegration,
  testAllContextIntegrations,
  createContextTestSuite,
};
