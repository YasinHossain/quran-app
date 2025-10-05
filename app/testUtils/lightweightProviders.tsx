import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { SWRConfig } from 'swr';

import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { UIStateProvider } from '@/app/providers/UIStateContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

// Minimal providers for simple component tests
const MinimalProviders = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <UIStateProvider>
      <ThemeProvider>
        <SettingsProvider>{children}</SettingsProvider>
      </ThemeProvider>
    </UIStateProvider>
  </SWRConfig>
);

// Audio-specific tests (for audio player components)
const AudioProviders = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <UIStateProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AudioProvider>{children}</AudioProvider>
        </SettingsProvider>
      </ThemeProvider>
    </UIStateProvider>
  </SWRConfig>
);

// Bookmark-specific tests
const BookmarkProviders = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <UIStateProvider>
      <ThemeProvider>
        <SettingsProvider>
          <BookmarkProvider>{children}</BookmarkProvider>
        </SettingsProvider>
      </ThemeProvider>
    </UIStateProvider>
  </SWRConfig>
);

// Full providers for complex integration tests (use sparingly)
const FullProviders = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <UIStateProvider>
      <ThemeProvider>
        <SettingsProvider>
          <BookmarkProvider>
            <SidebarProvider>
              <AudioProvider>{children}</AudioProvider>
            </SidebarProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </ThemeProvider>
    </UIStateProvider>
  </SWRConfig>
);

export function renderMinimal(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: MinimalProviders, ...options });
}

export function renderWithAudio(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: AudioProviders, ...options });
}

export function renderWithBookmarks(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: BookmarkProviders, ...options });
}

export function renderWithFullProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: FullProviders, ...options });
}
