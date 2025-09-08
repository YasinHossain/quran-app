import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { SWRConfig } from 'swr';

import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

const Providers = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <AudioProvider>
      <SettingsProvider>
        <BookmarkProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </BookmarkProvider>
      </SettingsProvider>
    </AudioProvider>
  </SWRConfig>
);

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
