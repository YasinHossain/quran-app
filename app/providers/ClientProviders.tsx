'use client';
import React from 'react';
import { ThemeProvider, Theme } from './ThemeContext';
import { SettingsProvider } from './SettingsContext';
import { BookmarkProvider } from './BookmarkContext';
import { SidebarProvider } from './SidebarContext';
import { UIStateProvider } from './UIStateContext';
import { NavigationProvider } from './NavigationContext';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
// import { ApplicationProvider } from '../../src/presentation/providers/ApplicationProvider';

/**
 * Groups client-side providers including `ThemeProvider`, `SettingsProvider`,
 * and `SidebarProvider`. Wrap your component tree with this provider to give
 * descendants access to theme, settings, and sidebar contexts.
 */
export default function ClientProviders({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
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
    <ThemeProvider initialTheme={initialTheme}>
      <SettingsProvider>
        <BookmarkProvider>
          <UIStateProvider>
            <SidebarProvider>
              <NavigationProvider>
                <AudioProvider>{children}</AudioProvider>
              </NavigationProvider>
            </SidebarProvider>
          </UIStateProvider>
        </BookmarkProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
