import { render, RenderOptions } from '@testing-library/react';
import { SWRConfig } from 'swr';

import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';

const Providers = ({ children }: { children: React.ReactNode }) => (
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

export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
