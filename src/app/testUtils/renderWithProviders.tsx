import { render, RenderOptions } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { AudioProvider } from '@/presentation/shared/player/context/AudioContext';
import { SettingsProvider } from '@/presentation/providers/SettingsContext';
import { BookmarkProvider } from '@/presentation/providers/BookmarkContext';
import { ThemeProvider } from '@/presentation/providers/ThemeContext';
import { SidebarProvider } from '@/presentation/providers/SidebarContext';

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
