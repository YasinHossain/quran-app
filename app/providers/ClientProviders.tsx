'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SWRConfig } from 'swr';

import { WebVitals } from '@/app/shared/components/WebVitals';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
import { ErrorHandler } from '@/src/infrastructure/errors';

import { BookmarkProvider } from './BookmarkContext';
import { NavigationProvider } from './NavigationContext';
import { SettingsProvider } from './SettingsContext';
import { SidebarProvider } from './SidebarContext';
import { ThemeProvider, Theme } from './ThemeContext';
import { UIStateProvider } from './UIStateContext';

import type { SWRConfiguration } from 'swr';

// import { ApplicationProvider } from '../../src/presentation/providers/ApplicationProvider';

/**
 * Groups client-side providers including `ThemeProvider`, `SettingsProvider`,
 * and `SidebarProvider`. Wrap your component tree with this provider to give
 * descendants access to theme, settings, and sidebar contexts.
 */
const SWR_OPTIONS: SWRConfiguration = {
  dedupingInterval: 2000,
  revalidateOnFocus: false,
  revalidateIfStale: false,
  keepPreviousData: true,
};

export function ClientProviders({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}): React.JSX.Element {
  const router = useRouter();

  React.useEffect(() => {
    ErrorHandler.configure({ retryCallback: () => router.refresh() });
  }, [router]);

  // In development, make sure any previously-installed service worker from a
  // production run doesn't interfere with local dev (common Safari issue).
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    // Unregister all service workers and clear caches on localhost during dev
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
    }
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .catch(() => {});
    }
  }, []);

  return (
    <SWRConfig value={SWR_OPTIONS}>
      <ThemeProvider initialTheme={initialTheme}>
        <SettingsProvider>
          <BookmarkProvider>
            <UIStateProvider>
              <SidebarProvider>
                <NavigationProvider>
                  <AudioProvider>
                    <WebVitals reportTarget="console" />
                    {children}
                  </AudioProvider>
                </NavigationProvider>
              </SidebarProvider>
            </UIStateProvider>
          </BookmarkProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
