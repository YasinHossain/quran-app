import { render, RenderOptions, RenderResult, act } from '@testing-library/react';
import { SWRConfig } from 'swr';

import { BookmarkProvider } from '@/app/providers/BookmarkContext';
import { SettingsProvider } from '@/app/providers/SettingsContext';
import { SidebarProvider } from '@/app/providers/SidebarContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';
import { UIStateProvider } from '@/app/providers/UIStateContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
import * as chaptersApi from '@/lib/api/chapters';

jest.mock('@/lib/api/chapters');

beforeEach(() => {
  (chaptersApi.getChapters as jest.Mock).mockResolvedValue([]);
});

const Providers = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <SWRConfig
    value={{
      provider: () => new Map(),
      // Avoid noisy background refetching in tests
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 1000,
    }}
  >
    <UIStateProvider>
      <AudioProvider>
        <SettingsProvider>
          <BookmarkProvider>
            <ThemeProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </AudioProvider>
    </UIStateProvider>
  </SWRConfig>
);

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: Providers, ...options });
}

export async function renderWithProvidersAsync(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): Promise<RenderResult> {
  let result: RenderResult | undefined;
  await act(async () => {
    result = render(ui, { wrapper: Providers, ...options });
  });
  return result!;
}

export * from '@testing-library/react';
